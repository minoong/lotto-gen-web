# Lotto Genius

AI 기반 로또 번호 추천 서비스

## Demo

https://minoong.github.io/lotto-gen-web/

## Features

- **AI 기반 번호 추천**: 과거 당첨 데이터 분석을 통한 스마트 번호 생성
- **게임 수 선택**: 1~50게임 (1,000원~50,000원) 슬라이더로 간편 선택
- **최근 당첨번호 조회**: 최근 5회차 당첨 결과 확인
- **통계 패널**: 자주 나온 번호 / 적게 나온 번호 분석
- **이미지 저장**: 추천 번호를 PNG 이미지로 저장
- **GSAP 애니메이션**: Apple 스타일의 부드러운 인터랙션

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4 (@tailwindcss/vite)
- **Data Fetching**: TanStack Query v5
- **HTTP Client**: Axios
- **Animation**: GSAP + @gsap/react
- **UI Components**: shadcn/ui 패턴 (수동 구현)
- **Image Export**: html-to-image
- **Icons**: Lucide React

## PRD 구현 상세

### 번호 생성 알고리즘

5가지 가중치 기반 분석으로 번호를 추천합니다:

| 분석 항목 | 가중치 | 설명 |
|----------|--------|------|
| 출현 빈도 (Frequency) | 25% | 전체 회차에서 각 번호가 출현한 횟수 분석 |
| 최근 트렌드 (Recent) | 30% | 최근 10회차 출현 빈도 + 미출현 보정(Cold Bonus) |
| 번호 간격 패턴 (Gap) | 15% | 연속 번호 간 간격의 표준편차 분석 |
| 구간 균형 (Balance) | 20% | 1-15/16-30/31-45 세 구간의 균등 분포 |
| 동반 출현 (Pair) | 10% | 특정 번호들이 함께 출현하는 패턴 분석 |

### 번호 검증 규칙

생성된 번호는 다음 조건을 만족해야 합니다:
- 번호 합계: 100 ~ 175
- 홀짝 비율: 전부 홀수 또는 전부 짝수 불가
- 연속 번호: 3개 이상 연속 불가
- 고저 분포: 최소 2개의 저번호(1-22) 및 고번호(23-45) 포함

### 번호 공 색상 (실제 로또와 동일)

| 범위 | 색상 |
|------|------|
| 1-10 | 노란색 (Yellow) |
| 11-20 | 파란색 (Blue) |
| 21-30 | 빨간색 (Red) |
| 31-40 | 회색 (Gray) |
| 41-45 | 초록색 (Green) |

## Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui 스타일 기본 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── slider.tsx
│   │   └── collapsible.tsx
│   ├── AnimatedCard.tsx    # GSAP 애니메이션 카드 래퍼
│   ├── GameResult.tsx      # 단일 게임 결과 표시
│   ├── GameSelector.tsx    # 게임 수 선택 슬라이더
│   ├── GenerateButton.tsx  # 번호 생성 버튼 (스파클 효과)
│   ├── Header.tsx          # 헤더 (그라데이션 타이틀, 오브)
│   ├── NumberBall.tsx      # 로또 번호 공
│   ├── RecentDraws.tsx     # 최근 당첨번호 (접이식)
│   ├── ResultList.tsx      # 추천 번호 목록 + 저장
│   └── StatisticsPanel.tsx # 통계 패널
├── hooks/
│   ├── useLottoData.ts     # 당첨 데이터 fetching
│   └── useLottoGenerator.ts # 번호 생성 로직
├── lib/
│   ├── algorithms.ts       # 번호 생성 알고리즘
│   ├── api.ts              # API 클라이언트
│   ├── statistics.ts       # 통계 계산 함수
│   └── utils.ts            # 유틸리티 (cn)
├── types/
│   └── lotto.ts            # TypeScript 타입 정의
├── App.tsx                 # 메인 앱 컴포넌트
├── main.tsx                # 엔트리 포인트
└── index.css               # Tailwind CSS 설정
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## Deployment

GitHub Actions를 통해 GitHub Pages로 자동 배포됩니다.

### 설정 방법

1. GitHub 저장소 Settings → Pages
2. Source: **GitHub Actions** 선택
3. `main` 브랜치에 push하면 자동 배포

### 워크플로 파일

`.github/workflows/deploy.yml` - 빌드 및 배포 자동화

## API

당첨 데이터는 외부 API에서 가져옵니다:
- Endpoint: `https://api.luckpick.xyz/api/lotto`
- 응답: 전체 회차 당첨 번호 배열

## License

MIT
