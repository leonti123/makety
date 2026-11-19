'use strict';

const LEAD_URL = "https://script.google.com/macros/s/AKfycby3_mdaCfx-Kv0MWD1RiwXnmTO47GtAS9zrH0WZsPcyeEGYHIRrXQjAU_EtMCfIypOW/exec";

const parts = document.querySelectorAll('[data-select]');
function selectPart(key) {
  const row = document.querySelector('[data-service="' + key + '"]');
  for (const button of parts) {
    button.setAttribute('aria-pressed', String(button.dataset.select === key));
  }
  for (const shape of document.querySelectorAll('[data-part]')) {
    shape.classList.toggle('active', shape.dataset.part === key);
  }
  document.querySelector('#problem').textContent = row.dataset.problem;
  document.querySelector('#work').textContent = row.querySelector('.work').textContent;
  document.querySelector('#price').textContent = row.querySelector('.price').textContent;
  document.querySelector('#answer [data-add]').dataset.add = key;
}

for (const button of parts) {
  button.addEventListener('click', () => selectPart(button.dataset.select));
}
if (parts.length) selectPart('sash');

for (const link of document.querySelectorAll('[data-add]')) {
  link.addEventListener('click', () => {
    document.getElementById('service-' + link.dataset.add).checked = true;
  });
}

const form = document.querySelector('.fl');
if (form) {
  const section = document.getElementById('zamer');
  const dock = document.querySelector('.dock');
  function updateDock() {
    const bounds = section.getBoundingClientRect();
    dock.hidden = bounds.top < window.innerHeight && bounds.bottom > 0;
  }
  window.addEventListener('scroll', updateDock, {passive: true});
  window.addEventListener('resize', updateDock);
  window.addEventListener('pageshow', updateDock);
  if ('ResizeObserver' in window) new ResizeObserver(updateDock).observe(document.body);
  updateDock();

  const fields = form.elements;
  const button = form.querySelector('button[type=submit]');
  const error = form.querySelector('.error');
  const sent = document.querySelector('.success');
  for (const field of [fields.name, fields.phone]) {
    field.addEventListener('input', () => field.setCustomValidity(''));
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled) return;
    const digits = fields.phone.value.replace(/\D/g, '');
    if (fields.name.value.trim().length < 2) fields.name.setCustomValidity('Укажите имя');
    if (!/^(?:[78])?\d{10}$/.test(digits)) fields.phone.setCustomValidity('Проверьте номер телефона');
    if (!form.reportValidity()) return;

    const values = new FormData(form);
    const details = ['Макет mk-servis-okna (МК-Сервис Окна, Москва)'];
    const services = values.getAll('service');
    if (services.length) details.push('Услуги: ' + services.join(', '));
    if (fields.district.value.trim()) details.push('Район или город: ' + fields.district.value.trim());
    details.push('Время: ' + (values.get('time') || 'как договоримся'));

    error.hidden = true;
    button.disabled = true;
    button.textContent = 'Отправляем…';
    let ok = false;
    try {
      const response = await fetch(LEAD_URL, {
        method: 'POST',
        headers: {'Content-Type': 'text/plain;charset=utf-8'},
        signal: typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(20000) : undefined,
        body: JSON.stringify({
          site: location.hostname,
          name: fields.name.value.trim(),
          phone: '+7' + digits.slice(-10),
          details: details.join('; '),
          comment: fields.comment.value.trim(),
          website: fields.website.value
        })
      });
      ok = (await response.json()).ok === true;
    } catch {
      // The fallback keeps the entered details available for a retry.
    }
    button.disabled = false;
    button.textContent = 'Записаться на замер';
    if (ok) {
      form.hidden = true;
      sent.hidden = false;
      sent.focus();
      sent.scrollIntoView({block: 'center'});
    } else {
      error.hidden = false;
      error.scrollIntoView({block: 'center'});
    }
  });
}
