# SPORT1 · PACEFORGE

크로스핏, HYROX, 복싱 등 인터벌 트레이닝을 위한 Next.js 기반 운동 타이머입니다.

## 실행 환경

- Node.js 20.9 이상
- npm 10 이상
- Next.js 16
- React 19

## 처음 실행하기

```bash
git clone https://github.com/heesun3004-ux/SPORT1.git
cd SPORT1
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 됩니다.

## 빌드 및 테스트

```bash
npm test
npm run build
npm start
```

## 환경변수

기본 운동 타이머는 환경변수 없이 실행됩니다. 선택적 AI 연동을 추가할 때만 예제 파일을 복사해서 사용하세요.

```bash
cp .env.example .env.local
```

실제 API 키가 들어 있는 `.env`와 `.env.local`은 Git에 포함되지 않습니다. 키를 저장소, 메신저 또는 압축파일에 넣어 공유하지 마세요.

## 배포

이 저장소는 Vercel 프로젝트와 연결할 수 있는 표준 Next.js 구조입니다. Vercel에서 저장소를 가져온 뒤 Build Command는 `npm run build`, Install Command는 `npm install`을 사용하면 됩니다.

현재 서비스: https://sport1-six.vercel.app

## 공유할 때

GitHub 저장소 링크를 공유하는 방법을 권장합니다. 폴더를 직접 전달해야 한다면 `.env`, `.env.local`, `.vercel`, `node_modules`, `.next`, `dist` 폴더를 제외하세요.
