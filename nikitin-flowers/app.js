"use strict";

const phone = "tel:+79645667974";
const money = new Intl.NumberFormat("ru-RU");
const catalog = document.querySelector("#catalog-grid");
const filters = document.querySelector("#filters");
const more = document.querySelector("#more");
const dialog = document.querySelector("#product-dialog");
const lockers = document.querySelector("#lockers");
const cellInfo = document.querySelector("#cell-info");
const form = document.querySelector("#lead");
const kind = form.elements.kind;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let currentTag = "Все";
let shown = 12;
let openCell = null;
let peekTimer;
let chosenDialogItem;

function icon(name) {
  return '<svg class="icon" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
}

function priceText(item) {
  return item.price === null ? "цена на витрине" : money.format(item.price) + " ₽";
}

function priceTag(item) {
  return '<span class="price' + (item.price === null ? ' unknown' : '') + '">' + priceText(item) + '</span>';
}

function dateText(item) {
  const [, month, day] = item.date.split("-");
  return (item.shop ? "в каталоге " : "был на витрине ") + day + "." + month;
}

function orderSimilar(item) {
  const label = "Похожий на «" + item.name + "»";
  let option = kind.querySelector("[data-similar]");
  if (!option) {
    option = document.createElement("option");
    option.dataset.similar = "";
    kind.add(option);
  }
  option.value = label;
  option.textContent = label;
  kind.value = label;
  kind.dispatchEvent(new Event("input", {bubbles: true}));
  closeCell();
  if (dialog.open) dialog.close();
  location.hash = "order";
  document.querySelector("#order").scrollIntoView({block: "start"});
  form.elements.name.focus({preventScroll: true});
}

function closeCell(returnFocus = false) {
  if (openCell) {
    openCell.setAttribute("aria-expanded", "false");
    if (returnFocus) openCell.focus({preventScroll: true});
  }
  openCell = null;
  cellInfo.hidden = true;
}

function cancelPreview() {
  clearTimeout(peekTimer);
  lockers.querySelector(".peek")?.classList.remove("peek");
}

function showCell(button, item) {
  cancelPreview();
  const wasOpen = openCell === button;
  closeCell();
  if (wasOpen) return;
  openCell = button;
  button.setAttribute("aria-expanded", "true");
  cellInfo.innerHTML = '<button type="button" aria-label="Закрыть ячейку" class="close-cell">' + icon("x") +
    '</button><h3>' + item.name + '</h3>' + priceTag(item) + '<p>' + item.desc +
    '</p><div class="actions"><a class="btn red" href="' + phone + '">Позвонить и отложить</a>' +
    '<button type="button" class="btn outlined">Похожий на заказ</button></div>';
  cellInfo.hidden = false;
  cellInfo.querySelector(".close-cell").onclick = () => closeCell(true);
  cellInfo.querySelector(".outlined").onclick = () => orderSimilar(item);
  if (matchMedia("(max-width: 700px)").matches) {
    cellInfo.scrollIntoView({block: "nearest"});
  }
}

const machineItems = bouquets.filter(item => item.machineCell).sort((a, b) => a.machineCell - b.machineCell);
for (const item of machineItems) {
  const n = item.machineCell;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "locker";
  button.style.setProperty("--n", n);
  button.setAttribute("aria-label", "Ячейка " + n + ". " + item.name + ", " + priceText(item));
  button.setAttribute("aria-controls", "cell-info");
  button.setAttribute("aria-expanded", "false");
  button.innerHTML = '<img src="img/cell-' + n + '.webp" width="400" height="332" alt="">' +
    '<span class="door" aria-hidden="true"></span><span class="num">' + n + '</span>' + priceTag(item);
  button.addEventListener("click", () => showCell(button, item));
  lockers.append(button);
}
if (!reducedMotion.matches) {
  const fourth = lockers.querySelectorAll(".locker")[3];
  peekTimer = setTimeout(() => {
    fourth.classList.add("peek");
    peekTimer = setTimeout(() => fourth.classList.remove("peek"), 1050);
  }, 1200);
}
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && openCell && !dialog.open) closeCell(true);
});
document.addEventListener("pointerdown", event => {
  if (openCell && !event.target.closest(".machine-scene")) closeCell();
});
document.querySelector("#min-price").textContent = money.format(Math.min(...bouquets.filter(item => item.price !== null).map(item => item.price))) + " ₽";

function renderCatalog() {
  const list = currentTag === "Все" ? bouquets : bouquets.filter(item => item.tag === currentTag);
  catalog.innerHTML = list.slice(0, shown).map(item =>
    '<button class="bouquet" data-id="' + item.id + '" type="button"><span class="picture">' +
    '<img loading="lazy" width="800" height="1067" src="' + item.photo + '" alt=""><span class="num" aria-label="Ячейка ' +
    item.cell + '">' + item.cell + '</span>' + priceTag(item) + '</span><span class="card-copy"><strong>' +
    item.name + '</strong><span class="date">' + dateText(item) + '</span></span></button>'
  ).join("");
  more.hidden = shown >= list.length;
  for (const filter of filters.children) filter.setAttribute("aria-pressed", String(filter.textContent === currentTag));
}
for (const tag of ["Все", "Розы", "Лилии", "Хризантемы", "Ромашки", "Гортензия", "Микс"]) {
  const filter = document.createElement("button");
  filter.type = "button";
  filter.textContent = tag;
  filter.className = "filter";
  filter.addEventListener("click", () => {
    currentTag = tag;
    shown = 12;
    renderCatalog();
  });
  filters.append(filter);
}
more.addEventListener("click", () => {
  const firstNew = catalog.childElementCount;
  shown += 12;
  renderCatalog();
  catalog.children[firstNew]?.focus({preventScroll: true});
});
renderCatalog();

function showDialog(item) {
  chosenDialogItem = item;
  const content = document.querySelector("#product-content");
  content.innerHTML = '<div class="dialog-picture"><img src="' + item.photo + '" alt="' + item.name +
    '"><span class="num">' + item.cell + '</span>' +
    (item.productPhoto ? '<button type="button" class="alternate">Фото из магазина</button>' : '') +
    '</div><div class="dialog-copy"><span class="date">' + dateText(item) +
    '</span><h2 id="dialog-title">' + item.name + '</h2>' + priceTag(item) + '<p>' + item.desc +
    '</p><div class="actions"><a class="btn red" href="' + phone + '">' + icon("phone") +
    'Позвонить</a><button type="button" id="similar" class="btn outlined">Заказать похожий</button></div></div>';
  const alternate = content.querySelector(".alternate");
  if (alternate) {
    let inShop = false;
    alternate.onclick = () => {
      inShop = !inShop;
      content.querySelector("img").src = inShop ? item.productPhoto : item.photo;
      alternate.textContent = inShop ? "Фото с витрины" : "Фото из магазина";
    };
  }
  content.querySelector("#similar").onclick = () => orderSimilar(chosenDialogItem);
  dialog.showModal();
  dialog.scrollTop = 0;
  document.body.classList.add("modal-open");
}
catalog.addEventListener("click", event => {
  const button = event.target.closest(".bouquet");
  if (button) showDialog(bouquets.find(item => item.id === button.dataset.id));
});
dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => document.body.classList.remove("modal-open"));
dialog.addEventListener("click", event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});

const LEAD_URL = "https://script.google.com/macros/s/AKfycby3_mdaCfx-Kv0MWD1RiwXnmTO47GtAS9zrH0WZsPcyeEGYHIRrXQjAU_EtMCfIypOW/exec";
const sent = document.querySelector("#sent");
const failed = document.querySelector("#failed");
const sendButton = form.querySelector('[type="submit"]');
form.addEventListener("input", event => {
  if (event.target.setCustomValidity) event.target.setCustomValidity("");
  sent.hidden = true;
  failed.hidden = true;
});
form.addEventListener("submit", async event => {
  event.preventDefault();
  if (sendButton.disabled) return;
  const fields = form.elements;
  if (fields.name.value.trim().length < 2) fields.name.setCustomValidity("Укажите имя.");
  const digits = fields.phone.value.replace(/\D/g, "");
  if (!/^(?:[78]\d{10}|\d{10})$/.test(digits)) fields.phone.setCustomValidity("Проверьте номер телефона.");
  if (fields.when.value && new Date(fields.when.value) < new Date()) fields.when.setCustomValidity("Укажите будущую дату и время.");
  if (!form.reportValidity()) return;
  const comment = fields.comment.value.trim().replace(/\s*\n\s*/g, "; ");
  const date = new Date(fields.when.value).toLocaleString("ru-RU", {dateStyle:"short",timeStyle:"short"});
  const details = ["Макет nikitin-flowers", kind.value, "К " + date, fields.budget.value && "Бюджет " + fields.budget.value, comment].filter(Boolean).join(", ");
  const payload = {site: location.hostname, name: fields.name.value.trim(), phone: fields.phone.value.trim(), details, comment, website: fields.website.value};
  sendButton.disabled = true;
  sendButton.textContent = "Отправляем…";
  failed.hidden = sent.hidden = true;
  try {
    const response = await fetch(LEAD_URL, {method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});
    if (!response.ok || (await response.json()).ok !== true) throw new Error("lead");
    form.reset();
    sent.hidden = false;
  } catch {
    failed.hidden = false;
  } finally {
    sendButton.textContent = "Отправить заявку";
    sendButton.disabled = false;
  }
});
