const form = document.querySelector('form'),
  inputs = form.querySelectorAll('.input'),
  btn = form.querySelector('.btn');

const messages = ['Поле обязательно', 'Неверный формат MM/YY', 'Не верный формат карты', 'Минимум 16 цифр', 'Неверный формат CVV/CVC'];

inputs.forEach((input) => {
  input.addEventListener('blur', (e) => {
    let target = e.target;
    let value = target.value;
    let resultValid = true;

    //Если поля пустые выдать ошибку об обязательном заполнении
    if (!value) {
      errorMessage(target, messages[0]);
      return;
    } else {
      successMessage(target);
    }
    //Проверки для поля ввода номера карты
    if (target.name == 'number_card') {
      value = value.replace(/\s+/g, '');

      //Если чисел в карте меньше 16
      if (value.length < 16) {
        errorMessage(target, messages[3]);
      } else {
        successMessage(target);
      }
    }
    //Проверка для ввода поля даты
    if (target.name == 'date') {
      value = value.replace(/\/+/g, '');

      if (value.length < 4 || value.substr(0, 2) > 12) {
        errorMessage(target, messages[1]);
      }
    }
    //Проверка поля информации
    if (target.name == 'info' && value.length < 3) {
      errorMessage(target, messages[4]);
    }

    //Проверка всех импутов на ошибки
    //и если хотя бы один не отвечает заданым параметрам
    // проверка не проходит
    inputs.forEach((item) => {
      if (item.classList.contains('error') || item.value == '') {
        resultValid = false;
        return;
      }
    });

    activeBtn(resultValid, inputs);
  });
});

//запрос на сервер
const postData = (body) =>
  fetch('./server.php', {
    method: 'POST',
    headers: {
      'contant-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

//Активация кнопки отправить
const activeBtn = (result) => {
  if (result) {
    btn.removeAttribute('disabled');
  } else {
    btn.setAttribute('disabled', 'disabled');
  }
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const confirmModal = document.querySelector('.confirm'),
    confirmList = confirmModal.querySelector('.confirm__list'),
    controlsBtns = confirmModal.querySelectorAll('.confirm__btn');

  confirmModal.classList.add('show');
  confirmList.innerHTML = '';

  inputs.forEach((item) => {
    const inputTitle = item.previousElementSibling.dataset.title;
    confirmList.insertAdjacentHTML(
      'beforeend',
      `<li class="confirm__item">
      <p class="confirm__item-title">${inputTitle}</p>
      <p class="confirm__item-text">${item.value}</p>
    </li>`
    );
  });

  controlsBtns.forEach((controlsBtn) => {
    controlsBtn.addEventListener('click', () => {
      if (controlsBtn.id == 'cancel') {
        confirmModal.classList.remove('show');
      } else if (controlsBtn.id == 'success') {
        confirmModal.classList.remove('show');
        addDate();
      }
    });
  });
});

const addDate = () => {
  //Добавляем спинер в кнопку
  btn.innerHTML = `<svg class="spiner" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0.000181827 11.9904C0.000181827 18.2141 5.36257 24 12.0002 24C12.6027 23.9882 13.1899 23.9491 13.7095 23.8745C15.1762 23.6508 15.5195 22.8554 15.4615 22.1961C15.4319 21.8611 15.2757 21.5592 15.0235 21.3616C14.7832 21.1734 14.4506 21.0574 13.9605 21.1319C13.893 21.1473 13.8173 21.1533 13.7521 21.1627C13.1898 21.2716 12.6039 21.3509 12.0002 21.3509C6.84022 21.3509 2.6591 17.1477 2.6591 11.9891C2.6591 6.84139 6.84022 2.64879 12.0002 2.64879C17.1483 2.64879 21.3413 6.84018 21.3413 11.9891C21.3413 13.1503 21.1341 14.2511 20.7577 15.262C20.0545 16.9239 22.3013 18.0058 23.1974 16.3143C23.8201 14.9969 23.9905 13.2948 24 11.9881C24 5.36316 18.6376 0 12 0C5.04419 0.113633 0.0984898 6.06647 0 11.9881L0.000181827 11.9904Z" fill="url(#paint0_angular_2_3329)"/>
  <defs>
  <radialGradient id="paint0_angular_2_3329" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 12) rotate(90) scale(12)">
  <stop offset="0.0554897" stop-color="white" stop-opacity="0.01"/>
  <stop offset="0.148719" stop-color="white"/>
  </radialGradient>
  </defs>
  </svg>`;

  btn.setAttribute('disabled', 'disabled');

  const formData = new FormData(form);
  const body = {};

  formData.forEach((item, key) => {
    body[key] = item;
  });

  //Если все гуд
  const successResolve = () => {
    clearInputs(inputs);
    alert('Данные успешно отправлены!');
    btn.innerHTML = `Отправить`;
  };

  //Если ошибка
  const errorResolve = () => {
    clearInputs(inputs);
    alert('Произошла ошибка');
    btn.innerHTML = `Отправить`;
  };

  postData(body)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('status not 200');
      }
      successResolve();
    })
    .catch((error) => {
      errorResolve();
      console.log(error);
    });
};

//Отчистка полей
const clearInputs = () => {
  inputs.forEach((input) => {
    input.value = '';
    input.classList.remove('active');
  });
};

//Выводит ошибку
const errorMessage = (item, textError) => {
  //Проверка на выводимое сообщение
  if (item.nextElementSibling) {
    if (item.nextElementSibling.textContent !== textError) {
      item.nextElementSibling.textContent = textError;
    }
  }

  //Проверка на класс Error, если он есть то функция прекращается
  if (item.classList.contains('error')) {
    return;
  }

  //Добавление класса Error,
  item.classList.add('error');

  //подсветка заголовка
  item.previousElementSibling.classList.add('error');

  //Создание елемента ошибки и записи туда самой ошибки
  let spanEl = document.createElement('span');
  spanEl.classList.add('error__text');
  spanEl.textContent = textError;

  item.insertAdjacentElement('afterend', spanEl);
};

//Убирает ошибку
const successMessage = (item) => {
  item.classList.remove('error');
  item.previousElementSibling.classList.remove('error');

  if (item.nextElementSibling) {
    item.nextElementSibling.remove();
  }
};
