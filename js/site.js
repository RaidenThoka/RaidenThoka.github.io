(() => {
  const progress = document.querySelector("[data-progress]");
  const header = document.querySelector("[data-header]");
  const scroller = document.querySelector("[data-scroller]");
  const folio = document.querySelector("[data-folio]");
  const indexEl = folio?.querySelector("[data-folio-index]");
  const labelEl = folio?.querySelector("[data-folio-label]");
  const sections = Array.from(document.querySelectorAll("[data-section]"));

  if (!scroller) return;

  let frame = 0;

  const update = () => {
    frame = 0;
    const max = scroller.scrollHeight - scroller.clientHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, scroller.scrollTop / max)) : 0;

    if (progress) progress.style.transform = `scaleX(${ratio})`;
    if (header) header.classList.toggle("is-scrolled", scroller.scrollTop > 4);
    if (folio) folio.classList.toggle("is-on", scroller.scrollTop > 160);
    if (!folio || sections.length === 0) return;

    const scrollerBox = scroller.getBoundingClientRect();
    const mark = scrollerBox.top + scroller.clientHeight * 0.33;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= mark) current = section;
    }
    if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2) {
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
  scroller.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  header?.addEventListener("wheel", (event) => {
    scroller.scrollTop += event.deltaY;
  }, { passive: true });

  document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const active = document.activeElement;
    if (active && (active.isContentEditable || active.tagName === "INPUT" || active.tagName === "TEXTAREA")) return;
    if (event.key === " " && active && (active.tagName === "A" || active.tagName === "BUTTON")) return;
    if (active && scroller.contains(active)) return;

    const page = scroller.clientHeight * 0.9;
    const distance = {
      ArrowDown: 48,
      ArrowUp: -48,
      PageDown: page,
      PageUp: -page,
      " ": event.shiftKey ? -page : page,
      Home: -scroller.scrollHeight,
      End: scroller.scrollHeight,
    }[event.key];
    if (distance === undefined) return;
    event.preventDefault();
    scroller.scrollBy({ top: distance, behavior: "auto" });
  });
})();
