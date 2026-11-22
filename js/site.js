(() => {
  const progress = document.querySelector("[data-progress]");
  const header = document.querySelector("[data-header]");
  const folio = document.querySelector("[data-folio]");
  const indexEl = folio?.querySelector("[data-folio-index]");
  const labelEl = folio?.querySelector("[data-folio-label]");
  const sections = Array.from(document.querySelectorAll("[data-section]"));

  let frame = 0;

  const update = () => {
    frame = 0;
    const root = document.documentElement;
    const max = root.scrollHeight - root.clientHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, root.scrollTop / max)) : 0;

    if (progress) progress.style.transform = `scaleX(${ratio})`;
    if (header) header.classList.toggle("is-scrolled", root.scrollTop > 4);
    if (folio) folio.classList.toggle("is-on", root.scrollTop > 160);
    if (!folio || sections.length === 0) return;

    const mark = window.innerHeight * 0.33;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= mark) current = section;
    }
    if (root.scrollTop + root.clientHeight >= root.scrollHeight - 2) {
      current = sections[sections.length - 1];
    }

    const nextIndex = current.dataset.index || "";
    const nextLabel = current.dataset.section || "";
    if (indexEl && indexEl.textContent !== nextIndex) indexEl.textContent = nextIndex;
    if (labelEl && labelEl.textContent !== nextLabel) labelEl.textContent = nextLabel;
  };

  const onScroll = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
})();
