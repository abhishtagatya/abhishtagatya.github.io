(() => {
  // <stdin>
  (function() {
    "use strict";
    let searchModal = null;
    let searchOverlay = null;
    let searchInput = null;
    let searchClear = null;
    let searchClose = null;
    let searchResults = null;
    let searchEmpty = null;
    let searchLoading = null;
    let searchNoResults = null;
    let searchResultsList = null;
    let searchStats = null;
    let searchItems = null;
    let isModalVisible = false;
    let searchData = null;
    let currentResults = [];
    let selectedIndex = -1;
    let searchTimeout = null;
    function init() {
      searchModal = document.getElementById("search-modal");
      searchOverlay = document.getElementById("search-overlay");
      searchInput = document.getElementById("search-input");
      searchClear = document.getElementById("search-clear");
      searchClose = document.getElementById("search-close");
      searchResults = document.getElementById("search-results");
      searchEmpty = document.getElementById("search-empty");
      searchLoading = document.getElementById("search-loading");
      searchNoResults = document.getElementById("search-no-results");
      searchResultsList = document.getElementById("search-results-list");
      searchStats = document.getElementById("search-stats");
      searchItems = document.getElementById("search-items");
      if (!searchModal) {
        return;
      }
      bindEvents();
      loadSearchData();
    }
    function bindEvents() {
      if (searchClose) {
        searchClose.addEventListener("click", hideSearch);
      }
      if (searchClear) {
        searchClear.addEventListener("click", clearSearch);
      }
      if (searchOverlay) {
        searchOverlay.addEventListener("click", hideSearch);
      }
      if (searchInput) {
        searchInput.addEventListener("input", handleInput);
        searchInput.addEventListener("keydown", handleKeydown);
      }
      document.addEventListener("keydown", handleGlobalKeydown);
      if (searchItems) {
        searchItems.addEventListener("click", handleResultClick);
      }
    }
    function handleGlobalKeydown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        showSearch();
        return;
      }
      if (e.key === "Escape" && isModalVisible) {
        hideSearch();
        return;
      }
    }
    function handleKeydown(e) {
      if (!isModalVisible) return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          navigateResults(1);
          break;
        case "ArrowUp":
          e.preventDefault();
          navigateResults(-1);
          break;
        case "Enter":
          e.preventDefault();
          selectResult();
          break;
        case "Escape":
          hideSearch();
          break;
      }
    }
    function handleInput(e) {
      const query = e.target.value.trim();
      toggleClearButton(query.length > 0);
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      resetNavigation();
      searchTimeout = setTimeout(() => {
        if (query.length === 0) {
          showEmptyState();
        } else {
          performSearch(query);
        }
      }, 300);
    }
    function handleResultClick(e) {
      const resultItem = e.target.closest("[data-url]");
      if (resultItem) {
        const url = resultItem.dataset.url;
        if (url) {
          window.location.href = url;
        }
      }
    }
    function showSearch() {
      if (!searchModal || isModalVisible) return;
      isModalVisible = true;
      searchOverlay.classList.remove("opacity-0", "pointer-events-none");
      searchOverlay.classList.add("opacity-100");
      searchModal.classList.remove(
        "opacity-0",
        "scale-95",
        "pointer-events-none"
      );
      searchModal.classList.add("opacity-100", "scale-100");
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
    function hideSearch() {
      if (!searchModal || !isModalVisible) return;
      isModalVisible = false;
      searchOverlay.classList.add("opacity-0", "pointer-events-none");
      searchOverlay.classList.remove("opacity-100");
      searchModal.classList.add("opacity-0", "scale-95", "pointer-events-none");
      searchModal.classList.remove("opacity-100", "scale-100");
      document.body.style.overflow = "";
      clearSearchContent();
      resetNavigation();
    }
    function clearSearchContent() {
      if (searchInput) {
        searchInput.value = "";
      }
      toggleClearButton(false);
      showEmptyState();
      currentResults = [];
      selectedIndex = -1;
    }
    function resetNavigation() {
      const prevSelected = searchItems && searchItems.querySelector(".search-result-selected");
      if (prevSelected) {
        prevSelected.classList.remove("search-result-selected");
      }
      selectedIndex = -1;
    }
    function clearSearch() {
      clearSearchContent();
      if (searchInput) {
        searchInput.focus();
      }
    }
    function toggleClearButton(show) {
      if (!searchClear) return;
      if (show) {
        searchClear.classList.remove("opacity-0", "pointer-events-none");
        searchClear.classList.add("opacity-100");
      } else {
        searchClear.classList.add("opacity-0", "pointer-events-none");
        searchClear.classList.remove("opacity-100");
      }
    }
    function showEmptyState() {
      hideAllStates();
      resetNavigation();
      if (searchEmpty) {
        searchEmpty.classList.remove("hidden");
      }
    }
    function showLoadingState() {
      hideAllStates();
      resetNavigation();
      if (searchLoading) {
        searchLoading.classList.remove("hidden");
      }
    }
    function showNoResultsState() {
      hideAllStates();
      resetNavigation();
      if (searchNoResults) {
        searchNoResults.classList.remove("hidden");
      }
    }
    function showResultsList() {
      hideAllStates();
      if (searchResultsList) {
        searchResultsList.classList.remove("hidden");
      }
    }
    function hideAllStates() {
      const states = [
        searchEmpty,
        searchLoading,
        searchNoResults,
        searchResultsList
      ];
      states.forEach((state) => {
        if (state) {
          state.classList.add("hidden");
        }
      });
    }
    async function loadSearchData() {
      if (searchData) return searchData;
      try {
        let indexURL = window.HUGO_SEARCH_CONFIG?.searchIndexURL || "/index.json";
        indexURL = indexURL.replace(/['"]/g, "").replace(/%22/g, "");
        const response = await fetch(indexURL);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        if (data && typeof data === "object") {
          const posts = data.posts || [];
          searchData = posts.map((post) => ({
            title: post.title,
            content: post.text,
            summary: post.text ? post.text.substring(0, 200) : "",
            url: post.link,
            date: "",
            categories: [],
            tags: []
          }));
        } else {
          searchData = [];
        }
        return searchData;
      } catch (error) {
        return [];
      }
    }
    async function performSearch(query) {
      showLoadingState();
      try {
        const data = await loadSearchData();
        const results = searchInData(data, query);
        currentResults = results;
        selectedIndex = -1;
        if (results.length === 0) {
          showNoResultsState();
        } else {
          displayResults(results, query);
          showResultsList();
        }
      } catch (error) {
        showNoResultsState();
      }
    }
    function parseKeywords(keywords) {
      return keywords.split(" ").filter((keyword) => {
        return !!keyword;
      }).map((keyword) => {
        return keyword.toLowerCase();
      });
    }
    function filter(keywords, obj, fields) {
      const keywordArray = parseKeywords(keywords);
      const containKeywords = keywordArray.filter((keyword) => {
        const containFields = fields.filter((field) => {
          if (!obj.hasOwnProperty(field) || !obj[field]) {
            return false;
          }
          const fieldValue = String(obj[field]).toLowerCase();
          if (fieldValue.indexOf(keyword) > -1) {
            return true;
          }
          return false;
        });
        if (containFields.length > 0) {
          return true;
        }
        return false;
      });
      return containKeywords.length === keywordArray.length;
    }
    function weight(keywords, obj, fields, weights) {
      let value = 0;
      parseKeywords(keywords).forEach((keyword) => {
        const pattern = new RegExp(escapeRegExp(keyword), "gim");
        fields.forEach((field, index) => {
          if (obj.hasOwnProperty(field) && obj[field]) {
            const fieldValue = String(obj[field]);
            const matches = fieldValue.match(pattern);
            value += matches ? matches.length * weights[index] : 0;
          }
        });
      });
      return value;
    }
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    function searchInData(data, query) {
      if (!query || query.trim() === "") {
        return [];
      }
      const keywords = parseKeywords(query);
      const results = [];
      data.forEach((item, index) => {
        let score = 0;
        let hasMatch = false;
        keywords.forEach((keyword) => {
          const keywordLower = keyword.toLowerCase();
          if (item.title && item.title.toLowerCase().includes(keywordLower)) {
            score += 10;
            hasMatch = true;
          }
          if (item.content && item.content.toLowerCase().includes(keywordLower)) {
            score += 1;
            hasMatch = true;
          }
          if (item.summary && item.summary.toLowerCase().includes(keywordLower)) {
            score += 5;
            hasMatch = true;
          }
        });
        if (hasMatch) {
          results.push({
            ...item,
            score,
            keywords
          });
        }
      });
      const sortedResults = results.sort((a, b) => b.score - a.score);
      return sortedResults;
    }
    function displayResults(results, query) {
      if (!searchStats || !searchItems) return;
      const statsTemplate = document.getElementById("search-stats");
      if (statsTemplate) {
        const template = statsTemplate.dataset.template;
        searchStats.textContent = template.replace("%d", results.length);
      } else {
        searchStats.textContent = `Found ${results.length} results`;
      }
      searchItems.innerHTML = "";
      results.forEach((result, index) => {
        const resultElement = createResultElement(result, query, index);
        searchItems.appendChild(resultElement);
      });
    }
    function generateStarRating(score) {
      if (!score || score <= 0) return "";
      let starCount;
      if (score >= 20) {
        starCount = 5;
      } else if (score >= 15) {
        starCount = 4;
      } else if (score >= 10) {
        starCount = 3;
      } else if (score >= 5) {
        starCount = 2;
      } else {
        starCount = 1;
      }
      return "\u2605".repeat(starCount);
    }
    function createResultElement(result, query, index) {
      const div = document.createElement("div");
      div.className = "search-result-item p-4 cursor-pointer rounded-lg transition-all duration-200 ease-out hover:bg-primary/10 hover:text-primary";
      div.dataset.url = result.url;
      div.dataset.index = index;
      const keywords = result.keywords || parseKeywords(query);
      const highlightedTitle = highlightText(result.title, keywords);
      const highlightedSummary = findAndHighlight(
        result.summary || result.content,
        keywords,
        120
      );
      const starRating = generateStarRating(result.score);
      div.innerHTML = `
      <div class="flex flex-col gap-2">
        <h3 class="text-base font-semibold text-foreground line-clamp-1">
          ${highlightedTitle}
        </h3>
        <p class="text-sm text-muted-foreground line-clamp-2">
          ${highlightedSummary}
        </p>
        <div class="flex items-center gap-2 text-xs text-muted-foreground">
          <span>${result.date}</span>
          ${result.categories && result.categories.length > 0 ? `<span>\u2022</span><span>${result.categories[0]}</span>` : ""}
          ${starRating ? `<span style="color: #f59e0b;">${starRating}</span>` : ""}
        </div>
      </div>
    `;
      return div;
    }
    function merge(ranges) {
      let last;
      const result = [];
      ranges.forEach((r) => {
        if (!last || r[0] > last[1]) {
          result.push(last = r);
        } else if (r[1] > last[1]) {
          last[1] = r[1];
        }
      });
      return result;
    }
    function findAndHighlight(text, matches, maxlen) {
      if (!Array.isArray(matches) || !matches.length || !text) {
        return maxlen ? text.slice(0, maxlen) : text;
      }
      const testText = text.toLowerCase();
      const indices = matches.map((match) => {
        const index = testText.indexOf(match.toLowerCase());
        if (!match || index === -1) {
          return null;
        }
        return [index, index + match.length];
      }).filter((match) => {
        return match !== null;
      }).sort((a, b) => {
        return a[0] - b[0] || a[1] - b[1];
      });
      if (!indices.length) {
        return text;
      }
      let result = "";
      let last = 0;
      const ranges = merge(indices);
      const sumRange = [ranges[0][0], ranges[ranges.length - 1][1]];
      if (maxlen && maxlen < sumRange[1]) {
        last = sumRange[0];
      }
      for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        result += text.slice(last, Math.min(range[0], sumRange[0] + maxlen));
        if (maxlen && range[0] >= sumRange[0] + maxlen) {
          break;
        }
        result += '<mark class="bg-primary/20 text-primary px-1 rounded font-medium">' + text.slice(range[0], range[1]) + "</mark>";
        last = range[1];
        if (i === ranges.length - 1) {
          if (maxlen) {
            result += text.slice(
              range[1],
              Math.min(text.length, sumRange[0] + maxlen + 1)
            );
          } else {
            result += text.slice(range[1]);
          }
        }
      }
      return result;
    }
    function highlightText(text, keywords) {
      if (!text || !keywords || !Array.isArray(keywords)) return text;
      return findAndHighlight(text, keywords);
    }
    function navigateResults(direction) {
      if (!currentResults || currentResults.length === 0) {
        return;
      }
      if (!searchItems) {
        return;
      }
      const prevSelected = searchItems.querySelector(".search-result-selected");
      if (prevSelected) {
        prevSelected.classList.remove("search-result-selected");
      }
      if (selectedIndex === -1) {
        selectedIndex = direction > 0 ? 0 : currentResults.length - 1;
      } else {
        selectedIndex += direction;
        if (selectedIndex < 0) {
          selectedIndex = currentResults.length - 1;
        } else if (selectedIndex >= currentResults.length) {
          selectedIndex = 0;
        }
      }
      const newSelected = searchItems.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      if (newSelected) {
        newSelected.classList.add("search-result-selected");
        newSelected.scrollIntoView({
          block: "nearest",
          behavior: "smooth"
        });
      }
    }
    function selectResult() {
      if (selectedIndex >= 0 && selectedIndex < currentResults.length) {
        const result = currentResults[selectedIndex];
        if (result.url) {
          window.location.href = result.url;
        }
      }
    }
    function toggleSearch() {
      if (isModalVisible) {
        hideSearch();
      } else {
        showSearch();
      }
    }
    window.Search = {
      show: showSearch,
      hide: hideSearch,
      toggle: toggleSearch,
      isVisible: () => isModalVisible
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  })();
})();
