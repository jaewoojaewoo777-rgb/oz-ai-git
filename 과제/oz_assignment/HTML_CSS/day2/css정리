# CSS 정리 (Day 2)

## 1. CSS란?
**Cascading Style Sheets**의 약자로, HTML로 만든 문서의 **겉모습(색상, 글꼴, 크기, 배치 등)을 꾸미는 언어**입니다.
- HTML = 뼈대(구조), CSS = 옷(디자인)
- 구조와 디자인을 분리하면 유지보수가 쉽고, 하나의 CSS로 여러 페이지에 같은 디자인을 적용할 수 있습니다.
- 기본 문법:

```css
선택자 {
  속성: 값;
}
```

## 2. CSS 적용 방식 3가지

| 방식 | 작성 위치 | 예시 |
|---|---|---|
| Inline CSS | 태그의 `style` 속성 안 | `<p style="color: red;">` |
| Internal CSS | `<head>` 안의 `<style>` 태그 | `<style> p { color: red; } </style>` |
| External CSS | 별도 `.css` 파일을 `<link>`로 연결 | `<link rel="stylesheet" href="style.css">` |

- **Inline**: 해당 태그 하나에만 적용, 우선순위 가장 높음. 재사용이 어려워 권장하지 않음.
- **Internal**: 한 HTML 파일 안에서만 적용. 파일이 하나일 때 간단히 쓰기 좋음.
- **External**: 여러 HTML이 하나의 CSS를 공유. **실무에서 가장 많이 쓰는 방식**이며 이번 이력서도 이 방식으로 작성했습니다.

## 3. CSS Selector (선택자)
스타일을 적용할 HTML 요소를 고르는 방법입니다.

| 선택자 | 문법 | 설명 |
|---|---|---|
| 전체 선택자 | `*` | 모든 요소 |
| 태그 선택자 | `p` | 해당 태그 전부 |
| 클래스 선택자 | `.card` | class="card"인 요소 (여러 개 가능) |
| 아이디 선택자 | `#title` | id="title"인 요소 (페이지에서 하나만) |
| 자손 선택자 | `.card p` | .card 안에 있는 모든 p |
| 자식 선택자 | `.card > p` | .card 바로 아래 자식 p만 |
| 그룹 선택자 | `h1, h2` | 여러 요소에 같이 적용 |
| 가상 클래스 | `a:hover` | 마우스를 올렸을 때 등 상태 |

**우선순위**: `!important` > inline > id > class > 태그 (같으면 나중에 쓴 것이 적용)

## 4. style 속성

### 4-1. text 관련
| 속성 | 설명 | 예시 |
|---|---|---|
| `font-size` | 글자 크기 | `font-size: 16px;` |
| `font-weight` | 글자 굵기 | `font-weight: 700;` (bold) |
| `text-align` | 글자 정렬 | `text-align: center;` (left / right / center) |
| `color` | 글자 색 | `color: #333;` |
| `line-height` | 줄 간격 | `line-height: 1.6;` |

### 4-2. Box Model
모든 HTML 요소는 **네모 상자**이고, 안쪽부터 `content → padding → border → margin` 순서로 구성됩니다.

```
┌──────────── margin (바깥 여백) ────────────┐
│ ┌──────────── border (테두리) ───────────┐ │
│ │ ┌────────── padding (안쪽 여백) ─────┐ │ │
│ │ │            content                │ │ │
│ │ └───────────────────────────────────┘ │ │
│ └───────────────────────────────────────┘ │
└───────────────────────────────────────────┘
```

| 속성 | 설명 | 예시 |
|---|---|---|
| `content` | 실제 내용(글, 이미지)이 들어가는 영역 | - |
| `padding` | content와 border 사이의 안쪽 여백 | `padding: 10px 20px;` |
| `border` | 테두리 (두께, 종류, 색) | `border: 1px solid #ccc;` |
| `margin` | border 바깥의 다른 요소와의 간격 | `margin: 0 auto;` (가로 가운데 정렬) |
| `width` / `height` | content 영역의 가로/세로 크기 | `width: 300px;` |
| `box-sizing` | width/height 계산 기준 | `box-sizing: border-box;` |

- 여백 축약: `margin: 위 오른쪽 아래 왼쪽;` (시계방향) / 값이 2개면 `상하 좌우`
- **box-sizing**
  - `content-box`(기본값): width가 content만의 크기 → padding/border를 더하면 실제 크기가 커짐
  - `border-box`: width에 padding과 border가 **포함** → 크기 계산이 직관적. 그래서 보통 `* { box-sizing: border-box; }`로 초기화해서 사용

## 오늘 배운 점
- 구조(HTML)와 디자인(CSS)을 나누면 코드가 깔끔해진다.
- 선택자로 "누구에게" 적용할지, 속성으로 "무엇을" 바꿀지 정한다.
- 박스 모델을 이해해야 여백과 배치를 마음대로 조절할 수 있다.
