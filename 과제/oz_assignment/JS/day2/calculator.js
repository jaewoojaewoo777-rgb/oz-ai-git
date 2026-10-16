// ============================================
// 웹 브라우저 Console 4칙연산 계산기
// 사용법: 브라우저 개발자도구(F12) > Console 에 붙여넣기 후
//   calc("1 + 2 * 3")  →  7
// ============================================
//
// 동작 원리 (eval을 쓰지 않고 직접 구현)
//  1) 문자열 → 토큰(숫자/연산자/괄호) 으로 쪼갠다
//  2) 연산자 우선순위(*, / > +, -)를 지키며 계산한다
//     - 재귀 하강 파서: expression(+,-) → term(*,/) → factor(숫자, 괄호, 음수)
//     - 우선순위가 낮은 연산이 높은 연산을 "호출"하는 구조라서 자연스럽게 곱셈/나눗셈이 먼저 계산됨

function tokenize(input) {
  const tokens = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    // 공백은 무시
    if (ch === " ") {
      i++;
      continue;
    }

    // 숫자 (소수점 포함)
    if ((ch >= "0" && ch <= "9") || ch === ".") {
      let numStr = "";
      while (
        i < input.length &&
        ((input[i] >= "0" && input[i] <= "9") || input[i] === ".")
      ) {
        numStr += input[i];
        i++;
      }
      if (isNaN(Number(numStr))) {
        throw new Error(`잘못된 숫자입니다: ${numStr}`);
      }
      tokens.push({ type: "number", value: Number(numStr) });
      continue;
    }

    // 연산자, 괄호
    if ("+-*/()".includes(ch)) {
      tokens.push({ type: "op", value: ch });
      i++;
      continue;
    }

    throw new Error(`사용할 수 없는 문자입니다: "${ch}"`);
  }

  return tokens;
}

function calc(input) {
  const tokens = tokenize(String(input));
  let pos = 0;

  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  // expression := term (('+' | '-') term)*
  function expression() {
    let result = term();
    while (peek() && (peek().value === "+" || peek().value === "-")) {
      const op = next().value;
      const right = term();
      result = op === "+" ? result + right : result - right;
    }
    return result;
  }

  // term := factor (('*' | '/') factor)*
  function term() {
    let result = factor();
    while (peek() && (peek().value === "*" || peek().value === "/")) {
      const op = next().value;
      const right = factor();
      if (op === "/" && right === 0) {
        throw new Error("0으로 나눌 수 없습니다.");
      }
      result = op === "*" ? result * right : result / right;
    }
    return result;
  }

  // factor := number | '-' factor | '(' expression ')'
  function factor() {
    const token = next();
    if (!token) throw new Error("수식이 완성되지 않았습니다.");

    if (token.type === "number") return token.value;

    if (token.value === "-") return -factor(); // 음수 (예: -3, 2 * -3)
    if (token.value === "+") return factor();

    if (token.value === "(") {
      const result = expression();
      const closing = next();
      if (!closing || closing.value !== ")") {
        throw new Error("괄호가 닫히지 않았습니다.");
      }
      return result;
    }

    throw new Error(`잘못된 위치의 기호입니다: "${token.value}"`);
  }

  const result = expression();
  if (pos < tokens.length) {
    throw new Error(`해석할 수 없는 수식입니다: "${tokens[pos].value}"`);
  }
  return result;
}

// ---------- 실행 예시 (콘솔에 붙여넣으면 바로 결과가 출력됩니다) ----------
const examples = [
  "1 + 2",
  "10 - 3",
  "4 * 5",
  "20 / 4",
  "1 + 2 * 3", // 7  (곱셈 먼저)
  "10 - 4 / 2", // 8  (나눗셈 먼저)
  "2 + 3 * 4 - 6 / 2 + 1", // 12 (긴 수식)
  "100 / 5 / 2 * 3 + 7 - 1", // 36
  "1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10", // 55
  "(1 + 2) * 3", // 9  (괄호)
  "-5 + 10", // 5  (음수)
  "1.5 * 4", // 6  (소수)
];

for (const expr of examples) {
  console.log(`${expr} = ${calc(expr)}`);
}

// 에러 처리 확인
try {
  calc("10 / 0");
} catch (e) {
  console.log("에러:", e.message);
}
