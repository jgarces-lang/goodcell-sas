/* =========================================================
   Good Cell SAS - Frontend conectado con API PHP + MySQL
   ========================================================= */

(function () {
  const API_BASE = "../../backend/api";
  const THEME_KEY = "goodcell_theme";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  async function apiRequest(endpoint, options) {
    const response = await fetch(API_BASE + "/" + endpoint, Object.assign({
      credentials: "include"
    }, options || {}));

    let payload = null;
    try {
      payload = await response.json();
    } catch (error) {
      payload = null;
    }

    if (!response.ok || !payload || payload.ok === false) {
      const message = payload && payload.message ? payload.message : "Error en la API.";
      const apiError = new Error(message);
      apiError.status = response.status;
      throw apiError;
    }

    return payload;
  }

  function getInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    return "dark";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeToggle(theme);
  }

  function updateThemeToggle(theme) {
    const btn = document.getElementById("themeToggle");
    if (!btn) {
      return;
    }
    if (theme === "dark") {
      btn.textContent = "☀ Claro";
      btn.setAttribute("aria-label", "Cambiar a modo claro");
    } else {
      btn.textContent = "🌙 Oscuro";
      btn.setAttribute("aria-label", "Cambiar a modo oscuro");
    }
  }

  function setupThemeToggle() {
    const btn = document.getElementById("themeToggle");
    const theme = getInitialTheme();
    applyTheme(theme);

    if (!btn) {
      return;
    }

    btn.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  function setupPageTransitions() {
    document.body.classList.add("page-enter");
    window.requestAnimationFrame(function () {
      document.body.classList.add("page-enter-active");
    });

    document.addEventListener("click", function (event) {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const link = target.closest("a");
      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }
      const href = link.getAttribute("href") || "";
      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        link.target === "_blank" ||
        event.metaKey ||
        event.ctrlKey
      ) {
        return;
      }
      if (!href.endsWith(".html") && !href.includes(".html?") && !href.startsWith("./") && !href.startsWith("../")) {
        return;
      }
      event.preventDefault();
      document.body.classList.add("page-exit");
      window.setTimeout(function () {
        window.location.href = href;
      }, 240);
    });
  }

  function setupCustomCursor() {
    if ("ontouchstart" in window || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    document.body.appendChild(dot);

    window.addEventListener("mousemove", function (event) {
      dot.style.transform = "translate(" + (event.clientX - 4) + "px, " + (event.clientY - 4) + "px)";
    });
  }

  function setupGlowBrand() {
    const brand = document.querySelector(".navbar__brand");
    if (!brand) {
      return;
    }
    brand.classList.add("is-brand-glow");
  }

  function setupHeroEffects() {
    const heroSection = document.querySelector(".hero");
    const heroCard = document.querySelector(".hero__card");
    const heroTitle = document.querySelector(".hero__title");

    if (heroTitle) {
      heroTitle.classList.add("is-hero-animated");
      if (!heroTitle.dataset.originalText) {
        heroTitle.dataset.originalText = heroTitle.textContent || "";
      }
      if (!heroTitle.dataset.typedDone) {
        const originalText = heroTitle.dataset.originalText;
        heroTitle.textContent = "";
        heroTitle.classList.add("is-typing");
        let index = 0;
        const tick = window.setInterval(function () {
          index += 1;
          heroTitle.textContent = originalText.slice(0, index);
          if (index >= originalText.length) {
            window.clearInterval(tick);
            heroTitle.classList.remove("is-typing");
            heroTitle.dataset.typedDone = "1";
          }
        }, 42);
      }
    }

    if (!heroCard || reduceMotion) {
      return;
    }

    if (heroSection) {
      let mouseX = 0;
      let mouseY = 0;
      let scrollY = 0;
      let rafId = 0;

      function updateParallax() {
        rafId = 0;
        const x = mouseX * 0.8;
        const y = mouseY * 1.1 + scrollY * -0.18;
        heroCard.style.transform = "translate3d(" + x.toFixed(2) + "px, " + y.toFixed(2) + "px, 0)";
      }

      function scheduleParallax() {
        if (rafId) {
          return;
        }
        rafId = window.requestAnimationFrame(updateParallax);
      }

      heroSection.addEventListener("mousemove", function (event) {
        const rect = heroSection.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        mouseX = px * 10;
        mouseY = py * 8;
        scheduleParallax();
      });

      heroSection.addEventListener("mouseleave", function () {
        mouseX = 0;
        mouseY = 0;
        scheduleParallax();
      });

      window.addEventListener("scroll", function () {
        const rect = heroSection.getBoundingClientRect();
        scrollY = Math.max(-18, Math.min(18, rect.top * -0.04));
        scheduleParallax();
      }, { passive: true });
    }

    if (heroCard.querySelector(".hero-particle")) {
      return;
    }
    for (let i = 0; i < 10; i += 1) {
      const p = document.createElement("span");
      p.className = "hero-particle";
      p.style.left = (8 + Math.random() * 84).toFixed(2) + "%";
      p.style.top = (8 + Math.random() * 78).toFixed(2) + "%";
      p.style.animationDelay = (Math.random() * 2.5).toFixed(2) + "s";
      p.style.animationDuration = (2.8 + Math.random() * 3.4).toFixed(2) + "s";
      heroCard.appendChild(p);
    }
  }

  function setupButtonRipple() {
    document.addEventListener("click", function (event) {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const btn = target.closest(".btn, .theme-toggle");
      if (!(btn instanceof HTMLElement)) {
        return;
      }
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "btn-ripple";
      const size = Math.max(rect.width, rect.height) * 1.15;
      ripple.style.width = size + "px";
      ripple.style.height = size + "px";
      ripple.style.left = (event.clientX - rect.left - size / 2) + "px";
      ripple.style.top = (event.clientY - rect.top - size / 2) + "px";
      btn.appendChild(ripple);
      window.setTimeout(function () {
        ripple.remove();
      }, 650);
    });
  }

  function setupCardReveal(container) {
    if (!container || reduceMotion) {
      return;
    }
    const cards = container.querySelectorAll(".product-card");
    if (cards.length === 0) {
      return;
    }
    cards.forEach(function (card, index) {
      card.classList.add("reveal-card");
      card.style.transitionDelay = (index * 55) + "ms";
    });

    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    cards.forEach(function (card) {
      observer.observe(card);
    });
  }

  function formatCOP(value) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    }).format(Number(value) || 0);
  }

  function getCategoryName(categorias, categoriaId) {
    const categoria = categorias.find(function (item) {
      return Number(item.id) === Number(categoriaId);
    });
    return categoria ? categoria.nombre : "Sin categoria";
  }

  function setupNavbar() {
    const navbar = document.getElementById("navbar");
    const toggle = document.getElementById("navbarToggle");
    const menu = document.getElementById("navbarMenu");

    if (!navbar || !toggle || !menu) {
      return;
    }

    function closeMenu() {
      navbar.classList.remove("navbar--open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    }

    function openMenu() {
      navbar.classList.add("navbar--open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.textContent = "✕";
    }

    toggle.addEventListener("click", function () {
      const isOpen = navbar.classList.contains("navbar--open");
      if (isOpen) {
        closeMenu();
        return;
      }
      openMenu();
    });

    menu.addEventListener("click", function (event) {
      const target = event.target;
      if (!(target instanceof HTMLAnchorElement)) {
        return;
      }
      closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }

  function safe(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  async function renderCatalogPage() {
    const productsGrid = document.getElementById("productsGrid");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const categoryChips = document.getElementById("categoryChips");
    const productsCount = document.getElementById("productsCount");
    if (!productsGrid || !searchInput || !categoryFilter || !productsCount) {
      return;
    }

    productsGrid.innerHTML = '<div class="empty-state">Cargando productos...</div>';

    let categorias = [];
    let productos = [];
    try {
      const [categoriasRes, productosRes] = await Promise.all([
        apiRequest("categorias.php"),
        apiRequest("productos.php")
      ]);
      categorias = categoriasRes.data || [];
      productos = productosRes.data || [];
    } catch (error) {
      productsGrid.innerHTML = '<div class="empty-state">No fue posible cargar el catalogo. Verifica tu backend PHP.</div>';
      productsCount.textContent = "0 producto(s) encontrados";
      return;
    }

    categoryFilter.innerHTML = '<option value="">Todas las categorias</option>';
    categorias.forEach(function (categoria) {
      const option = document.createElement("option");
      option.value = String(categoria.id);
      option.textContent = categoria.nombre;
      categoryFilter.appendChild(option);
    });

    if (categoryChips) {
      categoryChips.innerHTML = "";

      function addChip(label, value, isActive) {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chip" + (isActive ? " chip--active" : "");
        chip.textContent = label;
        chip.setAttribute("data-value", value);
        categoryChips.appendChild(chip);
      }

      addChip("Todos", "", true);
      categorias.forEach(function (categoria) {
        addChip(categoria.nombre, String(categoria.id), false);
      });

      categoryChips.addEventListener("click", function (event) {
        const target = event.target;
        if (!(target instanceof HTMLButtonElement)) {
          return;
        }
        const value = target.getAttribute("data-value");
        if (value === null) {
          return;
        }
        categoryFilter.value = value;
        const chips = categoryChips.querySelectorAll(".chip");
        chips.forEach(function (el) {
          el.classList.remove("chip--active");
        });
        target.classList.add("chip--active");
        renderProducts();
      });
    }

    function renderProducts() {
      const term = searchInput.value.trim().toLowerCase();
      const category = categoryFilter.value;

      const filtered = productos.filter(function (producto) {
        const byTerm =
          producto.nombre.toLowerCase().includes(term) ||
          producto.marca.toLowerCase().includes(term) ||
          producto.descripcion.toLowerCase().includes(term);
        const byCategory = !category || String(producto.categoria_id) === category;
        return byTerm && byCategory;
      });

      productsCount.textContent = filtered.length + " producto(s) encontrados";
      productsGrid.innerHTML = "";

      if (filtered.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.textContent = "No se encontraron productos con esos filtros.";
        productsGrid.appendChild(empty);
        return;
      }

      filtered.forEach(function (producto) {
        const categoriaNombre = producto.categoria_nombre || getCategoryName(categorias, producto.categoria_id);
        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML =
          '<img class="product-card__image" src="' + safe(producto.imagen || "../img/producto-placeholder.png") + '" alt="' + safe(producto.nombre) + '" onerror="this.src=\'../img/producto-placeholder.png\'">' +
          '<div class="product-card__content">' +
          '<div class="product-card__category">' + safe(categoriaNombre) + "</div>" +
          '<h3 class="product-card__title">' + safe(producto.nombre) + "</h3>" +
          '<p class="product-card__desc">' + safe(producto.descripcion) + "</p>" +
          '<div class="product-card__bottom">' +
          '<span class="product-card__price">' + formatCOP(producto.precio) + "</span>" +
          '<a class="btn btn--secondary" href="./producto.html?id=' + producto.id + '">Ver detalle</a>' +
          "</div></div>";
        productsGrid.appendChild(card);
      });
      setupCardReveal(productsGrid);
    }

    searchInput.addEventListener("input", renderProducts);
    categoryFilter.addEventListener("change", renderProducts);
    renderProducts();
  }

  async function renderDetailPage() {
    const detailRoot = document.getElementById("productDetail");
    if (!detailRoot) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    if (id <= 0) {
      detailRoot.innerHTML = '<div class="empty-state">Producto invalido. Regresa al catalogo.</div>';
      return;
    }

    detailRoot.innerHTML = '<div class="empty-state">Cargando detalle...</div>';

    let producto = null;
    try {
      const response = await apiRequest("producto.php?id=" + id);
      producto = response.data;
    } catch (error) {
      detailRoot.innerHTML = '<div class="empty-state">Producto no encontrado o inactivo.</div>';
      return;
    }

    const categoriaNombre = producto.categoria_nombre || "Sin categoria";
    const whatsappMessage = encodeURIComponent(
      "Hola Good Cell, quiero informacion del producto " +
      producto.nombre +
      " con precio " +
      formatCOP(producto.precio) +
      "."
    );

    const stockLabel = Number(producto.stock) > 0 ? "En stock" : "Sin stock";

    detailRoot.innerHTML =
      '<article class="product-detail__card">' +
      '<img class="product-detail__image" src="' + safe(producto.imagen || "../img/producto-placeholder.png") + '" alt="' + safe(producto.nombre) + '" onerror="this.src=\'../img/producto-placeholder.png\'">' +
      '<div class="product-detail__content">' +
      '<p class="product-card__category">' + safe(categoriaNombre) + "</p>" +
      "<h1>" + safe(producto.nombre) + "</h1>" +
      '<p class="product-detail__meta">' +
      '<span class="badge badge--stock">' + safe(stockLabel) + "</span>" +
      " &nbsp;•&nbsp; Marca: " + safe(producto.marca) +
      " &nbsp;•&nbsp; Stock: " + safe(producto.stock) +
      "</p>" +
      '<p class="section-subtitle">' + safe(producto.descripcion) + "</p>" +
      '<p class="product-detail__price">' + formatCOP(producto.precio) + "</p>" +
      '<div class="product-detail__actions">' +
      '<a class="btn btn--whatsapp" href="https://wa.me/573105000800?text=' + whatsappMessage + '" target="_blank" rel="noopener noreferrer">WhatsApp</a>' +
      '<a class="btn btn--secondary" href="./index.html">Volver al catalogo</a>' +
      "</div>" +
      '<div class="specs-grid" aria-label="Especificaciones">' +
      '<div class="spec-card"><p class="spec-card__label">Categoria</p><p class="spec-card__value">' + safe(categoriaNombre) + "</p></div>" +
      '<div class="spec-card"><p class="spec-card__label">Marca</p><p class="spec-card__value">' + safe(producto.marca) + "</p></div>" +
      '<div class="spec-card"><p class="spec-card__label">Precio</p><p class="spec-card__value">' + safe(formatCOP(producto.precio)) + "</p></div>" +
      '<div class="spec-card"><p class="spec-card__label">Disponibilidad</p><p class="spec-card__value">' + safe(stockLabel) + "</p></div>" +
      "</div>" +
      "</div></article>";
  }

  async function doAdminLogin() {
    const email = window.prompt("Email administrador:");
    if (!email) {
      return false;
    }
    const password = window.prompt("Contrasena administrador:");
    if (!password) {
      return false;
    }
    await apiRequest("auth.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password })
    });
    return true;
  }

  async function renderAdminPage() {
    const productForm = document.getElementById("productForm");
    const categoryForm = document.getElementById("categoryForm");
    const productCategory = document.getElementById("productCategory");
    const productsTableBody = document.getElementById("productsTableBody");
    const categoriesTableBody = document.getElementById("categoriesTableBody");
    const productIdInput = document.getElementById("productId");
    const categoryIdInput = document.getElementById("categoryId");
    const resetDataBtn = document.getElementById("resetDataBtn");

    if (!productForm || !categoryForm || !productCategory || !productsTableBody || !categoriesTableBody || !productIdInput || !categoryIdInput || !resetDataBtn) {
      return;
    }

    let data = { categorias: [], productos: [] };

    async function fetchAdminData() {
      const [categoriasRes, productosRes] = await Promise.all([
        apiRequest("admin_categorias.php"),
        apiRequest("admin_productos.php")
      ]);
      data.categorias = categoriasRes.data || [];
      data.productos = productosRes.data || [];
    }

    try {
      await fetchAdminData();
    } catch (error) {
      if (error.status === 401) {
        try {
          const logged = await doAdminLogin();
          if (!logged) {
            window.location.href = "./index.html";
            return;
          }
          await fetchAdminData();
        } catch (loginError) {
          alert("No se pudo iniciar sesion de administrador.");
          window.location.href = "./index.html";
          return;
        }
      } else {
        alert("No se pudo cargar el panel admin desde la API.");
        return;
      }
    }

    function refreshCategorySelect() {
      productCategory.innerHTML = '<option value="">Selecciona una categoria</option>';
      data.categorias.forEach(function (categoria) {
        const option = document.createElement("option");
        option.value = String(categoria.id);
        option.textContent = categoria.nombre + (categoria.activo ? "" : " (Inactiva)");
        productCategory.appendChild(option);
      });
    }

    function renderTables() {
      refreshCategorySelect();
      productsTableBody.innerHTML = "";
      categoriesTableBody.innerHTML = "";

      data.productos.forEach(function (producto) {
        const tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" + producto.id + "</td>" +
          "<td>" + producto.nombre + "</td>" +
          "<td>" + getCategoryName(data.categorias, producto.categoria_id) + "</td>" +
          "<td>" + formatCOP(producto.precio) + "</td>" +
          "<td>" + producto.stock + "</td>" +
          '<td><span class="tag ' + (producto.activo ? "tag--ok" : "tag--off") + '">' + (producto.activo ? "Activo" : "Inactivo") + "</span></td>" +
          '<td><div class="actions-inline">' +
          '<button class="btn btn--secondary" type="button" data-action="edit-product" data-id="' + producto.id + '">Editar</button>' +
          '<button class="btn btn--danger" type="button" data-action="toggle-product" data-id="' + producto.id + '">' + (producto.activo ? "Desactivar" : "Activar") + "</button>" +
          "</div></td>";
        productsTableBody.appendChild(tr);
      });

      data.categorias.forEach(function (categoria) {
        const tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" + categoria.id + "</td>" +
          "<td>" + categoria.nombre + "</td>" +
          "<td>" + categoria.descripcion + "</td>" +
          '<td><span class="tag ' + (categoria.activo ? "tag--ok" : "tag--off") + '">' + (categoria.activo ? "Activa" : "Inactiva") + "</span></td>" +
          '<td><div class="actions-inline">' +
          '<button class="btn btn--secondary" type="button" data-action="edit-category" data-id="' + categoria.id + '">Editar</button>' +
          '<button class="btn btn--danger" type="button" data-action="toggle-category" data-id="' + categoria.id + '">' + (categoria.activo ? "Desactivar" : "Activar") + "</button>" +
          "</div></td>";
        categoriesTableBody.appendChild(tr);
      });
    }

    productForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const form = new FormData(productForm);
      const payload = {
        categoria_id: Number(form.get("categoria_id")),
        nombre: String(form.get("nombre") || "").trim(),
        descripcion: String(form.get("descripcion") || "").trim(),
        precio: Number(form.get("precio")),
        marca: String(form.get("marca") || "").trim(),
        stock: Number(form.get("stock")),
        imagen: String(form.get("imagen") || "").trim() || "../img/producto-placeholder.png",
        activo: true
      };

      if (!payload.categoria_id || !payload.nombre || !payload.descripcion || !payload.precio || !payload.marca || Number.isNaN(payload.stock)) {
        alert("Completa todos los campos obligatorios del producto.");
        return;
      }

      const editingId = Number(productIdInput.value);
      try {
        if (editingId) {
          await apiRequest("admin_productos.php?id=" + editingId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
        } else {
          await apiRequest("admin_productos.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
        }
      } catch (error) {
        alert(error.message || "No se pudo guardar el producto.");
        return;
      }

      await fetchAdminData();
      productForm.reset();
      productIdInput.value = "";
      renderTables();
    });

    categoryForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const form = new FormData(categoryForm);
      const payload = {
        nombre: String(form.get("nombre") || "").trim(),
        descripcion: String(form.get("descripcion") || "").trim(),
        activo: true
      };
      if (!payload.nombre || !payload.descripcion) {
        alert("Completa nombre y descripcion de la categoria.");
        return;
      }

      const editingId = Number(categoryIdInput.value);
      try {
        if (editingId) {
          await apiRequest("admin_categorias.php?id=" + editingId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
        } else {
          await apiRequest("admin_categorias.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
        }
      } catch (error) {
        alert(error.message || "No se pudo guardar la categoria.");
        return;
      }

      await fetchAdminData();
      categoryForm.reset();
      categoryIdInput.value = "";
      renderTables();
    });

    document.addEventListener("click", async function (event) {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) {
        return;
      }
      const action = target.getAttribute("data-action");
      const id = Number(target.getAttribute("data-id"));
      if (!action || !id) {
        return;
      }

      if (action === "edit-product") {
        const product = data.productos.find(function (item) { return Number(item.id) === id; });
        if (!product) {
          return;
        }
        productIdInput.value = String(product.id);
        productForm.elements.categoria_id.value = String(product.categoria_id);
        productForm.elements.nombre.value = product.nombre;
        productForm.elements.descripcion.value = product.descripcion;
        productForm.elements.precio.value = String(product.precio);
        productForm.elements.marca.value = product.marca;
        productForm.elements.stock.value = String(product.stock);
        productForm.elements.imagen.value = product.imagen;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      if (action === "toggle-product") {
        const product = data.productos.find(function (item) { return Number(item.id) === id; });
        if (!product) {
          return;
        }
        try {
          await apiRequest("admin_productos.php?id=" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Object.assign({}, product, { activo: !product.activo }))
          });
          await fetchAdminData();
        } catch (error) {
          alert(error.message || "No se pudo actualizar el estado del producto.");
        }
        renderTables();
      }

      if (action === "edit-category") {
        const category = data.categorias.find(function (item) { return Number(item.id) === id; });
        if (!category) {
          return;
        }
        categoryIdInput.value = String(category.id);
        categoryForm.elements.nombre.value = category.nombre;
        categoryForm.elements.descripcion.value = category.descripcion;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      if (action === "toggle-category") {
        const category = data.categorias.find(function (item) { return Number(item.id) === id; });
        if (!category) {
          return;
        }
        try {
          await apiRequest("admin_categorias.php?id=" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Object.assign({}, category, { activo: !category.activo }))
          });
          await fetchAdminData();
        } catch (error) {
          alert(error.message || "No se pudo actualizar el estado de la categoria.");
        }
        renderTables();
      }
    });

    resetDataBtn.addEventListener("click", async function () {
      try {
        await fetchAdminData();
        productForm.reset();
        categoryForm.reset();
        productIdInput.value = "";
        categoryIdInput.value = "";
        renderTables();
      } catch (error) {
        alert("No se pudo recargar la informacion.");
      }
    });

    renderTables();
  }

  function init() {
    setupPageTransitions();
    
    setupButtonRipple();
    setupGlowBrand();
    setupHeroEffects();
    setupThemeToggle();
    setupNavbar();
    renderCatalogPage();
    renderDetailPage();
    renderAdminPage();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
