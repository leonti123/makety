'use strict';

const leadForm = document.getElementById('lead');
const fields = leadForm.elements;
const lettering = document.getElementById('lettering');
const lid = document.getElementById('lid');
const icing = document.getElementById('icing');
const hearts = document.getElementById('heart-switch');
const phraseButtons = document.querySelectorAll('.phrases button');
const submitButton = leadForm.querySelector('[type=submit]');
const successMessage = document.getElementById('sent');
const fallbackMessage = document.getElementById('fallback');
const errorMessage = document.getElementById('err');

function updateLettering() {
  icing.textContent = lettering.value.trim();
  document.getElementById('letter-count').textContent = lettering.value.length + '/40';
  for (const button of phraseButtons) {
    button.setAttribute('aria-pressed', String(button.textContent === lettering.value));
  }
}

lettering.addEventListener('input', updateLettering);
for (const button of phraseButtons) {
  button.addEventListener('click', () => {
    lettering.value = button.textContent;
    updateLettering();
  });
}
function updateLid() {
  const selected = document.querySelector('input[name=preview-color]:checked');
  lid.style.setProperty('--lid-color', selected.parentElement.style.getPropertyValue('--swatch'));
  lid.dataset.color = selected.value;
  icing.style.color = ['Белый', 'Розовый'].includes(selected.value) ? 'var(--ink)' : 'var(--frosting)';
  lid.querySelector('.heart-ring').toggleAttribute('hidden', !hearts.checked);
}
document.querySelector('.swatches').addEventListener('change', updateLid);
hearts.addEventListener('change', updateLid);
updateLettering();
updateLid();

function updateOrderFields() {
  const hasLid = ['bento', 'set'].includes(fields.product.value);
  document.getElementById('color-field').hidden = !hasLid;
  document.getElementById('hearts-field').hidden = !hasLid || !fields.color.value;
}

function startOrder(product) {
  fields.product.value = product;
  updateOrderFields();
  successMessage.hidden = true;
  submitButton.hidden = false;
  document.getElementById('order').scrollIntoView();
  fields.name.focus({preventScroll: true});
}
document.getElementById('order-lid').addEventListener('click', () => {
  fields.details.value = lettering.value.trim();
  fields.color.value = lid.dataset.color;
  fields.hearts.checked = hearts.checked;
  startOrder('bento');
});
fields.product.addEventListener('change', updateOrderFields);
fields.color.addEventListener('change', updateOrderFields);

for (const button of document.querySelectorAll('[data-open]')) {
  const dialog = document.getElementById('dlg-' + button.dataset.open);
  button.addEventListener('click', () => {
    dialog.showModal();
    dialog.scrollTop = 0;
  });
  dialog.querySelector('.close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right ||
          event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    }
  });
  dialog.querySelector('[data-order]').addEventListener('click', () => {
    dialog.close();
    startOrder(button.dataset.open);
  });
}

const filters = document.querySelectorAll('.filters button');
const pictures = document.querySelectorAll('.wall-grid figure');
for (const button of filters) {
  button.addEventListener('click', () => {
    for (const other of filters) other.setAttribute('aria-pressed', String(other === button));
    for (const pic of pictures) {
      pic.hidden = button.textContent !== 'Все' && pic.dataset.category !== button.textContent;
    }
  });
}

const LEAD_URL = "https://script.google.com/macros/s/AKfycby3_mdaCfx-Kv0MWD1RiwXnmTO47GtAS9zrH0WZsPcyeEGYHIRrXQjAU_EtMCfIypOW/exec";
const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
fields.date.min = today.toISOString().slice(0,10);

function orderDetails() {
  const date = new Date(fields.date.value + 'T12:00').toLocaleDateString('ru-RU');
  const lines = ['Макет astezian', 'Десерт: ' + fields.product.selectedOptions[0].text, 'Дата: ' + date];
  if (fields.details.value.trim()) lines.push('Надпись: ' + fields.details.value.trim());
  if (!document.getElementById('color-field').hidden && fields.color.value) {
    lines.push('Цвет крышки: ' + fields.color.value, 'Сердечки по кругу: ' + (fields.hearts.checked ? 'да' : 'нет'));
  }
  return lines.join('\n');
}

leadForm.addEventListener('input', () => {
  errorMessage.textContent = '';
  fallbackMessage.hidden = true;
  successMessage.hidden = true;
  submitButton.hidden = false;
});

leadForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (submitButton.disabled || !successMessage.hidden) return;
  if (fields.name.value.trim().length < 2) {
    errorMessage.textContent = 'Укажите имя';
    fields.name.focus();
    return;
  }
  if (fields.phone.value.replace(/\D/g, '').length !== 11) {
    errorMessage.textContent = 'Проверьте номер телефона';
    fields.phone.focus();
    return;
  }
  errorMessage.textContent = '';
  fallbackMessage.hidden = true;
  submitButton.disabled = true;
  submitButton.querySelector('span').textContent = 'Отправляем…';
  let ok = false;
  try {
    const res = await fetch(LEAD_URL, {
      method: 'POST',
      headers: {'Content-Type': 'text/plain;charset=utf-8'},
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        site: location.hostname, name: fields.name.value.trim(), phone: fields.phone.value,
        details: orderDetails(), comment: fields.comment.value.trim(), website: fields.website.value
      })
    });
    ok = (await res.json()).ok === true;
  } catch {
    ok = false;
  }
  submitButton.disabled = false;
  submitButton.querySelector('span').textContent = 'Отправить заявку';
  submitButton.hidden = ok;
  successMessage.hidden = !ok;
  fallbackMessage.hidden = ok;
});
