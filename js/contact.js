(() => {
  const $ = s => document.querySelector(s);
  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  document.querySelectorAll("[data-fill]").forEach(el => { el.textContent = SITE[el.dataset.fill] || ""; });
  document.title = `Contact — ${SITE.nom}`;
  $("#year").textContent = new Date().getFullYear();
  $("#socials").innerHTML = socialButtons();
  $("#socials-foot").innerHTML = socialButtons("soc-small");

  // Adresse de réception : celle de data.js (ou l'alias FormSubmit si tu l'as renseigné)
  const target = SITE.formulaire || SITE.email;
  const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(target)}`;

  const form = $("#form"), btn = $("#submit"), err = $("#form-error");
  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  const showError = (msg, field) => {
    err.innerHTML = msg; err.hidden = false;
    if (field) { field.setAttribute("aria-invalid", "true"); field.focus(); }
  };

  form.addEventListener("input", e => { e.target.removeAttribute("aria-invalid"); err.hidden = true; });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    err.hidden = true;
    const d = Object.fromEntries(new FormData(form));

    if (!d.nom.trim()) return showError("Indique ton nom.", $("#f-nom"));
    if (!isEmail(d.email.trim())) return showError("Ton adresse email ne semble pas valide.", $("#f-email"));
    if (!d.profil) return showError("Dis-moi si tu es joueur, agent, club…", form.querySelector('[name="profil"]'));
    if (d.message.trim().length < 10) return showError("Ton message est un peu court.", $("#f-msg"));
    if (d._honey) return; // robot

    const payload = {
      "Nom": d.nom.trim(),
      "Email": d.email.trim(),
      "Profil": d.profil,
      "Téléphone": d.telephone.trim() || "—",
      "Club / équipe": d.club.trim() || "—",
      "Message": d.message.trim(),
      _replyto: d.email.trim(),          // « Répondre » dans Gmail répond directement à la personne
      _subject: `Portfolio — nouveau message de ${d.nom.trim()} (${d.profil})`,
      _template: "table",
      _captcha: "false",
    };

    btn.disabled = true; btn.textContent = "Envoi en cours…";
    try {
      // Web3Forms si une clé est renseignée dans data.js, sinon FormSubmit
      const useW3F = Boolean(SITE.web3formsCle);
      const body = useW3F
        ? {
            access_key: SITE.web3formsCle,
            subject: payload._subject,
            from_name: `${payload.Nom} via portfolio`,
            replyto: payload.Email,
            botcheck: "",
            "Nom": payload.Nom, "Email": payload.Email, "Profil": payload.Profil,
            "Téléphone": payload["Téléphone"], "Club / équipe": payload["Club / équipe"], "Message": payload.Message,
          }
        : payload;
      const res = await fetch(useW3F ? "https://api.web3forms.com/submit" : endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (/activat/i.test(json.message || "")) {
        // 1er envoi : FormSubmit attend que le propriétaire active le formulaire
        showError("Formulaire pas encore activé : un mail « Activate Form » vient d'être envoyé à l'adresse du site. Clique sur le lien qu'il contient, puis renvoie ce message.");
        btn.disabled = false; btn.textContent = "Envoyer le message →";
        return;
      }
      if (!res.ok || String(json.success) !== "true") throw new Error(json.message || res.status);

      $("#success-email").textContent = payload.Email;
      form.hidden = true;
      $("#success").hidden = false;
      $("#success").focus();
    } catch (ex) {
      console.warn("Envoi échoué :", ex);
      const mail = `mailto:${esc(SITE.email)}?subject=${encodeURIComponent(payload._subject)}&body=${encodeURIComponent(payload.Message)}`;
      showError(`L'envoi n'a pas fonctionné. Réessaie dans un instant ou écris-moi directement à <a href="${mail}">${esc(SITE.email)}</a>.`);
      btn.disabled = false; btn.textContent = "Envoyer le message →";
    }
  });
})();
