'use strict';

const byId = id => document.getElementById(id);
const photos = {
  tav: 'market_14528894_4', milk: 'market_14414611_1', ester: 'post_5_457239031',
  lambeth: 'post_30_457239130', tira: 'post_12_457239046', black: 'post_17_457239075',
  napoleon: 'service_14502100_457239059', kiev: 'post_28_457239126', cherry: 'post_32_457239135',
  bunny: 'post_9_457239038', spider: 'post_35_457239145', baby: 'post_22_457239087',
  babyCut: 'post_22_457239088', message: 'post_22_457239090', owl: 'post_15_457239070',
  cups: 'post_25_457239118', eclairs: 'post_13_457239055', pumpkin: 'market_14860708_15',
  rasp: 'market_14609659_14',
  numberCake: 'max-015-02', apricot: 'max-010-01', stump: 'max-050-01',
  truffles: 'max-008-01', potato: 'max-034-03', sphere: 'max-057-01'
};

function picture(key, alt, sizes, lazy = false) {
  const base = 'img/' + photos[key] + '-';
  const el = document.createElement('picture');
  const src = document.createElement('source');
  src.type = 'image/webp';
  src.srcset = base + '640.webp 640w, ' + base + '1280.webp 1280w';
  src.sizes = sizes;
  const img = new Image();
  if (lazy) img.loading = 'lazy';
  img.alt = alt;
  img.sizes = sizes;
  img.srcset = base + '640.jpg 640w, ' + base + '1280.jpg 1280w';
  img.src = base + '640.jpg';
  el.append(src, img);
  return el;
}

const displayCakes = [
  ['milk', 'Молочная девочка'], ['lambeth', 'Ламбет'],
  ['ester', 'Эстерхази'], ['tira', 'Тирамису']
];
const heroPhoto = byId('hero-photo');
for (const [key, title] of displayCakes) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'thumb';
  button.setAttribute('aria-label', title);
  button.setAttribute('aria-pressed', 'false');
  button.title = title;
  button.append(picture(key, '', '40px'));
  button.addEventListener('click', () => {
    const reset = button.getAttribute('aria-pressed') === 'true';
    for (const other of byId('thumbs').children) other.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-pressed', String(!reset));
    const name = reset ? 'Таврический' : title;
    const next = picture(reset ? 'tav' : key, name, '(max-width:700px) 300px, 420px');
    heroPhoto.replaceChildren(next);
    next.classList.add('turn');
    byId('hero-name').textContent = name;
  });
  byId('thumbs').append(button);
}

const decor = [
  {short:'Цветы', name:'Цветы из крема', text:'Нежные пионы, розы или хризантемы. Анна отсаживает каждый цветок вручную.', photo:'cups', alt:'Розово-белые цветы из крема на капкейках'},
  {short:'Ягоды', name:'Свежие ягоды', text:'Малина, клубника или черника по сезону. Ягоды для декора оплачиваются отдельно.', photo:'rasp', alt:'Меренговый рулет со свежей малиной'},
  {short:'Меренга', name:'Меренговые облака', text:'Воздушная меренга — лёгкие облака на поверхности торта.'},
  {short:'Картинка', name:'Сахарная картинка', text:'На сахарную картинку можно перенести фото, надпись или рисунок. На этом бенто — сова к началу учебного года.', photo:'owl', alt:'Школьный бенто с изображением совы'},
  {short:'Надпись', name:'Надпись шоколадом или кремом', text:'Имя, короткая фраза или одно слово, как на белом торте Baby. Текст можно оставить в комментарии к заказу.', photo:'baby', alt:'Торт с надписью Baby', second:'message', secondAlt:'Торт с надписью «Ура! В декрет»'},
  {short:'Фигурки', name:'Фигурки из мастики', text:'Звери, куклы, любимые герои или логотип. Для этого детского торта Анна сделала съедобного зайку.', photo:'bunny', alt:'Розовый детский торт с фигуркой зайки'},
  {short:'Поталь и изомальт', name:'Золото, поталь и изомальт', text:'Фольга, поталь и золотые бусины дают блеск. Из изомальта получаются прозрачные крылья, шары, капли и лепестки.', photo:'tav', alt:'Золотистый ажурный декор Таврического'},
  {short:'Ярусы', name:'Ярусы и сложная геометрия', text:'Для многоярусной композиции Анна заранее обсудит с вами вес, форму и фото-пример.'}
];

const decorLevels = {
  simple: 'Простой декор · 3–5\u00a0дней',
  complex: 'Сложный декор · 5–7\u00a0дней'
};
const tagColors = {
  'Хит': 'rose', 'Классика': 'gold', 'Детский': 'sage',
  'Шоколадный': 'cocoa', 'На свадьбу': 'rose', 'Гендер-пати': 'sage'
};

const scale = byId('scale-options');
const decorSelect = byId('form-decor');
let selectedDecor = 0;
function selectDecor(index, focus = false) {
  selectedDecor = index;
  const item = decor[index];
  Array.from(scale.children).forEach((button, i) => {
    button.tabIndex = i === index ? 0 : -1;
    button.setAttribute('aria-checked', String(i === index));
  });
  const active = scale.children[index];
  if (focus) {
    active.focus({preventScroll:true});
    if (scale.scrollWidth > scale.clientWidth) {
      scale.scrollLeft += active.getBoundingClientRect().left - scale.getBoundingClientRect().left - (scale.clientWidth - active.offsetWidth) / 2;
    }
  }
  const level = index < 5 ? 'simple' : 'complex';
  byId('decor-time').dataset.level = level;
  byId('decor-time').textContent = decorLevels[level];
  byId('decor-name').textContent = item.name;
  byId('decor-info').textContent = item.text;
  const photo = byId('decor-photo');
  photo.replaceChildren();
  if (item.photo) photo.append(picture(item.photo, item.alt, '(max-width:700px) 90vw, 500px'));
  if (item.second) photo.append(picture(item.second, item.secondAlt, '240px'));
}
decor.forEach((item, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = index < 5 ? 'stop' : 'stop complex';
  button.textContent = item.short;
  button.setAttribute('role', 'radio');
  button.setAttribute('aria-label', item.name);
  button.addEventListener('click', () => selectDecor(index, true));
  scale.append(button);
  decorSelect.add(new Option(item.name, item.name));
});
scale.addEventListener('keydown', event => {
  let next = selectedDecor;
  switch (event.key) {
    case 'ArrowLeft': case 'ArrowUp': next--; break;
    case 'ArrowRight': case 'ArrowDown': next++; break;
    case 'Home': next = 0; break;
    case 'End': next = decor.length - 1; break;
    default: return;
  }
  event.preventDefault();
  selectDecor((next + decor.length) % decor.length, true);
});
function pointOnScale(event) {
  if (!matchMedia('(min-width:701px)').matches) return;
  const bounds = scale.getBoundingClientRect();
  const next = Math.max(0, Math.min(decor.length - 1, Math.floor((event.clientX - bounds.left) / bounds.width * decor.length)));
  if (next !== selectedDecor) selectDecor(next, true);
}
scale.addEventListener('pointerdown', event => {
  if (event.button !== 0 || !matchMedia('(min-width:701px)').matches) return;
  scale.setPointerCapture(event.pointerId);
  pointOnScale(event);
});
scale.addEventListener('pointermove', event => {
  if (scale.hasPointerCapture(event.pointerId)) pointOnScale(event);
});
selectDecor(0);
byId('apply-decor').addEventListener('click', () => {
  decorSelect.value = decor[selectedDecor].name;
});

const customPrice = 'Цена по декору';
const generalTerms = 'Праздничный торт от 1,7 кг. Простой декор заказывайте за 3–5 дней, сложный — за 5–7.';
const categories = {
  'Торты': [
    {name:'Таврический', photo:'tav', tag:'Хит', decorLevel:'complex', summary:'Венский бисквит и безе с фундуком', ingredients:'Венские бисквитные коржи, крем с варёной сгущёнкой и шоколадное безе с фундуком. Для оформления Анна использует бельгийский шоколад.'},
    {name:'Молочная девочка с малиной', photo:'milk', tag:'Хит', decorLevel:'simple', summary:'Маскарпоне и малиновое конфи', ingredients:'Мягкие сливочные коржи на натуральном масле, крем-чиз с маскарпоне и конфи из свежей малины. Можно выбрать другую ягодную или фруктовую прослойку.', terms:'От 1,8 кг. Заказ за 2–3 дня, сроки оформления Анна уточнит отдельно.', min:1.8},
    {name:'Эстерхази', photo:'ester', tag:'Классика', decorLevel:'simple', summary:'Миндальные коржи и заварной крем', ingredients:'Тонкие миндально-белковые коржи, заварной крем с коньячной нотой и венгерская глазурь с шоколадной паутинкой.'},
    {name:'Чёрный лес', photo:'black', tag:'Шоколадный', decorLevel:'simple', summary:'Шоколадные коржи и сливочный крем', ingredients:'Шоколадные коржи и лёгкий сливочный крем. Анна готовит этот вариант без вишни.', terms:'Изготовление до 3 дней. Вес и дополнительные украшения обсудите с Анной.'},
    {name:'Наполеон', photo:'napoleon', tag:'Классика', decorLevel:'simple', summary:'Слоёные коржи и крем на выбор', ingredients:'Слоёные коржи и крем «Дипломат» из заварного крема и взбитых сливок. Второй вариант — крем с варёной сгущёнкой.', terms:'От 1 кг, около 6–8 порций. Заказ за 2–3 дня.', min:1},
    {name:'Киевский', photo:'kiev', tag:'', decorLevel:'simple', summary:'Крем «Шарлотт», фундук и ганаш', ingredients:'Крем «Шарлотт», фундук, шоколадный ганаш и обсыпка из дроблёного фундука. Сверху — шоколадное безе с кусочками орехов.'},
    {name:'Вишня в шоколаде', photo:'cherry', tag:'Шоколадный', decorLevel:'simple', summary:'Тёмный шоколад и вишнёвое конфи', ingredients:'Шоколадный бисквит, ганаш на тёмном шоколаде Callebaut, вишнёвое конфи и кусочки вишни.'},
    {name:'Торт-цифра', photo:'numberCake', decorLevel:'simple', summary:'Миндальное песочное тесто и клубника', ingredients:'Песочные коржи с миндальной мукой, крем из маскарпоне и творожного сыра. Сверху Анна выкладывает свежую клубнику и хрустящее безе.'},
    {name:'Муссовый с абрикосом', photo:'apricot', decorLevel:'simple', summary:'Шоколадный бисквит, мусс и абрикосовый курд', ingredients:'Влажный шоколадный бисквит, абрикосовый курд и мусс на бельгийском шоколаде Callebaut. Снаружи — бархатистое велюровое покрытие.'},
    {name:'Пенёк', photo:'stump', decorLevel:'complex', summary:'Японский бисквит и шоколадный ганаш', ingredients:'Японский бисквит с ганашем на шоколаде Barry. Анна оформляет срез и кору шоколадом и украшает торт маленькими грибами.'},
    {name:'Ламбет', photo:'lambeth', tag:'На свадьбу', decorLevel:'simple', summary:'Кремовые цветы и рельефные бордюры', ingredients:'Светло-зелёный торт в стиле «Ламбет» с кремовыми цветами. Начинку Анна уточнит при заказе.'},
    {name:'Торт с зайкой', photo:'bunny', tag:'Детский', decorLevel:'complex', summary:'Черника с лимоном и маскарпоне', ingredients:'Ванильный бисквит, чернично-лимонная начинка, крем на маскарпоне и ганаш на бельгийском шоколаде Callebaut. Зайка, шарики и бабочка съедобные.'},
    {name:'Человек-паук', photo:'spider', tag:'Детский', decorLevel:'simple', summary:'Детский торт с тематическим декором', ingredients:'Синяя крошка, силуэт города и цифра для именинника. Состав начинки Анна уточнит при заказе.'},
    {name:'Гендер-торт Baby', photo:'baby', tag:'Гендер-пати', decorLevel:'simple', cut:'babyCut', summary:'Белый крем и цветная середина', ingredients:'Белый торт в стиле «Ламбет» с надписью Baby. Цвет спрятан внутри до первого разреза. Вкус и оформление обсудите с Анной.'}
  ],
  'Рулеты': [
    {name:'Тыквенно-карамельный', price:'2 200 ₽/кг',  photo:'pumpkin', summary:'Тыквенный бисквит и малина', ingredients:'Тыквенный бисквит с карамельным вкусом, крем на маскарпоне и домашнее малиновое конфи.', terms:'На фото рулет весом 1,2 кг. Дату согласуйте с Анной.'},
    {name:'Тирамису', price:'2 200 ₽/кг',  photo:'tira', summary:'Кофейный бисквит и маскарпоне', ingredients:'Бисквит, пропитанный натуральным кофе, крем из итальянского маскарпоне и лёгкая какао-посыпка.', terms:'От 1,2 кг, на 8–10 порций. Хранение до 3 суток в холодильнике.', min:1.2},
    {name:'Шоколадный рулет', price:'2 500 ₽/кг',  summary:'Какао, крем-чиз и черничное конфи', ingredients:'Шоколадный бисквит на какао Barry Callebaut, крем-чиз и кисло-сладкое черничное конфи с ягодами.', terms:'В витрине Анны указан пример весом 1,2 кг. Вес вашего рулета и дату можно обсудить при заказе.'},
    {name:'Меренговый с малиной', price:'2 800 ₽',  photo:'rasp', position:'50% 8%', summary:'Воздушная меренга и свежая малина', ingredients:'Нежная меренга с начинкой из свежей малины.', terms:'Вес рулета из витрины — 1,2 кг. Дату и оформление уточните при заказе.'}
  ],
  'Эклеры и капкейки': [
    {name:'Капкейки', price:'300 ₽/шт.',  photo:'cups', summary:'Бисквит, начинка и кремовые цветы', ingredients:'Ванильный, шоколадный или апельсиновый бисквит. Крем-чиз или маскарпоне. Начинки на выбор — шоколад, абрикос, черника, ваниль, апельсин, манго или вишня.', terms:'Наборы по 6 или 12 штук в подарочной коробке. Дату уточните при заказе.'},
    {name:'Эклеры', price:'1 500 ₽ за 10 шт.',  photo:'eclairs', summary:'Маскарпоне, «Дипломат» или сгущёнка', ingredients:'Эклеры с маскарпоне, кремом «Дипломат» или варёной сгущёнкой. У Анны также есть вариант со сливочно-шоколадным ганашем на какао Barry.', terms:'Набор из 10 эклеров. Изготовление до 3 дней.'}
  ],
  'Десертные наборы': [
    {name:'Трюфели', photo:'truffles', summary:'Шоколад Callebaut и ганаш', ingredients:'Анна вручную формует конфеты с начинкой из классического ганаша, глазирует шоколадом и украшает каждую.', terms:'Состав набора и дату выдачи обсудите с Анной.'},
    {name:'Картошка в шоколаде', photo:'potato', summary:'Мягкая серединка и хрустящая глазурь', ingredients:'Пирожные с влажной серединкой под шоколадной корочкой. Анна упаковывает их в подарочную коробку.', terms:'Количество пирожных и дату выдачи уточните при заказе.'},
    {name:'Апельсиновые сферы', photo:'sphere', summary:'Мусс с апельсиновым конфи', ingredients:'Под тонкой хрустящей оболочкой — воздушный мусс и яркая серединка из апельсинового конфи.', terms:'Анна собирает наборы по предзаказу.'}
  ],
  'Бенто': [
    {name:'Бенто к 1 сентября', price:'от 1 700 ₽',  photo:'owl', summary:'Небольшой торт с начинкой на выбор', ingredients:'Ванильный или шоколадный бисквит, маскарпоне и ягодное конфи. Вместо ягод можно выбрать карамель, сгущёнку или шоколад. Сверху — сахарная картинка.', terms:'Вес и срок Анна согласует после выбора оформления.'}
  ]
};

const dialog = byId('product-dialog');
const form = byId('lead-form');
let chosenProduct;
let currentCategory;
function showProduct(item) {
  chosenProduct = item;
  byId('product-title').textContent = item.name;
  byId('product-price').textContent = item.price || (item.decorLevel ? customPrice : 'Цена по запросу');
  byId('product-ingredients').textContent = item.ingredients;
  byId('product-terms').textContent = item.terms || generalTerms;
  const container = byId('dialog-photo');
  container.replaceChildren();
  if (item.photo) container.append(picture(item.photo, item.name, '(max-width:899px) 82vw, 390px'));
  if (item.cut) container.append(picture(item.cut, 'Голубая середина в разрезе', '180px'));
  dialog.showModal();
  dialog.scrollTop = 0;
}
function span(style, value) {
  const node = document.createElement('span');
  node.className = style;
  node.textContent = value;
  return node;
}
function filterCatalog(category) {
  currentCategory = category;
  for (const el of byId('filters').children) el.setAttribute('aria-pressed', String(el.textContent === category));
  const cards = categories[category].map(item => {
    const card = document.createElement('article');
    card.className = 'product';
    const media = document.createElement('div');
    media.className = 'product-media';
    if (item.photo) {
      const image = picture(item.photo, '', '(max-width:700px) 46vw, (max-width:950px) 31vw, 264px', true);
      if (item.position) image.querySelector('img').style.objectPosition = item.position;
      media.append(image);
      media.dataset.photo = item.photo;
    } else {
      media.append(span('recipe','Какао Barry Callebaut · крем-чиз · черника'));
    }
    if (item.tag) {
      const tag = span('product-tag ' + tagColors[item.tag], item.tag);
      if (item.tag === 'Хит') {
        const star = span('tag-star', '★');
        star.setAttribute('aria-hidden', 'true');
        tag.prepend(star);
      }
      media.append(tag);
    }

    const copy = document.createElement('div');
    copy.className = 'product-copy';
    const heading = document.createElement('h3');
    const details = document.createElement('button');
    details.type = 'button';
    details.className = 'product-name';
    details.textContent = item.name;
    details.setAttribute('aria-haspopup', 'dialog');
    details.addEventListener('click', () => showProduct(item));
    heading.append(details);
    copy.append(heading, span('product-summary', item.summary));
    if (item.decorLevel) {
      const footer = document.createElement('div');
      footer.className = 'product-footer';
      const level = span('decor-chip', decorLevels[item.decorLevel].replace(' декор', ''));
      level.dataset.level = item.decorLevel;
      const order = document.createElement('button');
      order.type = 'button';
      order.className = 'quick-order';
      order.textContent = '+';
      order.setAttribute('aria-label', 'Заказать ' + item.name);
      order.addEventListener('click', () => orderProduct(item));
      footer.append(level, span('price-note', customPrice), order);
      copy.append(footer);
    } else {
      copy.append(span('price', item.price || 'Цена по запросу'));
    }
    card.append(media, copy);
    return card;
  });
  byId('products').replaceChildren(...cards);
}
for (const category of Object.keys(categories)) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'filter';
  button.textContent = category;
  button.addEventListener('click', () => filterCatalog(category));
  byId('filters').append(button);
}
filterCatalog('Торты');
byId('close-product').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
const weight = form.elements.weight;
function setWeight(min) {
  weight.min = min ?? '0.1';
  weight.placeholder = min ? 'От ' + String(min).replace('.', ',') + ' кг' : 'По желанию';
}
function orderProduct(item) {
  byId('filling').value = item.name;
  setWeight(item.min ?? (currentCategory === 'Торты' ? 1.7 : null));
  if (dialog.open) dialog.close();
  location.hash = 'order';
  byId('order').scrollIntoView();
  form.elements.name.focus({preventScroll:true});
}
byId('order-product').addEventListener('click', () => orderProduct(chosenProduct));
byId('filling').addEventListener('input', () => {
  const query = byId('filling').value.trim().toLocaleLowerCase('ru');
  for (const [category, items] of Object.entries(categories)) {
    const item = items.find(product => product.name.toLocaleLowerCase('ru') === query);
    if (item) return setWeight(item.min ?? (category === 'Торты' ? 1.7 : null));
  }
  setWeight(1.7);
});

const LEAD_URL = 'https://script.google.com/macros/s/AKfycby3_mdaCfx-Kv0MWD1RiwXnmTO47GtAS9zrH0WZsPcyeEGYHIRrXQjAU_EtMCfIypOW/exec';
const send = byId('submit-lead');
form.elements.phone.addEventListener('input', () => form.elements.phone.setCustomValidity(''));
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (send.disabled || send.hidden) return;
  const digits = form.elements.phone.value.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    form.elements.phone.setCustomValidity('Укажите номер с кодом города или оператора');
    form.elements.phone.reportValidity();
    return;
  }
  const data = new FormData(form);
  const details = ['Макет torty-ot-anny'];
  for (const [name, label] of Object.entries({date:'Дата', occasion:'Повод', weight:'Вес, кг', decor:'Декор', filling:'Начинка или десерт'})) {
    if (data.get(name)) details.push(label + ': ' + data.get(name));
  }
  byId('error').hidden = true;
  send.textContent = 'Отправляем…';
  send.disabled = true;
  try {
    const response = await fetch(LEAD_URL, {
      method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, signal:AbortSignal.timeout(20000),
      body:JSON.stringify({site:location.hostname, name:data.get('name').trim(), phone:data.get('phone'), details:details.join(', '), comment:data.get('comment').trim(), website:data.get('website')})
    });
    if (!response.ok || (await response.json()).ok !== true) throw new Error('Rejected');
    send.hidden = true;
    byId('sent').hidden = false;
  } catch {
    byId('error').hidden = false;
  } finally {
    send.textContent = 'Отправить заявку';
    send.disabled = false;
  }
});
