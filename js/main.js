

const API_KEY = '23020d5c893f7c6a33cab91ed0a754b5';

// 1. 페이지 로드 시 실행
$(document).ready(function() {

    const savedUser = localStorage.getItem('username');

    if (!savedUser) {
        // 저장된 유저 정보가 없으면 다시 로그인 페이지로!
        alert("로그인이 필요한 서비스입니다.");
        location.href = 'index.html'; 
        return; // 아래 날씨 로직이 실행되지 않도록 중단
    }
    // 1. 저장된 도시가 있는지 확인
    const savedCity = localStorage.getItem('savedCity');

    if (savedCity) {
        // 저장된 도시가 있다면 바로 그 도시 날씨를 불러옴
        getCityWeather(savedCity);
    } else {
        // 저장된 게 없다면 원래대로 현재 위치(GPS) 기반 호출
        getCurrentLocationWeather();
    }

    const cityMap = {
        "서울": "Seoul", "서울시": "Seoul",
        "부산": "Busan", "부산광역시": "Busan",
        "진주": "Jinju", "진주시": "Jinju",
        "인천": "Incheon", "인천광역시": "Incheon",
        "대구": "Daegu", "대전": "Daejeon",
        "광주": "Gwangju", "울산": "Ulsan",
        "제주": "Jeju", "제주도": "Jeju",
        "하동": "Hadong", "광양": "Gwangyang"
    };

    // 지역 버튼 클릭 시 검색창
    $('.local-btn').on('click', function() {
        const userInput = prompt("도시 이름을 입력하세요 (한글/영문)");
        
        if (userInput) {
            const trimmedInput = userInput.trim();
            const city = cityMap[trimmedInput] || trimmedInput;
            getCityWeather(city);
        }
    });
});

// 2. 도시 이름으로 날씨 가져오기
async function getCityWeather(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=kr`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            alert("도시를 찾을 수 없습니다.");
            return;
        }
        const data = await response.json();const temp = Math.round(data.main.temp);
        const status = data.weather[0].main;
        const minTemp = Math.round(data.main.temp_min); // 최저기온 추출
        const maxTemp = Math.round(data.main.temp_max); // 최고기온 추출

        // ★ 추가: 검색 성공 시 도시 이름을 브라우저에 저장!
        localStorage.setItem('savedCity', cityName);

        updateMainUI(data, minTemp, maxTemp);
        updateCharacter(status);
        updateTotalOutfit(temp, status);
    } catch (err) {
        console.error("도시 검색 에러:", err);
    }
}

// 3. 현재 위치 좌표 가져오기
function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            fetchWeather(position.coords.latitude, position.coords.longitude);
        }, (error) => {
            fetchWeather(37.5665, 126.9780); // 거부 시 서울
        });
    }
}
// 4. 좌표로 API 호출 (컨트롤러 역할)
async function fetchWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // 데이터 추출
        const temp = Math.round(data.main.temp);
        const status = data.weather[0].main;
        const minTemp = Math.round(data.main.temp_min);
        const maxTemp = Math.round(data.main.temp_max);

        localStorage.setItem('savedCity', data.name);
        
        // --- 기능별로 딱 한 번씩만 호출 ---
        updateMainUI(data, minTemp, maxTemp); // 텍스트/기온 UI 업데이트
        updateCharacter(status);             // 캐릭터 상태 업데이트
        updateTotalOutfit(temp, status);     // 추천 아이템 필터링
        // -------------------------------

    } catch (err) {
        console.error("데이터 로드 에러:", err);
    }
}

// 5. UI 업데이트 (화면에 글자 뿌리는 역할만!)
function updateMainUI(data, minTemp, maxTemp) {
    const temp = Math.round(data.main.temp);

    $('.temp').html(`${temp}<span>°C</span>`);
    $('.temp-announce').text(data.weather[0].description);
    $('.local-btn').text(data.name);

    // 최저/최고 기온 표시 (전달받은 인자 활용)
    $('.min-temp').text('최저 ' + minTemp + '°');
    $('.max-temp').text('최고 ' + maxTemp + '°');
}


// 6. 캐릭터 및 배경색 업데이트
function updateCharacter(status) {
    const $gurumiBox = $('.gurumi');
    const $weatherSections = $('.weather');
    const $body = $('body');
    const $header = $('#header');

    //status = 'Clouds';

    // 클래스 초기화
    $gurumiBox.removeClass('rain clear clouds snow squall');
    $weatherSections.removeClass('rain clear cloud snow squall');

    if (status === 'Rain' || status === 'Drizzle' || status === 'Thunderstorm') {
        $gurumiBox.addClass('rain');
        $weatherSections.addClass('rain');
        $body.css('background-color', 'var(--rain-bg)');
        $header.css('background-color', 'var(--rain-bg)');
    } 
    else if (status === 'Clear') {
        $gurumiBox.addClass('clear');
        $weatherSections.addClass('clear');
        $body.css('background-color', 'var(--clear-bg)');
        $header.css('background-color', 'var(--clear-bg)');
    } 
    else if (status === 'Clouds' || status === 'Mist' || status === 'Fog') {
        $gurumiBox.addClass('clouds');
        $weatherSections.addClass('cloud');
        $body.css('background-color', 'var(--cloud-bg)');
        $header.css('background-color', 'var(--cloud-bg)');
    }
    else if (status === 'Snow') {
        $gurumiBox.addClass('snow');
        $weatherSections.addClass('snow');
        $body.css('background-color', 'var(--snow-bg)');
        $header.css('background-color', 'var(--snow-bg)');
    }
}

// 기온별 아웃핏

// 7. [통합] 기온 및 날씨별 아이템 업데이트
function updateTotalOutfit(temp, status) {
    //temp = '9';
    //status = 'Clouds';
    console.log("현재 기온:", temp, " / 현재 날씨 상태:", status);

    // A. 기온 범위 결정
    let range = "";
    if (temp <= 5) range = "cold";
    else if (temp <= 15) range = "mild";
    else if (temp <= 22) range = "warm";
    else range = "hot";

    // B. 날씨 타입 결정
    let weatherType = "";
    if (status === 'Rain' || status === 'Drizzle' || status === 'Thunderstorm') {
        weatherType = "rain";
    } else if (status === 'Clear') {
        weatherType = "clear";
    } else if (status === 'Clouds' || status === 'Mist' || status === 'Fog') {
        weatherType = "clouds";
    } else if (status === 'Snow') {
        weatherType = "snow";
    }

    // 1. API에서 받은 날씨 키워드 (예: 'Rain', 'Clear', 'Clouds' 등)
let weatherStatusText = "";

// 2. 내 입맛대로 한글 텍스트 매칭
switch (weatherType) {
    case 'rain':
        weatherStatusText = "비가 내리니 우산을 챙기세요 ! ☔";
        break;
    case 'clear':
        weatherStatusText = "햇살이 눈부셔요 ✨";
        break;
    case 'clouds':
        weatherStatusText = "구름이 많이 껴있어요 ☁️";
        break;
    case 'snow':
        weatherStatusText = "새하얀 눈이 내려요";
        break;
    default:
        weatherStatusText = "무난한 날씨예요 :)";
}

// 3. 화면에 출력
$('.temp-announce').text(weatherStatusText);


    // C. 모든 .content 초기화
    const $allContents = $('.content');
    $allContents.removeClass('on');

    // D. 조건에 맞는 아이템 노출
    $allContents.each(function() {
        const itemRange = $(this).data('range');
        const itemWeather = $(this).data('weather');

        // 기온 조건 확인
        const isRangeMatch = itemRange && itemRange.includes(range);
        // 날씨 조건 확인
        const isWeatherMatch = itemWeather && itemWeather.includes(weatherType);

        // 둘 중 하나라도 해당되면 표시
        if (isRangeMatch || isWeatherMatch) {
            $(this).addClass('on');
        }
    });
}