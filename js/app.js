'use strict';

const inputItems = document.querySelectorAll('.input');

/*Tooltip */
const infoItem = document.querySelector('.item__info');
const infoTooltip = document.querySelector('.info__tooltip');

infoItem.addEventListener('mouseenter', () => {
  infoTooltip.classList.add('show');
});

infoItem.addEventListener('mouseleave', () => {
  infoTooltip.classList.remove('show');
});

inputItems.forEach((item) => {
  const events = ['input', 'change', 'focus', 'blur'];

  for (const i in events) {
    /*Изменение инпутов*/
    item.addEventListener(events[i], (e) => {
      if (e.type == 'focus') {
        item.classList.add('inputing');
        item.classList.remove('active');
      } else if (e.type == 'blur') {
        item.classList.remove('inputing');
        item.classList.add('active');

        //Удаление класса active
        if (item.classList.contains('error')) {
          item.classList.remove('active');
        }
      }
    });

    /*Валидация */
    if (item.name == 'number_card') {
      item.addEventListener(events[i], formatCardCode, false);
    } else if (item.name == 'date') {
      item.addEventListener(events[i], formatDate, false);
    } else if (item.name == 'info') {
      item.addEventListener(events[i], formatCardInfo, false);
    }
  }
});

function formatCardCode() {
  let cardCode = this.value.replace(/[^\d]/g, '').substring(0, 19);
  cardCode = cardCode !== '' ? cardCode.match(/.{1,4}/g).join(' ') : '';
  this.value = cardCode;
}

function formatDate() {
  let cardDate = this.value.replace(/[^\d]/g, '').substring(0, 4);

  cardDate = cardDate !== '' ? cardDate.match(/.{1,2}/g).join('/') : '';
  this.value = cardDate;
}

function formatCardInfo() {
  let cardInfo = this.value.replace(/[^\d]/g, '').substring(0, 3);
  this.value = cardInfo;
}
