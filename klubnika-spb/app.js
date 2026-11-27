const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rub = n => n.toLocaleString("ru-RU").replace(/ /g, " ") + " ₽";
const esc = s => s.replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
const items = window.ITEMS || [];

/* ---------- builder ---------- */
const CHOC = {
  milk: {name: "Молочный шоколад", coat: "#8a5a3c", line: "#f4e7d3"},
  white: {name: "Белый шоколад", coat: "#f4e7d3", line: "#8a5a3c"},
  pink: {name: "Розовый шоколад", coat: "#ec9fb2", line: "#fff4f6"},
  dark: {name: "Тёмный шоколад", coat: "#3b2016", line: "#c9a04e"}
};
const DECOR = {lines: "штрихи", rasp: "сублимированная малина", gold: "золотой кандурин", pearls: "бусины"};
const SIZES = [[4, 750], [5, 1000], [6, 1200], [9, 1900], [12, 2500], [16, 3200], [25, 5100]];
const COLS = {4: 2, 5: 3, 6: 3, 9: 3, 12: 4, 16: 4, 25: 5};
const st = {c: "milk", d: "lines", n: 9, add: false};
const berry = $(".berry"), box = $("#bBox");
const words = n => n % 10 === 1 && n % 100 !== 11 ? "ягода" : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? "ягоды" : "ягод";

$("#bSize").innerHTML = SIZES.map(([n, p]) => `<button type="button" data-n="${n}" aria-pressed="${n === st.n}"><b>${n}</b><span>${rub(p)}</span></button>`).join("");

function redip() {
  berry.classList.add("dipping");
  void berry.getBoundingClientRect();
  requestAnimationFrame(() => requestAnimationFrame(() => berry.classList.remove("dipping")));
}
function renderBox() {
  const n = st.n, cols = COLS[n];
  box.style.gridTemplateColumns = `repeat(${cols},1fr)`;
  let html = "";
  for (let i = 0; i < n; i++) html += `<span class="mb" style="animation-delay:${i * 22}ms"><i></i></span>`;
  if (st.add) html += `<span class="mb add" style="animation-delay:${n * 22}ms"><i></i></span>`;
  box.innerHTML = html;
}
function render(dip) {
  const c = CHOC[st.c];
  document.documentElement.style.setProperty("--coat", c.coat);
  document.documentElement.style.setProperty("--line-c", c.line);
  $$(".decor", berry).forEach(g => g.classList.toggle("on", g.dataset.decor === st.d));
  box.className = "box-win deco-" + st.d;
  $("#bChocName").textContent = c.name;
  $("#bDecorName").textContent = DECOR[st.d];
  const price = SIZES.find(s => s[0] === st.n)[1] + (st.add ? 350 : 0);
  $("#bSumTitle").textContent = `${st.n} ${words(st.n)}${st.add ? " + ягоды в шоколаде" : ""}`;
  $("#bPrice").textContent = rub(price);
  renderBox();
  if (dip) redip();
}
function pick(groupSel, attr, key, dip) {
  $(groupSel).addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    $$("button", $(groupSel)).forEach(x => x.setAttribute("aria-pressed", x === b));
    st[key] = key === "n" ? +b.dataset[attr] : b.dataset[attr];
    render(dip);
  });
}
pick("#bChoc", "c", "c", true);
pick("#bDecor", "d", "d", true);
pick("#bSize", "n", "n", false);
$("#bAdd").addEventListener("change", e => { st.add = e.target.checked; render(false); });
render(false);
setTimeout(redip, 400);

/* ---------- catalog ---------- */
const cards = $("#cards");
cards.innerHTML = items.map((it, i) => `
  <button class="card" type="button" data-i="${i}">
    <div class="card-img"><img src="img/${it.photos[0]}.webp" alt="${esc(it.name)}" loading="lazy" width="825" height="1100"><span class="card-count">${it.count}</span></div>
    <div class="card-b"><h3>${esc(it.name)}</h3><p>${esc(it.text.split("\n")[0])}</p>
      <div class="card-f"><b>${rub(it.price)}</b><span>Подробнее</span></div></div>
  </button>`).join("") + `
  <a class="card card-own" href="#sobrat">
    <div class="own-in"><svg viewBox="0 0 40 44" aria-hidden="true"><path d="M20 42C8 37 3 25 5 16c2-6 8-7 15-5 7-2 13-1 15 5 2 9-3 21-15 26z" fill="#fff" opacity=".9"/><path d="M11 10l9 3 9-3-4 5h-10z" fill="#bfe3c4"/></svg>
    <h3>Нужен свой набор?</h3><p>Выберите шоколад, декор и количество ягод от 4 до 25</p><span class="btn btn-light">Собрать набор</span></div>
  </a>`;

const dlg = $("#dlg");
function textHtml(t) {
  const out = []; let list = [];
  t.split("\n").map(s => s.trim()).filter(Boolean).forEach(s => {
    if (s.startsWith("•")) list.push(`<li>${esc(s.slice(1).trim())}</li>`);
    else { if (list.length) { out.push(`<ul>${list.join("")}</ul>`); list = []; } out.push(`<p>${esc(s)}</p>`); }
  });
  if (list.length) out.push(`<ul>${list.join("")}</ul>`);
  return out.join("");
}
cards.addEventListener("click", e => {
  const c = e.target.closest("button.card"); if (!c) return;
  const it = items[+c.dataset.i];
  $("#dlgBody").innerHTML = `
    <div class="dlg-ph">${it.photos.map(p => `<img src="img/${p}.webp" alt="${esc(it.name)}" width="825" height="1100">`).join("")}</div>
    <div class="dlg-t"><h3>${esc(it.name)}</h3><div class="price">${rub(it.price)} <small>· ${it.count}</small></div>${textHtml(it.text)}
      <button class="btn btn-berry" type="button" data-order="${esc(it.name)}">Заказать этот набор</button></div>`;
  dlg.showModal();
});
dlg.addEventListener("click", e => {
  if (e.target === dlg || e.target.closest(".dlg-x")) dlg.close();
  const o = e.target.closest("[data-order]");
  if (o) { dlg.close(); orderFor(o.dataset.order, ""); }
});

/* ---------- gallery ---------- */
const GAL = ["p052", "p079", "p054", "p037", "p049", "p032", "p070", "p046", "p071", "p053", "p051", "p077", "p040", "p048", "p072", "p047", "p074", "p073", "p050", "p075", "p076", "p078", "p038", "p045"];
const gal = $("#gallery"), more = $("#moreBtn");
let shown = 12;
function renderGal() {
  gal.innerHTML = GAL.slice(0, shown).map(p => `<button type="button" data-p="${p}" aria-label="Открыть фото"><img src="img/${p}.webp" alt="Клубника в шоколаде, работа АлМаВи" loading="lazy" width="825" height="1100"></button>`).join("");
  more.hidden = shown >= GAL.length;
}
renderGal();
more.addEventListener("click", () => { shown = GAL.length; renderGal(); });
const lb = $("#lb");
gal.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; $("#lbImg").src = `img/${b.dataset.p}.webp`; lb.showModal(); });
lb.addEventListener("click", () => lb.close());

/* ---------- form ---------- */
const form = $("#form"), kind = form.elements.kind;
kind.innerHTML = [`<option value="">Ещё не выбрано</option>`, `<option value="Свой набор">Свой набор из конструктора</option>`]
  .concat(items.map(it => `<option value="${esc(it.name)}">${esc(it.name)}, ${rub(it.price)}</option>`)).join("");
function orderFor(name, comment) {
  kind.value = name;
  if (comment) form.elements.comment.value = comment;
  $("#zakaz").scrollIntoView({behavior: "smooth"});
  setTimeout(() => form.elements.name.focus({preventScroll: true}), 600);
}
$("#bOrder").addEventListener("click", () => {
  const price = SIZES.find(s => s[0] === st.n)[1] + (st.add ? 350 : 0);
  orderFor("Свой набор", `${st.n} ${words(st.n)}, ${CHOC[st.c].name.toLowerCase()}, декор: ${DECOR[st.d]}${st.add ? ", плюс малина или голубика в шоколаде" : ""}, ${rub(price)}`);
});

/* floating CTA hides near hero and form */
const fc = $(".float-cta"), seen = new Set();
const io = new IntersectionObserver(es => { es.forEach(x => x.isIntersecting ? seen.add(x.target) : seen.delete(x.target)); fc.classList.toggle("hide", seen.size > 0); }, {threshold: .05});
io.observe($("#zakaz")); io.observe($(".hero")); io.observe($(".foot"));

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
  const details = ["Макет klubnika-spb", f.kind.value.trim(), f.when.value.trim() && "когда: " + f.when.value.trim(), f.how.value, comment].filter(Boolean).join(", ");
  const payload = {site: location.hostname, name: f.name.value.trim(), phone: f.phone.value.trim(), details, comment, website: f.website.value};
  sendBtn.disabled = true; sendBtn.textContent = "Отправляем…"; sent.hidden = failed.hidden = true;
  try {
    const r = await fetch(LEAD_URL, {method: "POST", headers: {"Content-Type": "text/plain;charset=utf-8"}, body: JSON.stringify(payload), signal: AbortSignal.timeout(20000)});
    if (!r.ok || (await r.json()).ok !== true) throw new Error("lead");
    form.reset(); sent.hidden = false;
  } catch { failed.hidden = false; }
  finally { sendBtn.textContent = "Отправить заявку"; sendBtn.disabled = false; }
});
