(() => {
  const CFG = window.SALON_DEMO;
  if (!CFG) {
    console.warn("SALON_DEMO no está definido. ¿config.js está cargando?");
    return;
  }

  const $ = (sel) => document.querySelector(sel);
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el && value !== undefined) el.textContent = value;
  };
  const setHref = (id, value) => {
    const el = document.getElementById(id);
    if (el && value) el.href = value;
  };

  // Theme vars
  const root = document.documentElement;
  if (CFG.theme?.brand) root.style.setProperty("--brand", CFG.theme.brand);
  if (CFG.theme?.brand2) root.style.setProperty("--brand2", CFG.theme.brand2);

  if (CFG.images?.hero) root.style.setProperty("--heroImage", CFG.images.hero);
  if (CFG.images?.g1) root.style.setProperty("--gallery1", CFG.images.g1);
  if (CFG.images?.g2) root.style.setProperty("--gallery2", CFG.images.g2);
  if (CFG.images?.g3) root.style.setProperty("--gallery3", CFG.images.g3);

  // Business texts
  const B = CFG.business;
  setText("businessName", B.name);
  setText("cityLine", B.cityLine);
  setText("headline", B.headline);
  setText("subtext", B.subtext);
  setText("hours", B.hours);
  setText("address", B.address);
  setText("rating", B.rating);
  setText("years", B.years);
  setText("clients", B.clients);
  setText("address2", B.address);
  setText("hours2", B.hours);
  setText("cityLine2", B.cityLine);

  // Links
  setHref("phoneLink", `tel:${B.phoneTel}`);
  setText("phoneDisplay", B.phoneDisplay);

  const waMsg = encodeURIComponent(`Hola, quiero agendar una cita en ${B.name}.`);
  const waLink = `https://wa.me/${B.whatsapp}?text=${waMsg}`;
  ["whatsappLink","whatsappLink2","whatsappLink3","whatsappLink4","whatsappLink5","whatsappLink6"].forEach(id => setHref(id, waLink));

  setHref("instagramLink", B.instagramUrl);
  setHref("instagramLink2", B.instagramUrl);
  setHref("mapsLink", B.mapsUrl);
  setHref("mapsLink2", B.mapsUrl);

  // Render services
  const servicesWrap = $("#servicesGrid");
  if (servicesWrap && Array.isArray(CFG.services)) {
    servicesWrap.innerHTML = CFG.services.map(s => `
      <article class="card">
        
        <h3>${s.name}</h3>
        <p class="muted">${s.desc}</p>
        <div class="service-meta">
          <strong class="price">${s.price}</strong>
          <span class="time">${s.time}</span>
        </div>
      </article>
    `).join("");
  }

  // Render price blocks
  const pricesWrap = $("#pricesGrid");
  if (pricesWrap && Array.isArray(CFG.prices)) {
    pricesWrap.innerHTML = CFG.prices.map(p => `
      <article class="card">
        <h3>${p.name}</h3>
        <div class="service-meta" style="margin-top:10px;">
          <strong class="price">${p.price}</strong>
          <span class="tag">${p.note}</span>
        </div>
        <p class="muted" style="margin-top:10px;">${p.desc}</p>
      </article>
    `).join("");
  }

  // Footer year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();