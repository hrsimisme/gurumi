$(document).ready(function() {
    const CORRECT_CURRENT_PW = "1234";

    // 2. 입력값 감시 (버튼 활성화)
    $('.pw-wrapper input').on('input', function() {
        const isReady = $('#curr-pw').val() && $('#new-pw').val() && $('#confirm-pw').val();
        $('#pw-submit-btn').toggleClass('active', !!isReady).prop('disabled', !isReady);
    });

    // 3. 변경 버튼 클릭 검증
    $('#pw-submit-btn').on('click', function() {
        const curr = $('#curr-pw').val();
        const next = $('#new-pw').val();
        const conf = $('#confirm-pw').val();

        if(curr !== CORRECT_CURRENT_PW) return alert("현재 비밀번호가 틀립니다.");
        if(next !== conf) return alert("새 비밀번호가 일치하지 않습니다.");

        alert("비밀번호가 성공적으로 변경되었습니다.");
        $('.modal-overlay').hide();
        $('.pw-wrapper input').val(''); // 초기화
    });
});