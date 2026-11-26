(() => {
  const root = document.documentElement;
  const motionToggle = document.getElementById("motion-toggle");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const syncMotionButton = () => {
    if (!motionToggle) return;
    if (reducedMotionQuery.matches) {
      motionToggle.hidden = true;
      return;
    }
    motionToggle.hidden = false;
    const paused = root.classList.contains("motion-paused");
    motionToggle.textContent = paused ? "Play motion" : "Pause motion";
  };

  if (motionToggle) {
    motionToggle.addEventListener("click", () => {
      root.classList.toggle("motion-paused");
      syncMotionButton();
    });
  }
  reducedMotionQuery.addEventListener("change", syncMotionButton);
  syncMotionButton();

  // 10-Second Brain Check
  const checkButtons = Array.from(document.querySelectorAll(".check-pill"));
  const scoreEl = document.getElementById("check-score");
  const fillEl = document.getElementById("check-meter-fill");
  const verdictEl = document.getElementById("check-verdict");
  const resetBtn = document.getElementById("check-reset");

  const verdicts = [
    "Tap any habit above to see your score.",
    "One solid habit. Try sketching your own answer first next time.",
    "Strong start. Your brain stayed in the loop for most of the work.",
    "Brain in the driver's seat. AI was the tool, not the pilot."
  ];

  const updateCheck = () => {
    const count = checkButtons.filter((btn) => btn.getAttribute("aria-pressed") === "true").length;
    if (scoreEl) scoreEl.textContent = `${count} / 3`;
    if (fillEl) fillEl.style.transform = `scaleX(${count / 3})`;
    if (verdictEl) verdictEl.textContent = verdicts[count];
    if (resetBtn) resetBtn.hidden = count === 0;
  };

  checkButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.getAttribute("aria-pressed") !== "true";
      btn.setAttribute("aria-pressed", String(next));
      updateCheck();
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      checkButtons.forEach((btn) => btn.setAttribute("aria-pressed", "false"));
      updateCheck();
    });
  }

  // Interactive Six Series spotlight
  const seriesData = {
    "brain-fact": {
      kicker: "Brain Fact · Sample angle",
      hook: "\"What happens inside your brain when AI writes your first draft?\"",
      note: "Study twists unpack surprising cognitive science findings and give you one simple swap to try today."
    },
    "checked": {
      kicker: "Checked. · Sample angle",
      hook: "\"Are you really a 'visual learner', or did a quiz just stick a label on you?\"",
      note: "Myth checks test popular work and study advice directly against the original research papers."
    },
    "test": {
      kicker: "60-Second Test · Sample angle",
      hook: "\"Five yes-or-no questions to tell if you use AI, or AI uses you.\"",
      note: "Timed self-checks help you catch autopilot habits before they turn into your default."
    },
    "prompt": {
      kicker: "Prompt It · Sample angle",
      hook: "\"Stop asking for the answer. Ask AI to quiz you before it helps.\"",
      note: "Real prompts shown right on screen so you keep ownership of the thinking."
    },
    "work": {
      kicker: "Work Brain · Sample angle",
      hook: "\"What your manager notices when every draft sounds the same.\"",
      note: "Practical workplace habits around problem framing, keeping your voice, and building judgment."
    },
    "long": {
      kicker: "Long Read · Sample angle",
      hook: "\"Calculators did not make us bad at thinking. Why is AI different?\"",
      note: "90-second explainers when an idea deserves historical context and nuance."
    }
  };

  const seriesButtons = Array.from(document.querySelectorAll(".series-card"));
  const spotlight = document.getElementById("series-spotlight");
  const kickerEl = document.getElementById("spotlight-kicker");
  const hookEl = document.getElementById("spotlight-hook");
  const noteEl = document.getElementById("spotlight-note");

  seriesButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.series;
      const entry = key ? seriesData[key] : null;
      if (!entry) return;

      seriesButtons.forEach((other) => {
        const active = other === btn;
        other.classList.toggle("is-active", active);
        other.setAttribute("aria-pressed", String(active));
      });

      if (spotlight && !reducedMotionQuery.matches && !root.classList.contains("motion-paused")) {
        spotlight.classList.add("is-swapping");
        window.setTimeout(() => {
          if (kickerEl) kickerEl.textContent = entry.kicker;
          if (hookEl) hookEl.textContent = entry.hook;
          if (noteEl) noteEl.textContent = entry.note;
          spotlight.classList.remove("is-swapping");
        }, 120);
      } else {
        if (kickerEl) kickerEl.textContent = entry.kicker;
        if (hookEl) hookEl.textContent = entry.hook;
        if (noteEl) noteEl.textContent = entry.note;
      }
    });
  });
})();
