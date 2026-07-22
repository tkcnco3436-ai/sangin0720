(function () {
  "use strict";

  // ---------- edit.html: 비밀번호 입력칸 보기/가리기 토글 ----------
  function initMypagePasswordToggle() {
    var toggles = document.querySelectorAll("[data-mypage-password-toggle]");
    if (!toggles.length) return;
    toggles.forEach(function (btn) {
      var wrap = btn.closest(".mypage-form-password-wrap");
      var input = wrap ? wrap.querySelector("input") : null;
      if (!input) return;
      btn.addEventListener("click", function () {
        var reveal = input.type === "password";
        input.type = reveal ? "text" : "password";
        btn.classList.toggle("is-visible", reveal);
      });
    });
  }

  // ---------- 마이페이지: "변경하기" 클릭 시 기본 정보 수정 모달 ----------
  // ---------- edit.html: 기본 정보 수정 페이지 — 이메일/비밀번호 각각의 드릴다운 뷰 전환 ----------
  function initMypageEditProfile() {
    var emailOpenBtn = document.querySelector("[data-mypage-edit-email-open]");
    var emailOverlay = document.querySelector("[data-mypage-edit-email-overlay]");
    var emailCancelBtn = document.querySelector("[data-mypage-edit-email-cancel]");
    var emailApplyBtn = document.querySelector("[data-mypage-edit-email-apply]");
    var emailDisplay = document.querySelector("[data-mypage-edit-email-display]");
    var emailInput = document.querySelector("[data-mypage-edit-email-input]");
    var emailCurrent = document.querySelector("[data-mypage-edit-email-current]");
    var emailError = document.querySelector("[data-mypage-edit-email-error]");

    var pwOpenBtn = document.querySelector("[data-mypage-edit-password-open]");
    var pwOverlay = document.querySelector("[data-mypage-edit-password-overlay]");
    var pwCancelBtn = document.querySelector("[data-mypage-edit-password-cancel]");
    var pwApplyBtn = document.querySelector("[data-mypage-edit-password-apply]");
    var pwNewInput = document.querySelector("[data-mypage-edit-password-new]");
    var pwConfirmInput = document.querySelector("[data-mypage-edit-password-confirm]");
    var pwRuleCombo = document.querySelector('[data-mypage-pw-rule="combo"]');
    var pwRuleLength = document.querySelector('[data-mypage-pw-rule="length"]');
    var pwRuleMatch = document.querySelector('[data-mypage-pw-rule="match"]');

    if (!emailOpenBtn || !emailOverlay || !emailCancelBtn || !emailApplyBtn || !emailDisplay || !emailInput || !emailCurrent || !emailError ||
        !pwOpenBtn || !pwOverlay || !pwCancelBtn || !pwApplyBtn || !pwNewInput || !pwConfirmInput ||
        !pwRuleCombo || !pwRuleLength || !pwRuleMatch) return;

    // 데모용 목업 데이터 — 실제 백엔드 중복확인이 없어서 이 목록에 있으면 "이미 사용 중"으로 처리
    var MOCK_TAKEN_EMAILS = ["taken@sangin.com", "used@sangin.com"];
    var EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function bindOverlay(overlay, openBtn, cancelBtn, onOpen) {
      function close() { overlay.classList.remove("is-open"); }
      function open() {
        if (onOpen) onOpen();
        overlay.classList.add("is-open");
      }
      openBtn.addEventListener("click", open);
      cancelBtn.addEventListener("click", close);
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) close();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
      });
      return close;
    }

    function validateEmail(value) {
      if (!value) return "";
      if (!EMAIL_FORMAT.test(value)) return "올바른 이메일 형식이 아니에요.";
      if (value.toLowerCase() === emailCurrent.textContent.trim().toLowerCase()) return "현재 이메일과 동일해요.";
      if (MOCK_TAKEN_EMAILS.indexOf(value.toLowerCase()) !== -1) return "이미 사용 중인 이메일이에요.";
      return "";
    }

    function updateEmailValidity() {
      var value = emailInput.value.trim();
      var message = validateEmail(value);
      var isValid = value && !message;
      emailError.textContent = value ? (message || "사용이 가능해요.") : "";
      emailError.classList.toggle("is-visible", !!value);
      emailError.classList.toggle("is-valid", !!isValid);
      emailInput.classList.toggle("is-invalid", !!message);
      emailInput.classList.toggle("is-valid", !!isValid);
      emailApplyBtn.disabled = !isValid;
    }
    emailInput.addEventListener("input", updateEmailValidity);

    var closeEmail = bindOverlay(emailOverlay, emailOpenBtn, emailCancelBtn, function () {
      emailInput.value = "";
      emailCurrent.textContent = emailDisplay.textContent;
      updateEmailValidity();
    });
    var PW_COMBO = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#]).+$/;

    function updatePasswordValidity() {
      var newPw = pwNewInput.value;
      var confirmPw = pwConfirmInput.value;
      var comboOk = PW_COMBO.test(newPw);
      var lengthOk = newPw.length >= 8;
      var matchOk = !!newPw && newPw === confirmPw;

      pwRuleCombo.classList.toggle("is-met", comboOk);
      pwRuleLength.classList.toggle("is-met", lengthOk);
      pwRuleMatch.classList.toggle("is-met", matchOk);

      pwApplyBtn.disabled = !(comboOk && lengthOk && matchOk);
    }
    pwNewInput.addEventListener("input", updatePasswordValidity);
    pwConfirmInput.addEventListener("input", updatePasswordValidity);

    var closePw = bindOverlay(pwOverlay, pwOpenBtn, pwCancelBtn, function () {
      pwOverlay.querySelectorAll(".mypage-form-password-wrap input").forEach(function (f) {
        f.value = "";
        f.type = "password";
      });
      pwOverlay.querySelectorAll("[data-mypage-password-toggle]").forEach(function (btn) {
        btn.classList.remove("is-visible");
      });
      updatePasswordValidity();
    });

    emailApplyBtn.addEventListener("click", function () {
      if (emailApplyBtn.disabled) return;
      var newEmail = emailInput.value.trim();
      if (!newEmail || validateEmail(newEmail)) return;
      emailDisplay.textContent = newEmail;
      closeEmail();
    });

    pwApplyBtn.addEventListener("click", function () {
      if (pwApplyBtn.disabled) return;
      closePw();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMypagePasswordToggle();
    initMypageEditProfile();
  });
})();
