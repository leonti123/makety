const $ = (s, r = document) => r.querySelector(s);
const ITEMS = window.ITEMS, WORKS = window.WORKS;
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));

function card(it) {
  const unit = it.cat === "s" ? '<em class="unit">цена за 1 шт, по наличию</em>' : "";
  return `<button type="button" class="card" data-id="${it.id}">
    <div class="card-ph"><img src="${it.ph[0]}" alt="${esc(it.name)}" loading="lazy"><b class="tag">${esc(it.price)}</b></div>
    <div class="card-b"><b>${esc(it.name)}</b><span>${esc(it.text)}</span>${unit}</div></button>`;
}
document.addEventListener("click", e => {
  const c = e.target.closest(".card[data-id]");
  if (c) openItem(+c.dataset.id);
});

/* picker */
const NOTES = {
  mama: "Маме нежность, округлые формы, тёплые оттенки. Чтобы сказать спасибо.",
  love: "Любимой розы или пионы, побольше воздуха и одна яркая деталь. Скажите, какие цветы она любит, учту.",
  colleague: "Коллеге лаконичность, зелень, чистые линии. Чтобы отметить без лишнего пафоса. Учителям соберу и от всего класса.",
  bride: "Невесте букет под платье и стиль свадьбы. Гипсофила спокойно выдержит два дня торжества и перелёт.",
  self: "Себе то, что хочется прямо сейчас. Без повода, просто потому что."
};
const WHO = {mama: "маме", love: "любимой", colleague: "коллеге или учителю", bride: "невесте", self: "себе"};
const TONE = {any: "", tender: "нежные оттенки", bright: "яркие оттенки", white: "белые оттенки", lilac: "сиреневые оттенки"};
let who = "mama", tone = "any";
function seg(id, set) {
  const box = $(id);
  box.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    box.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
    set(b.dataset.v); renderPick();
  });
}
seg("#pick-who", v => who = v);
seg("#pick-tone", v => tone = v);
function renderPick() {
  $("#pick-note").textContent = NOTES[who];
  const forWho = ITEMS.filter(i => i.who.includes(who));
  const exact = forWho.filter(i => tone === "any" || i.tone === tone);
  const rest = forWho.filter(i => !exact.includes(i));
  const list = [...exact, ...rest, ...ITEMS.filter(i => tone !== "any" && i.tone === tone && !forWho.includes(i))].slice(0, 3);
  $("#pick-cards").innerHTML = list.map(card).join("");
}
renderPick();
$("#pick-surprise").addEventListener("click", () => toOrder(["Сюрприз " + WHO[who], TONE[tone]].filter(Boolean).join(", ")));

$("#season-btn").addEventListener("click", () => {
  who = "mama"; $("#pick-who").querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x.dataset.v === "mama")); renderPick();
});

/* catalog */
let cat = "b", shown = 12;
const tabs = $("#cat-tabs");
tabs.querySelectorAll("button").forEach(b => b.insertAdjacentHTML("beforeend", `<sup>${ITEMS.filter(i => i.cat === b.dataset.c).length}</sup>`));
tabs.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  tabs.querySelectorAll("button").forEach(x => x.setAttribute("aria-selected", x === b));
  cat = b.dataset.c; shown = 12; renderCat();
});
function renderCat() {
  const list = ITEMS.filter(i => i.cat === cat);
  $("#cat-grid").innerHTML = list.slice(0, shown).map(card).join("");
  $("#cat-more").hidden = list.length <= shown;
}
$("#cat-more").addEventListener("click", () => { shown += 12; renderCat(); });
renderCat();

/* item dialog */
const dlg = $("#dlg");
let cur = null;
function openItem(id) {
  cur = ITEMS.find(i => i.id === id);
  $("#dlg-name").textContent = cur.name;
  $("#dlg-price").textContent = cur.price + (cur.cat === "s" ? " за 1 шт" : "");
  $("#dlg-text").textContent = cur.text;
  const img = $("#dlg-img"); img.src = cur.ph[0]; img.alt = cur.name;
  $("#dlg-thumbs").innerHTML = cur.ph.length > 1 ? cur.ph.map((p, k) => `<button type="button" aria-label="Фото ${k + 1}" aria-current="${k === 0}"><img src="${p}" alt=""></button>`).join("") : "";
  $("#dlg-order").textContent = cur.cat === "s" ? "Заказать букет с этими цветами" : "Заказать";
  dlg.showModal();
}
$("#dlg-thumbs").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  [...b.parentNode.children].forEach(x => x.setAttribute("aria-current", x === b));
  $("#dlg-img").src = b.querySelector("img").src;
});
$("#dlg-order").addEventListener("click", () => { dlg.close(); toOrder(cur.name + ", " + cur.price); });
document.querySelectorAll("dialog").forEach(d => {
  d.querySelector(".dlg-x").addEventListener("click", () => d.close());
  d.addEventListener("click", e => { if (e.target === d) d.close(); });
});

/* works */
let wShown = 12;
function renderWorks() {
  $("#wgrid").innerHTML = WORKS.slice(0, wShown).map((w, k) => `<button type="button" data-k="${k}" aria-label="Открыть фото ${k + 1}"><img src="${w}" alt="Букет Елены" loading="lazy"></button>`).join("");
  $("#w-more").hidden = wShown >= WORKS.length;
}
renderWorks();
$("#w-more").addEventListener("click", () => { wShown += 12; renderWorks(); });
$("#wgrid").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  $("#lb-img").src = WORKS[+b.dataset.k]; $("#lb").showModal();
});

/* reviews */
const REVIEWS = [
  ["Ольга Богданова", "июль 2025", "Леночка замечательный флорист с отменным вкусом, оперативно поможет с выбором и организует доставку. Красиво оформила, очень изысканный букет получился, с доставкой в назначенное время. Спасибо за качество цветка и за оперативность!"],
  ["Ирина Огурцова", "март 2025", "Который год подряд цветы на разные мероприятия только у Елены. На 8 марта свежие красивущие тюльпаны порадовали наших учителей. Спасибо за труд, фантазию и душевный подход к покупателю. Люблю приходить в ваш магазинчик в Лигово."],
  ["Ирина Симакова", "сентябрь 2026", "Отличные букеты, сочетание оттенков такое, что хочется рассматривать каждую деталь. Видно, что флористы вкладывают душу: нет случайных веточек, всё на своём месте."],
  ["Мария Елтышева", "сентябрь 2025", "Благодарю Елену за подбор и оформление букета к важному событию. Доставка вовремя, всё отлично, буду обращаться ещё!"],
  ["Сергей Ковшанов", "октябрь 2025", "Спасибо огромное от родительского комитета одной из ближайших школ: очень выручили и помогли с выбором, причём в экстренном порядке!"],
  ["Светлана Витязева", "октябрь 2026", "Всегда красивые, шикарные и свежие букеты! Рекомендую всем!"],
  ["Айгуль Абдрахимова", "январь 2026", "Очень классная группа, много оригинальных идей для подарков и как их упаковать."],
  ["Ульяна Погромовна", "сентябрь 2025", "Прекрасный флорист, спасибо за подбор букета к торжеству!"],
  ["Людмила Медведева", "декабрь 2025", "Суперские букеты и всегда свежие цветы."],
  ["Валерий Лядинский", "февраль 2025", "Всё супер, отличный букет собрали. Всё на высшем уровне."],
  ["Анна Овчинникова", "октябрь 2025", "Спасибо вам за шикарный букет! Будем обращаться к вам снова."],
  ["Ирина Огурцова", "октябрь 2025", "Нежнейший, красивущий букет. Леночка, спасибо вам за такую красоту."],
  ["Татьяна Позднякова", "октябрь 2025", "Бесподобные, очень красивые букеты. Спасибо огромное."],
  ["Арина Абдулхалыгова", "октябрь 2025", "У вас самые замечательные букеты. Рекомендую всем."],
  ["Татьяна Попова-Кузнецова", "июль 2026", "Шикарно и стильно."]
];
const AVA = ["#D6336C", "#8A5BC4", "#6F8C5C", "#B8245A", "#C08A4A"];
let rShown = 6;
function renderRev() {
  $("#rev-grid").innerHTML = REVIEWS.slice(0, rShown).map(([n, d, t], k) => `<article class="rev"><p>${esc(t)}</p><footer><span class="ava" style="background:${AVA[k % 5]}">${n[0]}</span><span><b>${esc(n)}</b><br><span>${d}</span></span></footer></article>`).join("");
  $("#rev-more").hidden = rShown >= REVIEWS.length;
}
renderRev();
$("#rev-more").addEventListener("click", () => { rShown += 9; renderRev(); });

/* order helpers */
function toOrder(text) {
  const k = $("#f-kind"); k.value = text;
  $("#zakaz").scrollIntoView({behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
  setTimeout(() => $("#form").elements.name.focus({preventScroll: true}), 600);
}
document.querySelectorAll("[data-order]").forEach(a => a.addEventListener("click", e => { e.preventDefault(); toOrder(a.dataset.order); }));

/* floating CTA hides near hero and form */
const fc = $(".float-cta"), seen = new Set();
const io = new IntersectionObserver(es => { es.forEach(x => x.isIntersecting ? seen.add(x.target) : seen.delete(x.target)); fc.classList.toggle("hide", seen.size > 0); }, {threshold: .05});
io.observe($("#zakaz")); io.observe($(".hero"));

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
  const details = ["Макет elena-cvety", f.kind.value.trim(), f.when.value.trim() && "когда: " + f.when.value.trim(), f.how.value, comment].filter(Boolean).join(", ");
  const payload = {site: location.hostname, name: f.name.value.trim(), phone: f.phone.value.trim(), details, comment, website: f.website.value};
  sendBtn.disabled = true; sendBtn.textContent = "Отправляем…"; sent.hidden = failed.hidden = true;
  try {
    const r = await fetch(LEAD_URL, {method: "POST", headers: {"Content-Type": "text/plain;charset=utf-8"}, body: JSON.stringify(payload), signal: AbortSignal.timeout(20000)});
    if (!r.ok || (await r.json()).ok !== true) throw new Error("lead");
    form.reset(); sent.hidden = false;
  } catch { failed.hidden = false; }
  finally { sendBtn.textContent = "Отправить заявку"; sendBtn.disabled = false; }
});
