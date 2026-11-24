"use strict";
const money = n => new Intl.NumberFormat("ru-RU").format(n);
const $ = s => document.querySelector(s);
const C = window.CATALOG;
const form = $("#lead");
const dlg = $("#dlg");
const dlgBody = $("#dlg-body");
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function toOrder(kind, budget) {
  const sel = form.elements.kind;
  let opt = [...sel.options].find(o => o.value === kind);
  if (!opt) { opt = new Option(kind, kind); sel.add(opt); }
  sel.value = kind;
  if (budget) form.elements.budget.value = money(budget) + " ₽";
  if (dlg.open) dlg.close();
  $("#order").scrollIntoView({block: "start"});
  form.elements.name.focus({preventScroll: true});
}

/* Mother's day */
$("#mom-row").innerHTML = window.MOM.map((m, i) =>
  '<article class="mcard"><img src="img/' + m.img + '.webp" alt="' + esc(m.name) + '" width="760" height="950" loading="lazy">' +
  '<div><b>' + esc(m.name) + '</b><span>' + m.size + '</span><em>' + money(m.price) + (m.to ? "–" + money(m.to) : "") + ' ₽</em>' +
  '<button type="button" data-mom="' + i + '">Забронировать</button></div></article>').join("");
$("#mom-row").addEventListener("click", e => {
  const b = e.target.closest("[data-mom]");
  if (b) toOrder("Предзаказ ко Дню матери: " + window.MOM[b.dataset.mom].name, window.MOM[b.dataset.mom].price);
});

/* Budget picker */
const range = $("#brange"), bval = $("#bval"), bres = $("#bres"), spike = $("#spike");
let occ = "";
const PETALS = 18;
spike.innerHTML = Array.from({length: PETALS}, (_, i) => '<i style="height:' + (30 + i * 3.8) + '%"></i>').join("");
function renderBudget() {
  const v = +range.value;
  bval.textContent = money(v);
  const share = (v - +range.min) / (+range.max - +range.min);
  [...spike.children].forEach((p, i) => p.classList.toggle("on", i <= Math.round(share * (PETALS - 1))));
  const pool = C.filter(c => c.price <= v && (!occ || c.tags.includes(occ))).sort((a, b) => b.price - a.price);
  const pick = pool.slice(0, 3);
  if (!pick.length) {
    bres.innerHTML = '<div class="bempty"><b>На эту сумму в витрине пока нет примеров.</b><p>Напишите нам: флорист соберёт букет на ваш бюджет из того, что есть в магазине.</p><button type="button" class="btn pink" data-b="custom">Заказать на мой бюджет</button></div>';
    return;
  }
  bres.innerHTML = pick.map(c => '<article class="bcard"><img src="img/c' + c.id + '.webp" alt="' + esc(c.name) + '" width="720" height="900" loading="lazy"><div><b>' + esc(c.name) + '</b><em>' + money(c.price) + ' ₽</em><button type="button" data-b="' + c.id + '">Хочу такой</button></div></article>').join("");
}
range.addEventListener("input", renderBudget);
document.querySelector(".occ").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  occ = b.dataset.occ;
  document.querySelectorAll(".occ button").forEach(x => x.classList.toggle("on", x === b));
  renderBudget();
});
bres.addEventListener("click", e => {
  const b = e.target.closest("[data-b]");
  if (!b) return;
  if (b.dataset.b === "custom") return toOrder("Букет на мой бюджет", +range.value);
  const c = C.find(x => x.id === b.dataset.b);
  toOrder("Букет «" + c.name + "»", c.price);
});
renderBudget();

/* Catalog */
const CATS = ["Все", "Букеты", "Моно", "Коробки и корзины", "Сумочки", "С игрушкой"];
let cat = "Все", shown = 12;
const grid = $("#grid"), more = $("#more");
$("#filters").innerHTML = CATS.map(c => '<button type="button" data-cat="' + c + '"' + (c === cat ? ' class="on"' : "") + '>' + c + '<small>' + (c === "Все" ? C.length : C.filter(x => x.cat === c).length) + '</small></button>').join("");
function renderGrid() {
  const list = C.filter(c => cat === "Все" || c.cat === cat);
  grid.innerHTML = list.slice(0, shown).map(c =>
    '<article class="card"><button type="button" class="ph" data-open="' + c.id + '" aria-label="Подробнее: ' + esc(c.name) + '"><img src="img/c' + c.id + '.webp" alt="' + esc(c.name) + '" width="720" height="900" loading="lazy"><span class="cat">' + c.cat + '</span></button>' +
    '<div class="body"><h3>' + esc(c.name) + '</h3><div class="price">' + money(c.price) + ' ₽</div><div class="acts"><button type="button" class="b-order" data-order="' + c.id + '">Заказать</button><button type="button" class="b-more" data-open="' + c.id + '">Подробнее</button></div></div></article>').join("");
  more.hidden = list.length <= shown;
  more.parentElement.hidden = list.length <= shown;
}
$("#filters").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  cat = b.dataset.cat; shown = 12;
  document.querySelectorAll("#filters button").forEach(x => x.classList.toggle("on", x === b));
  renderGrid();
});
more.addEventListener("click", () => { shown += 12; renderGrid(); });
grid.addEventListener("click", e => {
  const o = e.target.closest("[data-order]");
  if (o) { const c = C.find(x => x.id === o.dataset.order); return toOrder("Букет «" + c.name + "»", c.price); }
  const d = e.target.closest("[data-open]");
  if (d) openItem(C.find(x => x.id === d.dataset.open));
});
renderGrid();

function openItem(c) {
  dlgBody.className = "dlg-body";
  dlgBody.innerHTML = '<div class="dimg"><img src="img/c' + c.id + '.webp" alt="' + esc(c.name) + '" width="720" height="900"></div>' +
    '<div class="dlg-info"><span class="muted">' + c.cat + '</span><h3>' + esc(c.name) + '</h3><div class="price">' + money(c.price) + ' ₽</div><p>' + esc(c.desc) + '</p>' +
    '<p class="muted">Цена на дату публикации в витрине. Если какого-то цветка нет, флорист предложит замену и согласует её с вами.</p>' +
    '<div class="btns"><button type="button" class="btn pink" data-dorder>Заказать этот букет</button><a class="btn wa" href="https://wa.me/79296053014?text=' + encodeURIComponent("Здравствуйте! Хочу букет «" + c.name + "» за " + money(c.price) + " ₽") + '" target="_blank" rel="noopener">Спросить в WhatsApp</a></div></div>';
  dlgBody.querySelector("[data-dorder]").onclick = () => toOrder("Букет «" + c.name + "»", c.price);
  dlg.showModal();
}
$(".dlg-x").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

/* Works */
const G = window.GALLERY;
let wShown = 12;
const wg = $("#works-grid"), wm = $("#works-more");
function renderWorks() {
  wg.innerHTML = G.slice(0, wShown).map(g => '<button type="button" data-g="' + g + '" aria-label="Открыть фото букета"><img src="img/g' + g + '.webp" alt="Букет мастерской «Люпин»" width="760" height="950" loading="lazy"></button>').join("");
  wm.parentElement.hidden = wShown >= G.length;
}
wm.addEventListener("click", () => { wShown = G.length; renderWorks(); });
wg.addEventListener("click", e => {
  const b = e.target.closest("[data-g]");
  if (!b) return;
  dlgBody.className = "dlg-body photo";
  dlgBody.innerHTML = '<img src="img/g' + b.dataset.g + '.webp" alt="Букет мастерской «Люпин»">';
  dlg.showModal();
});
renderWorks();

/* Winter CTA */
document.querySelectorAll("[data-kind]").forEach(a => a.addEventListener("click", e => { e.preventDefault(); toOrder(a.dataset.kind); }));

/* Map pins <-> shop cards */
function hl(id) {
  document.querySelectorAll("[data-pin]").forEach(x => x.classList.toggle("hl", x.dataset.pin === id));
}
document.querySelectorAll(".shop").forEach(s => { s.addEventListener("mouseenter", () => hl(s.dataset.pin)); s.addEventListener("focusin", () => hl(s.dataset.pin)); });
document.querySelectorAll(".mpin").forEach(p => p.addEventListener("click", e => {
  e.preventDefault(); hl(p.dataset.pin);
  document.querySelector('.shop[data-pin="' + p.dataset.pin + '"]').scrollIntoView({block: "nearest", behavior: "smooth"});
}));

/* Lead form */
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
  const when = f.when.value ? "К " + f.when.value.split("-").reverse().join(".") : "";
  const details = ["Макет lupin-zel", f.kind.value, f.how.value, when, f.budget.value && "Бюджет " + f.budget.value, comment].filter(Boolean).join(", ");
  const payload = {site: location.hostname, name: f.name.value.trim(), phone: f.phone.value.trim(), details, comment, website: f.website.value};
  sendBtn.disabled = true; sendBtn.textContent = "Отправляем…"; sent.hidden = failed.hidden = true;
  try {
    const r = await fetch(LEAD_URL, {method: "POST", headers: {"Content-Type": "text/plain;charset=utf-8"}, body: JSON.stringify(payload), signal: AbortSignal.timeout(20000)});
    if (!r.ok || (await r.json()).ok !== true) throw new Error("lead");
    form.reset(); sent.hidden = false;
  } catch { failed.hidden = false; }
  finally { sendBtn.textContent = "Отправить заявку"; sendBtn.disabled = false; }
});
