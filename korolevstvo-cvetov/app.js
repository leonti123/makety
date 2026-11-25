const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];

/* menu */
const nav = $("#nav"), burger = $("#burger");
burger.addEventListener("click", () => { const o = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
nav.addEventListener("click", e => { if (e.target.closest("a")) { nav.classList.remove("open"); burger.setAttribute("aria-expanded", false); } });

const METAL = {gold: ["Золото", "#D9B25C"], silver: ["Серебро", "#C9CDD8"], rose: ["Пудровый", "#E9A5B8"], white: ["Белый", "#F4F1F6"], mix: ["Золото и серебро", "linear-gradient(90deg,#D9B25C 50%,#C9CDD8 50%)"]};

/* catalog */
const CATALOG = [
  {id: "iris", t: "Золотой ирис", m: "gold", img: "img/iris.webp", kind: "Брошь", d: "Тот самый первый цветок, с которого началось королевство. Крупные мягкие лепестки из золотистой ткани, длинный стебель-булавка."},
  {id: "iris-set", t: "Ирисы: золото и графит", m: "gold", img: "img/iris-set.webp", kind: "Броши", d: "Эксперименты в цвете и форме: золотые ирисы и тёмно-серебристые цветы. Можно заказать пару для мамы и дочери или для подруг."},
  {id: "iris-box", t: "Ирис в подарок", m: "gold", img: "img/iris-box.webp", kind: "Подарок", d: "Золотой ирис с фирменной карточкой «Мой ирис создан для вас». Готовый подарок на день рождения или 8 Марта."},
  {id: "lily-gold", t: "Лилия золото и серебро", m: "mix", img: "img/lily-gold.webp", kind: "Брошь", d: "Двухцветная лилия: серебряные лепестки с золотой сердцевиной. Лилия, тотем мастера, крупная и заметная даже на пальто."},
  {id: "lily-silver", t: "Серебряная лилия", m: "silver", img: "img/lily-silver.webp", kind: "Брошь", d: "Пышная лилия в холодном серебре. Хорошо смотрится на чёрном, графитовом и синем."},
  {id: "mama", t: "Золотая лилия для мамы", m: "gold", img: "img/mama.webp", kind: "Брошь", d: "Первое изделие Лилии, которое она подарила маме. Золотой цветок на светлом свитере носится каждый день."},
  {id: "rose", t: "Пудровая брошь с лентами", m: "rose", img: "img/hero.webp", kind: "Брошь", d: "Нежный пудровый цветок с длинными лентами. Освежает тёмное пальто и подходит к весенним образам."},
  {id: "lapel", t: "Золотая брошь на лацкан", m: "gold", img: "img/lapel.webp", kind: "Брошь", d: "Золотая лилия с изогнутым стеблем на лацкане пиджака. Фото Дианы Канзафаровой."},
];
$("#grid").innerHTML = CATALOG.map(x => `
  <button class="card" type="button" data-id="${x.id}">
    <figure><img src="${x.img}" alt="${x.t}" loading="lazy" width="900" height="1200"${x.id === "rose" ? ' style="object-position:62% 38%"' : ""}></figure>
    <h3>${x.t}</h3>
    <p class="meta">${x.kind}, ручная работа</p>
    <p class="pr"><span class="metal" style="--m:${METAL[x.m][1]}">${METAL[x.m][0]}</span><span>Подробнее</span></p>
  </button>`).join("");

function toOrder(text) {
  $("#kind").value = text;
  $("#order").scrollIntoView({behavior: "smooth"});
  setTimeout(() => $('#form [name="name"]').focus({preventScroll: true}), 700);
}
$$("a[data-kind]").forEach(a => a.addEventListener("click", e => { e.preventDefault(); toOrder(a.dataset.kind); }));

const dlg = $("#dlg"); let cur = null;
$("#grid").addEventListener("click", e => {
  const b = e.target.closest(".card"); if (!b) return;
  cur = CATALOG.find(x => x.id === b.dataset.id);
  $("#dImg").src = cur.img; $("#dImg").alt = cur.t;
  $("#dImg").style.objectPosition = cur.id === "rose" ? "62% 38%" : "";
  $("#dTitle").textContent = cur.t;
  $("#dMeta").textContent = cur.kind + ", " + METAL[cur.m][0].toLowerCase();
  $("#dDesc").textContent = cur.d;
  dlg.showModal();
});
$("#dOrder").addEventListener("click", () => { dlg.close(); toOrder("Похожая на «" + cur.t + "»"); });
dlg.addEventListener("click", e => { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });

/* zodiac totems */
const Z = [
  ["Овен", "♈", "21 марта – 19 апреля", "Тюльпан", "gold", 6, 74, 30, "Огненный и смелый: острый золотой тюльпан для того, кто всегда идёт первым."],
  ["Телец", "♉", "20 апреля – 20 мая", "Роза", "rose", 12, 58, 34, "Чувственная пудровая роза для тех, кто ценит красоту и уют."],
  ["Близнецы", "♊", "21 мая – 20 июня", "Нарцисс", "gold", 6, 70, 26, "Лёгкий весенний нарцисс, два оттенка золота для двойственной натуры."],
  ["Рак", "♋", "21 июня – 22 июля", "Водяная лилия", "silver", 10, 66, 26, "Серебряная кувшинка: нежность, дом и лунный свет."],
  ["Лев", "♌", "23 июля – 22 августа", "Подсолнух", "gold", 16, 72, 18, "Самый солнечный цветок королевства, крупный и золотой."],
  ["Дева", "♍", "23 августа – 22 сентября", "Астра", "silver", 18, 62, 14, "Тонкие лепестки астры для внимательной и аккуратной Девы."],
  ["Весы", "♎", "23 сентября – 22 октября", "Гортензия", "rose", 8, 52, 34, "Пышная пудровая гортензия, гармония и равновесие."],
  ["Скорпион", "♏", "23 октября – 21 ноября", "Пион", "rose", 14, 60, 30, "Глубокий пион с загадкой: тёмно-розовые лепестки и золотая сердцевина."],
  ["Стрелец", "♐", "22 ноября – 21 декабря", "Гвоздика", "gold", 14, 64, 22, "Яркая гвоздика для путешественников и оптимистов."],
  ["Козерог", "♑", "22 декабря – 19 января", "Ирис", "silver", 6, 80, 30, "Строгий серебряный ирис, цветок силы и цели."],
  ["Водолей", "♒", "20 января – 18 февраля", "Орхидея", "silver", 5, 76, 40, "Необычная серебряная орхидея для свободных и оригинальных."],
  ["Рыбы", "♓", "19 февраля – 20 марта", "Лотос", "rose", 10, 72, 28, "Лотос в розовом жемчуге, мечтательный и тонкий."],
];
const wheel = $("#wheel"), petals = $("#petals"), dots = $("#dots");
wheel.innerHTML = Z.map((z, i) => {
  const a = (i / 12) * Math.PI * 2 - Math.PI / 2, r = 41.5;
  return `<button class="zs" type="button" role="radio" aria-checked="false" data-i="${i}" style="left:${50 + r * Math.cos(a)}%;top:${50 + r * Math.sin(a)}%"><i>${z[1]}&#xFE0E;</i><span>${z[0]}</span></button>`;
}).join("");
const GRAD = {gold: "url(#gGold)", silver: "url(#gSilver)", rose: "url(#gRose)"};
let rot = 0;
function totem(i) {
  const z = Z[i], [name, , dates, fl, metal, n, len, w, text] = z;
  $$(".zs").forEach(b => b.setAttribute("aria-checked", +b.dataset.i === i));
  let p = "";
  for (let k = 0; k < n; k++) {
    const ang = (360 / n) * k;
    p += `<path d="M0 0 C${w} ${-len * .3} ${w * .8} ${-len * .85} 0 ${-len} C${-w * .8} ${-len * .85} ${-w} ${-len * .3} 0 0Z" fill="${GRAD[metal]}" stroke="rgba(60,40,20,.25)" stroke-width="1" transform="rotate(${ang})"/>`;
  }
  if (n >= 12) for (let k = 0; k < n; k++) {
    const ang = (360 / n) * k + 180 / n;
    p += `<path d="M0 0 C${w * .7} ${-len * .2} ${w * .5} ${-len * .55} 0 ${-len * .62} C${-w * .5} ${-len * .55} ${-w * .7} ${-len * .2} 0 0Z" fill="${GRAD[metal]}" opacity=".9" transform="rotate(${ang})"/>`;
  }
  rot += 40;
  petals.innerHTML = p; petals.style.transform = `rotate(${rot}deg)`;
  dots.innerHTML = Array.from({length: 8}, (_, k) => { const a = k * Math.PI / 4; return `<circle cx="${Math.cos(a) * 20}" cy="${Math.sin(a) * 20}" r="3"/>`; }).join("");
  $("#tDates").textContent = dates;
  $("#tName").textContent = name;
  $("#tFlower").textContent = fl + ", " + METAL[metal][0].toLowerCase();
  $("#tText").textContent = text;
  $("#tOrder").textContent = "Хочу эскиз для знака " + name;
  $("#tOrder").dataset.i = i;
}
wheel.addEventListener("click", e => { const b = e.target.closest(".zs"); if (b) totem(+b.dataset.i); });
wheel.addEventListener("keydown", e => {
  const d = {ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1}[e.key]; if (!d) return;
  e.preventDefault(); const i = (+$('.zs[aria-checked="true"]').dataset.i + d + 12) % 12; totem(i); $(`.zs[data-i="${i}"]`).focus();
});
$("#tOrder").addEventListener("click", e => { const z = Z[+e.currentTarget.dataset.i]; toOrder(`Цветок-тотем: ${z[0]}, ${z[3].toLowerCase()}`); });
const now = new Date(), md = (now.getMonth() + 1) * 100 + now.getDate();
const START = [321, 420, 521, 621, 723, 823, 923, 1023, 1122, 1222, 120, 219];
let si = 9; START.forEach((s, i) => { const e = START[(i + 1) % 12]; if (s < e ? md >= s && md < e : md >= s || md < e) si = i; });
totem(si);

/* floating CTA hides near the form */
const fc = $(".float-cta");
const seen = new Set();
new IntersectionObserver(es => { es.forEach(x => x.isIntersecting ? seen.add(x.target) : seen.delete(x.target)); fc.classList.toggle("hide", seen.size > 0); }, {threshold: .05}).observe($("#order"));
new IntersectionObserver(es => { es.forEach(x => x.isIntersecting ? seen.add(x.target) : seen.delete(x.target)); fc.classList.toggle("hide", seen.size > 0); }).observe($(".hero"));

/* lead form */
const form = $("#form");
const LEAD_URL = "https://script.google.com/macros/s/AKfycby3_mdaCfx-Kv0MWD1RiwXnmTO47GtAS9zrH0WZsPcyeEGYHIRrXQjAU_EtMCfIypOW/exec";
const sent = $("#sent"), failed = $("#failed"), sendBtn = form.querySelector('[type="submit"]');
form.addEventListener("input", e => { if (e.target.setCustomValidity) e.target.setCustomValidity(""); sent.hidden = failed.hidden = true; });
form.addEventListener("submit", async e => {
  e.preventDefault();
  if (sendBtn.disabled) return;
  const f = form.elements;
  if (f.name.value.trim().length < 2) f.name.setCustomValidity("Укажите имя.");
  const digits = f.phone.value.replace(/\D/g, "");
  if (!/^(?:[78]\d{10}|\d{10})$/.test(digits)) f.phone.setCustomValidity("Проверьте номер телефона.");
  if (!form.reportValidity()) return;
  const comment = f.comment.value.trim().replace(/\s*\n\s*/g, "; ");
  const details = ["Макет korolevstvo-cvetov", f.kind.value.trim(), "металл: " + f.metal.value, f.how.value, comment].filter(Boolean).join(", ");
  const payload = {site: location.hostname, name: f.name.value.trim(), phone: f.phone.value.trim(), details, comment, website: f.website.value};
  sendBtn.disabled = true; sendBtn.textContent = "Отправляем…"; sent.hidden = failed.hidden = true;
  try {
    const r = await fetch(LEAD_URL, {method: "POST", headers: {"Content-Type": "text/plain;charset=utf-8"}, body: JSON.stringify(payload), signal: AbortSignal.timeout(20000)});
    if (!r.ok || (await r.json()).ok !== true) throw new Error("lead");
    form.reset(); sent.hidden = false;
  } catch { failed.hidden = false; }
  finally { sendBtn.textContent = "Отправить заявку"; sendBtn.disabled = false; }
});
