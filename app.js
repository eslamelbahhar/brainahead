(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const withTransition = (updateFn) => {
    if (!document.startViewTransition || reducedMotion.matches) {
      updateFn();
      return;
    }
    document.startViewTransition(() => updateFn());
  };

  // Subtle pointer-reactive spotlight on interactive surfaces
  document.querySelectorAll("[data-spotlight]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      if (reducedMotion.matches) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  });

  // Hero interactive Thinking Loop stage
  const beats = [
    {
      tag: "Beat 01 · Autopilot",
      step: "1 / 3",
      headlineHTML: 'Open chat first, paste the task, take the <span class="gold-word">first</span> draft.',
      detail: "Feels fast in the moment. Thirty minutes later, you barely remember what it argued or why."
    },
    {
      tag: "Beat 02 · Think First",
      step: "2 / 3",
      headlineHTML: 'Write three rough bullets yourself, then make AI <span class="gold-word">challenge</span> them.',
      detail: "Two minutes of your own friction turns AI from a crutch into a sharp sparring partner."
    },
    {
      tag: "Beat 03 · Keep Braining",
      step: "3 / 3",
      headlineHTML: 'Keep your <span class="gold-word">voice</span>, check the claim, stay in the driver’s seat.',
      detail: "The tools get faster every month. Your judgment is still the part that compounds."
    }
  ];

  let activeBeat = 0;
  const stageTag = document.getElementById("stage-tag");
  const stageStep = document.getElementById("stage-step");
  const stageHeadline = document.getElementById("stage-headline");
  const stageDetail = document.getElementById("stage-detail");
  const stageTabs = Array.from(document.querySelectorAll(".stage-tab"));
  const stageNext = document.getElementById("stage-next");

  const renderBeat = (index) => {
    const item = beats[index];
    if (!item) return;
    activeBeat = index;

    withTransition(() => {
      if (stageTag) stageTag.textContent = item.tag;
      if (stageStep) stageStep.textContent = item.step;
      if (stageHeadline) stageHeadline.innerHTML = item.headlineHTML;
      if (stageDetail) stageDetail.textContent = item.detail;

      stageTabs.forEach((tab, i) => {
        const selected = i === index;
        tab.classList.toggle("is-active", selected);
        tab.setAttribute("aria-selected", String(selected));
      });
    });
  };

  stageTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const idx = Number(tab.dataset.beat);
      if (!Number.isNaN(idx) && idx !== activeBeat) renderBeat(idx);
    });
  });

  if (stageNext) {
    stageNext.addEventListener("click", () => {
      renderBeat((activeBeat + 1) % beats.length);
    });
  }

  // Interactive Six Formats explorer
  const seriesData = {
    "brain-fact": {
      kind: "Study twists",
      hook: "\"What happens inside your brain when AI writes your first draft?\"",
      desc: "Breaks down what cognitive science actually measured and gives you one simple habit swap to try today."
    },
    "checked": {
      kind: "Myth checks",
      hook: "\"Are you really a 'visual learner', or did a quiz just stick a label on you?\"",
      desc: "Tests popular productivity and study advice directly against the original research papers."
    },
    "test": {
      kind: "Self-tests",
      hook: "\"Five yes-or-no questions to tell if you use AI, or AI uses you.\"",
      desc: "Quick timed self-checks that catch autopilot habits before they turn into your default."
    },
    "prompt": {
      kind: "AI how-tos",
      hook: "\"Stop asking for the answer. Ask AI to quiz you before it helps.\"",
      desc: "Practical prompts shown word for word on screen so you keep ownership of the thinking."
    },
    "work": {
      kind: "At work",
      hook: "\"What your manager notices when every draft sounds the same.\"",
      desc: "Workplace habits around problem framing, keeping your voice, and building judgment."
    },
    "long": {
      kind: "Deep dives",
      hook: "\"Calculators did not make us bad at thinking. Why is AI different?\"",
      desc: "90-second explainers when an idea deserves historical context and nuance."
    }
  };

  const seriesPills = Array.from(document.querySelectorAll(".series-pill"));
  const seriesKind = document.getElementById("series-kind");
  const seriesHook = document.getElementById("series-hook");
  const seriesDesc = document.getElementById("series-desc");

  seriesPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const key = pill.dataset.series;
      const entry = key ? seriesData[key] : null;
      if (!entry || pill.classList.contains("is-active")) return;

      withTransition(() => {
        seriesPills.forEach((other) => {
          const selected = other === pill;
          other.classList.toggle("is-active", selected);
          other.setAttribute("aria-selected", String(selected));
        });
        if (seriesKind) seriesKind.textContent = entry.kind;
        if (seriesHook) seriesHook.textContent = entry.hook;
        if (seriesDesc) seriesDesc.textContent = entry.desc;
      });
    });
  });
})();
