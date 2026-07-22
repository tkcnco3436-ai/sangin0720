(function () {
  "use strict";

  // 회원탈퇴: 확인 문구를 정확히 입력해야 [회원탈퇴] 버튼 활성화
  var CONFIRM_PHRASE = "탈퇴하겠습니다";

  function initWithdraw() {
    var input = document.querySelector("[data-withdraw-input]");
    var confirmBtn = document.querySelector("[data-withdraw-confirm]");
    if (!input || !confirmBtn) return;

    function sync() {
      confirmBtn.disabled = input.value.trim() !== CONFIRM_PHRASE;
    }
    input.addEventListener("input", sync);
    sync();

    confirmBtn.addEventListener("click", function () {
      if (confirmBtn.disabled) return;
      // 실제 탈퇴 처리 연결 지점(현재는 완료 후 랜딩으로 이동)
      window.location.href = "index.html";
    });
  }

  document.addEventListener("DOMContentLoaded", initWithdraw);
})();
