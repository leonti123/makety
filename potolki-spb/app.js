'use strict';

const PRICES = Object.freeze({canvas:800, floating:1400, shadow:1000, line:3000, cornice:3500});
const SERVICES = [
  {
    "name": "Монтаж натяжного потолка",
    "price": "от 800 ₽/м²",
    "photos": [
      "w456239409",
      "a456239246",
      "a456239177"
    ],
    "description": "Подберём полотно под высоту комнаты и расположение света. До установки отметим места под люстру, светильники и шторы.",
    "included": "Замер, разметка уровня, установка профиля и натяжка полотна.",
    "brands": "Подберём профиль и полотно на замере."
  },
  {
    "name": "Парящий потолок",
    "price": "от 1 400 ₽/м²",
    "photos": [
      "a456239357",
      "a456239363",
      "a456239331"
    ],
    "description": "Прячем светодиодную ленту в профиле у стены. Свет скользит по стене, и край потолка кажется приподнятым.",
    "included": "Разметка контура подсветки, установка профиля и ленты, проверка света.",
    "brands": "Flexy Fly, Lumfer"
  },
  {
    "name": "Теневой профиль",
    "price": "от 1 000 ₽",
    "photos": [
      "a456239301",
      "w456239415",
      "a456239214"
    ],
    "description": "Вдоль стены остаётся ровный узкий теневой шов. Он очерчивает полотно по всему периметру комнаты.",
    "included": "Подбор ширины шва, разметка примыканий и монтаж профиля.",
    "brands": "Euro KRAAB, Lumfer Umbra, Bizon"
  },
  {
    "name": "Световые линии",
    "price": "от 3 000 ₽",
    "photos": [
      "a456239273",
      "w456239429",
      "a456239201"
    ],
    "description": "Встраиваем алюминиевый профиль со светодиодной лентой в плоскость потолка. Линии можно соединить в угол, квадрат или ломаный рисунок.",
    "included": "Схема линий, стыковка профилей, монтаж ленты и рассеивателя.",
    "brands": "Flexy"
  },
  {
    "name": "Встроенный карниз",
    "price": "от 3 500 ₽",
    "photos": [
      "a456239327",
      "a456239355",
      "a456239199"
    ],
    "description": "Штора опускается из ниши в потолке. При желании добавим подсветку вдоль окна и предусмотрим место под электрокарниз.",
    "included": "Согласование глубины ниши и рядов для штор, установка карниза.",
    "brands": "Flexy Borzz 45"
  },
  {
    "name": "Магнитные треки",
    "price": "по смете",
    "photos": [
      "a456239228",
      "w456239440",
      "a456239360"
    ],
    "description": "Встраиваем направляющую в потолок. Магнитные светильники можно передвигать вдоль неё, чтобы осветить рабочую поверхность или обеденный стол.",
    "included": "Раскладка трека, подготовка питания, монтаж и проверка светильников.",
    "brands": "Lumfer, Denkirs"
  },
  {
    "name": "Тканевые потолки Descor",
    "price": "по смете",
    "photos": [
      "w456239317",
      "w456239318",
      "a456239302"
    ],
    "description": "Натягиваем матовое тканевое полотно Descor. Его можно сочетать с теневым примыканием, магнитным треком и нишей для штор.",
    "included": "Замер, подготовка профиля, закрепление и натяжка ткани.",
    "brands": "Descor Premium, Lumfer Clamp"
  },
  {
    "name": "Люстры и светильники",
    "price": "по смете",
    "photos": [
      "a456239151",
      "w456239446",
      "a456239368"
    ],
    "description": "Готовим крепление к основному потолку и вывод под светильник. Устанавливаем подвесную люстру или встраиваем точечный свет.",
    "included": "Разметка точек, подготовка закладных, крепление и подключение.",
    "brands": "BH 53, Denkirs"
  }
];

const CASES = [
  {
    "name": "ЖК Фотограф",
    "date": "24 сентября 2026",
    "photos": [
      "w456239421",
      "w456239422",
      "w456239423"
    ],
    "items": [
      "Заменили потолки от застройщика",
      "Поставили теневой и парящий профили",
      "Встроили линии Flexy и карнизы Flexy Borzz 45 с подсветкой"
    ]
  },
  {
    "name": "ЖК Беларт",
    "date": "24 августа 2026",
    "photos": [
      "w456239413",
      "w456239416",
      "w456239417"
    ],
    "items": [
      "Собрали теневой шов Euro KRAAB и парящий контур",
      "Установили магнитные треки и светильники BH 53",
      "Подсветили карнизы Flexy Borzz"
    ]
  },
  {
    "name": "ЖК Аквилон Leaves",
    "date": "7 августа 2026",
    "photos": [
      "w456239410",
      "w456239408",
      "w456239409"
    ],
    "items": [
      "Встроили световые линии Flexy",
      "Совместили теневой профиль Bizon и парящий Flexy Fly",
      "Установили карнизы Flexy Borzz 45"
    ]
  },
  {
    "name": "ЖК Golden City",
    "date": "3 июня 2026",
    "photos": [
      "w456239393",
      "w456239392",
      "w456239395"
    ],
    "items": [
      "Осветили рабочую зону кухни треком Denkirs",
      "Добавили точечный свет BH10",
      "Смонтировали теневые профили и скрытый карниз"
    ]
  },
  {
    "name": "ЖК Панорама парк Сосновка",
    "date": "7 мая 2026",
    "photos": [
      "w456239380",
      "w456239381",
      "w456239379"
    ],
    "items": [
      "Установили теневой профиль Euro KRAAB",
      "Встроили магнитные треки Denkirs",
      "Смонтировали скрытый карниз Flexy Borzz"
    ]
  },
  {
    "name": "ЖК Графика",
    "date": "2 апреля 2026",
    "photos": [
      "a456239333",
      "a456239355",
      "a456239353"
    ],
    "items": [
      "Собрали световые линии Flexy шириной 3 см",
      "Подвели парящий профиль Flexy Borzz Max",
      "Скрыли карниз в нише"
    ]
  },
  {
    "name": "ЖК Дом на Васильевском",
    "date": "31 марта 2026",
    "photos": [
      "a456239357",
      "a456239356",
      "a456239371"
    ],
    "items": [
      "Провели световые линии Flexy шириной 3 см",
      "Установили парящий профиль Lumfer",
      "Встроили карниз Flexy Borzz"
    ]
  }
];

const WORKS = [
  {
    "id": "w456239429",
    "category": "Световые линии",
    "alt": "Разомкнутый световой квадрат в тёплом свете"
  },
  {
    "id": "a456239363",
    "category": "Теневой и парящий профиль",
    "alt": "Тёплая подсветка у стены с деревянной отделкой"
  },
  {
    "id": "a456239327",
    "category": "Карнизы и шторы",
    "alt": "Тёплая подсветка над складками шторы"
  },
  {
    "id": "w456239446",
    "category": "Треки и люстры",
    "alt": "Каскад прозрачных подвесов на латунном основании"
  },
  {
    "id": "a456239179",
    "category": "Кухни и ванные",
    "alt": "Световая рамка в ванной с мраморной отделкой"
  },
  {
    "id": "a456239202",
    "category": "Световые линии",
    "alt": "Три световые линии расходятся веером"
  },
  {
    "id": "a456239275",
    "category": "Теневой и парящий профиль",
    "alt": "Стык теневого шва и подсвеченного контура"
  },
  {
    "id": "a456239355",
    "category": "Карнизы и шторы",
    "alt": "Скрытая ниша с подсветкой вдоль стены"
  },
  {
    "id": "a456239228",
    "category": "Треки и люстры",
    "alt": "Угловой магнитный трек с линейными модулями"
  },
  {
    "id": "w456239393",
    "category": "Кухни и ванные",
    "alt": "Г-образный трек над деревянной кухней"
  },
  {
    "id": "a456239273",
    "category": "Световые линии",
    "alt": "Пересечение линий на потолке в прихожей"
  },
  {
    "id": "a456239331",
    "category": "Теневой и парящий профиль",
    "alt": "Мягкий свет в углу спальни"
  },
  {
    "id": "w456239416",
    "category": "Карнизы и шторы",
    "alt": "Угловой стык встроенного карниза"
  },
  {
    "id": "a456239368",
    "category": "Треки и люстры",
    "alt": "Люстра из трёх светящихся колец"
  },
  {
    "id": "a456239247",
    "category": "Кухни и ванные",
    "alt": "Угловая линия света в ванной с зелёным камнем"
  },
  {
    "id": "a456239252",
    "category": "Световые линии",
    "alt": "Квадрат из света над кольцевым подвесом"
  },
  {
    "id": "a456239172",
    "category": "Теневой и парящий профиль",
    "alt": "Свет по периметру в зеркальной отделке"
  },
  {
    "id": "a456239199",
    "category": "Карнизы и шторы",
    "alt": "Длинная ниша с направляющими у окна"
  },
  {
    "id": "a456239151",
    "category": "Треки и люстры",
    "alt": "Люстра с рифлёными плафонами под высоким потолком"
  },
  {
    "id": "a456239085",
    "category": "Кухни и ванные",
    "alt": "Люстра-кольцо над рабочей зоной кухни"
  },
  {
    "id": "w456239428",
    "category": "Световые линии",
    "alt": "Две диагонали проходят через широкий коридор"
  },
  {
    "id": "w456239415",
    "category": "Теневой и парящий профиль",
    "alt": "Теневой зазор на внешнем углу стены"
  },
  {
    "id": "a456239328",
    "category": "Карнизы и шторы",
    "alt": "Подсвеченная штора у панорамного окна"
  },
  {
    "id": "a456239359",
    "category": "Треки и люстры",
    "alt": "Стеклянные шары на подвесе над кухней"
  },
  {
    "id": "a456239191",
    "category": "Кухни и ванные",
    "alt": "Точечный свет над тёмной мраморной плиткой"
  },
  {
    "id": "a456239181",
    "category": "Световые линии",
    "alt": "Пара прямых линий в светлой комнате"
  },
  {
    "id": "a456239017",
    "category": "Теневой и парящий профиль",
    "alt": "Подсвеченный периметр в длинной прихожей"
  },
  {
    "id": "a456239265",
    "category": "Карнизы и шторы",
    "alt": "Вид снизу на направляющие карниза"
  },
  {
    "id": "a456239369",
    "category": "Треки и люстры",
    "alt": "Чёрные подвесы и множество точечных светильников"
  },
  {
    "id": "w456239417",
    "category": "Кухни и ванные",
    "alt": "Подсвеченный край потолка над душем"
  }
];

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const money = value => Math.round(value).toLocaleString('ru-RU') + ' ₽';
const number = value => value.toLocaleString('ru-RU', {maximumFractionDigits:2});
const photoPath = id => 'img/' + id + '.jpg';
const image = (id, alt='') => '<img loading="lazy" src="' + photoPath(id) + '" alt="' + alt + '">';
const workAlt = id => WORKS.find(work => work.id === id)?.alt;

const burger = $('.burger');
function setMenu(open) {
  $('#mobile-nav').hidden = !open;
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
}
burger.onclick = () => setMenu($('#mobile-nav').hidden);
$('#mobile-nav').onclick = () => setMenu(false);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !$('#mobile-nav').hidden) {
    setMenu(false);
    burger.focus();
  }
});
matchMedia('(min-width:900px)').addEventListener('change', event => { if(event.matches) setMenu(false); });

const serviceDialog = $('#service-dialog');
const lightbox = $('#lightbox');
for (const dialog of [serviceDialog,lightbox]) {
  dialog.querySelector('.close').onclick = () => dialog.close();
  dialog.addEventListener('click', event => {
    const r = dialog.getBoundingClientRect();
    if(event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close();
  });
}
let slides = [], slideIndex = 0;
function showSlide(offset=0) {
  slideIndex = (slideIndex + offset + slides.length) % slides.length;
  const slide = slides[slideIndex];
  const img = lightbox.querySelector('img');
  img.src = photoPath(slide.id);
  img.alt = slide.alt;
  lightbox.querySelector('figcaption').textContent = slide.alt;
  lightbox.querySelector('.lb-nav span').textContent = (slideIndex+1) + ' / ' + slides.length;
}
function openPhotos(list, index) {
  slides = list;
  slideIndex = index;
  showSlide();
  lightbox.showModal();
}
lightbox.querySelector('.lb-nav button:first-child').onclick = () => showSlide(-1);
lightbox.querySelector('.lb-nav button:last-child').onclick = () => showSlide(1);
lightbox.onkeydown = event => {
  if(event.key === 'ArrowLeft') showSlide(-1);
  if(event.key === 'ArrowRight') showSlide(1);
};

$('#service-grid').innerHTML = SERVICES.map((s,i) => '<button class="service-card" data-index="'+i+'" aria-haspopup="dialog">'+image(s.photos[0])+'<span class="service-info"><strong>'+s.name+'</strong><span class="price">'+s.price+'</span></span><span aria-hidden="true" class="service-mark">+</span></button>').join('');
function openService(index) {
  const s = SERVICES[index];
  $('#service-detail').innerHTML = '<div class="detail-photos"><img class="detail-main" alt="'+s.name+'" src="'+photoPath(s.photos[0])+'"><div class="detail-thumbs">'+s.photos.map((id,i)=>'<button aria-pressed="'+(i===0)+'" aria-label="Фото '+(i+1)+'">'+image(id)+'</button>').join('')+'</div></div><div class="detail-copy"><h2 id="dlg-title">'+s.name+'</h2><div class="detail-price">'+s.price+'</div><p>'+s.description+'</p><h3>Что входит</h3><p>'+s.included+'</p><h3>Материалы</h3><p>'+s.brands+'</p><a class="btn primary" id="pick-service" href="#measure">Заказать замер</a></div>';
  const thumbs = $$('.detail-thumbs button');
  thumbs.forEach((button,i) => button.onclick = () => {
    $('.detail-main').src = photoPath(s.photos[i]);
    $('.detail-main').alt = workAlt(s.photos[i]) || s.name+', фото '+(i+1);
    thumbs.forEach(b => b.setAttribute('aria-pressed',b===button));
  });
  $('#pick-service').onclick = () => {
    serviceDialog.close();
    form.elements.service.value = s.name;
    const chip = ['Потолок','Парящий','Теневой','Линии','Карниз','Треки','Потолок',null][index];
    if(chip) form.querySelector('input[value="'+chip+'"]').checked = true;
    showSelection();
  };
  serviceDialog.showModal();
  serviceDialog.scrollTop = 0;
}
$('#service-grid').onclick = event => {
  const card = event.target.closest('.service-card');
  if(card) openService(Number(card.dataset.index));
};

$('#case-list').innerHTML = CASES.map((c,i)=>'<article class="case-card"><div class="case-images">'+c.photos.map((id,j)=>'<button data-case="'+i+'" data-photo="'+j+'" aria-label="'+c.name+', открыть фото '+(j+1)+'">'+image(id)+'</button>').join('')+'</div><div class="case-text"><span class="case-date">'+c.date+'</span><h3>'+c.name+'</h3><ul>'+c.items.map(item=>'<li>'+item+'</li>').join('')+'</ul></div></article>').join('');
$('#case-list').onclick = event => {
  const b = event.target.closest('[data-case]');
  if(!b) return;
  const c = CASES[Number(b.dataset.case)];
  openPhotos(c.photos.map((id,i)=>({id, alt:workAlt(id) || c.name+', фото '+(i+1)})),Number(b.dataset.photo));
};
const caseList = $('#case-list');
const caseBtns = $$('.rail-buttons button');
function syncCaseButtons() {
  caseBtns[0].disabled = caseList.scrollLeft <= 1;
  caseBtns[1].disabled = caseList.scrollLeft + caseList.clientWidth >= caseList.scrollWidth - 1;
}
caseBtns.forEach((b,i)=>b.onclick = () => caseList.scrollBy({left:(i ? 1 : -1)*(caseList.children[1].offsetLeft-caseList.children[0].offsetLeft)}));
caseList.onscroll = syncCaseButtons;
window.addEventListener('resize',syncCaseButtons);
syncCaseButtons();

const categories = ['Все работы',...new Set(WORKS.map(w=>w.category))];
let filteredWorks = WORKS, limit = 12;
$('#filters').innerHTML = categories.map((c,i)=>'<button aria-pressed="'+(i===0)+'">'+c+'</button>').join('');
function renderGallery() {
  $('#gallery').innerHTML = filteredWorks.slice(0,limit).map((w,i)=>'<button data-index="'+i+'" aria-label="Увеличить: '+w.alt+'">'+image(w.id,w.alt)+'</button>').join('');
  $('#more').hidden = limit >= filteredWorks.length;
}
$('#filters').onclick = event => {
  const b = event.target.closest('button');
  if(!b) return;
  $$('#filters button').forEach(el=>el.setAttribute('aria-pressed',el===b));
  filteredWorks = b.textContent===categories[0] ? WORKS : WORKS.filter(w=>w.category===b.textContent);
  limit = 12;
  renderGallery();
};
$('#more').onclick = () => { limit+=12; renderGallery(); };
$('#gallery').onclick = event => {
  const b = event.target.closest('button');
  if(b) openPhotos(filteredWorks,Number(b.dataset.index));
};
renderGallery();

const OPTIONS = {
  profile:{normal:'Обычный',shadow:'Теневой',floating:'Парящий'},
  line:{none:'Нет',single:'Одна по центру',square:'Квадрат',bolt:'Молнии'},
  light:{off:'Выключен',warm:'Тёплый 3000K',cool:'Холодный 4000K'}
};
const DEFAULT = {profile:'floating',line:'single',light:'warm'};
for(const [group,options] of Object.entries(OPTIONS)){
  $('#'+group+'-choices').innerHTML = Object.entries(options).map(([key,title])=>
    '<label><input type="radio" name="'+group+'" value="'+key+'" '+(key===DEFAULT[group]?'checked':'')+'><span>'+title+'</span></label>').join('');
}
const EXAMPLES = {
  normal:['a456239246','a456239177','a456239242'],
  shadow:['a456239301','a456239214','a456239303'],
  floating:['a456239357','a456239363','a456239331'],
  single:['a456239218','a456239266','w456239423'],
  square:['a456239333','a456239353','a456239252'],
  bolt:['a456239273','a456239274','w456239388']
};
let sampleSlides=[], latest;
function updateSamples(state){
  const line=EXAMPLES[state.line], profile=EXAMPLES[state.profile];
  const ids=line ? [line[0],line[1],state.profile==='normal' ? line[2] : profile[0]] : profile;
  if(sampleSlides.map(s=>s.id).join()===ids.join()) return;
  sampleSlides=ids.map((id,i)=>({id,alt:workAlt(id) || (line && (i<2 || state.profile==='normal') ? 'Световые линии: '+OPTIONS.line[state.line] : 'Профиль: '+OPTIONS.profile[state.profile])}));
  $('#samples').innerHTML=sampleSlides.map((s,i)=>'<button data-sample="'+i+'" aria-label="Увеличить: '+s.alt+'">'+image(s.id,s.alt)+'</button>').join('');
}
$('#samples').onclick = event => {
  const b=event.target.closest('button');
  if(b) openPhotos(sampleSlides,+b.dataset.sample);
};

// Geometry in metres drives both the drawing and its bill of materials.
function layoutLines(kind,l,w){
  const side=Math.min(l,w)*.62;
  const left=(l-side)/2, top=(w-side)/2;
  switch(kind){
    case 'single': return [[[0,w/2],[l,w/2]]];
    case 'square': return [[[left,top],[left+side,top],[left+side,top+side],[left,top+side],[left,top]]];
    case 'bolt': return [[[0,w*.82],[l*.70,0]],[[l*.32,w],[l,w*.18]]];
    default: return [];
  }
}
function readRoom(){
  const choice = name => $('#builder input[name="'+name+'"]:checked').value;
  const l=Number($('#length').value),w=Number($('#width').value);
  const profile=choice('profile'),line=choice('line'),light=choice('light');
  const spots=Number($('#spots').value),cornice=$('#cornice').checked;
  const area=l*w,perimeter=2*(l+w),corniceLength=cornice ? Math.max(l,w) : 0;
  const paths=layoutLines(line,l,w);
  const lineLength=paths.reduce((sum,path)=>sum+path.slice(1).reduce((n,[x,y],i)=>n+Math.hypot(x-path[i][0],y-path[i][1]),0),0);
  const total=area*(profile==='floating' ? PRICES.floating : PRICES.canvas)+(profile==='shadow' ? perimeter*PRICES.shadow : 0)+lineLength*PRICES.line+corniceLength*PRICES.cornice;
  return {l,w,profile,line,light,spots,cornice,area,perimeter,corniceLength,paths,lineLength,total};
}
function drawRoom(s) {
  const room=$('#room');
  const scale=Math.min(364/s.l,242/s.w),rw=s.l*scale,rh=s.w*scale;
  const x=(480-rw)/2, y=(350-rh)/2+6, right=x+rw, bottom=y+rh;
  const rect='x="'+x+'" y="'+y+'" width="'+rw+'" height="'+rh+'"';
  const strip=s.paths.map(path=>'<polyline class="lamp" fill="none" stroke-width="3" points="'+path.map(([px,py])=>(x+px*scale)+','+(y+py*scale)).join(' ')+'"/>').join('');
  let niche='';
  if(s.cornice){
    const path=s.l>=s.w ? 'M'+x+' '+(y+8)+' h'+rw : 'M'+(x+8)+' '+y+' v'+rh;
    niche='<g data-part="cornice"><path d="'+path+'" stroke="#202124" stroke-width="11"/><path class="lamp" d="'+path+'" stroke-width="2"/></g>';
  }
  const cols=Math.min(s.spots,Math.max(1,Math.ceil(Math.sqrt(s.spots*rw/rh))));
  const rows=s.spots ? Math.ceil(s.spots/cols) : 0;
  const spots=Array.from({length:s.spots},(_,i)=>{
    const row=Math.floor(i/cols), inRow=Math.min(cols,s.spots-row*cols);
    const cx=x+rw*((i%cols)+.5)/inRow,cy=y+rh*(row+.5)/rows;
    return '<circle class="lamp spot" cx="'+cx+'" cy="'+cy+'" r="4" fill="var(--lamp)" stroke-width="1"/>';
  }).join('');
  const edge=s.profile==='shadow' ? '#151719' : '#898d8c';
  const profile=s.profile==='floating' ? '<rect '+rect+' class="lamp" fill="none" stroke-width="3.5"/>' : '';
  room.dataset.light=s.light;
  room.setAttribute('aria-label','Комната '+number(s.l)+' на '+number(s.w)+' м. Профиль: '+OPTIONS.profile[s.profile]+'. Свет: '+OPTIONS.light[s.light]);
  room.innerHTML='<defs><filter id="bloom" filterUnits="userSpaceOnUse" x="0" y="0" width="480" height="350"><feGaussianBlur in="SourceGraphic" stdDeviation="4" result="halo"/><feMerge><feMergeNode in="halo"/><feMergeNode in="halo"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'+
    '<path fill="none" stroke="#a09b8f" stroke-width="1" d="M'+x+' '+(y-17)+'h'+rw+' M'+x+' '+(y-21)+'v8 M'+right+' '+(y-21)+'v8 M'+(x-16)+' '+y+'v'+rh+' M'+(x-20)+' '+y+'h8 M'+(x-20)+' '+bottom+'h8"/>'+
    '<text class="room-dim" text-anchor="middle" x="240" y="'+(y-25)+'">'+number(s.l)+' м</text><text class="room-dim" text-anchor="middle" transform="translate('+(x-23)+' '+(y+rh/2)+') rotate(-90)">'+number(s.w)+' м</text>'+
    '<rect data-profile="'+s.profile+'" '+rect+' fill="var(--floor)" stroke="'+edge+'" stroke-width="'+(s.profile==='shadow' ? 10 : 2)+'"/>'+profile+niche+'<g data-part="lines">'+strip+'</g>'+spots;
}
function refresh(){
  latest=readRoom();
  const s=latest;
  $('#length-out').textContent=number(s.l)+' м';
  $('#width-out').textContent=number(s.w)+' м';
  $('#area-out').textContent=number(s.area)+' м²';
  $('#perimeter-out').textContent=number(s.perimeter)+' м';
  $('#spots-out').textContent=s.spots+' шт.';
  $('#price-out').textContent='от '+money(s.total);
  $('#line-out').textContent=s.lineLength ? number(s.lineLength)+' м' : '';
  drawRoom(s);
  updateSamples(s);
}
$('#builder').addEventListener('input',refresh);
refresh();

const form=$('#lead-form');
const needs=['Потолок','Теневой','Парящий','Линии','Карниз','Треки'];
$('#needs').innerHTML=needs.map(n=>'<label><input type="checkbox" name="need" value="'+n+'"><span>'+n+'</span></label>').join('');
function showSelection(){
  const f=form.elements;
  const text=[f.service.value,f.estimate.value].filter(Boolean).join('. ');
  $('#selection p').textContent=text;
  $('#selection').hidden=!text;
}
$('#selection button').onclick=()=>{
  form.elements.estimate.value='';
  form.elements.service.value='';
  showSelection();
};
$('#apply-estimate').onclick=()=>{
  const s=latest;
  form.elements.area.value=number(s.area);
  form.elements.estimate.value=[
    'Комната '+number(s.l)+' × '+number(s.w)+' м ('+number(s.area)+' м², периметр '+number(s.perimeter)+' м)',
    'профиль: '+OPTIONS.profile[s.profile],
    'линии: '+OPTIONS.line[s.line]+(s.lineLength?' ('+number(s.lineLength)+' м)':''),
    'карниз: '+(s.cornice?number(s.corniceLength)+' м':'нет'),
    'светильники: '+s.spots+' шт.', 'свет: '+OPTIONS.light[s.light],
    'от '+money(s.total)
  ].join(', ');
  showSelection();
};

const LEAD_URL = "https://script.google.com/macros/s/AKfycby3_mdaCfx-Kv0MWD1RiwXnmTO47GtAS9zrH0WZsPcyeEGYHIRrXQjAU_EtMCfIypOW/exec";
const oneLine = value => value.trim().replace(/\s*[\r\n]+\s*/g,' ');
form.addEventListener('submit',async event=>{
  event.preventDefault();
  const f=form.elements;
  const digits=f.phone.value.replace(/\D/g,'');
  if(f.name.value.trim().length<2 || !/^[78]\d{10}$/.test(digits)){
    const bad=f.name.value.trim().length<2 ? f.name : f.phone;
    $('#err').textContent=bad===f.name?'Укажите имя':'Укажите телефон из 11 цифр, начиная с +7 или 8';
    bad.focus();
    return;
  }
  $('#err').textContent='';
  $('#fallback').hidden=true;
  const btn=$('#send');
  if(btn.disabled) return;
  btn.disabled=true;
  btn.textContent='Отправляем…';
  const selections=$$('input[name=need]:checked').map(el=>el.value);
  const details=['Макет potolki-spb',f.district.value.trim() && 'Район или ЖК: '+oneLine(f.district.value),
    f.area.value.trim() && 'Площадь, м²: '+oneLine(f.area.value),
    selections.length && 'Что нужно: '+selections.join(', '),
    f.service.value && 'Услуга: '+f.service.value, f.estimate.value && 'Расчёт: '+f.estimate.value].filter(Boolean).join(', ');
  let ok=false;
  try{
    const res=await fetch(LEAD_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},signal:AbortSignal.timeout(20000),
      body:JSON.stringify({site:location.hostname,name:oneLine(f.name.value),phone:f.phone.value.trim(),details,comment:oneLine(f.comment.value),website:f.website.value})});
    ok=(await res.json()).ok===true;
  }catch{}
  btn.disabled=false;
  btn.textContent='Вызвать замерщика';
  btn.hidden=ok;
  $('#sent').hidden=!ok;
  $('#fallback').hidden=ok;
});
