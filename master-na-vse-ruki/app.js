(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));

  /* ---------- services ---------- */
  const SERVICES = [
    {id: 'mebel', icon: 'i-mebel', title: 'Сборка мебели', note: 'Сборщик мебели с большим стажем. Свой крепёж, если комплектный ненадёжный.', items: [
      ['Шкаф-купе', 'от 3 500 ₽'], ['Кухонный гарнитур', 'от 8 000 ₽'], ['Кровать или диван', 'от 1 500 ₽'], ['Стол, комод, тумба', 'от 800 ₽'],
      ['Прихожая, стенка', 'от 2 500 ₽'], ['Выпил под мойку или варочную', 'от 800 ₽'], ['Ремонт мебели: петли, ручки, стулья', 'от 500 ₽'], ['Разборка и перестановка', 'от 1 000 ₽']]},
    {id: 'svet', icon: 'i-svet', title: 'Электрика', note: 'Розетки, выключатели и свет. Проводку в стенах не прокладываю без осмотра.', items: [
      ['Розетка или выключатель', 'от 400 ₽'], ['Люстра: сборка и навеска', 'от 1 200 ₽'], ['Бра, торшер, светильник', 'от 700 ₽'], ['Точечный светильник', 'от 400 ₽'],
      ['Светодиодная подсветка', 'от 1 500 ₽'], ['Замена патрона, лампочек', 'от 300 ₽']]},
    {id: 'naveska', icon: 'i-naveska', title: 'Навеска и крепёж', note: 'Всё, что вешается: сверлю бетон, кирпич, плитку. Пылесос свой.', items: [
      ['Телевизор на кронштейн', 'от 1 500 ₽'], ['Карниз, гардина, жалюзи', 'от 800 ₽'], ['Полка, зеркало, картина', 'от 400 ₽'], ['Навесной шкаф', 'от 1 000 ₽'],
      ['Турник, шведская стенка', 'от 1 500 ₽'], ['Сушилка для белья', 'от 1 000 ₽'], ['Отверстие в бетоне или кирпиче', 'от 200 ₽']]},
    {id: 'santeh', icon: 'i-santeh', title: 'Сантехника', note: 'Не глобальные работы. Прочистку старых труб беру после фото коммуникаций.', items: [
      ['Замена смесителя или крана', 'от 1 200 ₽'], ['Унитаз, в том числе подвесной', 'от 3 000 ₽'], ['Раковина, врезка в столешницу ДСП', 'от 2 000 ₽'], ['Сифон, гибкая подводка', 'от 600 ₽'],
      ['Фильтр для воды', 'от 1 500 ₽'], ['Полотенцесушитель', 'от 2 000 ₽'], ['Душевая кабина, ванна: монтаж и демонтаж', 'от 4 000 ₽'],
      ['Устранение протечки', 'от 800 ₽'], ['Прочистка засора', 'от 1 000 ₽'], ['Герметизация ванны, мойки, поддона', 'от 1 000 ₽'], ['Арматура смывного бачка', 'от 1 000 ₽']]},
    {id: 'tehnika', icon: 'i-tehnika', title: 'Подключение техники', note: 'Подключаю и устанавливаю. Бытовую технику не ремонтирую.', items: [
      ['Стиральная машина', 'от 1 500 ₽'], ['Посудомоечная машина', 'от 1 800 ₽'], ['Электроплита, варочная панель', 'от 1 200 ₽'], ['Вытяжка', 'от 1 500 ₽'], ['Холодильник, микроволновка', 'от 800 ₽']]},
    {id: 'dveri', icon: 'i-dveri', title: 'Двери, замки, полы', note: 'Межкомнатные двери, фурнитура и напольные покрытия.', items: [
      ['Установка межкомнатной двери', 'от 3 500 ₽'], ['Замена замка', 'от 1 000 ₽'], ['Врезка замка', 'от 1 500 ₽'], ['Ручки, петли, фурнитура', 'от 500 ₽'],
      ['Регулировка дверей и окон', 'от 600 ₽'], ['Ламинат', 'от 450 ₽/м²'], ['Линолеум', 'от 250 ₽/м²'], ['Плинтус, наличник', 'от 200 ₽/м']]},
    {id: 'otdelka', icon: 'i-otdelka', title: 'Отделка и мелкий ремонт', note: 'Локальный ремонт и декор. Квартиру под аренду могу взять комплексно.', items: [
      ['Реечные панели, декор стен', 'от 1 500 ₽/м²'], ['Отделка балкона', 'по смете'], ['Подмазать стену, подклеить пол', 'от 1 000 ₽'],
      ['Подготовка квартиры под аренду', 'по смете'], ['Помощь с выбором и закупкой материалов', 'бесплатно']]}
  ];
  const svc = id => SERVICES.find(s => s.id === id);
  $('#svc-grid').innerHTML = SERVICES.map(s => `
    <article class="svc" data-id="${s.id}">
      <div class="svc-top"><svg class="ico"><use href="#${s.icon}"/></svg><span class="svc-from">${esc(s.items[0][1])}</span></div>
      <h3>${esc(s.title)}</h3>
      <ul>${s.items.slice(0, 4).map(i => `<li>${esc(i[0])}</li>`).join('')}</ul>
      <button class="svc-more" type="button" data-open="${s.id}">Все цены <span>${s.items.length}</span></button>
    </article>`).join('') + `
    <article class="svc svc-cta">
      <h3>Не нашли свою задачу?</h3>
      <p>Опишите её словами или пришлите фото. Скажу честно, возьмусь или нет.</p>
      <a class="btn btn-brass" href="#contact">Спросить мастера</a>
    </article>`;

  const dlg = $('#svc-dlg');
  const openSvc = id => {
    const s = svc(id); if (!s) return;
    $('#dlg-ico').innerHTML = `<use href="#${s.icon}"/>`;
    $('#dlg-title').textContent = s.title;
    $('#dlg-note').textContent = s.note;
    $('#dlg-list').innerHTML = s.items.map(i => `<li><span>${esc(i[0])}</span><i></i><b>${esc(i[1])}</b></li>`).join('');
    $('#dlg-ask').onclick = () => { dlg.close(); prefill(`${s.title}: `); };
    dlg.showModal();
  };
  $('#svc-grid').addEventListener('click', e => {
    const b = e.target.closest('[data-open]'); if (b) return openSvc(b.dataset.open);
    const c = e.target.closest('.svc:not(.svc-cta)'); if (c && !e.target.closest('a')) openSvc(c.dataset.id);
  });
  $$('[data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));
  $$('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));

  /* ---------- planner (signature) ---------- */
  const ROOMS = {
    hall: {name: 'Прихожая', tasks: ['Собрать шкаф или прихожую', 'Повесить зеркало', 'Заменить замок', 'Отрегулировать дверь', 'Повесить вешалку или полку', 'Заменить выключатель']},
    kitchen: {name: 'Кухня', tasks: ['Собрать кухонные модули', 'Выпил под мойку или варочную', 'Подключить посудомойку', 'Подключить варочную или духовку', 'Повесить вытяжку', 'Заменить смеситель', 'Установить фильтр для воды', 'Повесить навесные шкафы']},
    bath: {name: 'Санузел', tasks: ['Заменить смеситель', 'Подключить стиральную машину', 'Установить унитаз', 'Устранить протечку', 'Прочистить засор', 'Повесить полотенцесушитель', 'Загерметизировать ванну', 'Повесить полку или зеркало']},
    living: {name: 'Гостиная', tasks: ['Повесить телевизор', 'Собрать и повесить люстру', 'Повесить карниз', 'Повесить картины и полки', 'Заменить розетки', 'Собрать стенку или комод', 'Постелить ламинат', 'Установить плинтус']},
    bed: {name: 'Спальня', tasks: ['Собрать шкаф-купе', 'Собрать кровать', 'Повесить бра', 'Повесить карниз', 'Установить турник или шведскую стенку', 'Переставить мебель']},
    balcony: {name: 'Балкон', tasks: ['Повесить сушилку для белья', 'Обшить рейкой или панелями', 'Провести освещение', 'Повесить полки']}
  };
  const picked = new Map(); // key room|task -> {room, task}
  let room = 'living';
  const tasksBox = $('#pl-tasks'), list = $('#pl-list'), count = $('#pl-count'), hint = $('#pl-hint'), send = $('#pl-send');
  const renderRoom = () => {
    const r = ROOMS[room];
    $('#pl-room').textContent = r.name;
    tasksBox.innerHTML = r.tasks.map(t => {
      const on = picked.has(room + '|' + t);
      return `<button type="button" class="tk${on ? ' on' : ''}" aria-pressed="${on}" data-t="${esc(t)}"><span class="tk-box"></span>${esc(t)}</button>`;
    }).join('');
    $$('#plan .room').forEach(g => {
      const id = g.dataset.room, n = [...picked.values()].filter(p => p.room === id).length;
      g.classList.toggle('cur', id === room); g.classList.toggle('has', n > 0);
      g.setAttribute('aria-pressed', id === room);
      const badge = g.querySelector('.rbadge'); badge.textContent = n; badge.parentNode.style.display = n ? '' : 'none';
    });
  };
  const renderList = () => {
    const all = [...picked.values()], n = all.length;
    count.textContent = n;
    list.innerHTML = n ? all.map(p => `<li><span>${esc(p.task)}</span><small>${esc(ROOMS[p.room].name)}</small><button type="button" aria-label="Убрать" data-k="${esc(p.room + '|' + p.task)}">×</button></li>`).join('')
      : '<li class="empty">Нажмите на комнату на плане и отметьте, что нужно сделать.</li>';
    hint.textContent = n === 0 ? 'Список пока пустой' : n < 3 ? 'Одна-две задачи тоже возьму. Добавьте ещё, если что-то давно ждёт: за один выезд выгоднее.'
      : 'Отлично, это комплексный выезд: так выходит выгоднее, чем вызывать мастера по одной задаче.';
    $('#pl-meter').style.setProperty('--f', Math.min(n, 6) / 6);
    send.disabled = n === 0;
  };
  $$('#plan .room').forEach(g => {
    const go = () => { room = g.dataset.room; renderRoom(); if (innerWidth < 900) $('#pl-panel').scrollIntoView({behavior: 'smooth', block: 'nearest'}); };
    g.addEventListener('click', go);
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
  $$('.room-tabs button').forEach(b => b.addEventListener('click', () => { room = b.dataset.room; renderRoom(); }));
  tasksBox.addEventListener('click', e => {
    const b = e.target.closest('.tk'); if (!b) return;
    const k = room + '|' + b.dataset.t;
    picked.has(k) ? picked.delete(k) : picked.set(k, {room, task: b.dataset.t});
    renderRoom(); renderList();
  });
  list.addEventListener('click', e => {
    const b = e.target.closest('[data-k]'); if (!b) return;
    picked.delete(b.dataset.k); renderRoom(); renderList();
  });
  send.addEventListener('click', () => {
    const byRoom = {};
    picked.forEach(p => (byRoom[ROOMS[p.room].name] ||= []).push(p.task));
    prefill(Object.entries(byRoom).map(([r, t]) => `${r}: ${t.join(', ').toLowerCase()}`).join('\n'));
  });
  renderRoom(); renderList();

  function prefill(text) {
    const c = $('#f-comment'); c.value = text; $('#contact').scrollIntoView({behavior: 'smooth'});
    setTimeout(() => c.focus({preventScroll: true}), 700);
  }

  /* ---------- before / after ---------- */
  $$('.ba').forEach(ba => {
    const r = ba.querySelector('input');
    const set = () => ba.style.setProperty('--x', r.value + '%');
    r.addEventListener('input', set); set();
  });
  $$('.ba-tabs button').forEach(b => b.addEventListener('click', () => {
    $$('.ba-tabs button').forEach(x => x.setAttribute('aria-selected', x === b));
    $$('.ba').forEach(x => x.hidden = x.id !== b.dataset.ba);
  }));

  /* ---------- gallery ---------- */
  const more = $('#gal-more');
  more && more.addEventListener('click', () => { $('#gal').classList.add('all'); more.remove(); });
  const lb = $('#lb'), lbImg = $('#lb-img'), lbCap = $('#lb-cap'), shots = $$('#gal figure');
  let cur = 0;
  const show = i => { cur = (i + shots.length) % shots.length; const f = shots[cur]; lbImg.src = f.dataset.full; lbImg.alt = f.querySelector('img').alt; lbCap.textContent = f.querySelector('figcaption').textContent; };
  shots.forEach((f, i) => f.addEventListener('click', () => { show(i); lb.showModal(); }));
  $('#lb-prev').onclick = () => show(cur - 1); $('#lb-next').onclick = () => show(cur + 1);
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });

  /* ---------- faq: one open at a time ---------- */
  $$('.faq details').forEach(d => d.addEventListener('toggle', () => { if (d.open) $$('.faq details').forEach(o => o !== d && (o.open = false)); }));

  /* ---------- mobile nav ---------- */
  const nav = $('#nav'), burger = $('#burger');
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
    const details = ['Макет master-na-vse-ruki', f.where.value.trim() && `Адрес: ${f.where.value.trim()}`, `Когда: ${f.when.value}`, `Связь: ${f.via.value}`].filter(Boolean).join(', ');
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
