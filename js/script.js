// --- Info Modal ---
const infoBtn = document.getElementById('infoBtn');
const infoModal = document.getElementById('infoModal');
const closeModal = document.getElementById('closeModal');

infoBtn.addEventListener('click', () => infoModal.classList.add('active'));
closeModal.addEventListener('click', () => infoModal.classList.remove('active'));
infoModal.addEventListener('click', e => {
  if (e.target === infoModal) infoModal.classList.remove('active');
});

// --- Dropdown ---
const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
  const btn = dropdown.querySelector('.dropdown-btn');
  const content = dropdown.querySelector('.dropdown-content');
  const customWrapId = dropdown.dataset.custom;
  const customWrap = customWrapId ? document.getElementById(customWrapId) : null;

  btn.addEventListener('click', e => {
    e.stopPropagation();
    const isActive = content.classList.contains('show');

    // Закрыть все dropdowns
    document.querySelectorAll('.dropdown-content.show').forEach(ul => {
      ul.classList.remove('show');
      if (ul.originalParent) ul.originalParent.appendChild(ul);
      ul.style.position = '';
      ul.style.top = '';
      ul.style.left = '';
      ul.style.width = '';
    });

    if (!isActive) {
      if (!content.originalParent) content.originalParent = dropdown;
      document.body.appendChild(content);

      const rect = btn.getBoundingClientRect();
      content.style.position = 'absolute';
      content.style.top = rect.bottom + window.scrollY + 8 + 'px';
      content.style.left = rect.left + window.scrollX + 'px';
      content.style.width = rect.width + 'px';

      content.classList.add('show');
    }
  });

  content.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', e => {
      e.stopPropagation();

      btn.textContent = item.textContent;
      btn.dataset.value = item.getAttribute('value') || item.dataset.insert || '';

      content.classList.remove('show');
      if (content.originalParent) content.originalParent.appendChild(content);
      content.style.position = '';
      content.style.top = '';
      content.style.left = '';
      content.style.width = '';

      if (btn.dataset.value === 'custom' && customWrap) {
        customWrap.hidden = false;
      } else if (customWrap) {
        customWrap.hidden = true;
      }

      updateFinalText();
    });
  });
});

document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown-content.show').forEach(ul => {
    ul.classList.remove('show');
    if (ul.originalParent) ul.originalParent.appendChild(ul);
    ul.style.position = '';
    ul.style.top = '';
    ul.style.left = '';
    ul.style.width = '';
  });
});

// --- Получение элементов для генерации ---
const greetingSelect = document.getElementById('greeting-select').querySelector('.dropdown-btn');
const greetingCustom = document.getElementById('greeting-custom');
const recipientName = document.getElementById('recipient-name');

const mainSelect = document.getElementById('main-select').querySelector('.dropdown-btn');
const mainCustom = document.getElementById('main-custom');

const eventSelect = document.getElementById('event-select').querySelector('.dropdown-btn');
const eventCustom = document.getElementById('event-custom');

const featureChecks = Array.from(document.querySelectorAll('.feature'));
const featureCustom = document.getElementById('feature-custom');

const thanksChecks = Array.from(document.querySelectorAll('.thanks'));
const thanksCustom = document.getElementById('thanks-custom');

const wishChecks = Array.from(document.querySelectorAll('.wish'));
const wishCustom = document.getElementById('wish-custom');

const endingSelect = document.getElementById('ending-select').querySelector('.dropdown-btn');
const endingCustom = document.getElementById('ending-custom');

const signSelect = document.getElementById('sign-select').querySelector('.dropdown-btn');
const signCustom = document.getElementById('sign-custom');

const senderName = document.getElementById('sender-name');
const hideOptional = document.getElementById('hideOptional');

const finalTextarea = document.getElementById('final-text');

// --- Функция генерации блоков ---
function computeGeneratedBlocks() {
  const name = recipientName.value.trim() || '{имя}';
  const eventName = eventSelect.dataset.value === 'custom' ? eventCustom.value.trim() || '{событие}' : eventSelect.dataset.value || '{событие}';

  const out = {};

  // Приветствие
  if (greetingSelect.dataset.value === 'custom') {
    let customGreeting = greetingCustom.value.trim();
    if (customGreeting) {
      // если пользователь забыл вставить {name}, добавляем имя в конце
      out.greeting = customGreeting.includes('{name}') 
        ? customGreeting.replace('{name}', name) 
        : customGreeting + ' ' + name + '!';
    } else {
      out.greeting = name + '!';
    }
  } else {
    out.greeting = (greetingSelect.dataset.value || '{name}').replace('{name}', name + '!');
  }

  // --- Основное поздравление ---
  if (mainSelect.dataset.value === 'custom') {
    let customMain = mainCustom.value.trim();
    if (customMain) {
      // если пользователь забыл вставить {event}, добавляем событие в конце
      out.main = customMain.includes('{event}') 
        ? customMain.replace('{event}', eventName + '!') 
        : customMain + ' ' + eventName + '!';
    } else {
      out.main = eventName + '!';
    }
  } else {
    out.main = (mainSelect.dataset.value || '{event}').replace('{event}', eventName + '!');
  }


  // Опциональные блоки
  if (hideOptional.checked) {
    out.features = '';
    out.thanks = '';
  } else {
    const featuresChosen = featureChecks.filter(c => c.checked).map(c => c.value);
    if (featureCustom.value.trim()) featuresChosen.push(featureCustom.value.trim());
    out.features = featuresChosen.length ? 'Этот день особенный, потому что ' + featuresChosen.join(', ') + '.' : '';

    const thanksChosen = thanksChecks.filter(c => c.checked).map(c => c.value);
    if (thanksCustom.value.trim()) thanksChosen.push(thanksCustom.value.trim());
    out.thanks = thanksChosen.length ? 'Я хочу сказать тебе спасибо ' + thanksChosen.join(', ') + '.' : '';
  }

  // Заключение и подпись
  const ending = endingSelect.dataset.value === 'custom' ? endingCustom.value.trim() : endingSelect.dataset.value || '';
  const sign = signSelect.dataset.value === 'custom' ? signCustom.value.trim() : signSelect.dataset.value || '';
  const sender = senderName.value.trim();
  out.ending = ending;
  out.sign = sender ? (sign + ' ' + sender) : sign;

  // Пожелания
  const wishesChosen = wishChecks.filter(c => c.checked).map(c => c.value);
  if (wishCustom.value.trim()) wishesChosen.push(wishCustom.value.trim());
  out.wishes = wishesChosen.join(', ');

  return out;
}

// --- Функция генерации текста ---
function updateFinalText() {
  const blocks = computeGeneratedBlocks();
  const parts = [];

  if (blocks.greeting) parts.push(blocks.greeting);
  if (blocks.main) parts.push(blocks.main);
  if (blocks.features) parts.push(blocks.features);
  if (blocks.thanks) parts.push(blocks.thanks);
  if (blocks.wishes) parts.push(blocks.wishes);
  if (blocks.ending) parts.push(blocks.ending);
  if (blocks.sign) parts.push(blocks.sign);

  finalTextarea.value = parts.join('\n\n');
}

// --- Автообновление ---
const autoInputs = [
  recipientName, greetingCustom, mainCustom, eventCustom,
  featureCustom, thanksCustom, wishCustom,
  endingCustom, signCustom, senderName
];

autoInputs.forEach(input => input.addEventListener('input', updateFinalText));
document.querySelectorAll('.feature, .thanks, .wish').forEach(chk => chk.addEventListener('change', updateFinalText));
dropdowns.forEach(dd => dd.querySelectorAll('li').forEach(item => item.addEventListener('click', updateFinalText)));

// --- Скрытие необязательных блоков ---
hideOptional.addEventListener('change', () => {
  const optionalBoxes = Array.from(document.querySelectorAll('.box')).filter(box => {
    const h3 = box.querySelector('h3');
    return h3 && h3.textContent.includes('(опционально)');
  });
  optionalBoxes.forEach(box => box.style.display = hideOptional.checked ? 'none' : 'block');
  updateFinalText();
});

// --- Копирование ---
document.getElementById('copyBtn').addEventListener('click', () => {
  finalTextarea.select();
  document.execCommand('copy');
  alert('Текст скопирован!');
});

// --- Инициализация ---
document.addEventListener('DOMContentLoaded', () => {
  finalTextarea.setAttribute('readonly', true); // блокируем редактирование
  updateFinalText();
});
