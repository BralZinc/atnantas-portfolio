(() => {
  const $ = s => document.querySelector(s);
  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const A = typeof APROPOS === "object" ? APROPOS : {};
  const hide = id => { const el = $(id); if (el) el.hidden = true; };

  document.querySelectorAll("[data-fill]").forEach(el => { el.textContent = SITE[el.dataset.fill] || ""; });
  document.title = `À propos — ${SITE.nom}`;
  $("#year").textContent = new Date().getFullYear();

  /* Présentation */
  $("#ab-photo").innerHTML = SITE.photoApropos
    ? `<div class="ph"><img src="${esc(SITE.photoApropos)}" alt="${esc(SITE.nom)} en train de photographier au bord du terrain"></div>`
    : "";
  $("#ab-sub").textContent = A.sousTitre || SITE.metier;
  $("#ab-bio").innerHTML = (A.bio && A.bio.length ? A.bio : SITE.apropos).map(p => `<p>${esc(p)}</p>`).join("");
  $("#ab-actions").innerHTML =
    `<a href="contact.html" class="btn btn-big">Me contacter →</a>` +
    (A.cv ? `<a href="${esc(A.cv)}" class="btn btn-ghost" download>Télécharger mon CV</a>` : "");

  $("#ab-socials").innerHTML = socialButtons("soc-dark");
  $("#socials").innerHTML = socialButtons("soc-small");

  /* Chiffres */
  $("#ab-stats").innerHTML = (SITE.chiffres || []).map(c => `<div><dt>${esc(c.label)}</dt><dd>${esc(c.valeur)}</dd></div>`).join("");

  /* Clubs (bandeau défilant) */
  if (A.clubs && A.clubs.length) {
    const row = A.clubs.map(c => `<span>${esc(c)}</span>`).join("");
    $("#ab-clubs").innerHTML = row.repeat(3);
  } else hide("#ab-clubs-wrap");

  /* Frises */
  const todo = `<span class="todo">À compléter</span>`;
  // petit logo de l'entreprise / école, ou badge à initiales
  const logoHTML = x => {
    if (x.icone === "appareil") return `<span class="tl-logo tl-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="4"/></svg></span>`;
    if (x.logo) return `<span class="tl-logo${x.logoPlein ? " is-full" : ""}"><img src="${esc(x.logo)}" alt="" loading="lazy"></span>`;
    const ini = x.initiales || (x.lieu || x.titre || "").split("·")[0].trim().split(/\s+/).map(w => w[0]).join("").slice(0, 3);
    return ini ? `<span class="tl-logo tl-ini" aria-hidden="true">${esc(ini)}</span>` : "";
  };
  const timeline = (list, el, wrap) => {
    if (!list || !list.length) return hide(wrap);
    $(el).innerHTML = list.map(x => `
      <li class="${x.aCompleter ? "is-todo" : ""}">
        <span class="tl-date">${esc(x.periode || "")}</span>
        <div class="tl-body">
          ${logoHTML(x)}
          <div>
          <h3>${esc(x.titre)} ${x.aCompleter ? todo : ""}</h3>
          ${x.lieu ? `<p class="tl-lieu">${esc(x.lieu)}</p>` : ""}
          ${x.points && x.points.length ? `<ul>${x.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
          </div>
        </div>
      </li>`).join("");
  };
  timeline(A.parcours, "#ab-parcours", "#ab-parcours-wrap");
  timeline(A.formation, "#ab-formation", "#ab-formation-wrap");

  /* Étiquettes */
  const tags = (list, el, wrap) => {
    if (!list || !list.length) return hide(wrap);
    $(el).innerHTML = list.map(t => `<li>${esc(t)}</li>`).join("");
  };
  tags(A.competences, "#ab-comp", "#ab-comp-wrap");
  tags(A.outils, "#ab-outils", "#ab-outils-wrap");
})();
