const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const rub = n => n.toLocaleString("ru-RU").replace(/ /g, " ") + " ₽";

/* menu */
const nav = $("#nav"), burger = $("#burger");
burger.addEventListener("click", () => { const o = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
nav.addEventListener("click", e => { if (e.target.closest("a")) { nav.classList.remove("open"); burger.setAttribute("aria-expanded", false); } });

/* garland bulbs along the hero curve */
(() => {
  const box = $(".bulbs"), cols = ["#F7B6C5", "#E9B44C", "#6FCFCB", "#ff6b81", "#fff3c4"];
  const n = innerWidth < 600 ? 12 : 26;
  for (let i = 0; i < n; i++) {
    const t = (i + .5) / n, x = t * 1440;
    // same cubic as the svg path: M0 20 C240 110 480 110 720 40 S1200 -10 1440 70
    let y;
    if (x <= 720) { const u = x / 720; y = (1-u)**3*20 + 3*(1-u)**2*u*110 + 3*(1-u)*u*u*110 + u**3*40; }
    else { const u = (x - 720) / 720; y = (1-u)**3*40 + 3*(1-u)**2*u*(-30) + 3*(1-u)*u*u*(-10) + u**3*70; }
    const b = document.createElement("i");
    b.style.cssText = `left:${t*100}%;top:${y/120*110 + 2}px;--c:${cols[i % cols.length]};--d:${(i*0.37)%3}s`;
    box.appendChild(b);
  }
})();

/* elka builder */
const NAMES = {red: "Красная с золотом", pink: "Пудровая розовая", teal: "Бирюзовая", blue: "Синяя с серебром", gold: "Золото и зелень", snow: "Заснеженная"};
const SIZES = ["40 см", "55–60 см", "65 см и выше"];
const PRICES = ["от 1 500 ₽", "6 000–6 500 ₽", "по декору"];
const eImg = $("#elkaImg"), eFig = eImg.closest("figure");
function elka() {
  const c = $('input[name="clr"]:checked').value, h = +$('input[name="h"]:checked').value;
  const src = BUILDER[c][h];
  $("#elkaName").textContent = NAMES[c] + ", " + SIZES[h];
  $("#elkaPrice").textContent = PRICES[h];
  eImg.alt = "Ёлочка: " + NAMES[c].toLowerCase() + ", " + SIZES[h];
  if (eImg.getAttribute("src") === src) return;
  eFig.classList.add("swap");
  const pre = new Image(); pre.src = src;
  pre.onload = pre.onerror = () => setTimeout(() => { eImg.src = src; eFig.classList.remove("swap"); }, 120);
}
$$('.elka-ctrl input').forEach(i => i.addEventListener("change", elka));
Object.values(BUILDER).flat().forEach((s, i) => setTimeout(() => { new Image().src = s; }, 1500 + i * 60));
$("#elkaOrder").addEventListener("click", () => toOrder("Ёлочка: " + $("#elkaName").textContent.toLowerCase()));

function toOrder(text) {
  $("#kind").value = text;
  $("#order").scrollIntoView({behavior: "smooth"});
  setTimeout(() => $('#form [name="name"]').focus({preventScroll: true}), 600);
}

/* catalog */
const grid = $("#grid"), more = $("#more");
const STEP = 12; let cat = "all", shown = STEP;
function render() {
  const list = CATALOG.filter(x => cat === "all" || x.cat === cat);
  grid.innerHTML = list.slice(0, shown).map(x => `
    <button class="card" type="button" data-id="${x.id}">
      <figure class="arch"><img src="${x.img}" alt="${x.t}" loading="lazy" width="570" height="760"></figure>
      <h3>${x.t}</h3>
      <p class="sz">${short(x.d)}</p>
      <p class="pr"><b>${rub(x.p)}</b><span>Подробнее</span></p>
    </button>`).join("");
  more.hidden = list.length <= shown;
}
function short(d) {
  const m = d.match(/(Высота[^.,]*|высот[^.,]*|Размер[^.,]*|размер[^.,]*|Длина[^.,]*|диаметр[^.,]*|\d+\s*(?:см|шт)[^.,]*)/);
  return m ? m[1].replace(/^./, c => c.toUpperCase()) : "Ручная работа";
}
$("#tabs").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  $$("#tabs button").forEach(x => x.setAttribute("aria-selected", x === b));
  cat = b.dataset.cat; shown = STEP; render();
});
more.addEventListener("click", () => { shown += STEP; render(); });
render();

const dlg = $("#dlg"); let cur = null;
grid.addEventListener("click", e => {
  const b = e.target.closest(".card"); if (!b) return;
  cur = CATALOG.find(x => x.id === b.dataset.id);
  $("#dImg").src = cur.img; $("#dImg").alt = cur.t;
  $("#dTitle").textContent = cur.t; $("#dPrice").textContent = rub(cur.p); $("#dDesc").textContent = cur.d.replace(/⛔[^⛔]*⛔\s*/g, "");
  dlg.showModal();
});
$("#dOrder").addEventListener("click", () => { dlg.close(); toOrder(cur.t + ", " + rub(cur.p)); });
$$("dialog").forEach(d => d.addEventListener("click", e => { if (e.target === d || e.target.closest("[data-close]")) d.close(); }));

/* gallery */
const gal = $("#gal"), galMore = $("#galMore"); let gShown = 12;
function galRender() {
  gal.innerHTML = GALLERY.slice(0, gShown).map(s => `<button type="button" data-src="${s}" aria-label="Открыть фото"><img src="${s}" alt="Работа мастерской" loading="lazy" width="480" height="640"></button>`).join("");
  galMore.hidden = GALLERY.length <= gShown;
}
galMore.addEventListener("click", () => { gShown += 12; galRender(); });
galRender();
const lb = $("#lb");
gal.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; $("#lbImg").src = b.dataset.src; lb.showModal(); });

/* lead form */
const form = $("#form");
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
  const details = ["Макет decorator-florist", f.kind.value.trim(), f.how.value, when, comment].filter(Boolean).join(", ");
  const payload = {site: location.hostname, name: f.name.value.trim(), phone: f.phone.value.trim(), details, comment, website: f.website.value};
  sendBtn.disabled = true; sendBtn.textContent = "Отправляем…"; sent.hidden = failed.hidden = true;
  try {
    const r = await fetch(LEAD_URL, {method: "POST", headers: {"Content-Type": "text/plain;charset=utf-8"}, body: JSON.stringify(payload), signal: AbortSignal.timeout(20000)});
    if (!r.ok || (await r.json()).ok !== true) throw new Error("lead");
    form.reset(); sent.hidden = false;
  } catch { failed.hidden = false; }
  finally { sendBtn.textContent = "Отправить заявку"; sendBtn.disabled = false; }
});
