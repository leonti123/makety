(() => {
  const D = window.SI, $ = s => document.querySelector(s);
  const rub = n => n.toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const ORD = D.chapters.map(c => c.id);
  D.items.sort((a, b) => ORD.indexOf(a.ch) - ORD.indexOf(b.ch));
  D.reviews.sort((a, b) => (b.t.length > 70) - (a.t.length > 70));
  const chName = Object.fromEntries(D.chapters.map(c => [c.id, c.name]));
  const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
  const COLORS = ['#B3263A','#2A9DA0','#8A5A12','#5A3526','#7b2a52','#1E6B57','#C8952B','#3c5a8a','#a3472b','#4d6b2f'];
  const HEIGHTS = [96, 84, 100, 90, 78, 94, 86, 98, 82, 92];

  /* shelf */
  const spines = $('#spines'), chapter = $('#chapter');
  spines.innerHTML = D.chapters.map((c, i) =>
    `<button class="spine" role="tab" data-ch="${c.id}" style="background:linear-gradient(90deg,${COLORS[i % 10]},${COLORS[i % 10]}dd 60%,${COLORS[i % 10]});height:${HEIGHTS[i % 10]}%" aria-label="Глава ${i + 1}: ${c.name}">
      <span class="no">${ROMAN[i]}</span><span class="t">${c.name}</span><span class="n">${c.count}</span></button>`).join('');
  function openChapter(id, scroll) {
    const i = D.chapters.findIndex(c => c.id === id), c = D.chapters[i];
    spines.classList.add('has-on');
    spines.querySelectorAll('.spine').forEach(b => { b.classList.toggle('on', b.dataset.ch === id); b.setAttribute('aria-selected', b.dataset.ch === id); });
    const picks = D.items.filter(x => x.ch === id).slice(0, 3);
    chapter.classList.remove('flip'); void chapter.offsetWidth; chapter.classList.add('flip');
    chapter.innerHTML = `<span class="ch-no">Глава ${ROMAN[i]}</span><h3>${c.name}</h3><p class="ch-line">${c.line}</p>
      <div class="mini">${picks.map(x => `<button data-id="${x.id}"><figure class="frame"><img src="${x.photos[0]}" alt="${esc(x.name)}" loading="lazy"></figure><b>${esc(x.name)}</b><span>${rub(x.price)}</span></button>`).join('')}</div>
      <button class="btn btn-ruby" data-all="${id}">Все наборы главы (${c.count})</button>`;
    if (scroll && innerWidth < 900) chapter.scrollIntoView({behavior: 'smooth', block: 'nearest'});
  }
  spines.addEventListener('click', e => { const b = e.target.closest('.spine'); if (b) openChapter(b.dataset.ch, true); });
  chapter.addEventListener('click', e => {
    const m = e.target.closest('[data-id]'); if (m) return openItem(m.dataset.id);
    const a = e.target.closest('[data-all]'); if (a) { setTab(a.dataset.all); $('#catalog').scrollIntoView({behavior: 'smooth'}); }
  });
  openChapter('skazki');

  /* catalog */
  const tabs = $('#tabs'), grid = $('#grid'), more = $('#more');
  let cur = 'all', shown = 12;
  tabs.innerHTML = `<button class="tab on" data-ch="all">Все <small>${D.items.length}</small></button>` +
    D.chapters.map(c => `<button class="tab" data-ch="${c.id}">${c.name} <small>${c.count}</small></button>`).join('');
  function list() { return cur === 'all' ? D.items : D.items.filter(x => x.ch === cur); }
  function render() {
    const l = list();
    grid.innerHTML = l.slice(0, shown).map(x => `<article class="card" data-id="${x.id}">
      <span class="ribbon">${rub(x.price)}</span>
      <figure class="frame"><img src="${x.photos[0]}" alt="${esc(x.name)}" loading="lazy" width="640" height="800"></figure>
      <h3>${esc(x.name)}</h3>${x.size ? `<p class="sz">${esc(x.size)}</p>` : `<p class="sz">${chName[x.ch]}</p>`}
      <button class="go">Подробнее →</button></article>`).join('');
    more.hidden = l.length <= shown;
    more.textContent = `Показать ещё (${l.length - shown})`;
  }
  function setTab(id) {
    cur = id; shown = 12;
    tabs.querySelectorAll('.tab').forEach(t => t.classList.toggle('on', t.dataset.ch === id));
    tabs.querySelector('.tab.on')?.scrollIntoView({inline: 'center', block: 'nearest'});
    render();
  }
  tabs.addEventListener('click', e => { const t = e.target.closest('.tab'); if (t) setTab(t.dataset.ch); });
  more.addEventListener('click', () => { shown += 12; render(); });
  grid.addEventListener('click', e => { const c = e.target.closest('.card'); if (c) openItem(c.dataset.id); });
  render();

  /* dialog */
  const dlg = $('#dlg'), dIn = $('#dlgIn');
  function openItem(id) {
    const x = D.items.find(i => i.id === id); if (!x) return;
    const desc = x.desc && x.desc.length > 12 ? x.desc : 'Набор шоколадных конфет ручной работы из бельгийского шоколада Callebaut: белый, тёмный и молочный. Начинки на выбор.';
    dIn.innerHTML = `<div class="gal"><figure class="frame"><img id="dMain" src="${x.photos[0]}" alt="${esc(x.name)}"></figure>
      ${x.photos.length > 1 ? `<div class="thumbs">${x.photos.map((p, k) => `<button class="${k ? '' : 'on'}" data-src="${p}" aria-label="Фото ${k + 1}"><img src="${p}" alt=""></button>`).join('')}</div>` : ''}</div>
      <div><span class="d-ch">${chName[x.ch]}</span><h3>${esc(x.name)}</h3><p class="d-price">${rub(x.price)}</p>${x.size ? `<p class="d-sz">${esc(x.size)}</p>` : ''}
      <p class="d-desc">${esc(desc)}</p>
      <div class="d-btns"><a class="btn btn-ruby" href="#order" data-pick="${esc(x.name)}">Заказать этот набор</a><a class="btn btn-line" href="https://vk.me/club219611967" target="_blank" rel="noopener">Написать в VK</a></div></div>`;
    dlg.showModal();
  }
  dIn.addEventListener('click', e => {
    const t = e.target.closest('.thumbs button');
    if (t) { $('#dMain').src = t.dataset.src; dIn.querySelectorAll('.thumbs button').forEach(b => b.classList.toggle('on', b === t)); }
  });
  $('#dlgX').onclick = () => dlg.close();
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

  /* picks into the form */
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-pick]'); if (!a) return;
    const v = a.dataset.pick, sel = $('#fWhat');
    if (['Мастер-класс', 'Корпоративные подарки', 'Свой сюжет'].includes(v)) sel.value = v;
    else { sel.value = 'Набор из каталога'; $('#fSet').value = v; }
    if (dlg.open) dlg.close();
  });

  /* calculator */
  const cnt = $('#cnt'), box = $('#calcBox');
  const CANDY = ['#5A3526', '#B3263A', '#C8952B', '#2A9DA0', '#F1E3C8', '#1E6B57', '#7b2a52', '#3B2117'];
  let dec = 0;
  box.innerHTML = Array.from({length: 60}, () => '<i></i>').join('');
  function calc() {
    const n = +cnt.value;
    $('#cntOut').textContent = n;
    const lo = n * 30 + (dec ? 100 : 50), hi = n * 50 + 100 + (dec ? 100 : 0);
    $('#calcRes').textContent = `от ${rub(Math.round(lo / 10) * 10)} до ${rub(Math.round(hi / 10) * 10)}`;
    box.querySelectorAll('i').forEach((c, k) => { const f = k < n; c.classList.toggle('f', f); c.style.background = f ? CANDY[(k * 7 + 3) % CANDY.length] : ''; });
  }
  cnt.addEventListener('input', calc);
  document.querySelectorAll('.seg button').forEach(b => b.onclick = () => {
    dec = +b.dataset.dec;
    document.querySelectorAll('.seg button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); });
    calc();
  });
  calc();

  /* reviews */
  const letters = $('#letters'), moreRev = $('#moreRev');
  let rShown = 6;
  function renderRev() {
    letters.innerHTML = D.reviews.slice(0, rShown).map(r => `<article class="letter ${r.t.length > 260 ? 'cut' : ''}">
      <span class="stamp">${esc(r.n.trim()[0] || 'Ш')}</span><h3>${esc(r.n)}</h3><time>${esc(r.d)}</time><p>${esc(r.t)}</p>
      ${r.t.length > 260 ? '<button class="rd">Читать полностью</button>' : ''}</article>`).join('');
    moreRev.hidden = rShown >= D.reviews.length;
  }
  letters.addEventListener('click', e => { const b = e.target.closest('.rd'); if (b) { b.parentNode.classList.remove('cut'); b.remove(); } });
  moreRev.onclick = () => { rShown += 6; renderRev(); };
  renderRev();

  /* menu */
  const menu = $('#menu');
  $('#burger').onclick = () => menu.classList.toggle('open');
  menu.addEventListener('click', e => { if (e.target.tagName === 'A') menu.classList.remove('open'); });

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
    const date = f.date.value ? new Date(f.date.value + 'T12:00').toLocaleDateString('ru-RU', {day: 'numeric', month: 'long'}) : 'не указана';
    const details = ['Макет shokoladnye-istorii', `Что: ${f.what.value}`, f.set.value.trim() && `Набор: ${f.set.value.trim()}`, `Дата: ${date}`, `Связь: ${f.via.value}`].filter(Boolean).join(', ');
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

  /* reveal */
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), {threshold: .1});
  document.querySelectorAll('.sec-head,.jar,.dcard,.price-in>*,.about-in>*,.mk-in>*').forEach(el => { el.classList.add('rv'); io.observe(el); });
})();
