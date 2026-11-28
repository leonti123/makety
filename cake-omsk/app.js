const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const PRICE = 1500, WED = 1700;
const fmt = n => n.toLocaleString("ru-RU").replace(/ /g, " ");
const kgTxt = kg => kg.toFixed(3);
const kgRu = kg => String(+kg.toFixed(2)).replace(".", ",");

/* catalog: photo, title, category, weight from her scales (kg), note */
const CAKES = [
  ["k206", "Двухъярусный с бантом", "deti", 5.690, "Розовый торт на первый день рождения, бант из органзы, золотая надпись One"],
  ["k1", "PlayStation для Лео", "muzh", 3.455, "Белый торт с геймпадом и именем, фигурки из мастики"],
  ["k41", "Сакура", "zhen", 2.100, "Мятный крем и цветущие ветки"],
  ["k85", "Гелендваген", "muzh", 5.030, "Фигурный торт в виде машины, от 3,5 кг"],
  ["k164", "Маша и Медведь", "deti", 4.015, "Детский торт с героями мультфильма, шарами и именем"],
  ["k22", "Прямоугольный с ягодами", "yub", 8.825, "Большой торт на компанию, сверху клубника и черника"],
  ["k196", "Лев в шоколаде", "muzh", 3.580, "Шоколадный крем, рисунок льва, золотые шары"],
  ["k142", "Розы и рюши", "zhen", 4.385, "Венок из кремовых роз и рюши по бокам"],
  ["k65", "Роблокс", "deti", 3.065, "Леденцы, фигурки и надпись Roblox"],
  ["k200", "Книга 90 лет", "yub", 4.105, "Торт-книга с фотографией юбиляра"],
  ["k138", "Шанель", "zhen", 3.040, "Розовый с чёрным, бант и сумочка"],
  ["k286", "Инициалы И и Т", "svad", 3.060, "Белые цветы из вафельной бумаги и золотые буквы"],
  ["k135", "Клубника и балерина", "deti", 2.845, "Свежая клубника и рисунок девочки"],
  ["k13", "ДМБ 2026", "muzh", 3.645, "Прямоугольный торт к возвращению из армии"],
  ["k27", "Цифра 30", "yub", 4.445, "Торт-цифра с кремом, ягодами и шоколадом"],
  ["k261", "Человек-паук", "deti", 2.655, "Красная паутина и фигурка героя"],
  ["k101", "Корона", "zhen", 2.495, "Розовые рюши, корона и надпись Happy Birthday"],
  ["k57", "Кто ищет, тот всегда найдёт", "muzh", 3.005, "Зелёный торт с лопатами и шоколадными монетами"],
  ["k149", "Майнкрафт", "deti", 2.560, "Пиксельные фигурки и надпись"],
  ["k45", "Белый с рюшами", "yub", 4.870, "Прямоугольный торт в рюшах из шоколада"],
  ["k132", "BMW", "muzh", 2.685, "Фотопечать с логотипом и машиной"],
  ["k146", "Сиреневый, 29", "zhen", 2.845, "Мраморный крем, меренги и цифры"],
  ["k128", "Тачки, Василию 5 лет", "deti", 4.295, "Прямоугольный торт-цифра с машинками"],
  ["k171", "Золотые инициалы", "svad", 0, "Свадебный торт под мрамор с золотыми буквами"],
  ["k233", "Анечка", "deti", 3.540, "Мишка, бантики и пинетки на первый день рождения"],
  ["k95", "Лев и доллары, 18 лет", "muzh", 3.105, "Рисунок льва, купюры и золотая цифра"],
  ["k217", "Книга 65 лет", "yub", 4.875, "Открытая книга с ягодами и шоколадным узором"],
  ["k39", "Кремовые розы", "zhen", 3.070, "Венок из кремовых роз по краю"],
  ["k184", "Майнкрафт квадратный", "deti", 3.735, "Торт из пиксельных квадратов с героями игры"],
  ["k157", "Лучшему шефу", "muzh", 3.130, "Торт-китель с поварским колпаком"],
  ["k80", "Два торта с эмблемой", "yub", 8.075, "Прямоугольные торты с фотопечатью и ягодами"],
  ["k249", "Принцесса", "deti", 3.690, "Розово-сиреневый торт с пряниками-принцессами"],
  ["k245", "Сердечки", "zhen", 3.750, "Шоколадные сердца и рисунок девушки"],
  ["k252", "Чёрный с золотом", "muzh", 3.520, "Чёрный крем, золото и фото именинника"],
  ["k290", "Мороженое, Ксюше 7 лет", "deti", 3.135, "Меренги, рожок и подтёки"],
  ["k70", "50 белых роз", "yub", 3.650, "Белые розы из мастики и золотая цифра"],
  ["k278", "Белые цветы", "zhen", 2.925, "Белый торт с цветами и золотой табличкой"],
  ["k154", "Дорожные знаки", "deti", 2.276, "Светофор, знаки и машины"],
  ["k238", "Любимому папе", "muzh", 0, "Белый торт с фруктами и шоколадными шарами"],
  ["k77", "Леденцы и фотопечать", "yub", 3.175, "Голубой торт с леденцами и картинками"],
  ["k281", "Человек-паук с леденцами", "deti", 3.170, "Рисунок героя и леденцы"],
  ["k265", "Маме с ягодами", "zhen", 0, "Ягодный ободок и табличка с надписью"],
  ["k292", "Футбол", "deti", 3.705, "Мяч, футболка с номером и трава из крема"],
  ["k241", "Книга настоящего мужчины", "muzh", 0, "Торт-книга с надписью на обложке"],
  ["k61", "Роблокс прямоугольный", "deti", 5.265, "Большой торт с героями игры"],
  ["k273", "Фотопечать", "yub", 0, "Белый торт с фотографией и сердечками"],
  ["k167", "Красные банты", "zhen", 0, "Кремовые рюши и красные ленты"],
  ["k268", "Зайка, 2 года", "deti", 2.955, "Бело-розовый торт с зайкой"],
  ["k276", "Космос", "deti", 0, "Ракета, планеты и пряники"],
  ["k259", "Минни", "deti", 2.750, "Розовые мазки и пряник Минни"],
  ["k255", "Агата", "deti", 3.660, "Пряники с датой рождения и сердце с именем"],
  ["k73", "Пуговки", "deti", 2.520, "Голубой крем, пуговицы и шоколадки"],
  ["k294", "Клубника и шоколад", "deti", 0, "Половина шоколадная, половина белая, свежая клубника"],
  ["k11", "Хот Вилс, 5 лет", "deti", 0, "Красный торт с машинками и огнём"],
  ["k26", "Розовый с шарами", "deti", 0, "Розовые шары и фигурка девочки"],
  ["k16", "Книга 65 лет, новая", "yub", 0, "Торт-книга с клубникой и малиной"],
];
const CAT_NAMES = {deti: "Детский", muzh: "Мужчине", zhen: "Девушке или маме", yub: "Юбилей, на компанию", svad: "Свадебный"};
const priceOf = c => c[3] ? Math.round(c[3] * (c[2] === "svad" ? WED : PRICE) / 10) * 10 : 0;

const grid = $("#grid"), moreBtn = $("#more");
let cat = "all", shown = 12;
function card(c, i) {
  const p = priceOf(c);
  return `<article class="card" tabindex="0" data-i="${i}" aria-label="${c[1]}">
    <div class="ph"><img src="img/${c[0]}.jpg" alt="${c[1]}" width="720" height="900" loading="lazy">
    ${c[3] ? `<span class="kg"><b>${kgTxt(c[3])}</b><span>кг</span></span>` : ""}</div>
    <div class="cb"><h3>${c[1]}</h3>
    <p class="pr">${p ? `${fmt(p)} ₽ за вес<small>+ оформление</small>` : `Цена по весу<small>${c[2] === "svad" ? "1 700" : "1 500"} ₽ за кг + оформление</small>`}</p></div></article>`;
}
function render() {
  const list = CAKES.map((c, i) => [c, i]).filter(([c]) => cat === "all" || c[2] === cat);
  grid.innerHTML = list.slice(0, shown).map(([c, i]) => card(c, i)).join("");
  moreBtn.parentElement.hidden = list.length <= shown;
}
$$(".f").forEach(b => b.addEventListener("click", () => {
  $$(".f").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-selected", x === b); });
  cat = b.dataset.cat; shown = 12; render();
}));
moreBtn.addEventListener("click", () => { shown += 12; render(); });
render();

/* dialog */
const dlg = $("#dlg");
function openCake(i) {
  const c = CAKES[i], p = priceOf(c);
  $("#dImg").src = `img/${c[0]}.jpg`; $("#dImg").alt = c[1];
  $("#dTitle").textContent = c[1];
  $("#dLcd").innerHTML = c[3]
    ? `<div><span>вес (кг)</span><b>${kgTxt(c[3])}</b></div><div><span>руб/кг</span><b>${c[2] === "svad" ? WED : PRICE}</b></div><div><span>итог (руб)</span><b>${p}</b></div>`
    : `<div><span>руб/кг</span><b>${c[2] === "svad" ? WED : PRICE}</b></div>`;
  $("#dText").textContent = `${c[4]}. ${CAT_NAMES[c[2]]} торт. ${p ? `Вес на фото ${kgRu(c[3])} кг, за вес ${fmt(p)} ₽, оформление считаю отдельно.` : "Вес подберём под ваших гостей, оформление считаю отдельно."}`;
  $("#dOrder").dataset.kind = `Как «${c[1]}»${c[3] ? `, ${kgRu(c[3])} кг` : ""}`;
  dlg.showModal();
}
grid.addEventListener("click", e => { const c = e.target.closest(".card"); if (c) openCake(+c.dataset.i); });
grid.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { const c = e.target.closest(".card"); if (c) { e.preventDefault(); openCake(+c.dataset.i); } } });
$("#dlgX").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

/* prefill order kind from any button with data-kind */
const form = $("#form");
document.addEventListener("click", e => {
  const a = e.target.closest("[data-kind]");
  if (!a) return;
  form.elements.kind.value = a.dataset.kind;
  if (dlg.open) dlg.close();
});

/* scales calculator */
const MIN = {round: 2, rect: 2, fig: 3.5, t2: 4.5, t3: 9};
const NOTE = {
  round: "На гостя кладу около 150 граммов. Меньше 2 кг торты не пеку.",
  rect: "Прямоугольный удобно резать на большую компанию. Минимум 2 кг.",
  fig: "Машинки, корабли и другие фигурные торты от 3,5 кг.",
  t2: "Двухъярусные торты от 4,5 кг, отдаю на подставке.",
  t3: "Трёхъярусные торты от 9 кг, отдаю на подставке.",
};
const g = $("#guests"), gOut = $("#gOut"), wed = $("#wed");
function calc() {
  const n = +g.value, shape = $('input[name="shape"]:checked').value;
  const kg = Math.max(MIN[shape], Math.ceil(n * 0.15 * 10) / 10);
  const per = wed.checked ? WED : PRICE, total = Math.round(kg * per);
  gOut.textContent = n;
  $("#dW").textContent = kgTxt(kg); $("#dP").textContent = per; $("#dT").textContent = total;
  $("#calcNote").textContent = NOTE[shape] + (kg > n * 0.15 + 0.05 ? ` Для ${n} гостей этого веса хватит с запасом.` : "");
  const ord = $("#calcOrder");
  ord.textContent = `Заказать торт на ${kgRu(kg)} кг`;
  ord.dataset.kind = `${wed.checked ? "Свадебный" : "Торт"}, ${kgRu(kg)} кг, ${n} гостей, ${{round: "круглый", rect: "прямоугольный", fig: "фигурный", t2: "2 яруса", t3: "3 яруса"}[shape]}, около ${fmt(total)} ₽ без оформления`;
  const pool = CAKES.map((c, i) => [c, i]).filter(([c]) => c[3] && (shape !== "t2" && shape !== "t3" || c[3] > 4.4) && (!wed.checked || c[2] === "svad" || c[2] === "yub"));
  const near = pool.sort((a, b) => Math.abs(a[0][3] - kg) - Math.abs(b[0][3] - kg)).slice(0, 3);
  $("#likeRow").innerHTML = near.map(([c, i]) => `<button type="button" data-i="${i}"><img src="img/${c[0]}.jpg" alt="" width="96" height="96" loading="lazy">${c[1]}<br>${kgRu(c[3])} кг</button>`).join("");
  if (near[0]) { const im = $("#panImg"); if (!im.src.endsWith(near[0][0][0] + ".jpg")) { im.style.opacity = .2; setTimeout(() => { im.src = `img/${near[0][0][0]}.jpg`; im.alt = near[0][0][1]; im.style.opacity = 1; }, 160); } }
}
[g, wed, ...$$('input[name="shape"]')].forEach(el => el.addEventListener("input", calc));
$("#likeRow").addEventListener("click", e => { const b = e.target.closest("button"); if (b) openCake(+b.dataset.i); });
calc();

/* fillings: layers top to bottom [colour, thickness] */
const S = "#f6dfa8", C = "#6b3a2a", W = "#fffaf2", Y = "#fbe9c6";
const FILLS = [
  ["Йогуртовый с ягодами", "Ванильный или шоколадный бисквит, йогуртовый или творожный крем, ягоды или фрукты", [[S, 2], [W, 1.2], ["#e23b5a", .6], [S, 2], [W, 1.2], [S, 2]]],
  ["Панчо", "Бисквит, сметанный крем, ананас и грецкий орех", [[C, 1.6], [W, 1], ["#ffd35a", .6], [S, 1.6], [W, 1], ["#a0734a", .5], [C, 1.6]]],
  ["Шоколадный", "Шоколадный бисквит и шоколадный крем", [[C, 2], ["#8a4f36", 1], [C, 2], ["#8a4f36", 1], [C, 2]]],
  ["Медовый", "Медовые коржи с грецкими орехами и варёной сгущёнкой", [["#d69a4e", 1.4], ["#c58a50", .7], ["#d69a4e", 1.4], ["#c58a50", .7], ["#d69a4e", 1.4], ["#c58a50", .7], ["#d69a4e", 1.4]]],
  ["Сникерс", "Бисквит, крем из варёной сгущёнки с арахисом, взбитые сливки", [[C, 1.8], ["#b97a3e", 1], ["#e0b27a", .5], [W, 1], [C, 1.8]]],
  ["Баунти", "Бисквит, крем из белого шоколада, кокосовой стружки и миндальной муки", [[C, 1.8], [W, 1.4], [C, 1.8], [W, 1.4], [C, 1.8]]],
  ["С черносливом и курагой", "Бисквит, сливочный крем со сгущёнкой, чернослив, курага, грецкий орех", [[S, 1.8], [Y, 1], ["#4a2433", .5], ["#f59b3a", .5], [S, 1.8], [Y, 1], [S, 1.8]]],
  ["Молочная девочка", "Нежные ванильные коржи, сырный крем с ягодами или фруктами", [[Y, 1], [W, .8], [Y, 1], [W, .8], ["#e23b5a", .4], [Y, 1], [W, .8], [Y, 1]]],
  ["Красный бархат", "Красные коржи, крем чиз, ягоды или фрукты", [["#b3122e", 2], [W, 1.2], ["#b3122e", 2], [W, 1.2], ["#b3122e", 2]]],
  ["Бисквит с кремом чиз", "Ванильный или шоколадный бисквит, сырный крем, фрукты или ягоды", [[S, 2], [W, 1.2], ["#7a3fb0", .5], [C, 2], [W, 1.2], [S, 2]]],
];
$("#fills").innerHTML = FILLS.map(f => `<article class="fill"><div class="slice" aria-hidden="true">${f[2].map(l => `<i style="background:${l[0]};--h:${l[1]}"></i>`).join("")}</div><h3>${f[0]}</h3><p>${f[1]}</p></article>`).join("");

/* bento strip */
$("#bentoStrip").innerHTML = ["b7", "b8", "b9", "b18", "b20", "b21", "b92", "b104"].map(n => `<img src="img/${n}.jpg" alt="Бенто-торт" width="720" height="900" loading="lazy">`).join("");

/* floating CTA hides near hero and form */
const fc = $(".float-cta"), seen = new Set();
const io = new IntersectionObserver(es => { es.forEach(x => x.isIntersecting ? seen.add(x.target) : seen.delete(x.target)); fc.classList.toggle("hide", seen.size > 0); }, {threshold: .05});
io.observe($("#zakaz")); io.observe($(".hero")); io.observe($(".foot"));

/* lead form */
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
  const details = ["Макет cake-omsk", f.kind.value.trim(), f.when.value.trim() && "когда: " + f.when.value.trim(), f.how.value, comment].filter(Boolean).join(", ");
  const payload = {site: location.hostname, name: f.name.value.trim(), phone: f.phone.value.trim(), details, comment, website: f.website.value};
  sendBtn.disabled = true; sendBtn.textContent = "Отправляем…"; sent.hidden = failed.hidden = true;
  try {
    const r = await fetch(LEAD_URL, {method: "POST", headers: {"Content-Type": "text/plain;charset=utf-8"}, body: JSON.stringify(payload), signal: AbortSignal.timeout(20000)});
    if (!r.ok || (await r.json()).ok !== true) throw new Error("lead");
    form.reset(); sent.hidden = false;
  } catch { failed.hidden = false; }
  finally { sendBtn.textContent = "Отправить заявку"; sendBtn.disabled = false; }
});
