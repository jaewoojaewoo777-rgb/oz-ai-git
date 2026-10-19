// ===============================================
// QuerySelector + EventListener 로 만든 계산기
// ===============================================

// 1. DOM 요소 가져오기 (Selector)
const display = document.querySelector('#display');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const clearButton = document.querySelector('.clear');
const enterButton = document.querySelector('.enter');
const powerButton = document.querySelector('.on-off');
const allButtons = document.querySelectorAll('button');

// 2. 상태 변수
let formula = '';        // 지금까지 입력한 수식 (예: "12 + 3 * 4")
let isPowerOn = true;    // 전원 상태
let isCalculated = false; // 방금 Enter를 눌러 결과가 나온 상태인지

const ERROR_MESSAGES = ['Error', '0으로 나눌 수 없음'];

// 3. 화면 갱신 (화살표 함수)
const updateDisplay = (text) => {
  display.value = text;
};

// 4. 숫자 입력
const appendNumber = (num) => {
  if (!isPowerOn) return;

  // 결과가 나온 직후 숫자를 누르면 새 계산 시작
  if (isCalculated || ERROR_MESSAGES.includes(display.value)) {
    formula = '';
    isCalculated = false;
  }

  // 현재 입력 중인 숫자(마지막 덩어리)에 소수점이 이미 있으면 무시
  const lastNumber = formula.split(' ').pop();
  if (num === '.' && lastNumber.includes('.')) return;

  // 숫자 덩어리가 '.'으로 시작하면 앞에 0 붙이기
  if (num === '.' && lastNumber === '') num = '0.';

  formula += num;
  updateDisplay(formula);
};

// 5. 연산자 입력
const appendOperator = (op) => {
  if (!isPowerOn) return;
  if (ERROR_MESSAGES.includes(display.value)) return;

  isCalculated = false; // 결과값에 이어서 계산 가능
  if (formula === '') formula = '0';

  // 이미 연산자로 끝나 있으면 연산자만 교체 ("3 + " → "3 * ")
  if (formula.endsWith(' ')) {
    formula = formula.slice(0, -3);
  }

  formula += ` ${op} `;
  updateDisplay(formula);
};

// 6. 초기화
const clearAll = () => {
  if (!isPowerOn) return;
  formula = '';
  isCalculated = false;
  updateDisplay('0');
};

// 7. 계산 로직 (eval 없이 곱셈/나눗셈 먼저 처리)
const calculate = (expr) => {
  const tokens = expr.trim().split(' ');
  if (tokens.length % 2 === 0) return 'Error';

  // 1단계: * / 먼저 계산
  const stack = [Number(tokens[0])];
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i];
    const next = Number(tokens[i + 1]);
    if (Number.isNaN(next)) return 'Error';

    if (op === '*') {
      stack.push(stack.pop() * next);
    } else if (op === '/') {
      if (next === 0) return '0으로 나눌 수 없음';
      stack.push(stack.pop() / next);
    } else {
      stack.push(op, next); // + - 는 일단 보관
    }
  }

  // 2단계: + - 계산
  let result = stack[0];
  for (let i = 1; i < stack.length; i += 2) {
    result = stack[i] === '+' ? result + stack[i + 1] : result - stack[i + 1];
  }

  // 0.1 + 0.2 = 0.30000000000000004 같은 부동소수점 오차 정리
  return Number.isNaN(result) ? 'Error' : parseFloat(result.toFixed(10));
};

// 8. 결과 출력 (Enter)
const showResult = () => {
  if (!isPowerOn || formula === '') return;

  // "3 + " 처럼 연산자로 끝나면 마지막 연산자는 버림
  const expr = formula.endsWith(' ') ? formula.slice(0, -3) : formula;
  const result = calculate(expr);

  updateDisplay(result);
  isCalculated = true;
  formula = ERROR_MESSAGES.includes(result) ? '' : String(result);
};

// 9. 전원 ON/OFF
const togglePower = () => {
  isPowerOn = !isPowerOn;
  powerButton.classList.toggle('on', isPowerOn);

  allButtons.forEach((btn) => {
    if (btn !== powerButton) btn.disabled = !isPowerOn;
  });

  formula = '';
  isCalculated = false;
  display.style.backgroundColor = isPowerOn ? '#222' : '#111';
  updateDisplay(isPowerOn ? '0' : '');
};

// ===============================================
// 10. EventListener 등록
// ===============================================

// 클릭 이벤트: 버튼 글자(textContent)를 그대로 값으로 사용
numberButtons.forEach((btn) => {
  btn.addEventListener('click', () => appendNumber(btn.textContent));
});

operatorButtons.forEach((btn) => {
  btn.addEventListener('click', () => appendOperator(btn.textContent));
});

clearButton.addEventListener('click', clearAll);
enterButton.addEventListener('click', showResult);
powerButton.addEventListener('click', togglePower);

// 마우스 감지: 버튼 위에 마우스가 올라가면 테두리 강조
allButtons.forEach((btn) => {
  btn.addEventListener('mouseenter', () => {
    btn.style.outline = '2px solid #f1c40f';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.outline = 'none';
  });
});

// 키보드 이벤트 (보너스): 키보드로도 계산 가능
document.addEventListener('keydown', (event) => {
  const { key } = event;

  if ('0123456789.'.includes(key)) appendNumber(key);
  else if ('+-*/'.includes(key)) appendOperator(key);
  else if (key === 'Enter' || key === '=') {
    event.preventDefault();
    showResult();
  } else if (key === 'Escape' || key === 'Backspace') clearAll();
});

// 처음엔 전원 ON 상태로 표시
powerButton.classList.add('on');
