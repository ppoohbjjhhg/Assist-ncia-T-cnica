(function () {
  "use strict";

  /* Ano no rodapé */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Painel de diagnóstico: alterna FALHA / OK ---------- */
  var diagLed = document.getElementById("diagLed");
  var diagWord = document.getElementById("diagWord");
  if (diagLed && diagWord && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var isOk = false;
    setInterval(function () {
      isOk = !isOk;
      diagLed.classList.toggle("is-ok", isOk);
      diagWord.classList.toggle("is-ok", isOk);
      diagWord.textContent = isOk ? "RESOLVIDO" : "FALHA";
    }, 3200);
  }

  /* ---------- Accordion FAQ ---------- */
  var accItems = document.querySelectorAll(".acc-item");
  accItems.forEach(function (item) {
    var head = item.querySelector(".acc-item__head");
    var body = item.querySelector(".acc-item__body");
    if (!head || !body) return;
    head.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      accItems.forEach(function (other) {
        other.classList.remove("is-open");
        other.querySelector(".acc-item__head").setAttribute("aria-expanded", "false");
        other.querySelector(".acc-item__body").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("is-open");
        head.setAttribute("aria-expanded", "true");
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });

  /* ---------- Filtro de bairros ---------- */
  var bairroInput = document.getElementById("bairroFiltro");
  var bairroLista = document.getElementById("bairroLista");
  var bairroVazio = document.getElementById("bairroVazio");
  if (bairroInput && bairroLista) {
    var itens = Array.prototype.slice.call(bairroLista.querySelectorAll("li"));
    bairroInput.addEventListener("input", function () {
      var termo = bairroInput.value.trim().toLowerCase();
      var visiveis = 0;
      itens.forEach(function (li) {
        var bate = li.textContent.toLowerCase().indexOf(termo) !== -1;
        li.hidden = !bate;
        if (bate) visiveis++;
      });
      if (bairroVazio) bairroVazio.hidden = visiveis > 0;
    });
  }

  /* ---------- CTA fixa: esconde ao rolar pra baixo, mostra ao subir ---------- */
  var stickyCta = document.getElementById("stickyCta");
  if (stickyCta) {
    var lastY = window.scrollY;
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        var scrollingDown = y > lastY && y > 120;
        stickyCta.classList.toggle("is-hidden", scrollingDown);
        lastY = y;
        ticking = false;
      });
    });
  }

  /* ---------- Assistente de dúvidas ---------- */
  var assistant = document.getElementById("assistant");
  var fab = document.getElementById("assistantFab");
  var panel = document.getElementById("assistantPanel");
  var closeBtn = document.getElementById("assistantClose");
  var body = document.getElementById("assistantBody");
  var form = document.getElementById("assistantForm");
  var input = document.getElementById("assistantInput");
  var suggestions = document.getElementById("assistantSuggestions");
  var whatsappLink =
    "https://wa.me/5581991546997?text=Ol%C3%A1!%20Meu%20eletrodom%C3%A9stico%20apresentou%20um%20problema%20e%20preciso%20falar%20com%20um%20t%C3%A9cnico.";

  var respostas = [
    {
      gatilhos: ["bairro", "endereço", "endereco", "atende aqui", "regi"],
      resposta:
        "Atendemos diversos bairros de Caruaru, com prioridade para Petrópolis, Cidade Jardim e Universitário. Me diz o nome do seu bairro que eu confirmo, ou pergunte direto no WhatsApp.",
    },
    {
      gatilhos: ["marca", "brastemp", "consul", "electrolux", "lg", "samsung", "panasonic"],
      resposta: "Atendemos as principais marcas do mercado: Brastemp, Electrolux, Consul, LG, Samsung e Panasonic.",
    },
    {
      gatilhos: ["ar condicionado", "ar-condicionado", "ar cond"],
      resposta:
        "No momento nosso foco é geladeira, freezer, frigobar, máquina de lavar, lava e seca, lava-louças e micro-ondas. Para ar-condicionado, confirme direto no WhatsApp.",
    },
    {
      gatilhos: ["orçamento", "orcamento", "preço", "preco", "valor", "quanto custa"],
      resposta:
        "O valor depende do defeito identificado. O técnico faz o diagnóstico e passa um orçamento transparente antes de qualquer serviço.",
    },
    {
      gatilhos: ["garantia"],
      resposta: "Sim! Todo serviço sai com garantia por escrito, cobrindo peça e mão de obra.",
    },
    {
      gatilhos: ["mesmo dia", "hoje", "urgente", "rápido", "rapido"],
      resposta:
        "Na maioria dos casos conseguimos atender no mesmo dia, dependendo da agenda e da região. Bairros perto da nossa base no Petrópolis costumam ter prioridade.",
    },
  ];

  function addMsg(texto, autor) {
    if (!body) return;
    var div = document.createElement("div");
    div.className = "msg " + (autor === "user" ? "msg--user" : "msg--bot");
    div.textContent = texto;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function addCtaMsg() {
    if (!body) return;
    var div = document.createElement("div");
    div.className = "msg msg--bot msg--cta";
    div.innerHTML =
      'Para fechar o atendimento, fale com nosso time: <a class="btn btn--wpp btn--sm" target="_blank" rel="noopener" href="' +
      whatsappLink +
      '">Abrir WhatsApp</a>';
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function responder(pergunta) {
    var termo = pergunta.toLowerCase();
    var encontrada = respostas.find(function (r) {
      return r.gatilhos.some(function (g) {
        return termo.indexOf(g) !== -1;
      });
    });
    addMsg(
      encontrada
        ? encontrada.resposta
        : "Não tenho certeza sobre isso, mas o time humano confirma rapidinho no WhatsApp.",
      "bot"
    );
    addCtaMsg();
  }

  if (fab && panel) {
    fab.addEventListener("click", function () {
      var isHidden = panel.hidden;
      panel.hidden = !isHidden;
      fab.setAttribute("aria-expanded", isHidden ? "true" : "false");
      if (isHidden && input) input.focus();
    });
  }
  if (closeBtn && panel && fab) {
    closeBtn.addEventListener("click", function () {
      panel.hidden = true;
      fab.setAttribute("aria-expanded", "false");
    });
  }
  if (suggestions) {
    suggestions.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-q]");
      if (!btn) return;
      var pergunta = btn.getAttribute("data-q");
      addMsg(pergunta, "user");
      responder(pergunta);
    });
  }
  if (form && input) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valor = input.value.trim();
      if (!valor) return;
      addMsg(valor, "user");
      responder(valor);
      input.value = "";
    });
  }
})();