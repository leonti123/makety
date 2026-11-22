'use strict';

const $ = selector => document.querySelector(selector);
const money = amount => amount.toLocaleString('ru-RU') + ' ₽';
const categories = {
  bouquet: 'Букеты', mega: 'Мега-букеты', box: 'Шляпные коробки', bag: 'Сумочки и конверты',
  basket: 'Корзины и композиции', plants: 'Комнатные растения', roses: 'Розы поштучно', wedding: 'Свадьба и венки'
};
const formats = {bouquet: 'Букет', box: 'Шляпная коробка', bag: 'Сумочка или конверт', basket: 'Корзина или композиция'};
const moods = {
  powder: ['Нежная пудра', '#e5b6bf'], mix: ['Яркий микс', 'conic-gradient(#e25b84,#f3b247,#946cb4,#e25b84)'],
  white: ['Белый с зеленью', 'linear-gradient(130deg,#f8f7e8 50%,#91b79b 50%)'],
  red: ['Красный', '#ae3049'], lilac: ['Сиреневый', '#b29ac9'], yellow: ['Солнечный жёлтый', '#edca60']
};
const byId = new Map(gardenProducts.map(p => [p.id, p]));
const form = $('#lead');
const fields = form.elements;
const dialog = $('#product-dialog');
let category = 'bouquet';
let catalogLimit = 12;
let galleryLimit = 12;
let mood = 'powder';
let format = 'bouquet';
let openProduct;
let photoIndex;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function photo(id, alt, lazy = true) {
  const img = element('img');
  img.src = 'img/' + id + '.webp';
  img.alt = alt;
  if (lazy) img.loading = 'lazy';
  return img;
}

function productPhoto(p, index = 0) {
  if (p.photos.length) return photo(p.photos[index], p.name);
  const fallback = element('span', 'placeholder');
  fallback.innerHTML = '<svg viewBox="0 0 190 218" aria-hidden="true"><use href="#leaf"/></svg>';
  fallback.append('Фото уточняйте');
  return fallback;
}

function card(p, kind) {
  const button = element('button', kind);
  button.type = 'button';
  button.dataset.product = p.id;
  const preview = productPhoto(p);
  if (kind === 'match') {
    const frame = element('span', 'match-photo');
    frame.append(preview);
    button.append(frame, element('span', '', p.name), element('b', '', money(p.price)));
    return button;
  }
  const copy = element('span', 'card-copy');
  copy.append(element('span', 'card-name', p.name), element('b', 'price', money(p.price)));
  if (kind === 'plant') {
    button.append(preview, copy);
    return button;
  }
  const frame = element('span', 'product-photo');
  frame.append(preview);
  const badges = element('span', 'badges');
  if (/авторск/i.test(p.name)) badges.append(element('small', '', 'Авторский'));
  if (!p.available) badges.append(element('small', 'absent', 'Нет в наличии'));
  frame.append(badges);
  button.append(frame, copy);
  return button;
}

function choiceButtons(container, entries, selected, onChange, swatches = false) {
  const buttons = Object.entries(entries).map(([key, value]) => {
    const button = element('button');
    button.type = 'button';
    button.dataset.value = key;
    button.setAttribute('aria-pressed', String(key === selected));
    if (swatches) {
      const dot = element('i');
      dot.style.setProperty('--swatch', value[1]);
      button.append(dot, value[0]);
    } else button.textContent = value;
    return button;
  });
  container.replaceChildren(...buttons);
  container.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button.getAttribute('aria-pressed') === 'true') return;
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    onChange(button.dataset.value);
  });
}

function renderCatalog() {
  const all = gardenProducts.filter(p => p.category === category);
  const sort = $('#sort').value;
  if (sort !== 'popular') all.sort((a, b) => sort === 'low' ? a.price - b.price : b.price - a.price);
  $('#products').replaceChildren(...all.slice(0, catalogLimit).map(p => card(p, 'product')));
  $('#product-count').textContent = 'На витрине · ' + all.length;
  $('#more-products').hidden = catalogLimit >= all.length;
}

function renderMatches(animate = true) {
  const budget = Number($('#budget').value);
  const eligible = gardenProducts.filter(p => p.available && p.format in formats && p.price <= budget);
  function tier(p) {
    if (p.palette !== mood) return 2;
    return p.format === format ? 0 : 1;
  }
  eligible.sort((a, b) => tier(a) - tier(b) || b.price - a.price);
  const picks = eligible.slice(0, 3);
  const host = $('#matches');
  const nextKey = picks.map(p => p.id).join(',');
  $('#budget-value').textContent = money(budget);
  $('#match-note').textContent = picks.every(p => tier(p) === 0) ? 'Подходят по настроению, формату и бюджету' :
    picks.every(p => tier(p) < 2) ? 'В вашей гамме, включая другие форматы' : 'В пределах бюджета, включая близкие варианты';
  if (host.dataset.result === nextKey) return;
  document.querySelector('.outgoing')?.remove();
  const useFade = animate && !matchMedia('(prefers-reduced-motion: reduce)').matches && host.children.length > 0;
  if (useFade) {
    const previous = host.cloneNode(true);
    previous.removeAttribute('id');
    previous.classList.add('outgoing');
    previous.inert = true;
    previous.setAttribute('aria-hidden', 'true');
    host.after(previous);
    const fade = previous.animate([{opacity: 1}, {opacity: 0}], {duration: 300, fill: 'forwards'});
    fade.onfinish = () => previous.remove();
  }
  host.replaceChildren(...picks.map(p => card(p, 'match')));
  host.dataset.result = nextKey;
  if (useFade) host.animate([{opacity: 0}, {opacity: 1}], {duration: 300});
}

function renderGallery() {
  const items = windowGallery.slice(0, galleryLimit).map((id, i) => {
    const frame = element('figure');
    const product = gardenProducts.find(p => p.photos.includes(id));
    frame.append(photo(id, product?.name || 'Цветочная работа с витрины бутика, фото ' + (i + 1)));
    return frame;
  });
  $('#gallery').replaceChildren(...items);
  $('#more-works').hidden = items.length >= windowGallery.length;
}

function showSlide(index) {
  const count = openProduct.photos.length;
  photoIndex = count ? (index + count) % count : 0;
  const image = productPhoto(openProduct, photoIndex);
  if (image.tagName === 'IMG') {
    image.loading = 'eager';
    image.alt = openProduct.name + ', фото ' + (photoIndex + 1);
  }
  $('#slide-image').replaceChildren(image);
  $('.slide-nav').hidden = count < 2;
  $('#slide-count').textContent = (photoIndex + 1) + ' / ' + count;
}

function openDialog(p) {
  openProduct = p;
  $('#dialog-cat').textContent = categories[p.category] + (p.available ? '' : ' · Нет в наличии');
  $('#dialog-name').textContent = p.name;
  $('#dialog-price').textContent = money(p.price);
  $('#dialog-desc').textContent = p.description;
  $('#dialog-order').textContent = !p.available ? 'Заказать похожий' :
    p.category === 'plants' ? 'Заказать растение' : ['bouquet','mega'].includes(p.category) ? 'Заказать этот букет' : 'Заказать';
  showSlide(0);
  dialog.showModal();
  dialog.scrollTop = 0;
}

function clearSignature() {
  for (const key of ['mood','format','budget']) fields[key].value = '';
  $('#selection-note').hidden = true;
}

function startOrder(value, signature = false) {
  clearSignature();
  fields.choice.value = value;
  if (signature) {
    fields.mood.value = moods[mood][0];
    fields.format.value = formats[format];
    fields.budget.value = money(Number($('#budget').value));
    $('#selection-note').textContent = [fields.mood.value, fields.format.value, 'до ' + fields.budget.value].join(' · ');
    $('#selection-note').hidden = false;
  }
  if (dialog.open) dialog.close();
  $('#order').scrollIntoView();
  fields.name.focus({preventScroll: true});
}

const customOrder = 'На усмотрение флориста';
fields.choice.add(new Option(customOrder, 'trust'));
for (const p of gardenProducts) {
  fields.choice.add(new Option(p.name + ' · ' + money(p.price) + (p.available ? '' : ' · похожий букет'), String(p.id)));
}
fields.choice.add(new Option('Свадебное оформление', 'wedding'));
fields.choice.add(new Option('Стабилизированные гортензии', 'hydrangeas'));
fields.choice.addEventListener('change', clearSignature);
$('#trust-order').onclick = () => startOrder('trust', true);
$('#wedding-order').onclick = () => startOrder('wedding');
$('.hydrangeas a').onclick = event => { event.preventDefault(); startOrder('hydrangeas'); };
document.addEventListener('click', event => {
  const button = event.target.closest('button[data-product]');
  if (button) openDialog(byId.get(Number(button.dataset.product)));
});
$('.dialog-close').onclick = () => dialog.close();
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
$('#dialog-order').onclick = () => startOrder(String(openProduct.id));
$('#prev').onclick = () => showSlide(photoIndex - 1);
$('#next').onclick = () => showSlide(photoIndex + 1);
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') showSlide(photoIndex + 1);
  if (event.key === 'ArrowLeft') showSlide(photoIndex - 1);
});
choiceButtons($('#moods'), moods, mood, value => { mood = value; renderMatches(); }, true);
choiceButtons($('#formats'), formats, format, value => { format = value; renderMatches(); });
choiceButtons($('#categories'), categories, category, value => { category = value; catalogLimit = 12; renderCatalog(); });
$('#budget').addEventListener('input', () => renderMatches());
$('#sort').onchange = () => { catalogLimit = 12; renderCatalog(); };
$('#more-products').onclick = () => { catalogLimit += 12; renderCatalog(); };
$('#more-works').onclick = () => { galleryLimit += 12; renderGallery(); };
const fadeFrame = element('div', 'crossfade');
$('#matches').before(fadeFrame);
fadeFrame.append($('#matches'));
renderMatches(false);
renderCatalog();
renderGallery();
$('#plant-shelf').replaceChildren(...[179,182,190,188,181,189,178,150].map(id => card(byId.get(id), 'plant')));

const menu = $('#mobile-nav');
const toggle = $('.menu-toggle');
function setMenu(open) {
  menu.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
}
toggle.onclick = () => setMenu(menu.hidden);
menu.addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
});
matchMedia('(min-width:900px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
window.addEventListener('scroll', () => $('.mast').classList.toggle('scrolled', scrollY > 12), {passive:true});

const LEAD_URL = 'https://script.google.com/macros/s/AKfycby3_mdaCfx-Kv0MWD1RiwXnmTO47GtAS9zrH0WZsPcyeEGYHIRrXQjAU_EtMCfIypOW/exec';
form.addEventListener('change', () => {
  const delivery = fields.method.value === 'Доставка';
  $('#address-wrap').hidden = !delivery;
  fields.address.required = delivery;
});
form.addEventListener('input', event => {
  event.target.setCustomValidity?.('');
  $('#sent').textContent = '';
  $('#failed').hidden = true;
});
const oneLine = value => value.trim().replace(/\s+/g, ' ');
form.addEventListener('submit', async event => {
  event.preventDefault();
  const phone = fields.phone.value.trim();
  if (fields.name.value.trim().length < 2) fields.name.setCustomValidity('Укажите ваше имя');
  if (!/^\d{10,11}$/.test(phone.replace(/\D/g, ''))) fields.phone.setCustomValidity('Проверьте номер телефона');
  if (!form.reportValidity()) return;
  const submit = form.querySelector('[type=submit]');
  if (submit.disabled) return;
  submit.disabled = true;
  submit.textContent = 'Отправляем…';
  $('#failed').hidden = true;
  $('#sent').textContent = '';
  const details = [
    'Макет vera-garden', fields.choice.selectedOptions[0].textContent,
    fields.mood.value && 'Настроение: ' + fields.mood.value, fields.format.value && 'Формат: ' + fields.format.value,
    fields.budget.value && 'Бюджет: до ' + fields.budget.value, 'Дата: ' + fields.date.value,
    'Время: ' + fields.time.value, fields.method.value, fields.method.value === 'Доставка' && 'Адрес: ' + oneLine(fields.address.value),
    fields.postcard.value.trim() && 'Открытка: ' + oneLine(fields.postcard.value)
  ].filter(Boolean).join(', ');
  try {
    const response = await fetch(LEAD_URL, {
      method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, signal:AbortSignal.timeout(20000),
      body:JSON.stringify({site:location.hostname, name:oneLine(fields.name.value), phone, details:oneLine(details),
        comment:oneLine(fields.comment.value), website:fields.website.value})
    });
    if (!response.ok || (await response.json()).ok !== true) throw new Error('Заявка не принята');
    form.reset();
    clearSignature();
    $('#address-wrap').hidden = true;
    fields.address.required = false;
    $('#sent').textContent = 'Спасибо, заявка принята!';
  } catch {
    $('#failed').hidden = false;
  } finally {
    submit.disabled = false;
    submit.textContent = 'Отправить заявку';
  }
});
