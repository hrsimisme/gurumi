$(document).ready(function() {
    // 1. 비밀번호 보기 토글
    $('.pw-toggle').on('click', function() {
        const $input = $('#user-pw');
        if ($input.attr('type') === 'password') {
            $input.attr('type', 'text');
            $(this).removeClass('fa-eye-slash').addClass('fa-eye');
        } else {
            $input.attr('type', 'password');
            $(this).removeClass('fa-eye').addClass('fa-eye-slash');
        }
    });

    // 2. 로그인 로직 통합 (딱 하나만 남기기)
    $('.login-form').on('submit', function(e) {
        e.preventDefault(); // 기본 제출 동작 방지

        // HTML의 id="user-id"에서 값을 가져옴
        const userName = $('#user-id').val().trim();
        const userPw = $('#user-pw').val().trim();

        console.log("입력 확인:", userName, userPw); // 데이터가 잘 들어오는지 콘솔 확인용

        if (userName === "" || userPw === "") {
            alert("아이디와 비밀번호를 모두 입력해주세요!");
            return;
        }

        // 로그인 버튼 상태 변경
        const $btn = $('.login-btn');
        $btn.text('구르미 만나는 중...').prop('disabled', true).css('opacity', '0.7');

        // 0.8초 뒤 이동
        setTimeout(function() {
            // 메인 페이지(index.html)에서 검사할 이름 저장
            localStorage.setItem('username', userName);
            
            location.href = 'main.html'; 
        }, 800);
    });
});