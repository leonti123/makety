(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const CASES = window.SB.cases, byId = Object.fromEntries(CASES.map(c => [c.id, c]));
  const MONTHS = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
  const when = d => { const [y, m] = d.split('-'); return `${MONTHS[+m - 1]} ${y}`; };
  const PLACES = {
    mga: {name: 'Мга', pos: [59.32, 83.96], about: 'Больше всего объектов: кровля школы искусств, фасады, крыльца, пристройка на сваях, отмостка, полы в квартире.'},
    kirovsk: {name: 'Кировск', pos: [42.18, 36.16], about: 'Здесь база бригады. Ремонт квартир и санузлов под ключ.'},
    shlis: {name: 'Шлиссельбург', pos: [53.11, 13.39], about: 'Санузел с демонтажом перегородки.'},
    mih: {name: 'Михайловский', pos: [80.79, 80.54], lab: 't', about: 'Крыша гаража и дорожки из тротуарной плитки.'},
    pavlovo: {name: 'Павлово', pos: [17.99, 64.12], about: 'Гараж восстановили почти с нуля и поставили подъёмные ворота.'},
    gory: {name: 'Горы', pos: [39.5, 84.95], lab: 'l', about: 'Ванная комната из пустого помещения.'},
    vyborg: {name: 'Выборг', about: 'Фельдшерско-акушерский пункт на 150 м², государственный объект.'},
    other: {name: 'СНТ и другие места', about: 'Садоводства Кировского района и объекты, где место в посте не указано.'}
  };
  const placeOf = c => PLACES[c.place] ? c.place : 'other';
  const SNT = {'snt-gribnoe': 'СНТ «Грибное»', 'snt-treug': 'СНТ «Треугольник»'};
  const where = c => PLACES[c.place]?.name || SNT[c.place] || 'Ленобласть';

  /* hero before/after */
  const ba = $('#heroBA'), range = ba.querySelector('.ba-range');
  range.addEventListener('input', () => ba.style.setProperty('--pos', range.value + '%'));

  /* services */
  const SVC = [
    {t: 'Кровля', img: 'p37_2', li: ['Перекрыть крышу или заменить настил', 'Наплавляемая кровля, металлочерепица', 'Подшива свесов, водостоки', 'Усиление стропил, мембрана, контрбрус'], p: 'по смете', types: ['roof'], opt: 0},
    {t: 'Фасады и утепление', img: 'p67_3', li: ['Сайдинг, имитация бруса', 'Утепление, в том числе ППУ', 'Откосы, отливы, фронтоны'], p: 'по смете', types: ['facade'], opt: 1},
    {t: 'Пристройки, веранды, крыльца', img: 'p60_2', li: ['Пристройки на сваях', 'Веранды и террасы', 'Крыльца и ступени с навесом'], p: 'по смете', types: ['build'], opt: 2},
    {t: 'Дома, бани, беседки', img: 'p46_3', li: ['Строительство домов и бань', 'Беседки, хозблоки, курятники', 'Реконструкция старых домов'], p: 'от 5 000 ₽', types: ['build', 'facade'], opt: 3},
    {t: 'Фундамент и отмостка', img: 'p11_2', li: ['Фундаменты под дом и пристройку', 'Отмостка с водоотводом', 'Армопояс'], p: 'по смете', types: ['yard'], opt: 4},
    {t: 'Дорожки и плитка', img: 'p10_3', li: ['Тротуарная плитка', 'Дорожки по участку', 'Площадки у входа'], p: 'по смете', types: ['yard'], opt: 8},
    {t: 'Заборы и ворота', img: 'p48_2', li: ['Заборы из любого материала', 'Подъёмные ворота с электроприводом', 'Столбы и проёмы под ворота'], p: 'по смете', types: ['yard'], opt: 8},
    {t: 'Ремонт квартир', img: 'p22_9', li: ['Частичный ремонт и под ключ', 'Перепланировки, перегородки', 'Обои, потолки, полы'], p: 'по смете', tag: 'скидка 10%', types: ['inside'], opt: 5},
    {t: 'Санузлы и ванные', img: 'p58_3', li: ['Плитка и сантехника', 'Ванна, душевая, унитаз', 'Ванная из пустого помещения'], p: 'по смете', types: ['inside'], opt: 6},
    {t: 'Полы и тёплый пол', img: 'p69_2', li: ['Демонтаж старого покрытия', 'Наливной пол, ДСП, кварцвинил', 'Тёплый пол'], p: 'по смете', types: ['inside'], opt: 7},
    {t: 'Электрика', img: 'p41_4', li: ['От замены розетки до полной разводки', 'Скрытая проводка', 'Уличное освещение'], p: 'от 100 ₽', types: ['inside'], opt: 7},
    {t: 'Вода, отопление, канализация', img: 'p23_7', li: ['Водоснабжение', 'Канализация', 'Отопление'], p: 'от 1 000 ₽', types: ['inside'], opt: 7},
    {t: 'Демонтаж', img: 'p54_4', li: ['Перегородки, полы, потолки', 'Старая кровля и кладка', 'Вывоз мусора по договорённости'], p: 'от 5 000 ₽', types: ['inside', 'yard'], opt: 9},
    {t: 'Отделка и штукатурка', img: 'p15_8', li: ['Венецианская штукатурка', 'Шпаклёвка и покраска', 'Вагонка, панели'], p: 'от 150 ₽ за м²', types: ['gov', 'inside'], opt: 5},
    {t: 'Дренаж и водоотвод', img: 'p50_3', li: ['Дренаж участка', 'Водоотвод от дома', 'Отвод воды в канаву'], p: 'по смете', types: ['yard'], opt: 8},
    {t: 'Исправим чужую работу', img: 'p45_1', li: ['Доделаем брошенный объект', 'Переделаем брак', 'Найдём ошибки в конструкциях'], p: 'по смете', types: ['facade', 'roof'], opt: 9}
  ];
  $('#svcGrid').innerHTML = SVC.map((s, i) => `<button class="svc" type="button" data-s="${i}">
    <div class="svc-img"><img src="img/${s.img}-t.webp" alt="" loading="lazy" width="480" height="360"></div>
    <div class="svc-b"><h3>${s.t}</h3><ul>${s.li.slice(0, 3).map(x => `<li>${x}</li>`).join('')}</ul>
    <div class="svc-p">${s.p === 'по смете' ? '<span>цена</span><b>после замера</b>' : `<span>цена</span><b>${s.p}</b>`}${s.tag ? `<i>${s.tag}</i>` : ''}</div></div></button>`).join('');
  $('#svcGrid').addEventListener('click', e => { const b = e.target.closest('.svc'); if (b) openSvc(SVC[b.dataset.s]); });

  /* dialog */
  const dlg = $('#dlg'), body = $('#dlgBody');
  $('#dlgX').onclick = () => dlg.close();
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  const gallery = photos => `<div class="dlg-gal"><div class="dlg-main"><img src="${photos[0]}" alt=""></div>
    ${photos.length > 1 ? `<div class="dlg-th">${photos.map((p, i) => `<button type="button" data-src="${p}" class="${i ? '' : 'on'}" aria-label="Фото ${i + 1}"><img src="${p.replace('.webp', '-t.webp')}" onerror="this.src='${p}'" alt="" loading="lazy"></button>`).join('')}</div>` : ''}</div>`;
  body.addEventListener('click', e => {
    const th = e.target.closest('.dlg-th button');
    if (th) { body.querySelector('.dlg-main img').src = th.dataset.src; body.querySelectorAll('.dlg-th button').forEach(b => b.classList.toggle('on', b === th)); }
    const rel = e.target.closest('[data-case]'); if (rel) openCase(rel.dataset.case);
    const ord = e.target.closest('[data-order]'); if (ord) { dlg.close(); toForm(ord.dataset.order, ord.dataset.opt); }
  });
  function openCase(id) {
    const c = byId[id];
    body.innerHTML = gallery(c.photos) + `<div class="dlg-info"><small>${esc(where(c))}, ${when(c.date)}</small><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p>
      <span class="dlg-src">${c.photos.length} фото. <a href="${c.src}" target="_blank" rel="noopener">Пост во ВКонтакте</a></span>
      <div class="dlg-acts"><button class="btn btn-copper" type="button" data-order="Похожая работа: ${esc(c.title)}">Хочу так же</button><a class="btn btn-line" href="tel:+79052505100">Позвонить</a></div></div>`;
    if (!dlg.open) dlg.showModal(); body.scrollTop = 0; dlg.scrollTop = 0;
  }
  function openSvc(s) {
    const rel = CASES.filter(c => c.types.some(t => s.types.includes(t))).slice(0, 6);
    body.innerHTML = gallery([`img/${s.img}.webp`, ...rel.map(c => c.photos[0])].filter((v, i, a) => a.indexOf(v) === i)) + `<div class="dlg-info"><small>Услуга</small><h3>${s.t}</h3>
      <ul>${s.li.map(x => `<li>${x}</li>`).join('')}</ul>
      <p class="dlg-price">Цена: <b>${s.p === 'по смете' ? 'после бесплатного замера' : s.p}</b>${s.tag ? `, ${s.tag}` : ''}. Итог в детальной смете с фиксированной суммой.</p>
      ${rel.length ? `<small>Работы по теме</small><div class="dlg-rel">${rel.map(c => `<button class="chip" type="button" data-case="${c.id}">${esc(c.title)}</button>`).join('')}</div>` : ''}
      <div class="dlg-acts"><button class="btn btn-copper" type="button" data-order="Услуга: ${s.t}" data-opt="${s.opt}">Заказать замер</button><a class="btn btn-line" href="tel:+79052505100">Позвонить</a></div></div>`;
    dlg.showModal(); dlg.scrollTop = 0;
  }
  function toForm(note, opt) {
    const f = $('#form').elements;
    if (opt !== undefined && opt !== '') f.what.selectedIndex = +opt;
    if (note && !f.comment.value.includes(note)) f.comment.value = (f.comment.value ? f.comment.value + '\n' : '') + note;
    $('#zayavka').scrollIntoView({behavior: 'smooth'}); setTimeout(() => $('#fName').focus({preventScroll: true}), 600);
  }

  /* map */
  const counts = {}; CASES.forEach(c => { const p = placeOf(c); counts[p] = (counts[p] || 0) + 1; });
  const map = $('#map');
  Object.entries(PLACES).filter(([, p]) => p.pos).forEach(([k, p]) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'pin' + (p.lab ? ' lab-' + p.lab : ''); b.dataset.place = k;
    b.style.left = p.pos[0] + '%'; b.style.top = p.pos[1] + '%';
    b.innerHTML = `<i>${counts[k] || 0}</i><span>${p.name}</span>`; b.setAttribute('aria-label', `${p.name}: объектов ${counts[k] || 0}`);
    map.appendChild(b);
  });
  $('#placeTabs').innerHTML = Object.entries(PLACES).map(([k, p]) => `<button class="chip" type="button" data-place="${k}">${p.name} <em>${counts[k] || 0}</em></button>`).join('');
  function showPlace(k) {
    const p = PLACES[k], list = CASES.filter(c => placeOf(c) === k);
    $('#place').innerHTML = `<h3>${p.name}</h3><p class="place-sub">${p.about}</p><div class="place-list">${list.map(c => `<button class="prow" type="button" data-case="${c.id}"><img src="${c.cover}" alt="" loading="lazy"><span><b>${esc(c.title)}</b><small>${k === 'other' ? esc(where(c)) + ', ' : ''}${when(c.date)}, ${c.photos.length} фото</small></span></button>`).join('')}</div>`;
    $$('[data-place]').forEach(b => b.classList.toggle('on', b.dataset.place === k));
  }
  document.addEventListener('click', e => {
    const pl = e.target.closest('[data-place]'); if (pl) showPlace(pl.dataset.place);
    const pr = e.target.closest('.prow,.work,.gcard,.pair [data-case]'); if (pr && !dlg.contains(pr)) openCase(pr.dataset.case);
  });
  showPlace('mga');

  /* works */
  const TYPES = [['all', 'Все'], ['roof', 'Кровля'], ['facade', 'Фасады'], ['build', 'Пристройки и крыльца'], ['inside', 'Квартиры и санузлы'], ['yard', 'Участок и гаражи'], ['gov', 'Гособъекты']];
  let filter = 'all', shown = 12;
  $('#filters').innerHTML = TYPES.map(([k, n]) => `<button class="chip${k === 'all' ? ' on' : ''}" type="button" data-f="${k}">${n} <em>${k === 'all' ? CASES.length : CASES.filter(c => c.types.includes(k)).length}</em></button>`).join('');
  const order = [...CASES].sort((a, b) => b.date.localeCompare(a.date));
  function renderWorks() {
    const list = order.filter(c => filter === 'all' || c.types.includes(filter));
    $('#works').innerHTML = list.slice(0, shown).map(c => `<button class="work" type="button" data-case="${c.id}"><img src="${c.cover}" alt="${esc(c.title)}" loading="lazy" width="480" height="600">${c.types.includes('gov') ? '<span class="work-g">Гособъект</span>' : ''}<span class="work-n">${c.photos.length} фото</span><span class="work-t"><b>${esc(c.title)}</b><small>${esc(where(c))}, ${when(c.date)}</small></span></button>`).join('');
    $('#moreWorks').hidden = list.length <= shown;
  }
  $('#filters').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; filter = b.dataset.f; shown = 12; $$('#filters .chip').forEach(x => x.classList.toggle('on', x === b)); renderWorks(); });
  $('#moreWorks').onclick = () => { shown += 12; renderWorks(); };
  renderWorks();

  /* pairs */
  const PAIRS = [['p22_3', 'p22_7', 'Санузел, Кировск', 'c22'], ['p22_5', 'p22_8', 'Ванная, Кировск', 'c22'], ['p69_1', 'p69_2', 'Полы с наливным основанием, Мга', 'c69'], ['p67_1', 'p67_3', 'Дом в СНТ «Грибное»: крыша и сайдинг', 'c67']];
  $('#pairs').innerHTML = PAIRS.map(([a, b, t, id]) => `<figure class="pair" style="margin:0"><div class="pair-ph"><div><img src="img/${a}-t.webp" alt="${t}, до" loading="lazy"><span>до</span></div><div><img src="img/${b}-t.webp" alt="${t}, после" loading="lazy"><span>после</span></div></div><figcaption class="pair-c"><b>${t}</b><button type="button" data-case="${id}">Весь объект</button></figcaption></figure>`).join('');

  /* gov */
  const GOV = [['c4', 'Выборг, 150 м²'], ['c3', 'Мга, кровля'], ['c15', 'Отделка']];
  $('#gov').innerHTML = GOV.map(([id, tag]) => { const c = byId[id]; return `<button class="gcard" type="button" data-case="${id}"><div class="gcard-img"><img src="${c.photos[0]}" alt="" loading="lazy"></div><div class="gcard-b"><small>${tag}</small><b>${esc(c.title)}</b><p>${esc(c.text.split('. ').slice(0, 2).join('. ').replace(/\.?$/, '.'))}</p></div></button>`; }).join('');

  /* menu */
  const menu = $('#menu'), burger = $('#burger');
  burger.onclick = () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); };
  menu.addEventListener('click', e => { if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); } });

  /* phone mask */
  const ph = $('#fPhone');
  ph.addEventListener('input', () => {
    let d = ph.value.replace(/\D/g, ''); if (!d) { ph.value = ''; return; }
    if (d[0] === '8') d = '7' + d.slice(1); if (d[0] !== '7') d = '7' + d; d = d.slice(0, 11);
    const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
    ph.value = '+7' + (p[0] ? ` (${p[0]}` : '') + (p[0].length === 3 ? ')' : '') + (p[1] ? ` ${p[1]}` : '') + (p[2] ? `-${p[2]}` : '') + (p[3] ? `-${p[3]}` : '');
  });

  /* lead form (demo script, mockup) */
  const LEAD_URL = 'https://script.google.com/macros/s/AKfycby3_mdaCfx-Kv0MWD1RiwXnmTO47GtAS9zrH0WZsPcyeEGYHIRrXQjAU_EtMCfIypOW/exec';
  const form = $('#form'), err = $('#err'), btn = $('#submit');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const f = form.elements;
    if (f.name.value.trim().length < 2) return err.textContent = 'Укажите имя';
    if (f.phone.value.replace(/\D/g, '').length !== 11) return err.textContent = 'Проверьте номер телефона';
    if (!f.consent.checked) return err.textContent = 'Отметьте согласие на обработку данных';
    err.textContent = ''; $('#fallback').hidden = true;
    const details = ['Макет stroika-brigada', `Что: ${f.what.value}`, f.where.value.trim() && `Где: ${f.where.value.trim()}`, `Связь: ${f.via.value}`].filter(Boolean).join(', ');
    btn.disabled = true; btn.textContent = 'Отправляем...';
    let ok = false;
    try {
      const res = await fetch(LEAD_URL, {method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'}, signal: AbortSignal.timeout(20000),
        body: JSON.stringify({site: location.hostname, name: f.name.value.trim(), phone: f.phone.value, details, comment: f.comment.value.trim(), website: f.website.value})});
      ok = (await res.json()).ok === true;
    } catch (x) {}
    btn.disabled = false; btn.textContent = 'Отправить заявку';
    if (ok) { btn.hidden = true; $('#sent').hidden = false; } else $('#fallback').hidden = false;
  });
})();
