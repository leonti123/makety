const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rub = n => n.toLocaleString("ru-RU").replace(/ /g, " ") + " ₽";

/* flavours: whole price, half price, photos, description, colour for the halves builder */
const CAKES = [
  {id:"medovik", name:"Медовик", whole:1399, half:699, hit:"Хит продаж", img:["c-med","c-med-b","g-med-whole"], hImg:"h-med",
   short:"Медовые коржи на алтайском мёде и сметанный крем.",
   desc:["Классика русской кондитерской традиции. Ароматные медовые коржи, мягкие и рассыпчатые, и нежный сметанный крем: не приторный, с лёгкой освежающей ноткой.","Торт хорошо пропитан, поэтому тает во рту. Для семейного чаепития и праздничного стола."],
   fill:"#dc9a3c", pat:"p-comb"},
  {id:"medovik-brusnika", name:"Медовик с брусникой", whole:1499, half:749, img:["c-medbr","c-medbr-b","g-medbr-cut"], hImg:"h-medbr",
   short:"Медовые коржи, сметанный крем и слои брусники.",
   desc:["Тот же нежный медовый корж и сметанный крем, а между слоями ароматная брусничная начинка с приятной кислинкой.","Тепло мёда и свежесть лесных ягод в каждом кусочке."],
   fill:"#d9973a", pat:"p-lingon"},
  {id:"medovik-shok", name:"Медовик шоколадный", whole:1499, half:759, img:["c-medsh","c-medsh-b"], hImg:"h-medsh",
   short:"Шоколадно-медовые коржи и сметанный крем.",
   desc:["Нежные шоколадные коржи с тонким медовым ароматом, пропитанные воздушным сметанным кремом с нотками горького шоколада.","Верх и бока в крошке из коржей. После нескольких часов пропитки торт становится ещё нежнее."],
   fill:"#5b3322", pat:"p-comb"},
  {id:"praga", name:"Прага", whole:1699, half:849, img:["c-praga","c-praga-2","g-praga"], hImg:"h-praga",
   short:"Шоколадный бисквит, масляный крем, абрикосовый конфитюр.",
   desc:["Легендарный торт с полувековой историей.","<ul><li>шоколадные бисквитные коржи с насыщенным вкусом какао</li><li>нежный масляный крем с шоколадным оттенком</li><li>тонкий слой абрикосового конфитюра</li><li>зеркальная шоколадная глазурь и шоколадная крошка по бокам</li></ul>"],
   fill:"#2e140d", pat:"p-gloss"},
  {id:"barhat", name:"Красный бархат", whole:1519, half:769, hit:"Хит продаж", img:["c-barhat","c-barhat-s","g-barhat-cut"], hImg:"h-barhat",
   short:"Коржи на кефире, крем-чиз и сливки 33%.",
   desc:["Бархатисто-нежные коржи насыщенного красного цвета с деликатным шоколадным послевкусием. Воздушный крем-чиз на сливках 33% даёт идеальный баланс вкуса.","Подаётся охлаждённым, так текстура раскрывается полностью."],
   fill:"#b5122b", pat:"p-crumb"},
  {id:"fistashka", name:"Фисташка с малиной", whole:1519, half:759, hit:"Лидер продаж", img:["c-fist","c-fist-s","g-fist-cut"], hImg:"h-fist",
   short:"Фисташковые коржи, фисташковый крем и малина.",
   desc:["Нежнейший фисташковый крем обволакивает воздушные коржи, а в каждом кусочке сочная, чуть терпкая малина.","Ореховая глубина фисташки и яркая ягодная свежесть."],
   fill:"#93b934", pat:"p-crumb"},
  {id:"chernichny", name:"Черничный с чёрной смородиной", whole:1499, half:759, img:["c-chern","c-chern-b"], hImg:"h-chern",
   short:"Нежный бисквит, черника и чёрная смородина.",
   desc:["Нежный бисквит, словно облачко, и сочная ягодная начинка: благородная сладость черники и деликатная кислинка чёрной смородины."],
   fill:"#f2eef6", pat:"p-berry"},
  {id:"snikers", name:"Сникерс", whole:1529, half:799, img:["c-snik","c-snik-2"], hImg:"h-snik",
   short:"Шоколадный бисквит, карамель, жареный арахис.",
   desc:["Знакомый с детства вкус в формате торта.","<ul><li>шоколадные бисквиты, сочные и нежные</li><li>сливочная карамель, тягучая и ароматная</li><li>обжаренный хрустящий арахис</li><li>воздушный крем, сбалансированный по сладости</li></ul>"],
   fill:"#3a1d12", pat:"p-drip"},
];
const ORDER = [
  {id:"bedny", name:"Бедный еврей", img:["ph"], noPhoto:true, short:"Грецкий орех, мак, изюм и крем с варёной сгущёнкой.", desc:["Вопреки названию, в составе богато: грецкий орех, мак, изюм, а крем на варёной сгущёнке."]},
  {id:"klubnika", name:"Клубника со сливками", img:["o-klub","g-klub"], short:"Бисквит, сливки и натуральная клубника.", desc:["Наш любимый клубничный тортик с натуральной ягодой клубникой и сливочным кремом."]},
  {id:"abrikos", name:"Абрикос", img:["o-abr","g-abr"], short:"Тающие пропитанные коржи и натуральный абрикос.", desc:["Нежный десерт с тающими пропитанными коржами. Вкус натурального абрикоса делает торт по-летнему ярким."]},
  {id:"karamel", name:"Карамель", img:["o-karamel"], short:"Бисквит с варёной сгущёнкой и карамелью.", desc:["Карамельный торт с кремом на варёной сгущёнке."]},
  {id:"cherny-les", name:"Чёрный лес с вишней", img:["o-cherles","g-cherles-cut"], short:"Шоколадный бисквит, заварной крем, вишня.", desc:["Шоколадный бисквит, заварной шоколадный крем со сливками 33% и слой вишнёвого джема. Оформлен сырно-сливочным кремом."]},
  {id:"cheremuha", name:"Черёмуховый", img:["o-cherem"], short:"Черёмуховый бисквит и сметанный крем.", desc:["Черёмуховый бисквит со сметанным кремом и черёмуховым слоем."]},
  {id:"spartak", name:"Спартак", img:["o-spartak"], short:"Шоколадно-медовые коржи и нежный крем.", desc:["Тонкие шоколадные коржи с мёдом и нежный крем."]},
  {id:"kokos", name:"Кокосовый", img:["o-kokos"], short:"Белый бисквит, сырно-сливочный крем, кокос.", desc:["Классический белый бисквит, сырно-сливочный крем с кокосовой стружкой."]},
];

const grid = $("#grid"), dlg = $("#dlg");
let tab = "whole";
function render(){
  const list = tab === "order" ? ORDER : CAKES;
  grid.innerHTML = list.map((c, i) => {
    const pic = tab === "half" ? c.hImg : c.img[0];
    const price = tab === "whole" ? `<span class="price">${rub(c.whole)}<small>целый торт</small></span>`
      : tab === "half" ? `<span class="price">${rub(c.half)}<small>половинка</small></span>`
      : `<span class="price">по запросу<small>уточним при заказе</small></span>`;
    const tag = tab !== "order" && c.hit ? `<span class="card-tag">${c.hit}</span>` : (c.noPhoto ? `<span class="card-tag">фото скоро</span>` : "");
    return `<article class="card"><button class="card-pic" data-i="${i}" aria-label="Подробнее: ${c.name}"><img src="img/${pic}${c.noPhoto ? ".svg" : ".webp"}" alt="${c.name}" loading="lazy">${tag}</button>
      <div class="card-body"><h3>${c.name}</h3><p>${c.short}</p><div class="card-foot">${price}<button class="card-btn" data-order="${i}">Заказать</button></div></div></article>`;
  }).join("");
}
render();
$$(".tabs button").forEach(b => b.addEventListener("click", () => {
  tab = b.dataset.tab; $$(".tabs button").forEach(x => x.setAttribute("aria-selected", x === b)); render();
}));

function prefill(name, fmt){
  $("#f-kind").value = name;
  if (fmt) { const r = $(`.fmt input[value="${fmt}"]`); if (r) r.checked = true; }
  $("#zakaz").scrollIntoView({behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
}
grid.addEventListener("click", e => {
  const o = e.target.closest("[data-order]"), p = e.target.closest("[data-i]");
  const list = tab === "order" ? ORDER : CAKES;
  if (o) return prefill(list[+o.dataset.order].name, tab === "half" ? "половинка" : "целый");
  if (p) openDlg(list[+p.dataset.i]);
});

function openDlg(c){
  const pics = tab === "half" ? [c.hImg, ...c.img] : c.img;
  const show = n => { $("#dImg").src = `img/${pics[n]}${c.noPhoto ? ".svg" : ".webp"}`; $("#dImg").alt = c.name; $$("#dThumbs button").forEach((b, k) => b.setAttribute("aria-current", k === n)); };
  $("#dName").textContent = c.name;
  $("#dPrices").innerHTML = c.whole ? `<span><b>${rub(c.whole)}</b>целый, 10–12 порций</span><span><b>${rub(c.half)}</b>половинка</span>` : `<span><b>по запросу</b>цену уточним при заказе</span>`;
  $("#dDesc").innerHTML = c.desc.map(d => d.startsWith("<") ? d : `<p>${d}</p>`).join("");
  $("#dThumbs").innerHTML = pics.length > 1 ? pics.map(p => `<button type="button"><img src="img/${p}.webp" alt=""></button>`).join("") : "";
  $$("#dThumbs button").forEach((b, k) => b.addEventListener("click", () => show(k)));
  show(0);
  $("#dOrder").onclick = e => { e.preventDefault(); dlg.close(); prefill(c.name, tab === "half" ? "половинка" : "целый"); };
  dlg.showModal();
}
$(".dlg-x").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

/* halves builder */
const sel = {L: "praga", R: "fistashka"};
function halfSvg(c){
  return `<circle cx="200" cy="200" r="170" fill="${c.fill}"/><circle cx="200" cy="200" r="170" fill="url(#${c.pat})"/>
    <circle cx="200" cy="200" r="158" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="3" stroke-dasharray="2 10"/>`;
}
function opts(side){
  $("#opt" + side).innerHTML = CAKES.map(c => `<button type="button" data-id="${c.id}" aria-pressed="${sel[side] === c.id}"><i style="background:${c.fill}"></i>${c.name.replace(" с чёрной смородиной", "")}<small>${rub(c.half)}</small></button>`).join("");
}
function drawCake(){
  const L = CAKES.find(c => c.id === sel.L), R = CAKES.find(c => c.id === sel.R);
  $("#halfL").innerHTML = halfSvg(L); $("#halfR").innerHTML = halfSvg(R);
  $("#bnames").textContent = L.id === R.id ? `${L.name}, целый` : `${L.name} + ${R.name}`;
  $("#bprice").textContent = rub(L.half + R.half);
  opts("L"); opts("R");
}
["L", "R"].forEach(s => $("#opt" + s).addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return; sel[s] = b.dataset.id; drawCake();
}));
drawCake();
$("#border").addEventListener("click", e => {
  e.preventDefault();
  const L = CAKES.find(c => c.id === sel.L), R = CAKES.find(c => c.id === sel.R);
  prefill(`Половинки: ${L.name} + ${R.name}`, "две половинки");
});

/* gallery */
const GAL = ["g-combo","g-domes","g-fist-cut","g-medovik","g-barhat-cut","g-halves","g-klub","g-shok","g-two","g-med-cut","g-praga","g-vitrina",
  "g-fist-top","g-bow","g-abr","g-ny","g-med-top","g-fist-stack","g-medbr-cut","g-cherles-cut","g-barhat-top","g-fist-half","g-domes2","g-med-whole"];
const gal = $("#gal"); let shown = 12;
function drawGal(){
  gal.innerHTML = GAL.slice(0, shown).map(g => `<button type="button" data-g="${g}" aria-label="Открыть фото"><img src="img/${g}.webp" alt="Торт Цех 24" loading="lazy"></button>`).join("");
  $("#galMore").hidden = shown >= GAL.length;
}
drawGal();
$("#galMore").addEventListener("click", () => { shown = GAL.length; drawGal(); });
gal.addEventListener("click", e => {
  const b = e.target.closest("[data-g]"); if (!b) return;
  $("#dName").textContent = "Из нашего цеха"; $("#dPrices").innerHTML = ""; $("#dDesc").innerHTML = "<p>Фото из группы Цех 24 ВКонтакте.</p>"; $("#dThumbs").innerHTML = "";
  $("#dImg").src = `img/${b.dataset.g}.webp`; $("#dImg").alt = "Торт Цех 24";
  $("#dOrder").onclick = ev => { ev.preventDefault(); dlg.close(); prefill("", null); };
  dlg.showModal();
});

/* floating CTA hides near hero, form and footer */
const fc = $(".float-cta"), seen = new Set();
const io = new IntersectionObserver(es => { es.forEach(x => x.isIntersecting ? seen.add(x.target) : seen.delete(x.target)); fc.classList.toggle("hide", seen.size > 0); }, {threshold: .05});
io.observe($("#zakaz")); io.observe($(".hero")); io.observe($(".foot"));

/* lead form */
const LEAD_URL = "https://script.google.com/macros/s/AKfycby3_mdaCfx-Kv0MWD1RiwXnmTO47GtAS9zrH0WZsPcyeEGYHIRrXQjAU_EtMCfIypOW/exec";
const form = $("#form"), sent = $("#sent"), failed = $("#failed"), sendBtn = form.querySelector('[type="submit"]');
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
  const details = ["Макет tcex24", f.kind.value.trim(), f.fmt.value, f.when.value.trim() && "когда: " + f.when.value.trim(), f.how.value, comment].filter(Boolean).join(", ");
  const payload = {site: location.hostname, name: f.name.value.trim(), phone: f.phone.value.trim(), details, comment, website: f.website.value};
  sendBtn.disabled = true; sendBtn.textContent = "Отправляем…"; sent.hidden = failed.hidden = true;
  try {
    const r = await fetch(LEAD_URL, {method: "POST", headers: {"Content-Type": "text/plain;charset=utf-8"}, body: JSON.stringify(payload), signal: AbortSignal.timeout(20000)});
    if (!r.ok || (await r.json()).ok !== true) throw new Error("lead");
    form.reset(); sent.hidden = false;
  } catch { failed.hidden = false; }
  finally { sendBtn.textContent = "Отправить заявку"; sendBtn.disabled = false; }
});
