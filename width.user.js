// ==UserScript==
// @name         width honey-manga.com.ua
// @namespace    http://tampermonkey.net/
// @version      2025-12-23
// @description  expand width on honey-manga.com.ua reading pages
// @author       You
// @match        https://honey-manga.com.ua/read/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=honey-manga.com.ua
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const CONTAINER_SELECTOR = ".md\\:container ";
  const CONTENT_TEXT_SELECTOR = CONTAINER_SELECTOR + " .max-w-4xl";
  const TARGET_PANEL_SELECTOR =
    "[class*='MuiPaper-elevation'] > div:last-child";
  const STORAGE_KEY = "custom-manga-width";

  const updateWidth = (value) => {
    const container = document.querySelector(CONTAINER_SELECTOR);
    const label = document.getElementById("manga-width-value");

    if (container) {
      container.style.setProperty("max-width", `${value}%`, "important");
      container.style.setProperty("width", `${value}%`, "important");
      container.classList.remove("max-w-4xl");
    }

    if (label) {
      label.textContent = `${value}%`;
    }

    localStorage.setItem(STORAGE_KEY, value);
  };

  const injectController = () => {
    const target = document.querySelector(TARGET_PANEL_SELECTOR);

    if (target && !document.getElementById("manga-width-ctrl-wrapper")) {
      const savedWidth = localStorage.getItem(STORAGE_KEY) || "100";

      const wrapper = document.createElement("div");
      wrapper.id = "manga-width-ctrl-wrapper";
      wrapper.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 15px;
        color: white;
        min-width: 200px;
        flex-grow: 1;
      `;

      wrapper.innerHTML = `
        <span style="font-size: 13px; white-space: nowrap; opacity: 0.9;">Ширина:</span>
        <input type="range" id="manga-width-slider" value="${savedWidth}" min="10" max="100" 
               style="flex-grow: 1; cursor: pointer; accent-color: #ff4d00;">
        <span id="manga-width-value" style="font-size: 14px; font-weight: bold; min-width: 45px; text-align: right;">${savedWidth}%</span>
      `;

      target.appendChild(wrapper);

      const slider = wrapper.querySelector("#manga-width-slider");

      slider.addEventListener("input", (e) => updateWidth(e.target.value));

      updateWidth(savedWidth);
    }
  };

  const observer = new MutationObserver(() => {
    injectController();

    const currentVal = localStorage.getItem(STORAGE_KEY) || "100";
    const container = document.querySelector(CONTAINER_SELECTOR);
    const contentText = document.querySelectorAll(CONTENT_TEXT_SELECTOR);

    if (container && container.style.maxWidth !== `${currentVal}%`) {
      updateWidth(currentVal);
    }

    if (contentText) {
      contentText.forEach((el) => el.classList.remove("max-w-4xl"));
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  injectController();
})();
