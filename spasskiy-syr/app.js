const $ = s => document.querySelector(s);
const CHEESE = [
  {id:"feta", f:"oil", t:"Фета в масле", p:300, u:"баночка 200 г", tag:"В Булгарочке", img:["feta-pine","feta-stack","feta-jars"], occ:"salad",
   d:"Кубики феты в масле с травами. Солёная и нежная, в баночке много сыра, хватит не на один раз. Масло потом идёт в заправку салата.", pair:"Греческий салат, салат с черри и травами, пита, выпечка с сыром."},
  {id:"feta150", f:"oil", t:"Фета, малая баночка", p:225, u:"баночка 150 г", img:["feta-150","feta-shop"], occ:"salad",
   d:"Та же фета в масле с травами в баночке поменьше. Удобно взять на пробу.", pair:"Салаты, закуски, горячие блюда."},
  {id:"shevr", f:"oil", t:"Шевр в масле", p:400, u:"баночка", tag:"В Булгарочке", img:["shevr-jars","shevr-jars2","shevr-ball"], occ:"wine",
   d:"Мягкий сливочный сыр из коровьего молока. Шарики в обсыпке из лимонного перца, паприки, хмели-сунели или карри, залиты маслом.", pair:"Хрустящий багет к утреннему кофе, брускетты, салаты."},
  {id:"belper", f:"aged", t:"Белпер Кнолле", p:200, u:"шарик", tag:"Новая партия зреет", img:["belper","belper-cut","pyramid"], occ:"wine",
   d:"Твёрдый швейцарский сыр в обсыпке из чёрного перца. Пикантный, островатый, с цитрусовой кислинкой. Выдерживаем минимум месяц, молодой не продаём.", pair:"Вино и сырная тарелка. Шарик не режут, а раскалывают."},
  {id:"uzelki", f:"stretch", t:"Узелки", u:"", tag:"В Булгарочке", img:["uzelki"], occ:"beer",
   d:"Вытяжной сыр, завязанный узелками и щедро приправленный хмели-сунели. Тягучий, ароматный, в специях.", pair:"Закуска к пиву и вину."},
  {id:"kachok", f:"stretch", t:"Качокавалло", u:"", tag:"Новинка", img:["kachok"], occ:"wine",
   d:"Итальянский вытяжной сыр с характером: плотный, с лёгким дымком. Рецепт отрабатывали всю осень, теперь он в продаже.", pair:"Отлично плавится: гриль, горячие бутерброды, сырная тарелка к вину."},
  {id:"mozz", f:"stretch", t:"Моцарелла", u:"варим под заказ", tag:"Свежая партия", art:true, occ:"salad",
   d:"Молодой вытяжной сыр. Варим к определённому дню, о свежей партии пишем в группе.", pair:"Капрезе, пицца, запеканки."},
  {id:"chechil", f:"stretch", t:"Чечил", p:130, u:"за 100 г", img:["chechil"], occ:"beer",
   d:"Молодой вытяжной сыр. Покупатели говорят, что он на все случаи жизни: хоть к вину, хоть к бутерброду, а кто-то ест его как семечки.", pair:"Пиво, перекус, бутерброды."},
  {id:"brynza", f:"young", t:"Брынза", p:140, u:"за 100 г", art:true, occ:"salad",
   d:"Солёный рассольный сыр с нежной, рыхловатой текстурой.", pair:"Мясо и рыба, овощные блюда, начинка для пирогов и вареников."},
  {id:"adyg", f:"young", t:"Адыгейский", p:135, u:"за 100 г", tag:"Под заказ", img:["adyg"], occ:"salad",
   d:"Нежный ароматный домашний сыр. Варим в назначенный день по предварительным заказам.", pair:"Завтрак, сырники, жарка на сковороде."},
  {id:"yog", f:"yog", t:"Йогурт с чиа и персиковым джемом", p:180, u:"баночка 200 г", tag:"Небольшие партии", img:["yog","yog2"], occ:"salad", noboard:true,
   d:"Термостатный домашний йогурт с семенами чиа и персиковым джемом.", pair:"Завтрак или перекус."},
];
const OCC = {wine:"к вину", beer:"к пиву", salad:"к салату и закускам"};
const rub = n => n.toLocaleString("ru-RU") + " ₽";
const price = c => c.p ? rub(c.p) : "Цена по запросу";
const art = t => `<div class="art"><svg viewBox="0 0 120 90" aria-hidden="true"><path d="M10 62 60 22l50 40v14H10z"/><path d="M10 62h100"/><circle cx="40" cy="70" r="4"/><circle cx="74" cy="68" r="6"/><circle cx="58" cy="48" r="4"/><circle cx="92" cy="71" r="3"/></svg><span>${t}</span></div>`;
const pic = (c, cls = "") => c.art ? art(c.t) : `<img class="${cls}" src="img/${c.img[0]}.webp" alt="${c.t}" loading="lazy">`;

/* catalog */
const grid = $("#grid");
grid.innerHTML = CHEESE.map(c => `
  <article class="card" data-f="${c.f}" data-id="${c.id}" tabindex="0">
    <div class="card-pic">${pic(c)}${c.tag ? `<span class="badge">${c.tag}</span>` : ""}</div>
    <h3>${c.t}</h3>
    <p class="card-p${c.p ? "" : " ask"}"><b>${price(c)}</b>${c.u ? `<span>${c.u}</span>` : ""}</p>
    <button class="card-btn">Подробнее</button>
  </article>`).join("") + `<a class="card card-cta" href="#board" data-f="all"><span class="cta-board" aria-hidden="true"></span><h3>Не знаете, что выбрать?</h3><p>Соберите сырную тарелку из нескольких сортов, а Александр подскажет по вкусу.</p><b>Собрать тарелку</b></a>`;
document.querySelectorAll(".filters button").forEach(b => b.addEventListener("click", () => {
  document.querySelectorAll(".filters button").forEach(x => x.classList.toggle("on", x === b));
  grid.querySelectorAll(".card").forEach(c => c.hidden = b.dataset.f !== "all" && c.dataset.f !== b.dataset.f && c.dataset.f !== "all");
}));

/* item dialog */
const dlg = $("#dlg"); let cur = null;
function openItem(id) {
  cur = CHEESE.find(c => c.id === id);
  $("#dlgT").textContent = cur.t; $("#dlgD").textContent = cur.d;
  $("#dlgP").innerHTML = `<b>${price(cur)}</b> ${cur.u}`;
  $("#dlgPair").innerHTML = `<b>С чем подавать.</b> ${cur.pair}`;
  $("#dlgTag").textContent = cur.tag || ""; $("#dlgTag").hidden = !cur.tag;
  $("#dlgP").innerHTML = cur.p ? `<b>${rub(cur.p)}</b> ${cur.u}` : `<b class="ask">Цена по запросу</b> ${cur.u}`;
  $("#dlgBoard").hidden = !!cur.noboard;
  const im = $("#dlgImg"), th = $("#dlgThumbs");
  if (cur.art) { im.hidden = true; th.innerHTML = art(cur.t); }
  else {
    im.hidden = false; im.src = `img/${cur.img[0]}.webp`; im.alt = cur.t;
    th.innerHTML = cur.img.length > 1 ? cur.img.map((s, i) => `<button class="${i ? "" : "on"}" data-s="${s}"><img src="img/${s}.webp" alt=""></button>`).join("") : "";
  }
  dlg.showModal();
}
grid.addEventListener("click", e => { const c = e.target.closest(".card"); if (c && c.dataset.id) openItem(c.dataset.id); });
grid.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.classList.contains("card")) openItem(e.target.dataset.id); });
$("#dlgThumbs").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  $("#dlgImg").src = `img/${b.dataset.s}.webp`;
  $("#dlgThumbs").querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b));
});
$("#dlgX").onclick = () => dlg.close();
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
$("#dlgOrder").onclick = () => { dlg.close(); want([cur.t]); };
$("#dlgBoard").onclick = () => { dlg.close(); add(cur.id); $("#board").scrollIntoView({behavior: "smooth"}); };

/* cheese board builder */
const BOARD = CHEESE.filter(c => !c.noboard && c.id !== "feta150");
const pick = $("#pick"), slots = [...document.querySelectorAll(".slot")];
let on = ["shevr", "belper", "uzelki"];
pick.innerHTML = BOARD.map(c => `<button data-id="${c.id}" aria-pressed="false">${c.t}<small>${c.p ? rub(c.p) : "цена по запросу"}</small></button>`).join("");
pick.addEventListener("click", e => { const b = e.target.closest("button"); if (b) toggle(b.dataset.id); });
function toggle(id) { on.includes(id) ? on = on.filter(x => x !== id) : add(id, true); render(); }
function add(id, noRender) { if (!on.includes(id) && on.length < 5) on.push(id); if (!noRender) render(); }
function render() {
  const sel = on.map(id => CHEESE.find(c => c.id === id));
  slots.forEach((s, i) => {
    const c = sel[i];
    s.innerHTML = c ? `${c.art ? `<span class="slot-art">${c.t}</span>` : `<img src="img/${c.img[0]}.webp" alt="">`}<em>${c.t}</em>` : "";
    s.classList.toggle("full", !!c);
  });
  pick.querySelectorAll("button").forEach(b => {
    const a = on.includes(b.dataset.id); b.setAttribute("aria-pressed", a); b.disabled = !a && on.length >= 5;
  });
  const sum = sel.reduce((s, c) => s + (c.p || 0), 0), unknown = sel.filter(c => !c.p);
  $("#total").textContent = (unknown.length ? "от " : "") + rub(sum);
  $("#note").textContent = unknown.length ? `Цену на ${unknown.map(c => c.t.toLowerCase()).join(", ")} подскажет Александр.` : sel.length ? "Сумма за одну баночку, шарик или 100 г каждого сыра." : "";
  const cnt = {}; sel.forEach(c => cnt[c.occ] = (cnt[c.occ] || 0) + 1);
  const best = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0];
  $("#occasion").textContent = sel.length ? `${sel.length} из 5, тарелка ${OCC[best]}` : "Добавьте первый сыр на доску";
  $(".plank-cap").textContent = sel.length ? sel.map(c => c.t).join(", ") : "Доска пока пустая";
  $("#boardOrder").disabled = $("#boardClear").disabled = !sel.length;
}
$("#boardClear").onclick = () => { on = []; render(); };
$("#boardOrder").onclick = () => want(on.map(id => CHEESE.find(c => c.id === id).t), "Сырная тарелка");
render();

/* gallery */
const GAL = ["board","pyramid","feta-stack","shevr-jars2","uzelki","kachok","balls","feta-cubes","belper","young","salad","feta-jars","adyg","yog2","stickers","shevr-ball","feta-150","feta-shop"];
const gal = $("#gal"); const galStep = window.innerWidth < 700 ? 6 : 10; let galN = galStep;
function galRender() {
  gal.innerHTML = GAL.slice(0, galN).map(s => `<button data-src="img/${s}.webp"><img src="img/${s}.webp" alt="Фото сыроварни" loading="lazy"></button>`).join("");
  $("#galMore").hidden = galN >= GAL.length;
}
$("#galMore").onclick = () => { galN += galStep; galRender(); };
galRender();
const lb = $("#lb");
gal.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; $("#lbImg").src = b.dataset.src; lb.showModal(); });
lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });

/* form */
const form = $("#form"), tags = $("#wantTags");
const NAMES = ["Фета","Шевр","Белпер Кнолле","Узелки","Качокавалло","Моцарелла","Чечил","Брынза","Адыгейский","Йогурт","Сырная тарелка"];
tags.innerHTML = NAMES.map(n => `<label class="tag"><input type="checkbox" name="want" value="${n}"><span>${n}</span></label>`).join("");
function want(list, extra) {
  const names = list.map(t => NAMES.find(n => t.startsWith(n)) || t);
  if (extra) names.push(extra);
  form.querySelectorAll('[name="want"]').forEach(i => i.checked = names.includes(i.value));
  if (extra) form.elements.comment.value = "Тарелка: " + list.join(", ");
  $("#order").scrollIntoView({behavior: "smooth"});
}
document.querySelectorAll("[data-want]").forEach(a => a.addEventListener("click", () => setTimeout(() => want([a.dataset.want]), 0)));
form.elements.when.min = new Date().toISOString().slice(0, 10);
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
  const kinds = [...form.querySelectorAll('[name="want"]:checked')].map(i => i.value).join(", ");
  const when = f.when.value ? "К " + f.when.value.split("-").reverse().join(".") : "";
  const details = ["Макет spasskiy-syr", kinds, f.how.value, when, comment].filter(Boolean).join(", ");
  const payload = {site: location.hostname, name: f.name.value.trim(), phone: f.phone.value.trim(), details, comment, website: f.website.value};
  sendBtn.disabled = true; sendBtn.textContent = "Отправляем…"; sent.hidden = failed.hidden = true;
  try {
    const r = await fetch(LEAD_URL, {method: "POST", headers: {"Content-Type": "text/plain;charset=utf-8"}, body: JSON.stringify(payload), signal: AbortSignal.timeout(20000)});
    if (!r.ok || (await r.json()).ok !== true) throw new Error("lead");
    form.reset(); sent.hidden = false;
  } catch { failed.hidden = false; }
  finally { sendBtn.textContent = "Отправить заявку"; sendBtn.disabled = false; }
});
