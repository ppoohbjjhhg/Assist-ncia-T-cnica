document.addEventListener("DOMContentLoaded", () => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Ano no rodapé ---------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Menu mobile ---------------- */
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }));
  }

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("is-visible"));
  }

  /* ---------------- Painel de diagnóstico: FALHA -> NORMAL ---------------- */
  const diagLed = document.getElementById("diagLed");
  const diagWord = document.getElementById("diagWord");
  if (diagLed && diagWord && !prefersReduced) {
    setTimeout(() => {
      diagLed.classList.add("is-ok");
      diagWord.classList.add("is-ok");
      diagWord.textContent = "NORMAL";
    }, 2200);
  } else if (diagWord) {
    diagWord.textContent = "NORMAL";
    diagLed.classList.add("is-ok");
    diagWord.classList.add("is-ok");
  }

  /* ---------------- Accordion FAQ ---------------- */
  document.querySelectorAll(".acc-item").forEach(item => {
    const head = item.querySelector(".acc-item__head");
    const body = item.querySelector(".acc-item__body");
    head.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".acc-item.is-open").forEach(other => {
        if (other !== item) {
          other.classList.remove("is-open");
          other.querySelector(".acc-item__head").setAttribute("aria-expanded", "false");
          other.querySelector(".acc-item__body").style.maxHeight = null;
        }
      });
      item.classList.toggle("is-open", !isOpen);
      head.setAttribute("aria-expanded", String(!isOpen));
      body.style.maxHeight = !isOpen ? body.scrollHeight + "px" : null;
    });
  });

  /* ---------------- Antes & Depois (slider) ---------------- */
  document.querySelectorAll(".ba").forEach(ba => {
    const clip = ba.querySelector(".ba__clip");
    const handle = ba.querySelector(".ba__handle");
    const range = ba.querySelector(".ba__range");
    const update = (val) => {
      clip.style.width = val + "%";
      handle.style.left = val + "%";
    };
    range.addEventListener("input", (e) => update(e.target.value));
    update(range.value);
  });

  /* ---------------- Assistente (chat baseado em regras) ---------------- */
  const fab = document.getElementById("assistantFab");
  const panel = document.getElementById("assistantPanel");
  const closeBtn = document.getElementById("assistantClose");
  const body = document.getElementById("assistantBody");
  const form = document.getElementById("assistantForm");
  const input = document.getElementById("assistantInput");
  const suggestions = document.getElementById("assistantSuggestions");

  function togglePanel(open) {
    panel.hidden = !open;
    fab.setAttribute("aria-expanded", String(open));
    if (open) input.focus();
  }
  fab?.addEventListener("click", () => togglePanel(panel.hidden));
  closeBtn?.addEventListener("click", () => togglePanel(false));

  function addMsg(text, who) {
    const div = document.createElement("div");
    div.className = "msg msg--" + who;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }

  function addCta(label, message) {
    const wrap = document.createElement("div");
    wrap.className = "msg msg--cta";
    const a = document.createElement("a");
    a.className = "btn btn--wpp btn--sm";
    a.target = "_blank";
    a.rel = "noopener";
    a.href = (typeof whatsappLink === "function") ? whatsappLink(message) : "#";
    a.textContent = label + " ↗";
    wrap.appendChild(a);
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }

  function normalize(str) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function answer(question) {
    const q = normalize(question);
    if (typeof INTENTS !== "undefined") {
      for (const intent of INTENTS) {
        if (intent.keywords.some(k => q.includes(normalize(k)))) {
          addMsg(intent.reply, "bot");
          addCta(intent.cta, question);
          return;
        }
      }
    }
    if (typeof FALLBACK !== "undefined") {
      addMsg(FALLBACK.reply, "bot");
      addCta(FALLBACK.cta, question);
    }
  }

  suggestions?.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const q = btn.dataset.q;
      addMsg(q, "user");
      setTimeout(() => answer(q), 350);
    });
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    addMsg(val, "user");
    input.value = "";
    setTimeout(() => answer(val), 350);
  });
});
