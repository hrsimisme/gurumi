    // 2. 모달 열기 로직
    $('.modal-trigger').on('click', function() {
        const target = $(this).data('target');
        const $modal = $(`#${target}`);

        $modal.fadeIn(200);
        $modal.find('.modal-content').css('bottom', '0');
    });

    // 3. 모달 닫기 로직 (취소 버튼 및 배경 클릭)
    $('.modal-close, .modal-overlay').on('click', function(e) {
        if (e.target !== this && !$(this).hasClass('modal-close')) return;
        
        $('.modal-content').css('bottom', '-100%');
        $(this).closest('.modal-overlay').fadeOut(300);
    });



    // 유저 이름을 가져와서 특정 요소에 넣어주는 공통 함수
function displayUserName(selector) {
    const savedUser = localStorage.getItem('username');
    if (savedUser) {
        $(selector).text(savedUser);
    }
}

// 로그아웃 공통 함수
function logout() {
    if (confirm("로그아웃 하시겠습니까?")) {
        localStorage.removeItem('username');
        // 폴더 구조에 따라 경로를 조절해야 할 수 있습니다.
        location.href = 'login.html'; 
    }
}