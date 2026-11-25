(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const fmt = n => n.toLocaleString('ru-RU').replace(/ /g, ' ');
  const C = {r: 'var(--r)', y: 'var(--y)', g: 'var(--g)', b: 'var(--b)'};
  const ok = '<span class="box"><svg><use href="#i-check"/></svg></span>';

  /* ---------- menu ---------- */
  const nav = $('#nav'), burger = $('#burger');
  burger.addEventListener('click', () => {
    const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o);
  });
  nav.addEventListener('click', e => { if (e.target.tagName === 'A') { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); } });

  /* ---------- services ---------- */
  const SVC = [
    {t: 'Регулярная уборка', p: 80, u: '₽/м²', c: 'b', hit: 'Чаще всего заказывают', calc: 'reg',
      li: ['Пыль на открытых поверхностях', 'Полы, зеркала, сантехника', 'Кухня снаружи, вынос мусора']},
    {t: 'Генеральная лайт', p: 150, u: '₽/м²', c: 'g', calc: 'lite',
      li: ['42 пункта чек-листа', 'Кухня и санузел снаружи, швы, налёт', 'Фото- и видеоотчёт']},
    {t: 'Расширенная генеральная', p: 210, u: '₽/м²', c: 'g', calc: 'full',
      li: ['61 пункт чек-листа', 'Шкафы и техника внутри', 'Люстры, радиаторы, плинтусы']},
    {t: 'После ремонта', p: 200, u: '₽/м²', from: 1, c: 'y', calc: 'reno',
      li: ['Строительная пыль со стен и потолка', 'Следы краски, затирки, скотча', 'Межплиточные швы паром']},
    {t: 'Мойка окон', p: 350, u: '₽/м²', from: 1, c: 'b', pick: 'Мойка окон',
      li: ['Панорамные и габаритные створки', 'Зимняя мойка от 500 ₽/м²', 'После ремонта от 500 ₽/м²']},
    {t: 'Мойка под давлением', p: 65, u: '₽/м²', from: 1, c: 'r', pick: 'Мойка под давлением',
      li: ['Фасады, плитка, бассейны, витрины', 'Kärcher K5 и K7, свои насадки', 'Нужен доступ к воде и свету']}
  ];
  $('#svcGrid').innerHTML = SVC.map((s, i) => `<article class="card">
    <span class="card__tag" style="background:${C[s.c]}"></span>
    ${s.hit ? `<span class="card__hit">${s.hit}</span>` : ''}
    <h3>${s.t}</h3>
    <p class="card__price">${s.from ? 'от ' : ''}<b>${fmt(s.p)}</b> ${s.u}</p>
    <ul>${s.li.map(x => `<li>${x}</li>`).join('')}</ul>
    <button class="card__btn" data-i="${i}">${s.calc ? 'Рассчитать' : 'Оставить заявку'}</button></article>`).join('');
  $('#svcGrid').addEventListener('click', e => {
    const b = e.target.closest('.card__btn'); if (!b) return;
    const s = SVC[b.dataset.i];
    if (s.calc) { setType(s.calc); $('#raschet').scrollIntoView(); }
    else pickKind(s.pick);
  });

  const EXTRAS = [
    {h: 'Кухня и техника', c: 'g', rows: [['Холодильник', 'от 2 000 ₽'], ['Холодильник Side-by-Side', 'от 2 500 ₽'], ['Духовой шкаф', 'от 2 000 ₽'], ['Вытяжка', 'от 1 000 ₽'], ['Варочная панель', 'от 1 000 ₽'], ['Микроволновка', 'от 500 ₽'], ['Кухонный гарнитур внутри', 'от 1 000 ₽'], ['Мелкая техника', 'от 200 ₽']]},
    {h: 'Окна', c: 'b', rows: [['Мойка окон', 'от 350 ₽/м²'], ['Панорамные и габаритные створки', 'от 350 ₽/м²'], ['Окна после ремонта', 'от 500 ₽/м²'], ['Зимняя мойка окон', 'от 500 ₽/м²'], ['Жалюзи', 'от 100 ₽']]},
    {h: 'Санузел и детали', c: 'y', rows: [['Санузлы и кухни', 'от 500 ₽/м²'], ['Межплиточные швы паром', 'от 200 ₽/м²'], ['Люстра', 'от 200 ₽']]},
    {h: 'Особые случаи', c: 'r', rows: [['Точечная уборка, 1 исполнитель', '1 500 ₽/ч'], ['Комплексная уборка', '800 ₽/м²'], ['Экстремальная уборка', '3 000 ₽/м²'], ['Вышка-тура', '3 000 ₽']]}
  ];
  $('#extrasGrid').innerHTML = EXTRAS.map(g => `<div class="pl"><h4><i style="background:${C[g.c]}"></i>${g.h}</h4><dl>${g.rows.map(r => `<div><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join('')}</dl></div>`).join('');

  /* ---------- checklist ---------- */
  // [text, zone colour, in lite]
  const ROOMS = [
    {id: 'kitchen', n: 'Кухня', z: ['g'], items: [
      ['Столешница и фартук', 'g', 1], ['Фасады гарнитура снаружи', 'g', 1], ['Вытяжка снаружи', 'g', 1], ['Варочная панель', 'g', 1],
      ['Раковина и смеситель без налёта', 'g', 1], ['Холодильник, духовка, СВЧ снаружи', 'g', 1], ['Обеденный стол и стулья', 'g', 1],
      ['Подоконник и откосы', 'g', 1], ['Выключатели и розетки', 'g', 1], ['Мусорное ведро, вынос мусора', 'g', 1], ['Пол', 'g', 1],
      ['Шкафы гарнитура внутри', 'g', 0], ['Холодильник внутри', 'g', 0], ['Духовой шкаф внутри', 'g', 0], ['Микроволновка внутри', 'g', 0],
      ['Решётка и фильтр вытяжки', 'g', 0], ['Плинтусы и дверь', 'g', 0]]},
    {id: 'bath', n: 'Санузел', z: ['r', 'y'], items: [
      ['Унитаз снаружи и внутри', 'r', 1], ['Пол вокруг унитаза', 'r', 1], ['Раковина и смеситель', 'y', 1], ['Ванна или душевая кабина', 'y', 1],
      ['Плитка на стенах', 'y', 1], ['Зеркало без разводов', 'y', 1], ['Полочки и аксессуары', 'y', 1], ['Стиральная машина снаружи', 'y', 1],
      ['Полотенцесушитель', 'y', 1], ['Дверь и ручка', 'y', 1], ['Пол', 'y', 1],
      ['Межплиточные швы паром', 'y', 0], ['Шкафчики внутри', 'y', 0], ['Решётка вентиляции', 'y', 0], ['Налёт на лейке и шланге', 'y', 0]]},
    {id: 'rooms', n: 'Комнаты', z: ['b'], items: [
      ['Пыль на открытых поверхностях', 'b', 1], ['Мебель снаружи', 'b', 1], ['Зеркала и стекло', 'b', 1], ['Подоконники', 'b', 1],
      ['Выключатели и розетки', 'b', 1], ['Дверные ручки', 'b', 1], ['Телевизор и мониторы', 'b', 1], ['Ковры пылесосом', 'b', 1],
      ['Под кроватью и диваном, где доступно', 'b', 1], ['Корзины для мусора', 'b', 1], ['Заправка кровати по просьбе', 'b', 1], ['Влажная уборка пола', 'b', 1],
      ['Шкафы внутри, если пустые', 'b', 0], ['Плинтусы', 'b', 0], ['Радиаторы', 'b', 0], ['Люстры и светильники', 'b', 0], ['Отодвигаем лёгкую мебель', 'b', 0]]},
    {id: 'hall', n: 'Прихожая и балкон', z: ['b'], items: [
      ['Входная дверь с двух сторон', 'b', 1], ['Зеркало', 'b', 1], ['Обувница снаружи', 'b', 1], ['Вешалка и полки', 'b', 1],
      ['Пыль на поверхностях', 'b', 1], ['Выключатели', 'b', 1], ['Коврик у двери', 'b', 1], ['Пол', 'b', 1],
      ['Шкаф-купе внутри', 'b', 0], ['Плинтусы', 'b', 0], ['Балкон: пол и подоконник', 'b', 0], ['Балконные рамы изнутри', 'b', 0]]}
  ];
  let lvl = 'lite', room = 'kitchen';
  const total = l => ROOMS.reduce((a, r) => a + r.items.filter(i => l === 'full' || i[2]).length, 0);
  $('#rooms').innerHTML = ROOMS.map(r => `<button class="room${r.id === room ? ' is-on' : ''}" data-r="${r.id}" role="tab">${r.z.map(z => `<i style="background:${C[z]}"></i>`).join('')}${r.n}</button>`).join('');
  function renderCL() {
    const r = ROOMS.find(x => x.id === room);
    $('#clRoom').textContent = r.n;
    const inc = r.items.filter(i => lvl === 'full' || i[2]).length;
    $('#clN').textContent = `${inc} из ${r.items.length} пунктов`;
    $('#clList').innerHTML = r.items.map(i => {
      const on = lvl === 'full' || i[2];
      return `<li class="${on ? 'done' : 'off'}" style="--c:${C[i[1]]}">${ok}<span>${i[0]}</span>${on ? '' : '<em>в расширенной</em>'}</li>`;
    }).join('');
    const n = total(lvl);
    $('#ringN').textContent = n;
    $('#ringArc').style.strokeDashoffset = 326.7 * (1 - n / 61);
    $('#clNote').textContent = lvl === 'lite'
      ? 'В лайт входит всё, что видно глазу: пыль, полы, сантехника, кухня снаружи.'
      : 'В расширенной моем ещё шкафы и технику внутри, плинтусы, радиаторы и люстры.';
    $('#clCalc').textContent = `Посчитать ${lvl === 'lite' ? 'лайт' : 'расширенную'} для своей площади`;
  }
  $('#rooms').addEventListener('click', e => {
    const b = e.target.closest('.room'); if (!b) return;
    room = b.dataset.r; $$('.room').forEach(x => x.classList.toggle('is-on', x === b)); renderCL();
  });
  $$('.seg__b').forEach(b => b.addEventListener('click', () => {
    lvl = b.dataset.lvl;
    $$('.seg__b').forEach(x => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-selected', x === b); });
    renderCL();
  }));
  $('#clCalc').addEventListener('click', () => setType(lvl));
  renderCL();

  /* ---------- calculator ---------- */
  const TYPES = [
    {id: 'reg', n: 'Регулярная', p: 80, k: 'Регулярная уборка'},
    {id: 'lite', n: 'Генеральная лайт', p: 150, k: 'Генеральная лайт'},
    {id: 'full', n: 'Расширенная генеральная', p: 210, k: 'Расширенная генеральная'},
    {id: 'reno', n: 'После ремонта', p: 200, k: 'После ремонта'}
  ];
  const ADDS = [
    {id: 'win', n: 'Окна, м² створок', p: 350, u: 'м²'},
    {id: 'fridge', n: 'Холодильник внутри', p: 2000, inFull: 1},
    {id: 'oven', n: 'Духовой шкаф', p: 2000, inFull: 1},
    {id: 'hood', n: 'Вытяжка', p: 1000},
    {id: 'mw', n: 'Микроволновка', p: 500, inFull: 1},
    {id: 'cab', n: 'Кухонный гарнитур внутри', p: 1000, inFull: 1},
    {id: 'lamp', n: 'Люстра', p: 200},
    {id: 'blind', n: 'Жалюзи', p: 100}
  ];
  const q = Object.fromEntries(ADDS.map(a => [a.id, 0]));
  let type = 'lite';
  $('#calcTypes').insertAdjacentHTML('beforeend', TYPES.map(t => `<label class="tp"><input type="radio" name="ct" value="${t.id}"${t.id === type ? ' checked' : ''}><span>${t.n}<small>${t.id === 'reno' ? 'от ' : ''}${t.p} ₽/м²</small></span></label>`).join(''));
  $('#adds').innerHTML = ADDS.map(a => `<div class="add" data-a="${a.id}"><span>${a.n}<small>${a.u ? 'от ' + fmt(a.p) + ' ₽/м²' : 'от ' + fmt(a.p) + ' ₽'}</small></span><span class="step"><button type="button" data-d="-1" aria-label="Меньше">−</button><output>0</output><button type="button" data-d="1" aria-label="Больше">+</button></span></div>`).join('');
  const area = $('#area'), areaR = $('#areaR');
  function calc() {
    const t = TYPES.find(x => x.id === type), a = Math.max(0, Math.round(+area.value || 0));
    const lines = [[`${t.n}, ${a} м²`, t.p * a]];
    ADDS.forEach(x => {
      const el = $(`.add[data-a="${x.id}"]`), inc = type === 'full' && x.inFull;
      el.querySelector('small').textContent = inc ? 'входит в расширенную' : (x.u ? 'от ' + fmt(x.p) + ' ₽/м²' : 'от ' + fmt(x.p) + ' ₽');
      el.querySelector('.step').style.visibility = inc ? 'hidden' : '';
      if (!inc && q[x.id]) lines.push([`${x.n.replace(', м² створок', '')} × ${q[x.id]}${x.u ? ' м²' : ''}`, x.p * q[x.id]]);
    });
    const sum = lines.reduce((s, l) => s + l[1], 0);
    $('#sum').textContent = fmt(sum); $('#sumF').textContent = fmt(sum);
    $('#lines').innerHTML = lines.map(l => `<li><span>${l[0]}</span><b>${fmt(l[1])} ₽</b></li>`).join('');
    return {t, a, lines, sum};
  }
  function setType(id) {
    type = id; const r = document.querySelector(`input[name=ct][value="${id}"]`); if (r) r.checked = true; calc();
  }
  $('#calcTypes').addEventListener('change', e => { type = e.target.value; calc(); });
  areaR.addEventListener('input', () => { area.value = areaR.value; calc(); });
  area.addEventListener('input', () => { areaR.value = Math.min(250, Math.max(15, +area.value || 15)); calc(); });
  $('#adds').addEventListener('click', e => {
    const b = e.target.closest('button[data-d]'); if (!b) return;
    const id = b.closest('.add').dataset.a; q[id] = Math.max(0, Math.min(99, q[id] + +b.dataset.d));
    b.parentNode.querySelector('output').textContent = q[id]; calc();
  });
  calc();
  if ('IntersectionObserver' in window) {
    let formIn = false, resIn = false;
    const upd = () => $('#calcFloat').classList.toggle('on', formIn && !resIn);
    new IntersectionObserver(es => { es.forEach(e => { if (e.target.id === 'calcRes') resIn = e.isIntersecting; else formIn = e.isIntersecting; }); upd(); }).observe($('.calc__form'));
    new IntersectionObserver(es => { es.forEach(e => { resIn = e.isIntersecting; }); upd(); }).observe($('#calcRes'));
  }
  $('#toForm').addEventListener('click', () => {
    const r = calc();
    $('#kind').value = r.t.k; $('#farea').value = r.a;
    $('#comment').value = `Расчёт на сайте: ${r.lines.map(l => l[0]).join(', ')}. Итого от ${fmt(r.sum)} ₽`;
  });

  function pickKind(k) { if (k) $('#kind').value = k; $('#zayavka').scrollIntoView(); }
  $$('[data-pick]').forEach(a => a.addEventListener('click', () => { $('#kind').value = a.dataset.pick; }));

  /* ---------- hero report animation (one moment on load) ---------- */
  const items = $$('#actList li'), still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finish = () => { items.forEach(li => li.classList.add('done')); $('#actN').textContent = 42; $('#actBar').style.width = '100%'; $('#actStamp').classList.add('on'); };
  if (still) finish();
  else {
    let i = 0;
    const tick = () => {
      if (i < items.length) {
        items[i].classList.add('done'); i++;
        $('#actN').textContent = Math.round(42 * i / items.length);
        $('#actBar').style.width = (100 * i / items.length) + '%';
        setTimeout(tick, 380);
      } else setTimeout(() => $('#actStamp').classList.add('on'), 250);
    };
    setTimeout(tick, 600);
  }

  /* ---------- phone mask ---------- */
  const ph = $('#phone');
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
    const details = ['Макет clean-criteria', `Услуга: ${f.kind.value}`, f.area.value.trim() && `Площадь: ${f.area.value.trim()} м²`, f.where.value.trim() && `Район: ${f.where.value.trim()}`, `Связь: ${f.via.value}`].filter(Boolean).join(', ');
    btn.disabled = true; btn.textContent = 'Отправляем...';
    let sent = false;
    try {
      const res = await fetch(LEAD_URL, {method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'}, signal: AbortSignal.timeout(20000),
        body: JSON.stringify({site: location.hostname, name: f.name.value.trim(), phone: f.phone.value, details, comment: f.comment.value.trim(), website: f.website.value})});
      sent = (await res.json()).ok === true;
    } catch (x) {}
    btn.disabled = false; btn.textContent = 'Отправить заявку';
    if (sent) { btn.hidden = true; $('#sent').hidden = false; } else $('#fallback').hidden = false;
  });
})();
