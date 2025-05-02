export const globalObserver = () => {
  const targetOnce = document.querySelectorAll("[data-trigger-once]");
  const targetEach = document.querySelectorAll("[data-trigger-each]");
  const targets = [...targetOnce, ...targetEach];

  if (!targets.length) return;

  const callback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      const hasTriggerEach = "triggerEach" in (entry.target as HTMLElement).dataset;

      if (entry.isIntersecting) {
        entry.target.classList.add("is-view");
      } else if (hasTriggerEach) {
        entry.target.classList.remove("is-view");
      }
    });
  };

  const observer = new IntersectionObserver(callback);

  targets.forEach((target) => {
    observer.observe(target);
  });
};
