(function () {
  "use strict";

  // ---------- 마이페이지: 프로필 사진 업로드 + 원형 크롭(드래그로 팬, 슬라이더로 줌) + 삭제 ----------
  function initMypageAvatarCrop() {
    var wrap = document.querySelector("[data-mypage-avatar-wrap]");
    if (!wrap) return;
    var initialSpan = wrap.querySelector("[data-mypage-avatar-initial]");
    var img = wrap.querySelector("[data-mypage-avatar-img]");
    var editBtn = wrap.querySelector("[data-mypage-avatar-edit]");
    var fileInput = wrap.querySelector("[data-mypage-avatar-input]");
    var menu = document.querySelector("[data-mypage-avatar-menu]");
    var changeBtn = document.querySelector("[data-mypage-avatar-change]");
    var defaultBtn = document.querySelector("[data-mypage-avatar-default]");
    var menuCancelBtn = document.querySelector("[data-mypage-avatar-menu-cancel]");
    var overlay = document.querySelector("[data-mypage-crop-overlay]");
    var stage = document.querySelector("[data-mypage-crop-stage]");
    var canvas = document.querySelector("[data-mypage-crop-canvas]");
    var zoomInput = document.querySelector("[data-mypage-crop-zoom]");
    var cancelBtn = document.querySelector("[data-mypage-crop-cancel]");
    var applyBtn = document.querySelector("[data-mypage-crop-apply]");
    if (!initialSpan || !img || !editBtn || !menu || !changeBtn || !defaultBtn || !menuCancelBtn || !fileInput || !overlay || !stage || !canvas || !zoomInput || !cancelBtn || !applyBtn) return;

    var ctx = canvas.getContext("2d");
    var STAGE = 280;
    var source = null;
    var baseScale = 1;
    var scale = 1;
    var offsetX = 0;
    var offsetY = 0;
    var dragging = false;
    var lastX = 0;
    var lastY = 0;
    var hasPhoto = false;

    function closeMenu() {
      menu.classList.remove("is-open");
      editBtn.setAttribute("aria-expanded", "false");
    }
    function toggleMenu() {
      var willOpen = !menu.classList.contains("is-open");
      menu.classList.toggle("is-open", willOpen);
      editBtn.setAttribute("aria-expanded", String(willOpen));
    }
    function setPhoto(applied) {
      hasPhoto = applied;
      img.style.display = applied ? "block" : "none";
      initialSpan.style.display = applied ? "none" : "flex";
    }
    menuCancelBtn.addEventListener("click", closeMenu);
    menu.addEventListener("click", function (e) {
      if (e.target === menu) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) closeMenu();
    });

    function drawnSize() {
      return {
        w: source.naturalWidth * baseScale * scale,
        h: source.naturalHeight * baseScale * scale
      };
    }

    function clampOffset() {
      var size = drawnSize();
      var maxX = Math.max(0, (size.w - STAGE) / 2);
      var maxY = Math.max(0, (size.h - STAGE) / 2);
      offsetX = Math.max(-maxX, Math.min(maxX, offsetX));
      offsetY = Math.max(-maxY, Math.min(maxY, offsetY));
    }

    function draw() {
      ctx.clearRect(0, 0, STAGE, STAGE);
      if (!source) return;
      var size = drawnSize();
      var x = STAGE / 2 - size.w / 2 + offsetX;
      var y = STAGE / 2 - size.h / 2 + offsetY;
      ctx.save();
      ctx.beginPath();
      ctx.arc(STAGE / 2, STAGE / 2, STAGE / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(source, x, y, size.w, size.h);
      ctx.restore();
    }

    function openModal(file) {
      var reader = new FileReader();
      reader.onload = function () {
        var image = new Image();
        image.onload = function () {
          source = image;
          baseScale = Math.max(STAGE / image.naturalWidth, STAGE / image.naturalHeight);
          scale = 1;
          offsetX = 0;
          offsetY = 0;
          zoomInput.value = "1";
          overlay.style.display = "flex";
          draw();
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    }

    function closeModal() {
      overlay.style.display = "none";
      source = null;
    }

    editBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (hasPhoto) toggleMenu();
      else fileInput.click();
    });
    changeBtn.addEventListener("click", function () {
      closeMenu();
      fileInput.click();
    });
    defaultBtn.addEventListener("click", function () {
      closeMenu();
      setPhoto(false);
      img.src = "";
    });
    fileInput.addEventListener("change", function () {
      var file = fileInput.files && fileInput.files[0];
      if (file) openModal(file);
      fileInput.value = "";
    });

    cancelBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.style.display === "flex") closeModal();
    });

    zoomInput.addEventListener("input", function () {
      if (!source) return;
      scale = parseFloat(zoomInput.value);
      clampOffset();
      draw();
    });

    function pointerPos(e) {
      if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      return { x: e.clientX, y: e.clientY };
    }
    function onDown(e) {
      if (!source) return;
      dragging = true;
      var p = pointerPos(e);
      lastX = p.x;
      lastY = p.y;
    }
    function onMove(e) {
      if (!dragging) return;
      var p = pointerPos(e);
      offsetX += p.x - lastX;
      offsetY += p.y - lastY;
      lastX = p.x;
      lastY = p.y;
      clampOffset();
      draw();
    }
    function onUp() { dragging = false; }
    stage.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    stage.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);

    applyBtn.addEventListener("click", function () {
      if (!source) { closeModal(); return; }
      var OUT = 256;
      var out = document.createElement("canvas");
      out.width = OUT;
      out.height = OUT;
      var octx = out.getContext("2d");
      var ratio = OUT / STAGE;
      var size = drawnSize();
      var w = size.w * ratio;
      var h = size.h * ratio;
      var x = OUT / 2 - w / 2 + offsetX * ratio;
      var y = OUT / 2 - h / 2 + offsetY * ratio;
      octx.save();
      octx.beginPath();
      octx.arc(OUT / 2, OUT / 2, OUT / 2, 0, Math.PI * 2);
      octx.clip();
      octx.drawImage(source, x, y, w, h);
      octx.restore();
      img.src = out.toDataURL("image/png");
      setPhoto(true);
      closeModal();
    });
  }

  // ---------- 마이페이지: 모바일에서 긴 문장을 4단어씩 끊어 줄바꿈 ----------
  function initMypageWordWrap() {
    var targets = document.querySelectorAll(".mypage-crop-modal__hint, .mypage-subscribe__desc, .mypage-info-row__desc, .withdraw-card__lead, .withdraw-card__warn");
    if (!targets.length) return;
    var mq = window.matchMedia("(max-width: 767px)");

    function apply() {
      targets.forEach(function (el) {
        if (el.dataset.originalText === undefined) el.dataset.originalText = el.textContent;
        if (mq.matches) {
          var words = el.dataset.originalText.trim().split(/\s+/);
          var lines = [];
          for (var i = 0; i < words.length; i += 6) {
            lines.push(words.slice(i, i + 6).join(" "));
          }
          el.innerHTML = lines.join("<br>");
        } else {
          el.textContent = el.dataset.originalText;
        }
      });
    }
    apply();
    if (mq.addEventListener) mq.addEventListener("change", apply);
    else mq.addListener(apply);
  }

  // ---------- 로그아웃 확인 팝업 (mypage/mypage-login/withdraw 공용) ----------
  function initMypageLogout() {
    var overlay = document.querySelector("[data-logout-overlay]");
    if (!overlay) return;
    var openers = document.querySelectorAll("[data-logout-open]");
    var cancelBtn = overlay.querySelector("[data-logout-cancel]");
    var confirmBtn = overlay.querySelector("[data-logout-confirm]");

    function open() { overlay.classList.add("is-open"); }
    function close() { overlay.classList.remove("is-open"); }

    openers.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        open();
      });
    });
    if (cancelBtn) cancelBtn.addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    if (confirmBtn) confirmBtn.addEventListener("click", function () {
      // 실제 로그아웃 처리 연결 지점(현재는 팝업만 닫음)
      close();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMypageAvatarCrop();
    initMypageWordWrap();
    initMypageLogout();
  });
})();
