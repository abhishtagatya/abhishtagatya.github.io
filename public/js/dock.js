(() => {
  // <stdin>
  (function() {
    "use strict";
    let lastScrollTop = 0;
    let isScrollingUp = false;
    let scrollThreshold = 100;
    let isDockVisible = false;
    const dock = document.getElementById("dock");
    const floatTrigger = document.getElementById("dock-float-trigger");
    if (!dock) return;
    const dockMode = dock.dataset.dockMode || "scroll";
    function handleScroll() {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScrollTop < lastScrollTop) {
        isScrollingUp = true;
      } else {
        isScrollingUp = false;
      }
      switch (dockMode) {
        case "scroll":
          if (isScrollingUp && currentScrollTop > scrollThreshold) {
            showDock();
          } else if (!isScrollingUp || currentScrollTop <= scrollThreshold) {
            hideDock();
          }
          break;
        case "always":
          showDock();
          break;
        case "float":
          if (isDockVisible && currentScrollTop > lastScrollTop) {
            hideDock();
          }
          break;
      }
      lastScrollTop = currentScrollTop;
    }
    function showDock() {
      dock.classList.remove("translate-y-24", "opacity-0", "pointer-events-none");
      dock.classList.add("translate-y-0", "opacity-100", "pointer-events-auto");
      isDockVisible = true;
    }
    function hideDock() {
      dock.classList.remove(
        "translate-y-0",
        "opacity-100",
        "pointer-events-auto"
      );
      dock.classList.add("translate-y-24", "opacity-0", "pointer-events-none");
      isDockVisible = false;
    }
    function toggleFloatDock() {
      if (isDockVisible) {
        hideDock();
      } else {
        showDock();
      }
    }
    function throttle(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }
    window.addEventListener("scroll", throttle(handleScroll, 16));
    if (floatTrigger && dockMode === "float") {
      let hoverTimer;
      floatTrigger.addEventListener("click", function(e) {
        e.preventDefault();
        toggleFloatDock();
      });
      floatTrigger.addEventListener("mouseenter", function() {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
          if (!isDockVisible) {
            showDock();
          }
        }, 150);
      });
      floatTrigger.addEventListener("mouseleave", function() {
        clearTimeout(hoverTimer);
        setTimeout(() => {
          if (isDockVisible && !dock.matches(":hover")) {
            hideDock();
          }
        }, 200);
      });
      dock.addEventListener("mouseenter", function() {
        clearTimeout(hoverTimer);
      });
      dock.addEventListener("mouseleave", function() {
        setTimeout(() => {
          if (isDockVisible && !floatTrigger.matches(":hover")) {
            hideDock();
          }
        }, 200);
      });
      document.addEventListener("click", function(e) {
        if (isDockVisible && !dock.contains(e.target) && !floatTrigger.contains(e.target)) {
          hideDock();
        }
      });
      dock.addEventListener("click", function(e) {
        e.stopPropagation();
      });
    }
    const backBtn = document.getElementById("dock-back");
    if (backBtn) {
      backBtn.addEventListener("click", function(e) {
        e.preventDefault();
        try {
          if (window.history.length > 1 && document.referrer) {
            const referrerUrl = new URL(document.referrer);
            const currentUrl = new URL(window.location.href);
            if (referrerUrl.origin === currentUrl.origin) {
              window.history.back();
              console.log("\u8FD4\u56DE\u6309\u94AE\u70B9\u51FB - \u6D4F\u89C8\u5668\u8FD4\u56DE");
              return;
            }
          }
          window.location.href = "/";
          console.log("\u8FD4\u56DE\u6309\u94AE\u70B9\u51FB - \u8DF3\u8F6C\u9996\u9875");
        } catch (error) {
          console.warn("\u8FD4\u56DE\u529F\u80FD\u51FA\u9519\uFF0C\u8DF3\u8F6C\u5230\u9996\u9875:", error);
          window.location.href = "/";
        }
      });
    }
    const tocBtn = document.getElementById("dock-toc");
    if (tocBtn) {
      tocBtn.addEventListener("click", function(e) {
        e.preventDefault();
        function tryToggleTOC(retries = 5) {
          if (window.TOC && window.TOC.initialized) {
            if (window.Search && window.Search.isVisible && window.Search.isVisible()) {
              window.Search.hide();
            }
            window.TOC.toggle();
          } else if (window.TOC && !window.TOC.initialized && retries > 0) {
            setTimeout(() => tryToggleTOC(retries - 1), 200);
          } else if (!window.TOC && retries > 0) {
            setTimeout(() => tryToggleTOC(retries - 1), 200);
          }
        }
        tryToggleTOC();
      });
    }
    const searchBtn = document.getElementById("dock-search");
    if (searchBtn) {
      searchBtn.addEventListener("click", function(e) {
        e.preventDefault();
        function tryToggleSearch(retries = 5) {
          if (window.Search) {
            if (window.TOC && window.TOC.initialized && window.TOC.isVisible && window.TOC.isVisible()) {
              window.TOC.hide();
            }
            if (window.Search.isVisible && window.Search.isVisible()) {
              window.Search.hide();
            } else {
              window.Search.show();
            }
          } else if (retries > 0) {
            setTimeout(() => tryToggleSearch(retries - 1), 200);
          }
        }
        tryToggleSearch();
      });
    }
    const commentsBtn = document.getElementById("dock-comments");
    if (commentsBtn) {
      commentsBtn.addEventListener("click", function(e) {
        e.preventDefault();
        try {
          const commentSelectors = [
            "#comments",
            // 通用评论区域 ID
            ".comments",
            // 通用评论区域类
            "#giscus-container",
            // Giscus 评论系统
            ".giscus",
            // Giscus 评论系统类
            "#disqus_thread",
            // Disqus 评论系统
            ".disqus",
            // Disqus 评论系统类
            "#utterances",
            // Utterances 评论系统
            ".utterances",
            // Utterances 评论系统类
            "#waline",
            // Waline 评论系统
            ".waline",
            // Waline 评论系统类
            "[data-comments]",
            // 带有 data-comments 属性的元素
            ".comment-section",
            // 评论区域类
            ".post-comments"
            // 文章评论类
          ];
          let commentElement = null;
          for (const selector of commentSelectors) {
            commentElement = document.querySelector(selector);
            if (commentElement) {
              console.log(`\u627E\u5230\u8BC4\u8BBA\u533A\u57DF: ${selector}`);
              break;
            }
          }
          if (commentElement) {
            commentElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest"
            });
            console.log("\u8BC4\u8BBA\u6309\u94AE\u70B9\u51FB - \u6EDA\u52A8\u5230\u8BC4\u8BBA\u533A\u57DF");
          } else {
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: "smooth"
            });
            console.log("\u8BC4\u8BBA\u6309\u94AE\u70B9\u51FB - \u672A\u627E\u5230\u8BC4\u8BBA\u533A\u57DF\uFF0C\u6EDA\u52A8\u5230\u9875\u9762\u5E95\u90E8");
          }
        } catch (error) {
          console.warn("\u6EDA\u52A8\u5230\u8BC4\u8BBA\u533A\u57DF\u5931\u8D25:", error);
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth"
          });
        }
      });
    }
    const topBtn = document.getElementById("dock-top");
    if (topBtn) {
      topBtn.addEventListener("click", function() {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
    }
    switch (dockMode) {
      case "always":
        showDock();
        break;
      case "float":
        hideDock();
        if (floatTrigger) {
          floatTrigger.style.opacity = "1";
        }
        break;
      case "scroll":
      default:
        hideDock();
        break;
    }
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      console.log(
        "Dock initialized successfully - positioned at perfect center bottom"
      );
    }
  })();
})();
