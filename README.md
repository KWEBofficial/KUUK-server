# KUUK-server 소개

mysql/mariadb 기반 KUUK서비스의 백엔드 서버 프로젝트입니다.

## 개발 스택

- **boilerplate** : https://github.com/sjn0910/express-ts-typeorm-boilerplate
- **typescript** : type soundness를 위한 타입 체킹 시스템
- **express** : router, middleware를 이용한 간단한 서버 구축
- **typeORM** : entity, repository 기반 service 지원
- **eslint/prettier** : 개발 일관성을 위한 코드 형식 유지 툴

## 구조

- **MVC 설계 기반**
- **Entity** : DB에 필요한 요소와 관계를 정의하고 설정해줍니다.
- **Repository** : Entity를 활용하여 dataSource (DB)와 연결해줍니다.
- **Service** : Repository를 활용하여 dataSource (DB)의 CRUD 서비스를 제공합니다.
- **Controller** : Query를 분석하고 요청 받은 기능을 service를 이용하여 수행합니다.
- **Router** : Query에 따라 적절한 middleware 혹은 controller로 연결해줍니다.

## 기능 및 서비스

- **로그인** : 회원 user와 비회원 guest로 나눠서 관리합니다. 회원의 경우만 아이디, 비밀번호, 별명, 생일을 받아와 DB에 저장하여 관리합니다. 비회원의 경우 별명만을 받아오고 특정 투표방 내에서만 정보가 유효합니다.
- **세션** : 로그인과 마찬가지로 회원 user와 비회원 guest로 나눠서 관리합니다. 기능에 권한이 필요한 경우 세션을 확인합니다.
- **식당DB** : 투표 설정창에서 선택한 카테고리, 위치에 따른 식당 리스트를 제공합니다.
- **투표** : 회원인 투표방 제작자와 링크를 통해 들어온 비회원들의 투표를 통해 후보 식당 중 우승 식당을 선정합니다.
- **보안** : 세션유지를 통한 권한 부여, 비밀번호 해싱을 통한 개인정보 보호 등의 보안이 적용되어 있습니다.

## API

- **/participant** : 투표 참여자 정보와 관련된 기능 모음
- **/poll** : 투표, 식당, 후보군, 히스토리와 관련된 관련된 기능 모음
- **/user** : 회원가입, 로그인, 로그아웃, 로그인 상태와 관련된 기능 모음


# 프로젝트 셋업

## 데이터베이스

기본 DBMS는 mysql/mariadb입니다. mysql/mariadb를 설치하고 사용할 데이터베이스의 이름으로 데이터베이스를 생성하세요. 다른 DBMS를 사용하려면 **`src/config`** 디렉토리의 **`dataSource.ts`** 파일을 수정할 수 있습니다.

## 환경 변수

개발 모드인 경우 프로젝트의 루트 디렉토리에 **`.env.dev`** 파일을 생성하고 다음과 같은 변수를 추가하세요.

```
CLIENT_URL=http://localhost:4000

PORT=3000 # port on which the server will listen

DB_HOST=localhost # host(ip) of the database
DB_PORT=3306 # port of the database
DB_USER=root # username of the database
DB_PASSWORD=pwd # password of the database
DB_NAME=example # name of the database, which you created in the previous step
```

프로덕션 모드인 경우 프로젝트의 루트 디렉토리에 **`.env.prod`** 파일을 생성하고 위의 구성 변수를 적절한 값으로 추가하세요.

## 실행

원하는 모드에 따라 프로젝트의 루트 디렉토리에서 다음 명령을 실행하여 서버를 실행하세요.

### Development Mode

```
npm install
npm run dev
```

### Production Mode

```
npm install
npm run build
npm run prod
```

# 멤버

김수현 

문정민

박보건

정연승

정혜민
