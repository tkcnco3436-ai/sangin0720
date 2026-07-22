/* 관리자 사이드바: 내비 활성 상태 토글 */
(function () {
  "use strict";

  if (window.lucide) window.lucide.createIcons();

  var items = document.querySelectorAll("[data-admin-nav-item]");
  items.forEach(function (item) {
    item.addEventListener("click", function () {
      items.forEach(function (i) {
        i.classList.remove("is-active");
        i.removeAttribute("aria-current");
      });
      item.classList.add("is-active");
      item.setAttribute("aria-current", "page");
    });
  });
})();
