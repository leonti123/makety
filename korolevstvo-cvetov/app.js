const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];

/* menu */
const nav = $("#nav"), burger = $("#burger");
burger.addEventListener("click", () => { const o = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
nav.addEventListener("click", e => { if (e.target.closest("a")) { nav.classList.remove("open"); burger.setAttribute("aria-expanded", false); } });

const METAL = {gold: ["Золото", "#D9B25C"], silver: ["Серебро", "#C9CDD8"], mix: ["Золото и серебро", "linear-gradient(90deg,#D9B25C 50%,#C9CDD8 50%)"]};

/* catalog */
const CATALOG = [
  {id: "iris", t: "Золотой ирис", m: "gold", img: "img/iris.webp", kind: "Брошь", d: "Тот самый первый цветок, с которого началось королевство. Крупные мягкие лепестки из золотистой ткани, длинный стебель-булавка."},
  {id: "iris-set", t: "Ирисы: золото и серебро", m: "mix", img: "img/iris-set.webp", kind: "Броши", d: "Эксперименты в цвете и форме: золотые и серебряные ирисы. Можно заказать пару для мамы и дочери или для подруг."},
  {id: "iris-box", t: "Ирис в подарок", m: "gold", img: "img/iris-box.webp", kind: "Подарок", d: "Золотой ирис с фирменной карточкой «Мой ирис создан для вас». Готовый подарок на день рождения или 8 Марта."},
  {id: "lily-gold", t: "Лилия золото и серебро", m: "mix", img: "img/lily-gold.webp", kind: "Брошь", d: "Двухцветная лилия: серебряные лепестки с золотой сердцевиной. Лилия, тотем мастера, крупная и заметная даже на пальто."},
  {id: "lily-silver", t: "Серебряная лилия", m: "silver", img: "img/lily-silver.webp", kind: "Брошь", d: "Пышная лилия в холодном серебре. Хорошо смотрится на чёрном, сером и синем."},
  {id: "mama", t: "Золотая лилия для мамы", m: "gold", img: "img/mama.webp", kind: "Брошь", d: "Первое изделие Лилии, которое она подарила маме. Золотой цветок на светлом свитере носится каждый день."},
  {id: "first", t: "Золотая лилия, первый заказ", m: "gold", img: "img/first-order.webp", kind: "Брошь", d: "Первая заказчица поверила в Лилию ещё до того, как цветок появился. Золотая лилия на блузе и фирменная коробка AGZAMOVA."},
  {id: "pom", t: "Пышный золотой цветок", m: "gold", img: "img/gold-pom.webp", kind: "Брошь", d: "Крупный цветок с множеством волнистых лепестков. Смотрится как украшение для вечернего платья или шляпы."},
  {id: "lapel", t: "Золотая брошь на лацкан", m: "gold", img: "img/lapel.webp", kind: "Брошь", d: "Золотая лилия с изогнутым стеблем на лацкане пиджака. Фото Дианы Канзафаровой."},
];
$("#grid").innerHTML = CATALOG.map(x => `
  <button class="card" type="button" data-id="${x.id}">
    <figure><img src="${x.img}" alt="${x.t}" loading="lazy" width="900" height="1200"></figure>
    <h3>${x.t}</h3>
    <p class="meta">${x.kind}, ручная работа</p>
    <p class="pr"><span class="metal" style="--m:${METAL[x.m][1]}">${METAL[x.m][0]}</span><span>Подробнее</span></p>
  </button>`).join("") + `
  <a class="card card-cta" href="#podbor"><svg aria-hidden="true"><use href="#crown"/></svg><h3>Не нашли свою брошь?</h3><p>Соберите цветок, металл и повод, Лилия сделает брошь в единственном экземпляре</p><span class="btn btn-gold">Собрать брошь</span></a>`;

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
  $("#dTitle").textContent = cur.t;
  $("#dMeta").textContent = cur.kind + ", " + METAL[cur.m][0].toLowerCase();
  $("#dDesc").textContent = cur.d;
  dlg.showModal();
});
$("#dOrder").addEventListener("click", () => { dlg.close(); toOrder("Похожая на «" + cur.t + "»"); });
dlg.addEventListener("click", e => { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });

/* brooch builder */
const B = {
  fl: [["iris", "Ирис"], ["lily", "Лилия"], ["pom", "Пышный"], ["own", "Свой цветок"]],
  mt: [["gold", "Золото"], ["silver", "Серебро"], ["mix", "Золото и серебро"]],
  fr: [["me", "Для себя"], ["mama", "Маме"], ["bride", "Невесте"], ["gift", "В подарок"]],
};
const FL = {
  iris: {n: 6, len: 78, w: 32, t: "ирис", T: "Ирис", d: "Крупные мягкие лепестки и длинный стебель-булавка, тот самый цветок, с которого началось королевство."},
  lily: {n: 6, len: 86, w: 20, t: "лилия", T: "Лилия", d: "Острые изогнутые лепестки, тотем мастера. Заметна даже на пальто."},
  pom: {n: 14, len: 70, w: 30, t: "пышный цветок", T: "Пышный цветок", d: "Много волнистых лепестков в несколько слоёв, крупная и праздничная брошь."},
  own: {n: 12, len: 62, w: 26, t: "цветок по вашей идее", T: "Цветок по вашей идее", d: "Пришлите фото или картинку из Pinterest, Лилия предложит свою трактовку."},
};
const MT = {gold: ["золотой", "золотая", "в золоте"], silver: ["серебряный", "серебряная", "в серебре"], mix: ["золото-серебряный", "золото-серебряная", "в золоте и серебре"]};
const FR = {me: ["", "Подчеркнёт ваш образ и сделает простое платье праздничным."], mama: [" для мамы", "Носится каждый день на свитере или пальто, как у мамы Лилии."], bride: [" для невесты", "Можно сделать в пару к букету невесты или на заколку."], gift: [" в подарок", "Придёт в коробке с карточкой мастера, готовый подарок."]};
const sel = {fl: "iris", mt: "gold", fr: "me"};
$$(".b-opts").forEach(box => {
  const k = box.dataset.k;
  box.setAttribute("role", "radiogroup");
  box.innerHTML = B[k].map(([v, l]) => `<button class="b-opt" type="button" role="radio" data-v="${v}" aria-checked="${sel[k] === v}">${l}</button>`).join("");
  box.addEventListener("click", e => { const b = e.target.closest(".b-opt"); if (!b) return; sel[k] = b.dataset.v; box.querySelectorAll(".b-opt").forEach(x => x.setAttribute("aria-checked", x === b)); build(); });
});
const petals = $("#petals"), dots = $("#dots");
let rot = 0;
function build() {
  const f = FL[sel.fl], m = sel.mt, {n, len, w} = f;
  const fill = k => m === "mix" ? (k % 2 ? "url(#gSilver)" : "url(#gGold)") : m === "gold" ? "url(#gGold)" : "url(#gSilver)";
  let p = "";
  for (let k = 0; k < n; k++) {
    const ang = (360 / n) * k;
    const d = sel.fl === "lily"
      ? `M0 0 C${w} ${-len * .25} ${w * .7} ${-len * .75} ${w * .25} ${-len} C${-w * .1} ${-len * .8} ${-w} ${-len * .35} 0 0Z`
      : `M0 0 C${w} ${-len * .3} ${w * .8} ${-len * .85} 0 ${-len} C${-w * .8} ${-len * .85} ${-w} ${-len * .3} 0 0Z`;
    p += `<path d="${d}" fill="${fill(k)}" stroke="rgba(60,40,20,.25)" stroke-width="1" transform="rotate(${ang})"/>`;
  }
  if (n >= 12) for (let k = 0; k < n; k++) {
    const ang = (360 / n) * k + 180 / n;
    p += `<path d="M0 0 C${w * .7} ${-len * .2} ${w * .5} ${-len * .55} 0 ${-len * .62} C${-w * .5} ${-len * .55} ${-w * .7} ${-len * .2} 0 0Z" fill="${fill(k + 1)}" opacity=".9" transform="rotate(${ang})"/>`;
  }
  if (sel.fl === "iris") for (let k = 0; k < 3; k++) p += `<path d="M0 0 C14 -10 12 -34 0 -44 C-12 -34 -14 -10 0 0Z" fill="${m === "silver" ? "url(#gSilver)" : "url(#gGold)"}" stroke="rgba(60,40,20,.3)" transform="rotate(${k * 120 + 60})"/>`;
  rot += 40;
  petals.innerHTML = p; petals.style.transform = `rotate(${rot}deg)`;
  dots.innerHTML = Array.from({length: 8}, (_, k) => { const a = k * Math.PI / 4; return `<circle cx="${Math.cos(a) * 20}" cy="${Math.sin(a) * 20}" r="3"/>`; }).join("");
  const name = sel.fl === "own" ? f.T + " " + MT[m][2] : (sel.fl === "lily" ? MT[m][1] : MT[m][0]) + " " + f.t;
  const title = name.charAt(0).toUpperCase() + name.slice(1) + FR[sel.fr][0];
  $("#tDates").textContent = "Ваша брошь";
  $("#tName").textContent = title;
  $("#tText").textContent = f.d + " " + FR[sel.fr][1];
  $("#tOrder").dataset.t = title;
}
$("#tOrder").addEventListener("click", e => {
  const v = {gold: "Золото", silver: "Серебро", mix: "Золото и серебро"}[sel.mt];
  const r = $(`#form [name="metal"][value="${v}"]`); if (r) r.checked = true;
  toOrder(e.currentTarget.dataset.t);
});
build();

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
