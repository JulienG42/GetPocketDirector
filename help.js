(() => {
  const searchInput = document.querySelector("[data-faq-search]");
  const status = document.querySelector("[data-search-status]");
  const noResults = document.querySelector("[data-no-results]");
  const categories = Array.from(document.querySelectorAll("[data-faq-category]"));
  const items = Array.from(document.querySelectorAll("[data-faq-item]"));

  if (!searchInput || !status || !noResults || items.length === 0) {
    return;
  }

  const normalize = (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase(document.documentElement.lang);

  const questionLabel = status.dataset.questionLabel || "question";
  const questionsLabel = status.dataset.questionsLabel || "questions";
  const resultLabel = status.dataset.resultLabel || "result";
  const resultsLabel = status.dataset.resultsLabel || "results";

  const updateStatus = (count, hasQuery) => {
    const label = hasQuery
      ? count === 1
        ? resultLabel
        : resultsLabel
      : count === 1
        ? questionLabel
        : questionsLabel;

    status.textContent = `${count} ${label}`;
  };

  const filterFaq = () => {
    const query = normalize(searchInput.value.trim());
    let visibleCount = 0;

    items.forEach((item) => {
      const matches = query === "" || normalize(item.textContent).includes(query);
      item.hidden = !matches;
      visibleCount += matches ? 1 : 0;
    });

    categories.forEach((category) => {
      const hasVisibleItem = Array.from(
        category.querySelectorAll("[data-faq-item]")
      ).some((item) => !item.hidden);
      category.hidden = !hasVisibleItem;
    });

    noResults.hidden = visibleCount !== 0;
    updateStatus(visibleCount, query !== "");
  };

  searchInput.addEventListener("input", filterFaq);
  searchInput.addEventListener("search", filterFaq);
  filterFaq();
})();
