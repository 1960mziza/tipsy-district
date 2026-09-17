(function () {
  "use strict";

  const CATEGORY_ORDER = ["Wines", "Whiskies & Spirits", "Beers & Ciders", "Mixers & More"];

  const fmtPrice = (n) => "KSh " + Number(n || 0).toLocaleString("en-KE");

  function waLink(phone, text) {
    const digits = String(phone || "").replace(/[^\d]/g, "");
    return "https://wa.me/" + digits + (text ? "?text=" + encodeURIComponent(text) : "");
  }

  async function loadJSON(path) {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load " + path);
    return res.json();
  }

  function applySettings(settings) {
    const phone = settings.whatsapp || "";
    const greeting = "Hi Tipsy District! I'd like to place an order.";

    document.querySelectorAll("#heroWaBtn, #bandWaBtn, #floatWaBtn").forEach((el) => {
      el.href = waLink(phone, greeting);
      el.target = "_blank";
      el.rel = "noopener";
    });

    const aboutText = document.getElementById("aboutText");
    if (aboutText) aboutText.textContent = settings.about || "";

    const deliveryText = document.getElementById("deliveryText");
    if (deliveryText) deliveryText.textContent = settings.delivery || "";

    const addressText = document.getElementById("addressText");
    if (addressText) addressText.textContent = settings.address || "";

    const hoursText = document.getElementById("hoursText");
    if (hoursText) hoursText.textContent = settings.hours || "";

    const phoneText = document.getElementById("phoneText");
    if (phoneText) phoneText.textContent = phone ? "+" + phone.replace(/^0+/, "") : "";

    const directionsBtn = document.getElementById("directionsBtn");
    if (directionsBtn && settings.mapsUrl) directionsBtn.href = settings.mapsUrl;

    const tagline = document.querySelector(".hero-tagline");
    if (tagline && settings.tagline) tagline.textContent = settings.tagline;
    const callBtn = document.getElementById("navCallBtn");
if (callBtn) callBtn.href = "tel:+" + String(settings.phone || "").replace(/[^\d]/g, "");

const callPhoneText = document.getElementById("callPhoneText");
if (callPhoneText) callPhoneText.textContent = settings.phone ? "+" + settings.phone : "";
  }

  function groupByCategory(items) {
    const groups = {};
    items.forEach((item) => {
      const cat = item.category || "Other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }

  function renderTabs(categories, onSelect) {
    const tabWrap = document.getElementById("menuTabs");
    tabWrap.innerHTML = "";

    const makeTab = (label, value, active) => {
      const btn = document.createElement("button");
      btn.className = "menu-tab" + (active ? " active" : "");
      btn.type = "button";
      btn.textContent = label;
      btn.addEventListener("click", () => {
        tabWrap.querySelectorAll(".menu-tab").forEach((t) => t.classList.remove("active"));
        btn.classList.add("active");
        onSelect(value);
      });
      return btn;
    };

    tabWrap.appendChild(makeTab("All", "all", true));
    categories.forEach((cat) => tabWrap.appendChild(makeTab(cat, cat, false)));
  }

  function renderMenu(items, whatsapp, filter) {
    const list = document.getElementById("menuList");
    list.innerHTML = "";

    const visible = items.filter((i) => filter === "all" || i.category === filter);
    if (!visible.length) {
      list.innerHTML = '<p class="menu-empty">Nothing here yet — check back soon.</p>';
      return;
    }

    const groups = groupByCategory(visible);
    const orderedCats = CATEGORY_ORDER.filter((c) => groups[c]).concat(
      Object.keys(groups).filter((c) => !CATEGORY_ORDER.includes(c))
    );

    orderedCats.forEach((cat) => {
      const section = document.createElement("div");
      section.className = "menu-category";

      const title = document.createElement("h3");
      title.className = "menu-category-title";
      title.textContent = cat;
      section.appendChild(title);

      const rule = document.createElement("div");
      rule.className = "menu-category-rule";
      section.appendChild(rule);

      groups[cat].forEach((item) => {
        const row = document.createElement("div");
        row.className = "menu-row" + (item.available === false ? " unavailable" : "");

        const name = document.createElement("span");
        name.className = "menu-row-name";
        name.textContent = item.name + (item.available === false ? " (out of stock)" : "");

        const leader = document.createElement("span");
        leader.className = "menu-row-leader";

        const price = document.createElement("span");
        price.className = "menu-row-price";
        price.textContent = fmtPrice(item.price);

        const meta = document.createElement("div");
        meta.className = "menu-row-meta";

        const descWrap = document.createElement("div");
        const desc = document.createElement("p");
        desc.className = "menu-row-desc";
        desc.textContent = item.description || "";
        descWrap.appendChild(desc);
        if (item.volume) {
          const vol = document.createElement("span");
          vol.className = "menu-row-vol";
          vol.textContent = item.volume;
          descWrap.appendChild(document.createTextNode(" · "));
          descWrap.appendChild(vol);
        }

        const order = document.createElement("a");
        order.className = "menu-row-order";
        order.textContent = "Order";
        order.target = "_blank";
        order.rel = "noopener";
        order.href = waLink(
          whatsapp,
          "Hi Tipsy District! I'd like to order: " + item.name + " (" + (item.volume || "") + ") — " + fmtPrice(item.price)
        );

        row.appendChild(name);
        row.appendChild(leader);
        row.appendChild(price);
        row.appendChild(meta);
        meta.appendChild(descWrap);
        meta.appendChild(order);

        section.appendChild(row);
      });

      list.appendChild(section);
    });
  }

  function setupNav() {
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");
    if (!toggle || !links) return;
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  async function init() {
    setupNav();

    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    try {
      const [settings, catalog] = await Promise.all([
        loadJSON("data/settings.json"),
        loadJSON("data/products.json"),
      ]);

      applySettings(settings);

      const items = catalog.items || [];
      const categories = CATEGORY_ORDER.filter((c) => items.some((i) => i.category === c)).concat(
        [...new Set(items.map((i) => i.category))].filter((c) => !CATEGORY_ORDER.includes(c))
      );

      renderTabs(categories, (filter) => renderMenu(items, settings.whatsapp, filter));
      renderMenu(items, settings.whatsapp, "all");
    } catch (err) {
      const list = document.getElementById("menuList");
      if (list) list.innerHTML = '<p class="menu-empty">Couldn\'t load the menu right now. Please refresh.</p>';
      console.error(err);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
