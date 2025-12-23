// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-12-22
// @description  try to take over the world!
// @author       You
// @match        https://honey-manga.com.ua/book/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=honey-manga.com.ua
// @grant        none
// ==/UserScript==

(async function () {
  "use strict";

  const nameClass = ".MuiTabPanel-root > .mt-12>div:nth-child(3) ";

  let container = window.document.querySelector(nameClass);

  if (!container) {
    await new Promise((r) => setTimeout(r, 2000));
    container = window.document.querySelector(nameClass);
  }

  if (!container) return;

  if (container.className.includes("isNewUserscriptContainer")) return;

  container.className += " " + "isNewUserscriptContainer";

  const mangaId = window.location.pathname.split("/book/")[1];
  const apiUrl = `https://data.api.honey-manga.com.ua/v2/chapter/cursor-list`;
  const params = {
    page: 1,
    pageSize: 1000,
    mangaId,
    sortOrder: "DESC",
  };
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  const data = await res.json();

  function generateChaptersHtml(apiResponse) {
    const { data } = apiResponse;

    if (!data || data.length === 0) return "";

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };

      return (
        new Intl.DateTimeFormat("uk-UA", options)
          .format(date)
          .replace(".", "") + " р."
      );
    };

    const itemsHtml = data
      .map((chapter) => {
        return `
    <a class="flex items-start justify-between py-4 border-b last:border-b-0 border-dashed dark:border-gray-800 border-gray-200" 
       href="/read/${chapter.id}/${chapter.mangaId}">
      <div class="flex-1">
        <p class="flex items-center font-medium text-sm dark:text-gray-50 text-gray-700">
          <span>Том ${chapter.volume} - Розділ ${chapter.chapterNum} &nbsp; ${
          chapter.title
        }</span>
        </p>
        <div class="mt-3 flex items-center gap-x-3 text-[13px] dark:text-gray-500 text-gray-400">
          <span>${formatDate(chapter.lastUpdated)}</span>
          <span class="text-[8px]">|</span>
          <div class="flex items-center gap-x-2">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" stroke-linejoin="round" stroke-width="32" d="M408 64H104a56.16 56.16 0 00-56 56v192a56.16 56.16 0 0056 56h40v80l93.72-78.14a8 8 0 015.13-1.86H408a56.16 56.16 0 0056-56V120a56.16 56.16 0 00-56-56z"></path>
              <circle cx="160" cy="216" r="32"></circle>
              <circle cx="256" cy="216" r="32"></circle>
              <circle cx="352" cy="216" r="32"></circle>
            </svg>
            ${chapter.commented}
          </div>
          <div class="flex items-center gap-x-2">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z"></path>
            </svg>
            ${chapter.likes}
          </div>
        </div>
      </div>
      <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="dark:text-gray-500 text-gray-400" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
    </a>`;
      })
      .join("");

    return `${itemsHtml}`;
  }

  container.innerHTML = generateChaptersHtml(data);
})();
