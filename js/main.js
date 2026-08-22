(function () {
  "use strict";

  window.dataLayer = window.dataLayer || [];

  /* Ano no rodapé */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Rastreamento de conversão (WhatsApp / telefone) ----------
     Cada clique em link de WhatsApp ou telefone dispara um evento pro
     dataLayer, que o GTM usa pra alimentar a conversão no Google Ads.
     Sem isso o Ads não sabe distinguir clique de lead de verdade. */
  document.querySelectorAll('[data-track="whatsapp_click"]').forEach(function (el) {
    el.addEventListener("click", function () {
      window.dataLayer.push({
        event: "whatsapp_click",
        link_url: el.href,
        link_location: el.closest("section, header, footer, div.sticky-cta")
          ? (el.closest("[id]") ? el.closest("[id]").id : "page")
          : "page",
      });
    });
  });
  document.querySelectorAll('[data-track="phone_click"]').forEach(function (el) {
    el.addEventListener("click", function () {
      window.dataLayer.push({
        event: "phone_click",
        link_url: el.href,
      });
    });
  });

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
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (diagLed && diagWord && !reducedMotion) {
    var isOk = false;
    setInterval(function () {
      isOk = !isOk;
      diagLed.classList.toggle("is-ok", isOk);
      diagWord.classList.toggle("is-ok", isOk);
      diagWord.textContent = isOk ? "RESOLVIDO" : "FALHA";
    }, 3200);
  }

  /* ---------- Contador animado da faixa de estatísticas ---------- */
  var statEls = document.querySelectorAll(".stat__num[data-count]");
  if (statEls.length) {
    var animateCount = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      if (reducedMotion) {
        el.textContent = target + suffix;
        return;
      }
      var duration = 1400;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
        }
      }
      requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      var statIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              statIo.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      statEls.forEach(function (el) {
        statIo.observe(el);
      });
    } else {
      statEls.forEach(animateCount);
    }
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
      gatilhos: ["bairro", "endereço", "endereco", "atende aqui", "regi", "cidade"],
      resposta:
        "Atendemos Recife, Olinda, Paulista, Jaboatão dos Guararapes, Camaragibe e São Lourenço da Mata. Em Recife, prioridade para Boa Viagem, Pina, Imbiribeira, Espinheiro e Casa Forte. Me diz sua cidade ou bairro que eu confirmo, ou pergunte direto no WhatsApp.",
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
      resposta: "Sim! Todo serviço sai com 90 dias de garantia por escrito, cobrindo peça e mão de obra.",
    },
    {
      gatilhos: ["mesmo dia", "hoje", "urgente", "rápido", "rapido"],
      resposta:
        "Na maioria dos casos conseguimos atender no mesmo dia, dependendo da agenda e da região. Bairros perto da orla costumam ter prioridade.",
    },
    {
      gatilhos: ["quanto tempo", "experi", "confia", "quem", "quantos"],
      resposta: "Já são mais de 3 mil serviços realizados em 5+ anos de mercado — trazendo esse padrão pra Recife agora.",
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
    var link = document.createElement("a");
    link.className = "btn btn--wpp btn--sm";
    link.target = "_blank";
    link.rel = "noopener";
    link.href = whatsappLink;
    link.setAttribute("data-track", "whatsapp_click");
    link.textContent = "Abrir WhatsApp";
    link.addEventListener("click", function () {
      window.dataLayer.push({ event: "whatsapp_click", link_url: whatsappLink, link_location: "assistant" });
    });
    div.textContent = "Para fechar o atendimento, fale com nosso time: ";
    div.appendChild(link);
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