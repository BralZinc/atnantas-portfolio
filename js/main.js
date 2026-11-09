(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Textes ---------- */
  document.querySelectorAll("[data-fill]").forEach(el => { el.textContent = SITE[el.dataset.fill] || ""; });
  document.title = `${SITE.nom} — ${SITE.metier}`;
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Photos ---------- */
  const photosOf = album =>
    album.photos && album.photos.length
      ? album.photos.map(p => (typeof p === "string" ? { src: p } : p))
      : Array.from({ length: album.demo || 6 }, (_, i) => ({ demo: true, i }));

  const hueOf = str => [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 0);

  const ratioOf = p => (p && p.w && p.h ? p.w / p.h : null);

  const photoHTML = (p, album, { lazy = true, label = "", full = false } = {}) => {
    if (p.demo) {
      const h = 95 + ((hueOf(album.titre) + p.i * 23) % 70); // tons verts, assortis au site
      return `<div class="ph demo" style="--h:${h}" data-label="${esc(label)}"></div>`;
    }
    return `<div class="ph"><img src="${esc(full ? p.src : p.thumb || p.src)}" alt="${esc(album.titre)}" ${lazy ? 'loading="lazy"' : ""} decoding="async"></div>`;
  };

  const fmtDate = d => {
    if (!d) return "";
    const date = new Date(d + "T12:00:00");
    return isNaN(date) ? d : date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  const source = window.ALBUMS && window.ALBUMS.length ? window.ALBUMS : ALBUMS_DEMO;
  const albums = [...source].sort((a, b) => (b.une === true) - (a.une === true) || (b.date || "").localeCompare(a.date || ""));

  /* ---------- Carrousel ---------- */
  const reelItems = albums.flatMap((a, ai) => photosOf(a).slice(0, 3).map((p, pi) => ({ a, ai, p, pi })))
    .sort((x, y) => x.pi - y.pi)  // mélange les albums
    .slice(0, 14);
  $("#reel").innerHTML = reelItems.map(({ a, ai, p, pi }) =>
    `<button data-album="${ai}" data-start="${pi}" aria-label="${esc(a.titre)}" ${ratioOf(p) ? `style="--r:${ratioOf(p).toFixed(4)}"` : ""}>${photoHTML(p, a, { lazy: pi > 0 })}</button>`).join("");
  const reel = $("#reel");
  const reelStep = () => reel.clientWidth * 0.7;
  $("#reel-prev").onclick = () => reel.scrollBy({ left: -reelStep(), behavior: "smooth" });
  $("#reel-next").onclick = () => reel.scrollBy({ left: reelStep(), behavior: "smooth" });

  /* Bandeau défilant automatique ET manipulable (doigt, trackpad, clic-glisser) */
  function scrollableMarquee(box, speed) {
    if (!box) return;
    box.classList.add("is-scrollable");
    const track = box.firstElementChild;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pausedUntil = 0, dragging = false, startX = 0, startLeft = 0, moved = false;
    const half = () => track.scrollWidth / 2;
    const wrap = () => {                       // boucle infinie : le contenu est répété
      const h = half();
      if (box.scrollLeft >= h) box.scrollLeft -= h;
      else if (box.scrollLeft <= 0) box.scrollLeft += h;
    };
    const pause = (ms = 2500) => { pausedUntil = performance.now() + ms; };
    requestAnimationFrame(() => { box.scrollLeft = half() / 2; });
    let acc = 0;
    const tick = () => {
      if (!reduce && !dragging && performance.now() > pausedUntil) {
        acc += speed;                          // scrollLeft n'accepte que des pixels entiers
        const step = Math.trunc(acc);
        if (step) { box.scrollLeft += step; acc -= step; wrap(); }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    box.addEventListener("scroll", wrap, { passive: true });
    box.addEventListener("wheel", () => pause(), { passive: true });
    box.addEventListener("touchstart", () => pause(4000), { passive: true });
    box.addEventListener("touchmove", () => pause(4000), { passive: true });
    box.addEventListener("mouseenter", () => pause(600000));
    box.addEventListener("mouseleave", () => { dragging = false; box.classList.remove("is-dragging"); pause(1200); });
    // clic-glisser à la souris
    box.addEventListener("pointerdown", e => {
      if (e.pointerType !== "mouse") return;
      dragging = true; moved = false; startX = e.clientX; startLeft = box.scrollLeft;
      box.classList.add("is-dragging");
    });
    window.addEventListener("pointermove", e => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      box.scrollLeft = startLeft - dx; wrap();
    });
    window.addEventListener("pointerup", () => {
      if (!dragging) return;
      dragging = false; box.classList.remove("is-dragging"); pause(2500);
    });
    box.addEventListener("dragstart", e => e.preventDefault());
  }

  /* ---------- Bandeaux défilants ---------- */
  const fillMarquee = (el, words) => {
    const row = words.map(w => `<span>${esc(w)}</span>`).join("");
    el.innerHTML = row.repeat(4);
  };
  // bandeau clubs & ligues : logos seuls, les compétitions intercalées entre les clubs
  const withLogo = list => (list || []).filter(x => x && x.logo);
  const teams = withLogo(SITE.equipes), comps = withLogo(SITE.competitions);
  const logo = x => `<span class="logo-item${x.long ? " is-long" : ""}${x.blanc ? " is-white" : ""}${x.fondNoir ? " is-on-black" : ""}"><img src="${esc(x.logo)}" alt="${esc(x.nom)}" title="${esc(x.nom)}"></span>`;
  const mix = [];
  teams.forEach((t, i) => { mix.push(logo(t)); if (i % 2 === 1 && comps.length) mix.push(logo(comps[(i >> 1) % comps.length])); });
  if (mix.length) {
    $("#marquee0").innerHTML = mix.join("").repeat(4);
    scrollableMarquee($(".marquee-teams"), -0.6);   // défile tout seul, mais se manipule à la main
  } else $(".marquee-teams").remove();

  fillMarquee($("#marquee1"), SITE.bandeau || ["Matchs", "Séances joueurs", "Agents", "Clubs"]);
  fillMarquee($("#marquee2"), [`Écris-moi : ${SITE.email}`, "Réponse sous 24h"]);

  /* ---------- Feed éditorial ---------- */
  const cats = ["Tout", ...new Set(albums.map(a => a.categorie).filter(Boolean))];
  let current = "Tout";

  const entryHTML = (a, i, pos, layout) => {
    const meta = [a.competition, fmtDate(a.date), `${photosOf(a).length} photos`].filter(Boolean).map(esc).join(" / ");
    const cover = photosOf(a)[0];
    const r = ratioOf(cover);
    return `
      <button class="entry ${layout}${pos === 0 ? " is-first" : ""}${r && r > 1.2 ? " is-land" : ""} reveal" data-album="${i}" aria-label="Ouvrir l'album ${esc(a.titre)}" ${r ? `style="--r:${r.toFixed(4)}"` : ""}>
        <span class="num" aria-hidden="true">${String(pos + 1).padStart(2, "0")}</span>
        ${photoHTML(cover, a)}
        <figcaption>
          <h3>${esc(a.titre)}</h3>
          ${a.score ? `<span><span class="score-lbl">Score final</span><span class="score">${esc(a.score)}</span></span>` : ""}
          <span class="meta">${meta}</span>
          <span class="entry-cta" aria-hidden="true">Voir l'album →</span>
        </figcaption>
      </button>`;
  };
  const renderFeed = () => {
    // paysage : pleine largeur / 62 % à gauche — portrait : à droite / centré (jamais pleine largeur)
    let pos = 0, nLand = 0, nPort = 0;
    $("#feed").innerHTML = albums
      .map((a, i) => {
        if (!(current === "Tout" || a.categorie === current)) return "";
        const r = ratioOf(photosOf(a)[0]);
        const portrait = r ? r < 1 : pos % 2 === 1;
        const layout = portrait ? (nPort++ % 2 ? "l4" : "l2") : (nLand++ % 2 ? "l3" : "l1");
        return entryHTML(a, i, pos++, layout);
      })
      .join("");
    observe();
  };
  const setCat = c => {
    current = c;
    document.querySelectorAll(".filter").forEach(f => f.setAttribute("aria-selected", f.dataset.cat === c));
    renderFeed();
  };
  if (cats.length > 2) {
    $("#filters").innerHTML = cats.map(c => `<button class="filter" aria-selected="${c === current}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
    $("#menu-cats").innerHTML = cats.slice(1).map(c => `<a href="#travaux" data-close data-cat="${esc(c)}">${esc(c)}</a>`).join("");
  }
  document.addEventListener("click", e => {
    const f = e.target.closest("[data-cat]");
    if (f) setCat(f.dataset.cat);
  });

  /* ---------- Services / À propos / Contact ---------- */
  $("#services-list").innerHTML = SERVICES.map((s, i) => `
    <li class="reveal"><span class="num" aria-hidden="true">${i + 1}</span>
    <h3>${esc(s.titre)}</h3><p>${esc(s.texte)}</p></li>`).join("");

  const pick = (n, wantPortrait) => {
    const a = albums[n % albums.length];
    if (!a) return "";
    const list = photosOf(a);
    const p = list.slice(1).find(x => { const r = ratioOf(x); return r && (wantPortrait ? r < 1 : r > 1); }) || list[Math.min(1, list.length - 1)];
    return photoHTML(p, a);
  };
  $("#about-photo").innerHTML = SITE.photoApropos
    ? `<div class="ph about-me"><img src="${esc(SITE.photoApropos)}" alt="${esc(SITE.nom)} en train de photographier au bord du terrain" loading="lazy"></div>`
    : pick(1, true);
  $("#cta-photo").innerHTML = SITE.photoContact
    ? `<div class="ph cta-me"><img src="${esc(SITE.photoContact)}" alt="Avant-match au stade, bannières des deux clubs sur la pelouse" loading="lazy"></div>`
    : pick(2, false);

  $("#about-text").innerHTML = SITE.apropos.map(p => `<p>${esc(p)}</p>`).join("");
  $("#stats").innerHTML = SITE.chiffres.map(c => `<div><dt>${esc(c.label)}</dt><dd>${esc(c.valeur)}</dd></div>`).join("");

  const links = [];
  if (SITE.whatsapp) links.push(`<a class="alt" href="https://wa.me/${esc(SITE.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>`);
  if (SITE.telephone) links.push(`<a class="alt" href="tel:${esc(SITE.telephone.replace(/\s/g, ""))}">${esc(SITE.telephone)}</a>`);
  $("#contact-links").innerHTML = links.join("") + socialButtons("soc-dark");

  $("#socials").innerHTML = socialButtons("soc-small");
  $("#menu-socials").innerHTML = socialButtons("soc-dark") || (SITE.email ? `<a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>` : "");

  /* ---------- Menu ---------- */
  const menu = $("#menu"), burger = $("#burger");
  const toggleMenu = open => {
    menu.hidden = !open;
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    document.body.classList.toggle("locked", open);
  };
  burger.onclick = () => toggleMenu(menu.hidden);
  menu.addEventListener("click", e => { if (e.target.closest("[data-close]")) toggleMenu(false); });

  /* ---------- Album + visionneuse ---------- */
  const view = $("#album-view"), lb = $("#lightbox");
  let openAlbum = null, lbIndex = 0, lastFocus = null;

  const showAlbum = (idx, start) => {
    openAlbum = albums[idx];
    lastFocus = document.activeElement;
    $("#album-title").textContent = openAlbum.titre;
    $("#album-meta").textContent = [openAlbum.competition, openAlbum.score, fmtDate(openAlbum.date)].filter(Boolean).join(" · ");
    $("#album-photos").innerHTML = photosOf(openAlbum)
      .map((p, i) => {
        // lignes justifiées : chaque photo garde ses proportions, lecture de gauche à droite
        const r = p.w && p.h ? p.w / p.h : (i % 3 === 2 ? 1.5 : 0.8);
        return `<button data-photo="${i}" aria-label="Agrandir la photo ${i + 1}" style="--r:${r.toFixed(4)}">${photoHTML(p, openAlbum, { label: "Photo " + (i + 1) })}</button>`;
      }).join("");
    view.hidden = false; view.scrollTop = 0;
    document.body.classList.add("locked");
    if (start != null) openLb(start); else $("#album-close").focus();
  };
  const closeAlbum = () => {
    view.hidden = true; document.body.classList.remove("locked");
    lastFocus && lastFocus.focus();
  };
  const renderLb = () => {
    const list = photosOf(openAlbum);
    $("#lb-stage").innerHTML = photoHTML(list[lbIndex], openAlbum, { lazy: false, full: true, label: "Photo " + (lbIndex + 1) });
    $("#lb-count").textContent = `${lbIndex + 1} / ${list.length}`;
  };
  const openLb = i => { lbIndex = i; lb.hidden = false; renderLb(); $("#lb-close").focus(); };
  const step = d => { const n = photosOf(openAlbum).length; lbIndex = (lbIndex + d + n) % n; renderLb(); };

  document.addEventListener("click", e => {
    const card = e.target.closest("[data-album]");
    if (card) return showAlbum(+card.dataset.album, card.dataset.start != null ? +card.dataset.start : null);
    const ph = e.target.closest("[data-photo]");
    if (ph) openLb(+ph.dataset.photo);
  });
  $("#album-close").onclick = closeAlbum;
  $("#lb-close").onclick = () => { lb.hidden = true; };
  $("#lb-prev").onclick = () => step(-1);
  $("#lb-next").onclick = () => step(1);
  lb.addEventListener("click", e => { if (e.target === lb || e.target.id === "lb-stage") lb.hidden = true; });

  document.addEventListener("keydown", e => {
    if (!lb.hidden) {
      if (e.key === "Escape") lb.hidden = true;
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    } else if (!view.hidden && e.key === "Escape") closeAlbum();
    else if (!menu.hidden && e.key === "Escape") toggleMenu(false);
  });

  let x0 = null;
  lb.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    x0 = null;
  });

  /* ---------- Apparition au scroll ---------- */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -6% 0px" })
    : null;
  function observe() {
    document.querySelectorAll(".reveal:not(.in)").forEach(el => (io ? io.observe(el) : el.classList.add("in")));
  }
  renderFeed();
})();
