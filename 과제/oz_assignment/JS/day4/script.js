const API_URL = "https://api4.binance.com/api/v3/ticker/24hr";
const FAV_KEY = "crypto-favorites";

const listEl = document.getElementById("list");
const searchEl = document.getElementById("search");
const statusEl = document.getElementById("status");
const emptyEl = document.getElementById("empty");
const favCountEl = document.getElementById("favCount");
const tabButtons = document.querySelectorAll(".tab");

let coins = new Map();      // symbol -> { price, change, volume }
let favorites = loadFavorites();
let currentTab = "all";
let keyword = "";
const rows = new Map();     // symbol -> <tr> (재사용하여 깜빡임 방지)

/* ---------- LocalStorage ---------- */
function loadFavorites() {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAV_KEY)) || []);
  } catch {
    return new Set();
  }
}
function saveFavorites() {
  localStorage.setItem(FAV_KEY, JSON.stringify([...favorites]));
}

/* ---------- 데이터 가져오기 (매초) ---------- */
let fetching = false;
async function fetchPrices() {
  if (fetching) return; // 응답이 1초 넘게 걸리면 중복 요청 방지
  fetching = true;
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    for (const t of data) {
      if (!t.symbol.endsWith("USDT")) continue; // USDT 항목만
      const prev = coins.get(t.symbol);
      const price = parseFloat(t.lastPrice);
      coins.set(t.symbol, {
        price,
        prevPrice: prev ? prev.price : price,
        change: parseFloat(t.priceChangePercent),
        volume: parseFloat(t.quoteVolume),
      });
    }
    statusEl.textContent = "실시간 업데이트 중 · " + new Date().toLocaleTimeString("ko-KR");
    statusEl.classList.remove("error");
    render();
  } catch (err) {
    statusEl.textContent = "데이터를 불러오지 못했습니다. 재시도 중... (" + err.message + ")";
    statusEl.classList.add("error");
  } finally {
    fetching = false;
  }
}

/* ---------- 렌더링 ---------- */
function formatPrice(p) {
  if (p >= 1000) return p.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (p >= 1) return p.toFixed(4);
  return p.toFixed(8);
}
function formatVolume(v) {
  if (v >= 1e9) return (v / 1e9).toFixed(2) + "B";
  if (v >= 1e6) return (v / 1e6).toFixed(2) + "M";
  return (v / 1e3).toFixed(1) + "K";
}

function createRow(symbol) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td class="star-col"><button class="star" title="관심항목">★</button></td>
    <td class="symbol"></td>
    <td class="num price"></td>
    <td class="num change"></td>
    <td class="num hide-sm volume"></td>`;
  tr.querySelector(".star").addEventListener("click", () => toggleFavorite(symbol));
  return tr;
}

function render() {
  const kw = keyword.trim().toUpperCase();

  const visible = [...coins.entries()]
    .filter(([sym]) => (currentTab === "fav" ? favorites.has(sym) : true))
    .filter(([sym]) => sym.includes(kw))
    .sort((a, b) => b[1].volume - a[1].volume); // 거래대금 순

  favCountEl.textContent = favorites.size;

  const frag = document.createDocumentFragment();
  for (const [symbol, c] of visible) {
    let tr = rows.get(symbol);
    if (!tr) {
      tr = createRow(symbol);
      rows.set(symbol, tr);
    }
    const base = symbol.replace(/USDT$/, "");
    tr.querySelector(".symbol").innerHTML = `${base}<small>/USDT</small>`;

    const priceTd = tr.querySelector(".price");
    priceTd.textContent = formatPrice(c.price);
    if (c.price !== c.prevPrice) {
      const cls = c.price > c.prevPrice ? "flash-up" : "flash-down";
      priceTd.classList.remove("flash-up", "flash-down");
      void priceTd.offsetWidth; // 애니메이션 재시작
      priceTd.classList.add(cls);
    }

    const changeTd = tr.querySelector(".change");
    changeTd.textContent = (c.change > 0 ? "+" : "") + c.change.toFixed(2) + "%";
    changeTd.className = "num change " + (c.change >= 0 ? "up" : "down");

    tr.querySelector(".volume").textContent = formatVolume(c.volume);
    tr.querySelector(".star").classList.toggle("on", favorites.has(symbol));
    frag.appendChild(tr);
  }
  listEl.replaceChildren(frag);

  if (visible.length === 0 && coins.size > 0) {
    emptyEl.hidden = false;
    emptyEl.textContent =
      currentTab === "fav" && favorites.size === 0
        ? "★를 눌러 관심항목을 추가해보세요."
        : "검색 결과가 없습니다.";
  } else {
    emptyEl.hidden = true;
  }
}

/* ---------- 이벤트 ---------- */
function toggleFavorite(symbol) {
  favorites.has(symbol) ? favorites.delete(symbol) : favorites.add(symbol);
  saveFavorites();
  render();
}

searchEl.addEventListener("input", (e) => {
  keyword = e.target.value;
  render();
});

tabButtons.forEach((btn) =>
  btn.addEventListener("click", () => {
    currentTab = btn.dataset.tab;
    tabButtons.forEach((b) => b.classList.toggle("active", b === btn));
    render();
  })
);

/* ---------- 시작 ---------- */
fetchPrices();
setInterval(fetchPrices, 1000);
