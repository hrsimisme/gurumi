$(document).ready(function() {

        // 1. 사용자 데이터 설정 (나중에 DB나 localStorage에서 불러올 수 있음)

    const savedUser = localStorage.getItem('username');

    // 2. 만약 이름이 있다면 화면에 뿌려주고, 없으면 "손님"으로 표시
    const userData = {
        nickname: savedUser + ' 님',
        id: savedUser
    };
    $('#user-nickname').text(userData.nickname);
    $('#user-id').text(userData.id);

    const savedBirth = localStorage.getItem('userBirth');
    const savedGender = localStorage.getItem('userGender');

    if (savedBirth) {
        $('#birth-value').text(savedBirth);
    }
    if (savedGender) {
        $('#gender-value').text(savedGender);
    }

    // [추가] 토글 스위치 상태 불러오기
    $('.switch input').each(function() {
        const id = $(this).attr('id');
        const isChecked = localStorage.getItem(id) === 'true'; // 문자열 'true'인지 확인
        $(this).prop('checked', isChecked);
    });

    
    // 1. 초기 데이터 생성 및 로드
    const initPickers = () => {
        // 연도 생성 (1900 ~ 2026)
        for (let i = 2026; i >= 1900; i--) {
            $('#year-list').append(`<li>${i}</li>`);
        }
        // 월 생성 (1 ~ 12)
        for (let i = 1; i <= 12; i++) {
            $('#month-list').append(`<li>${i}</li>`);
        }
        // 일 생성 (1 ~ 31)
        for (let i = 1; i <= 31; i++) {
            $('#day-list').append(`<li>${i}</li>`);
        }
        
        // 초기 선택값 설정 (중앙에 맞추기 위해 첫 번째 아이템 선택)
        $('.picker-list li:first-child').addClass('selected');
    };

    initPickers();



    // 4. 피커 선택 로직 (클릭 시 해당 위치로 이동 및 강조)
    $(document).on('click', '.picker-list li', function() {
        const $li = $(this);
        const $container = $li.closest('.picker-container, .picker-wrapper');
        
        // 클래스 변경
        $li.addClass('selected').siblings().removeClass('selected');
        
        // 스크롤 위치 조정 (중앙으로)
        const itemHeight = 40; // CSS li 높이
        const index = $li.index();
        $container.stop().animate({
            scrollTop: index * itemHeight
        }, 200);
    });

// 중앙 요소 감지 함수
    const updateSelectedInsideScroll = ($container) => {
        const containerTop = $container.offset().top;
        const containerCenter = containerTop + ($container.height() / 2);
        let closestItem = null;
        let minDistance = Infinity;

        $container.find('li').each(function() {
            const itemCenter = $(this).offset().top + ($(this).height() / 2);
            const distance = Math.abs(containerCenter - itemCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestItem = $(this);
            }
        });

        if (closestItem && !closestItem.hasClass('selected')) {
            $container.find('li').removeClass('selected');
            closestItem.addClass('selected');
        }
    };

    // 스크롤 이벤트 연결
    $('.picker-container, .picker-wrapper').on('scroll', function() {
        const $this = $(this);
        // 스크롤 중 실시간 감지
        updateSelectedInsideScroll($this);
    });
    

    // 5. 저장 버튼 로직
    $('.modal-save').on('click', function() {
        const type = $(this).data('for');
        
        if (type === 'birth') {
            const y = $('#year-list .selected').text() || '2000';
            const m = ($('#month-list .selected').text() || '10').padStart(2, '0');
            const d = ($('#day-list .selected').text() || '01').padStart(2, '0');
            
            const fullDate = `${y}.${m}.${d}`;
            $('#birth-value').text(fullDate);
            localStorage.setItem('userBirth', fullDate);
            
        } else if (type === 'gender') {
            const gender = $('#gender-list .selected').text();
            $('#gender-value').text(gender);
            localStorage.setItem('userGender', gender);
        }

        $('.modal-close').trigger('click');
    });

    // 6. 토글 스위치 상태 저장 (선택 사항)
    $('.switch input').on('change', function() {
        const id = $(this).attr('id');
        const isChecked = $(this).prop('checked');
        localStorage.setItem(id, isChecked);
    });
});


$(document).ready(function() {
    // 로그아웃 버튼 클릭 시
    $('.btn-logout').on('click', function() {
        if (confirm("로그아웃 하시겠습니까?")) {
            // 1. 로그인 상태 정보 지우기 (로컬스토리지 비우기)
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('nickname');

            // 2. 로그인 화면으로 이동
            location.href = '../index.html'; 
        }
    });
});
