# Knoah-ai 백엔드 개발자 채용 과제: 키워드 마이닝 Lite 버전 제작

## 1. 프로젝트 실행

### 앱 실행
프로젝트 최상단에서 app.js를 실행합니다.
```
$ node app.js
 ```

Live debugging을 하려면 nodemon을 설치하고, 프로젝트 최상단에서 app.js를 실행합니다.
```
$ nodemon app.js
 ```


### 페이지 접속
앱을 실행하면 로컬 환경에서 애플리케이션이 구동됩니다.
<br> 
아래 주소로 접속하면 원하는 키워드로 유튜브 영상/채널 정보 검색을 수행할 수 있습니다.
```
localhost:3000 
```

### 개발환경
#### backend
- node.js v14.17.4
- npm v6.14.14
- nodemon v2.0.15
- nvm v0.33.1
#### frontend
- html
- css
- javascript


## 2. 프로젝트 구성
### 2-1. app.js
- node.js 애플리케이션을 구동하기 위한 메인 파일.
- 포트 3000


### 2-2. views
- 사용자에게 보이는 화면 영역으로서, views의 하위 폴더 구조대로 웹페이지가 구성됨.
- 검색어 입력 -> 검색 -> 검색어 확인 -> 스크롤을 내려 영상 목록을 확인 -> ```더 보기``` 버튼을 통해 추가 검색
  - 입력한 검색어로 검색된 영상이 없으면, ```검색결과가 없습니다. 다른 키워드 검색을 시도해 보거나 필터를 수정하세요.``` 라는 문구 출력.
  - ```더 보기``` 기능을 통해 최대 600건까지 화면에 출력할 수 있으며, 600건에 도달하면 ```더 보기``` 버튼을 숨김.
  - 해당 검색어로 마지막 페이지에 도달한 경우, ```더 보기``` 버튼을 숨김.


### 2-3. public
- css: CSS 파일.
- js: 각 view에 필요한 javascript 코드.


### 2-4. routes
- 컨트롤러 역할을 하는 곳으로, HTTP 요청을 모으고 응답을 내보내는 역할.
- 각 HTTP 요청에 대해 적절한 model로 안내함.
- 클라이언트의 요청을 model이 연산에 필요로 하는 형식으로 변환함.
  - Query string


### 2-5. models
- Open API(Youtube Data API(v3))를 호출하여 필요한 데이터 조회.
- 클라이언트가 사용자에게 표현하고자 하는 형식대로 데이터 가공.
- 에러 처리.