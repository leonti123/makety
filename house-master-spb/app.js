(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));

  /* ---------- services ---------- */
  const SERVICES = [
    {t: 'Квартира под ключ', img: 'p536_2', p: 'по смете после замера', d: 'Комплексный ремонт от демонтажа до уборки, одна команда на все работы.',
      list: ['демонтаж, стяжка, штукатурка по маякам', 'электрика, сантехника, отопление', 'плитка, полы, покраска или обои', 'двери, свет, вывоз мусора и уборка']},
    {t: 'Дизайнерский ремонт', img: 'p529_4', p: '12 000 – 45 000 ₽ за м²', d: 'Ремонт по дизайн-проекту под ключ: от замера и сметы до чистовой отделки.',
      list: ['выезд на объект и замер', 'дизайн-проект, интерьер и смета', 'общестроительные и демонтажные работы', 'закупка и доставка черновых материалов', 'инженерия: электрика, сантехника, отопление, вентиляция', 'чистовая отделка, уборка и вывоз мусора']},
    {t: 'Отделка по дизайн-проекту', img: 'p531_3', p: 'от 12 000 ₽ за м²', d: 'Пришлите проект, посчитаем стоимость и оперативно его реализуем.',
      list: ['крупноформатный керамогранит и мрамор', 'скрытые латунные и алюминиевые профили', 'декоративные панели и подсветка', 'работа вместе с вашим дизайнером']},
    {t: 'Отделка по проекту заказчика', img: 'p526_9', p: 'от 4 000 ₽ за м²', d: 'Работаем по вашему плану и материалам, составляем подробную смету.',
      list: ['детальная смета по позициям', 'бесплатный выезд на замер', 'отделка квартир, офисов, домов']},
    {t: 'Санузел и ванная под ключ', img: 'p488_0', p: 'по смете после замера', d: 'Ванные и туалеты любого размера, от 1×1 м до совмещённых.',
      list: ['разводка труб и инсталляция', 'гидроизоляция', 'плитка по лазеру, запил углов под 45°', 'душевые с трапом и стеклом', 'сантехника, полотенцесушитель, свет', 'пример: небольшой санузел с декоративной покраской, работы 70\u00a0000\u00a0₽']},
    {t: 'Комната под ключ', img: 'p496_8', p: 'по смете после замера', d: 'Демонтаж старой отделки, ровные стены, новый пол и свет.',
      list: ['демонтаж штукатурки, обоев, покрытия пола', 'шпаклёвка и покраска в два слоя', 'выравнивание пола и новое покрытие', 'розетки, выключатели, освещение', 'подводка к отоплению']},
    {t: 'Балкон и лоджия', img: 'p462_0', p: 'по смете после замера', d: 'Утепление и отделка под ключ, можно с тёплым полом.',
      list: ['утепление стен, пола и потолка', 'тёплый пол', 'панели или декоративная штукатурка', 'подоконники, свет и розетки']},
    {t: 'Плитка и керамогранит', img: 'p531_8', p: 'по смете после замера', d: 'Любой формат и сложность, от мозаики до плит 60×120.',
      list: ['полный объём подготовки: грунт, гидроизоляция', 'облицовка стен с контролем каждого ряда по лазеру', 'углы с профилем или запилом под 45°', 'эпоксидная затирка, фартуки кухни', 'все отверстия под розетки и трубы']},
    {t: 'Электромонтаж', img: 'p517_2', p: 'по смете после замера', d: 'От замены розеток до разводки всей квартиры и умного дома.',
      list: ['разводка электрики по квартире', 'сборка щитков, автоматы', 'розетки, выключатели, светильники', 'умный дом']},
    {t: 'Сантехника', img: 'p441_0', p: 'по смете после замера', d: 'Трубы, инсталляции, радиаторы, установка ванн и душевых.',
      list: ['разводка холодной и горячей воды', 'инсталляции и подвесные унитазы', 'радиаторы и полотенцесушители', 'смесители любой сложности']},
    {t: 'Декор стен и потолков', img: 'p526_3', p: 'по смете после замера', d: 'Молдинги, стеновые панели, декоративная штукатурка, травертин.',
      list: ['молдинги и рейки, оформление ТВ-зоны', 'декоративная штукатурка, травертин', 'потолки из гипсокартона, подсветка', 'панно из панелей на стену']},
    {t: 'Офисы и коммерция', img: 'p421_1', p: 'по смете после замера', d: 'Офисы, пункты выдачи, кабинеты. Делали офис в Москве под ключ.',
      list: ['пункты выдачи заказов', 'офисы и кабинеты', 'сборка мебели, вывески, видеонаблюдение', 'работы в сжатые сроки']}
  ];
  $('#svc-grid').innerHTML = SERVICES.map((s, i) => `<button class="svc" type="button" data-i="${i}">
    <span class="svc-img"><img src="img/${s.img}-s.webp" alt="" loading="lazy"></span>
    <span class="svc-b"><h3>${esc(s.t)}</h3><span class="svc-d">${esc(s.d)}</span><span class="svc-p">${esc(s.p)}</span></span></button>`).join('');
  const dlg = $('#svc-dlg');
  $('#svc-grid').addEventListener('click', e => {
    const b = e.target.closest('.svc'); if (!b) return;
    const s = SERVICES[b.dataset.i];
    $('#dlg-img').src = `img/${s.img}.webp`; $('#dlg-img').alt = s.t;
    $('#dlg-title').textContent = s.t; $('#dlg-price').textContent = s.p; $('#dlg-desc').textContent = s.d;
    $('#dlg-list').innerHTML = s.list.map(x => `<li>${esc(x)}</li>`).join('');
    $('#dlg-cta').onclick = () => { setComment(`Услуга: ${s.t}`); };
    dlg.showModal();
  });
  $$('dialog').forEach(d => {
    d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
  });

  /* ---------- works ---------- */
  const CAP = {536: 'Квартира 100 м², 2026', 531: 'Санузел: мрамор и латунь', 529: 'Квартира в современном стиле', 233: 'Квартира в современном стиле', 526: 'Декор стен и подсветка', 524: 'Молдинги и стеновые панели',
    527: 'Фартук кухни, эпоксидная затирка', 498: 'Стены с молдингами', 496: 'Квартира: стены и полы', 488: 'Санузел под мрамор', 485: 'Ванная с угловой ванной', 486: 'Компактная душевая',
    484: 'Коридор с подсветкой', 477: 'Комната под ключ', 426: 'Квартира-студия', 421: 'Офис 24 м²', 420: 'Декоративная штукатурка травертин', 430: 'Декоративная штукатурка',
    434: 'Косметологический кабинет', 462: 'Лоджия с утеплением', 459: 'Лоджия под ключ', 492: 'Лоджия 7 м²: тёплый пол и штукатурка', 204: 'Лоджия с утеплением', 183: 'Кухня',
    102: 'Кухня 12 м²', 428: 'Кухня и плитка', 200: 'Офис в Москве под ключ', 447: 'Ванная под ключ', 416: 'Пятикомнатная квартира, Сосновый Бор', 417: 'Совмещённый санузел',
    218: 'Санузел и ванная', 201: 'Ремонт квартиры', 407: 'Ванная, Сосновый Бор', 405: 'Ванная 1,6×1,6 м', 130: 'Санузел', 401: 'Дом с перепланировкой'};
  const W = {
    bath: 'p531_0 p488_3 p485_5 p531_4 p486_0 p485_0 p529_0 p447_3 p416_3 p233_1 p218_5 p417_0 p201_4 p488_5 p485_3 p407_0 p405_0 p130_0 p201_2 p531_8',
    room: 'p529_7 p498_0 p526_2 p496_8 p529_5 p484_6 p524_1 p536_8 p529_8 p477_0 p488_6 p526_7 p498_3 p233_6 p529_9 p496_0 p484_8 p426_6 p524_3 p420_0 p529_3 p496_1 p477_3 p426_9 p430_0 p401_6 p488_7',
    kitchen: 'p527_3 p527_2 p183_0 p102_0 p428_0',
    balcony: 'p492_0 p462_0 p492_4 p462_4 p459_3 p492_5 p204_2',
    office: 'p421_0 p421_1 p200_0 p434_0'
  };
  const items = {};
  Object.entries(W).forEach(([c, s]) => items[c] = s.split(' ').map(k => ({k, c, cap: CAP[k.slice(1).split('_')[0]] || ''})));
  const mix = [];
  const q = {bath: [...items.bath], room: [...items.room], kitchen: [...items.kitchen], balcony: [...items.balcony], office: [...items.office]};
  const pattern = ['bath', 'room', 'room', 'bath', 'balcony', 'room', 'kitchen', 'bath', 'room', 'office'];
  while (Object.values(q).some(a => a.length)) pattern.forEach(c => { if (q[c].length) mix.push(q[c].shift()); });
  let cat = 'all', shown = 12, list = mix;
  const grid = $('#w-grid'), more = $('#w-more');
  function renderWorks() {
    list = cat === 'all' ? mix : items[cat];
    grid.innerHTML = list.slice(0, shown).map((it, i) => `<button class="wi" type="button" data-i="${i}"><img src="img/${it.k}-s.webp" alt="${esc(it.cap)}" loading="lazy"><span>${esc(it.cap)}</span></button>`).join('');
    more.hidden = shown >= list.length;
  }
  $('#w-tabs').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#w-tabs button').forEach(x => x.setAttribute('aria-selected', x === b));
    cat = b.dataset.cat; shown = 12; renderWorks();
  });
  more.addEventListener('click', () => { shown += 12; renderWorks(); });
  renderWorks();

  /* ---------- lightbox ---------- */
  const lb = $('#lb'); let lbList = [], lbI = 0;
  const lbShow = () => { const it = lbList[lbI]; $('#lb-img').src = `img/${it.k}.webp`; $('#lb-img').alt = it.cap; $('#lb-cap').textContent = it.cap; };
  const openLb = (arr, i) => { lbList = arr; lbI = i; lbShow(); lb.showModal(); };
  grid.addEventListener('click', e => { const b = e.target.closest('.wi'); if (b) openLb(list, +b.dataset.i); });
  const caseArr = $$('.case-photos .cp').map(b => ({k: b.dataset.lb, cap: b.querySelector('img').alt}));
  $$('.case-photos .cp').forEach((b, i) => b.addEventListener('click', () => openLb(caseArr, i)));
  $('.lb-prev').addEventListener('click', () => { lbI = (lbI - 1 + lbList.length) % lbList.length; lbShow(); });
  $('.lb-next').addEventListener('click', () => { lbI = (lbI + 1) % lbList.length; lbShow(); });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') $('.lb-prev').click(); if (e.key === 'ArrowRight') $('.lb-next').click(); });

  /* ---------- reviews ---------- */
  const REV = [
    {n: 'Виктория', y: '2023', w: 'частный дом с перепланировкой', t: 'Делали комплексный ремонт разных помещений в частном доме. Самые сложные работы были связаны с перепланировкой первого этажа: проём в несущей стене, а плана дома не было. Помог профессионализм мастера по имени Зафар. В отсутствие заказчика на объекте постоянный фото и видеоотчёт об этапах работ, никакой отсебятины, советовались по любой мелочи. Потраченных денег ни копейки не жаль!'},
    {n: 'Ирина', y: '2023', w: 'совмещённый санузел', ph: ['rv22_0', 'rv22_2'], t: 'Понравилось, что была составлена смета с чётко прописанной стоимостью работ. Всё прозрачно и понятно. Дмитрий всегда на связи, все вопросы решаются оперативно. Мастера работают аккуратно, без лишней грязи и пыли. Каждый раз после окончания этапа ставили на место унитаз-«времяночку», не оставляли нас без столь нужной вещи.'},
    {n: 'Евгения', y: '2023', w: 'почти вся квартира', ph: ['rv24_0', 'rv24_2'], t: 'Отмечу высокий профессионализм электрика Николая: разводка по всей квартире, помог определить оптимальный вариант по удобству и цене. Благодарю Зафара, который укладывал плитку в санузле и ванной, кварцвинил по всему полу, за качество, художественный взгляд, аккуратность. По прошествии 9 месяцев эксплуатации никакие косяки не вылезли, всё крепко и качественно.'},
    {n: 'Таша', y: '2023', w: 'плитка в ванной', t: 'Выбирала из нескольких фирм и не жалею. Большое спасибо мастеру Мураду за качественный, красивый и выполненный в обговоренный срок ремонт! Идеально положена плитка в ванной комнате, аккуратно демонтирован и смонтирован натяжной потолок.'},
    {n: 'Дмитрий', y: '2024', w: 'совмещённый санузел', ph: ['rv28_0'], t: 'Выбирали дизайн сами, сделали всё в точности как на чертеже. Сделали быстро, без косяков, в указанные сроки. В процессе работ в отсутствии меня постоянно скидывали фотоотчёт и видеоотчёт. Советовались о любой мелочи, всегда на связи и на месте в оговоренное время.'},
    {n: 'Арина', y: '2024', w: 'ремонт помещения', ph: ['rv27_0', 'rv27_1'], t: 'Ремонт прошёл на удивление гладко и приятно. Бригада оказалась настоящими профессионалами: аккуратные, исполнительные, всегда готовые ответить на вопросы. Все работы были выполнены точно в срок, без лишних задержек и нервов.'},
    {n: 'Екатерина', y: '2023', w: 'плитка и наливной пол', t: 'Обращались к Дмитрию для укладки плитки и устройства наливного пола. Иван и Виталий сделали всё оперативно, в течение недели всё уложили и затёрли. Качественно, быстро и красиво! Плюс выполнили работы по электрике.'},
    {n: 'Мария', y: '2022', w: 'электрика на участке', t: 'Подключали фонарные столбики и теплицу. Всё сделано качественно и быстро, материал закупают сами с отчётом и чеками, учли все пожелания. Хорошая команда знающих своё дело мастеров.'},
    {n: 'Ольга', y: '2022', w: 'выравнивание стен', t: 'Делали небольшой объём работ по выравниванию стен. Сделали всё быстро и качественно. Не каждая фирма берётся за маленькие объёмы. Очень рекомендую.'}
  ];
  $('#rev-grid').innerHTML = REV.map(r => `<article class="rev"><p>${esc(r.t)}</p>${r.ph ? `<div class="rev-ph">${r.ph.map(k => `<img src="img/${k}-s.webp" alt="Фото от заказчика" loading="lazy">`).join('')}</div>` : ''}<footer><b>${esc(r.n)}</b><span>${esc(r.w)}, ${r.y}</span></footer></article>`).join('');

  /* ---------- calculator: tiles 60x120, one tile = 2.5 m2 ---------- */
  const RATE = {cos: [4000, 6500, 15, 10, 1, 2], cap: [7000, 12000, 8, 6, 2, 3], des: [12000, 45000, 6, 4, 3, 4]};
  const tilesEl = $('#tiles'), N = 60;
  tilesEl.innerHTML = Array.from({length: N}, (_, i) => `<i class="tile" style="--a:${(i * 47) % 120 - 20}deg"></i>`).join('');
  const tiles = $$('#tiles .tile');
  const area = $('#c-area'), fmt = n => Math.round(n / 1000) * 1000;
  const money = n => fmt(n).toLocaleString('ru-RU').replace(/ /g, ' ');
  let calcText = '';
  function calc() {
    const a = +area.value, type = $('input[name=ctype]:checked').value, r = RATE[type];
    $('#c-area-out').textContent = `${a} м²`;
    const on = Math.ceil(a / 2.5);
    tiles.forEach((t, i) => { t.classList.toggle('on', i < on); t.classList.toggle('dk', type === 'des' && (i % 12 === 5 || i % 12 === 6)); });
    const lo = a * r[0], hi = a * r[1];
    const w1 = Math.max(1, Math.round(a / r[2] + r[4])), w2 = Math.max(w1 + 1, Math.round(a / r[3] + r[5]));
    $('#c-sum').textContent = `${money(lo)} – ${money(hi)} ₽`;
    $('#c-term').textContent = `${w1}–${w2} недель`;
    const ex = $$('.calc-extra input:checked').map(x => x.value);
    $('#c-note').textContent = ex.length ? `Учтём в смете: ${ex.join(', ')}. Материалы считаем отдельно и закупаем со своей скидкой.` : 'Материалы считаем отдельно и закупаем со своей скидкой.';
    const names = {cos: 'косметический', cap: 'капитальный', des: 'по дизайн-проекту'};
    calcText = `Расчёт на сайте: ${names[type]} ремонт, ${a} м², работы ${money(lo)} – ${money(hi)} ₽${ex.length ? ', ещё: ' + ex.join(', ') : ''}`;
  }
  $('#calc').addEventListener('input', calc); calc();
  function setComment(t) { const c = $('#f-comment'); if (!c.value.includes(t)) c.value = (c.value ? c.value + '\n' : '') + t; }
  $('#c-send').addEventListener('click', () => { setComment(calcText); $('#form').scrollIntoView({behavior: 'smooth'}); setTimeout(() => $('#f-name').focus({preventScroll: true}), 600); });

  /* ---------- map pins ---------- */
  const PINS = [['office', 65.16, 23.55, 'Плесецкая 24', 'big'], ['spb', 68.99, 38.73, 'Санкт-Петербург', 'big'], ['sbor', 9.09, 44.42, 'Сосновый Бор', 'big'],
    ['pushkin', 73.67, 70.85, 'Пушкин'], ['peterhof', 49.19, 47.36, 'Петергоф', 'sm'], ['lomonosov', 42.45, 42.94, 'Ломоносов', 'l sm'], ['kolpino', 82.35, 66.45, 'Колпино', 'sm'],
    ['vsev', 84.74, 26.71, 'Всеволожск', 'l'], ['sestr', 51.92, 15.62, 'Сестрорецк', 'sm'], ['krasnoe', 57.87, 68.21, 'Красное Село', 'l sm'], ['gatchina', 59.92, 93.5, 'Гатчина'], ['lipovo', 14.61, 51.18, 'Липово', 'sm']];
  $('#map').insertAdjacentHTML('beforeend', PINS.map(p => `<span class="pin ${p[4] || ''}" style="left:${p[1]}%;top:${p[2]}%">${p[3]}</span>`).join(''));

  /* ---------- menu ---------- */
  const burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
  $$('#nav a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); }));

  /* ---------- phone mask ---------- */
  const ph = $('#f-phone');
  ph.addEventListener('input', () => {
    let d = ph.value.replace(/\D/g, ''); if (!d) { ph.value = ''; return; }
    if (d[0] === '8') d = '7' + d.slice(1); if (d[0] !== '7') d = '7' + d; d = d.slice(0, 11);
    const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
    ph.value = '+7' + (p[0] ? ` (${p[0]}` : '') + (p[0].length === 3 ? ')' : '') + (p[1] ? ` ${p[1]}` : '') + (p[2] ? `-${p[2]}` : '') + (p[3] ? `-${p[3]}` : '');
  });

  /* ---------- lead form (demo script, mockup) ---------- */
  const LEAD_URL = 'https://script.google.com/macros/s/AKfycby3_mdaCfx-Kv0MWD1RiwXnmTO47GtAS9zrH0WZsPcyeEGYHIRrXQjAU_EtMCfIypOW/exec';
  const form = $('#form'), err = $('#err'), btn = $('#submit');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const f = form.elements;
    if (f.name.value.trim().length < 2) return err.textContent = 'Укажите имя';
    if (f.phone.value.replace(/\D/g, '').length !== 11) return err.textContent = 'Проверьте номер телефона';
    if (!f.consent.checked) return err.textContent = 'Отметьте согласие на обработку данных';
    err.textContent = ''; $('#fallback').hidden = true;
    const details = ['Макет house-master-spb', `Объект: ${f.obj.value}`, f.where.value.trim() && `Адрес: ${f.where.value.trim()}`, `Связь: ${f.via.value}`].filter(Boolean).join(', ');
    btn.disabled = true; btn.textContent = 'Отправляем...';
    let ok = false;
    try {
      const res = await fetch(LEAD_URL, {method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'}, signal: AbortSignal.timeout(20000),
        body: JSON.stringify({site: location.hostname, name: f.name.value.trim(), phone: f.phone.value, details, comment: f.comment.value.trim(), website: f.website.value})});
      ok = (await res.json()).ok === true;
    } catch (x) {}
    btn.disabled = false; btn.textContent = 'Вызвать на замер';
    if (ok) { btn.hidden = true; $('#sent').hidden = false; } else $('#fallback').hidden = false;
  });
})();
