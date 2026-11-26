(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const labFrame = document.getElementById("lab-frame");
  const modeRadios = Array.from(document.querySelectorAll('input[name="brain-mode"]'));
  const captionLine = document.getElementById("caption-line");
  const outcomeEl = document.getElementById("lab-outcome");
  const replayBtn = document.getElementById("replay-btn");

  const modes = {
    "autopilot": {
      words: [
        { text: "Open", gold: false },
        { text: "chat", gold: false },
        { text: "first,", gold: false },
        { text: "forget", gold: true },
        { text: "by", gold: false },
        { text: "lunch.", gold: false }
      ],
      outcome: "Fast now. Thirty minutes later, you barely remember what it argued."
    },
    "think-first": {
      words: [
        { text: "Three", gold: false },
        { text: "bullets", gold: false },
        { text: "first,", gold: false },
        { text: "then", gold: false },
        { text: "challenge", gold: true },
        { text: "AI.", gold: false }
      ],
      outcome: "Two minutes of your own friction keeps your brain in the driver's seat."
    }
  };

  let timers = [];
  const clearTimers = () => {
    timers.forEach((id) => window.clearTimeout(id));
    timers = [];
  };

  const renderCaptions = (modeKey) => {
    const data = modes[modeKey];
    if (!data || !captionLine) return;
    clearTimers();
    captionLine.textContent = "";

    data.words.forEach((word, index) => {
      const span = document.createElement("span");
      span.className = word.gold ? "cap-word is-gold" : "cap-word";
      span.textContent = word.text;
      if (!reducedMotion.matches) {
        span.style.opacity = "0";
        const id = window.setTimeout(() => {
          span.style.opacity = "1";
          span.classList.add("is-entering");
        }, index * 95);
        timers.push(id);
      }
      captionLine.appendChild(span);
    });

    if (outcomeEl) {
      outcomeEl.textContent = data.outcome;
    }
  };

  const applyMode = (modeKey) => {
    if (!labFrame) return;
    const update = () => {
      labFrame.setAttribute("data-mode", modeKey);
      renderCaptions(modeKey);
    };
    if (!document.startViewTransition || reducedMotion.matches) {
      update();
      return;
    }
    document.startViewTransition(update);
  };

  modeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked) {
        applyMode(radio.value);
      }
    });
  });

  if (replayBtn) {
    replayBtn.addEventListener("click", () => {
      const current = labFrame ? labFrame.getAttribute("data-mode") || "autopilot" : "autopilot";
      renderCaptions(current);
    });
  }

  // Flip / Stamp Index Cards
  const cards = Array.from(document.querySelectorAll(".index-card"));
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const expanded = card.getAttribute("aria-expanded") === "true";
      const next = !expanded;
      card.setAttribute("aria-expanded", String(next));
      const cue = card.querySelector(".card-cue");
      if (cue) {
        cue.textContent = next ? "Tap to close" : "Tap to flip";
      }
    });
  });

  // Initial caption run
  renderCaptions("autopilot");
})();
