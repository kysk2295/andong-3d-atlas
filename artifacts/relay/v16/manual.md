# v1.22 검증 — 외부 시각화 기반 월영 밤마당

## 참고와 구현
- 출처: references/SOURCES.md. 외부 이미지 세 장을 읽고 공간 요소를 새 geometry로 구현. 원본 작품 이미지 자체는 배포하지 않음.
- 62×44m, 9부스, 6구역, 15목적지. 현장 실측이나 실제 영업장이 아닌 기획 시안.
- 신규 기능: 3종 상품 추가, 구매한 음식/차 손동작 맛보기, 3D 엽서3도장/PNG, 풍경 캡처PNG, 야외 탈 전시, 실제 배치 기반 안내도.

## 실행
- 전용 테스트 origin127.0.0.1:4174, visit=popup. 기존 localhost와 public 여정 기록은 초기화하지 않음.
- 안내도→먹거리 마당→부스까지 실제 자동 보행. 간고등어 한 접시6,000원 시연 카드 구매 완료, 메뉴가 손에 들고 맛보기로 바뀜. 국화차 맛보기 후 완료 기록.
- 엽서 첫 도장은 접근성 버튼, 다리와 탈은 실제 화면 위치 클릭. 엽서받기 후 새로고침, 기록3/3과 다운로드 확인. 개선된 종이/선명도/패널 위치 screenshot postcard-desktop.png, postcard-mobile.png.
- 현재 풍경 캡처 실제PNG를 이미지와 다운로드 링크로 표시. 새로고침 후 기록1장 유지.
- 새 투호 구역에서 항아리 입구화면640,360 직접 클릭/놓기 →2성공/2회. tuho-aim.png.
- 모바일 안내도→공방 직접걷기→E 달빛 엽서 공방 버튼으로 실제 작업대 진입. map-mobile.png와 postcard-mobile.png.
- 모바일 안내도→달빛무대→E 장단따라하기, 네 차례입력후완료. 위치0,1.7,-8.4 유지. performance-mobile.png.
- W 입력으로(-5.800,1.700,18.700)→(-5.979,1.700,18.459). Space 직후y2.225와airborne=true 관측.
- 모바일390×844 가로넘침false, 조이스틱과점프표시. 최신로드 콘솔error/warn0.
- 최신밤입구전경 night-market-desktop.png. 사람/음식은 게임용모형이며 사진동등실사아님.

## 검사
- test.log:190pass,0fail. build.log:성공,기존큰청크경고.
- geometry병합시indexed속성차이로몸이안보이던개발오류를nonindexed재질/속성그룹으로수정하고새로드렌더확인.
- graphify.log:요구된update시도. 기존CLI인터프리터경로없어실행불가.

## 추가 확인
- 수변 전망대에서 촬영한 949×641 PNG 로딩 완료를 확인하고 저장 링크를 눌렀다. river-photo-preview.png.
- 신규 외부 참고 시안 3개 원문 링크가 사진·현장 정보 패널에 표시됨을 확인했다.
- 모바일 테스트 후 화면 크기 설정을 원래대로 복원했다.

## 배포
Deployment `13bae3a5-9dbc-40a8-8172-ff7979f797ac` SUCCESS 확인.
- 공개 URL: https://andong-atlas-production.up.railway.app/?experience=relay&visit=popup
- 공개 새 탭에서 밤마당 입구 렌더, 6개 구역 안내도, 9개 목적지 부스/새 음식/엽서/사진/전시/투호/장단 메뉴를 확인했다. public-night-market.png.
- 공개 브라우저 오류·경고 0건. 사용자 본 여정/기존 탭은 초기화·이동하지 않았다.
- public-assets.json: 진입 스크립트와 릴레이JS/CSS가 로컬 production build와 SHA-256 일치.
- 모바일 viewport 설정 복원, 전용 로컬 QA 탭 정리. 공개 결과 탭 보존.
