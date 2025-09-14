(() => {
  // <stdin>
  var UIManager = class {
    constructor() {
      this.theme = localStorage.getItem("theme") || "system";
      this.colorScheme = localStorage.getItem("colorScheme") || document.documentElement.getAttribute("data-theme") || "default";
      this.init();
    }
    init() {
      this.setupEventListeners();
      this.updateUI();
    }
    // 通用下拉菜单处理函数 - 统一处理所有类型的菜单
    setupDropdown(type) {
      const toggleSelector = `.dropdown-toggle[data-dropdown-type="${type}"]`;
      const dropdownSelector = `.dropdown-menu[data-dropdown-type="${type}"]`;
      const toggles = document.querySelectorAll(toggleSelector);
      const dropdowns = document.querySelectorAll(dropdownSelector);
      toggles.forEach((toggle, index) => {
        const dropdown = dropdowns[index] || dropdowns[0];
        if (toggle && dropdown) {
          toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            this.closeOtherMenus(type);
            document.querySelectorAll(dropdownSelector).forEach((d) => {
              if (d !== dropdown) {
                d.classList.add("hidden");
                const correspondingToggle = document.querySelector(`${toggleSelector}[aria-labelledby="${d.getAttribute("aria-labelledby")}"], ${toggleSelector}[aria-controls="${d.id}"]`);
                if (correspondingToggle) {
                  correspondingToggle.setAttribute("aria-expanded", "false");
                }
              }
            });
            const isHidden = dropdown.classList.contains("hidden");
            dropdown.classList.toggle("hidden");
            toggle.setAttribute("aria-expanded", isHidden ? "true" : "false");
            if (type === "mobile-menu") {
              this.handleMobileMenuClick(dropdown, toggle);
            }
          });
        }
      });
    }
    // 关闭其他类型的菜单 - 统一处理所有菜单类型
    closeOtherMenus(currentType) {
      const allTypes = ["color-scheme", "theme", "language", "mobile-menu"];
      allTypes.forEach((type) => {
        if (type !== currentType) {
          document.querySelectorAll(`.dropdown-menu[data-dropdown-type="${type}"]`).forEach((d) => {
            d.classList.add("hidden");
            const toggle = document.querySelector(`.dropdown-toggle[data-dropdown-type="${type}"]`);
            if (toggle) {
              toggle.setAttribute("aria-expanded", "false");
            }
          });
        }
      });
    }
    // 关闭所有下拉菜单
    closeAllDropdowns() {
      document.querySelectorAll(".dropdown-menu").forEach((d) => {
        d.classList.add("hidden");
        const dropdownType = d.getAttribute("data-dropdown-type");
        if (dropdownType) {
          const toggle = document.querySelector(`.dropdown-toggle[data-dropdown-type="${dropdownType}"]`);
          if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
          }
        }
      });
    }
    // 关闭移动端菜单 - 保持向后兼容
    closeMobileMenu() {
      const mobileMenu = document.getElementById("mobile-menu");
      const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
      if (mobileMenu) {
        mobileMenu.classList.add("hidden");
      }
      if (mobileMenuToggle) {
        mobileMenuToggle.setAttribute("aria-expanded", "false");
      }
    }
    // 关闭所有菜单（包括下拉菜单和移动端菜单）
    closeAllMenus() {
      this.closeAllDropdowns();
    }
    // 移动端菜单特殊处理 - 点击菜单项后自动关闭
    handleMobileMenuClick(dropdown, toggle) {
      dropdown.addEventListener("click", (e) => {
        const link = e.target.closest("a[href]");
        if (link) {
          setTimeout(() => {
            dropdown.classList.add("hidden");
            toggle.setAttribute("aria-expanded", "false");
          }, 100);
        }
      });
    }
    // 设置移动端菜单 - 保持向后兼容，但现在使用统一的 setupDropdown
    setupMobileMenu() {
      console.log("\u79FB\u52A8\u7AEF\u83DC\u5355\u4F7F\u7528\u7EDF\u4E00\u7684\u4E0B\u62C9\u83DC\u5355\u5904\u7406\u903B\u8F91");
    }
    setupEventListeners() {
      this.setupDropdown("mobile-menu");
      this.setupDropdown("color-scheme");
      this.setupDropdown("theme");
      this.setupDropdown("language");
      const colorSchemeDropdowns = document.querySelectorAll(
        '.dropdown-menu[data-dropdown-type="color-scheme"]'
      );
      colorSchemeDropdowns.forEach((dropdown) => {
        if (dropdown) {
          dropdown.addEventListener("click", (e) => {
            const button = e.target.closest("[data-color-scheme]");
            if (button) {
              const newColorScheme = button.getAttribute("data-color-scheme");
              this.setColorScheme(newColorScheme);
              this.closeAllMenus();
            }
          });
        }
      });
      const themeDropdowns = document.querySelectorAll(
        '.dropdown-menu[data-dropdown-type="theme"]'
      );
      themeDropdowns.forEach((dropdown) => {
        if (dropdown) {
          dropdown.addEventListener("click", (e) => {
            const button = e.target.closest("[data-theme]");
            if (button) {
              const newTheme = button.getAttribute("data-theme");
              this.setTheme(newTheme);
              this.closeAllMenus();
            }
          });
        }
      });
      document.addEventListener("click", (e) => {
        const isClickInsideMenu = e.target.closest(".dropdown-toggle, .dropdown-menu");
        if (!isClickInsideMenu) {
          this.closeAllMenus();
        }
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.closeAllMenus();
        }
      });
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        if (this.theme === "system") {
          this.applyTheme();
          this.updateUI();
        }
      });
    }
    setColorScheme(colorScheme) {
      this.colorScheme = colorScheme;
      localStorage.setItem("colorScheme", colorScheme);
      document.documentElement.setAttribute("data-theme", colorScheme);
      this.updateUI();
      window.dispatchEvent(
        new CustomEvent("themeChanged", {
          detail: { colorScheme, theme: this.theme }
        })
      );
    }
    setTheme(theme) {
      this.theme = theme;
      localStorage.setItem("theme", theme);
      this.applyTheme();
      this.updateUI();
      window.dispatchEvent(
        new CustomEvent("themeChanged", {
          detail: { colorScheme: this.colorScheme, theme }
        })
      );
    }
    applyTheme() {
      if (this.theme === "dark" || this.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    updateUI() {
      const sunIcons = document.querySelectorAll(".sun-icon, #sun-icon");
      const moonIcons = document.querySelectorAll(".moon-icon, #moon-icon");
      const systemIcons = document.querySelectorAll(".system-icon, #system-icon");
      [...sunIcons, ...moonIcons, ...systemIcons].forEach((icon) => {
        if (icon) icon.classList.add("hidden");
      });
      if (this.theme === "light") {
        sunIcons.forEach((icon) => icon.classList.remove("hidden"));
      } else if (this.theme === "dark") {
        moonIcons.forEach((icon) => icon.classList.remove("hidden"));
      } else if (this.theme === "system") {
        systemIcons.forEach((icon) => icon.classList.remove("hidden"));
      }
      this.updateDropdownSelection();
    }
    updateDropdownSelection() {
      document.querySelectorAll("[data-color-scheme]").forEach((button) => {
        const isSelected = button.getAttribute("data-color-scheme") === this.colorScheme;
        button.classList.toggle("bg-accent", isSelected);
        button.classList.toggle("text-accent-foreground", isSelected);
      });
      document.querySelectorAll("[data-theme]").forEach((button) => {
        const isSelected = button.getAttribute("data-theme") === this.theme;
        button.classList.toggle("bg-accent", isSelected);
        button.classList.toggle("text-accent-foreground", isSelected);
      });
      const currentLang = document.documentElement.lang || "en";
      document.querySelectorAll('.dropdown-menu[data-dropdown-type="language"] a[role="menuitem"]').forEach((link) => {
        const href = link.getAttribute("href");
        const isSelected = this.isCurrentLanguageLink(href, currentLang);
        link.classList.toggle("bg-accent", isSelected);
        link.classList.toggle("text-accent-foreground", isSelected);
      });
    }
    // 辅助方法：判断链接是否为当前语言
    isCurrentLanguageLink(href, currentLang) {
      if (href === "/" && currentLang === "en") {
        return true;
      }
      const langPattern = new RegExp(`^/${currentLang}(/|$)`);
      return langPattern.test(href);
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    new UIManager();
  });
  console.log("Hugo site with advanced UI management loaded.");
})();
