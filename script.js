(function () {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
  }

  if (window.jQuery) {
    $('.tab-btn').on('click', function () {
      const tabId = $(this).data('tab');
      $('.tab-btn').removeClass('active');
      $(this).addClass('active');
      $('.tab-panel').removeClass('active').hide();
      $('#' + tabId).addClass('active').fadeIn(220);
    });

    $('.faq-question').on('click', function () {
      const answer = $(this).next('.faq-answer');
      $('.faq-answer').not(answer).slideUp(200);
      answer.stop(true, true).slideToggle(220);
    });
  }

  const bookingForm = document.getElementById('bookingForm');

  if (bookingForm) {
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    const roomTypeInput = document.getElementById('roomType');
    const extras = document.querySelectorAll('.extra');

    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const dateError = document.getElementById('dateError');

    const nightsCount = document.getElementById('nightsCount');
    const basePrice = document.getElementById('basePrice');
    const extrasPrice = document.getElementById('extrasPrice');
    const totalPrice = document.getElementById('totalPrice');
    const extrasList = document.getElementById('extrasList');
    const modal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');

    const getNights = () => {
      if (!checkinInput.value || !checkoutInput.value) return 1;
      const start = new Date(checkinInput.value);
      const end = new Date(checkoutInput.value);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 1;
    };

    const getExtrasTotal = () => {
      let sum = 0;
      extras.forEach(extra => {
        if (extra.checked) sum += Number(extra.value);
      });
      return sum;
    };

    const updateExtrasList = () => {
      const selected = Array.from(extras).filter(extra => extra.checked);
      extrasList.innerHTML = '';
      if (!selected.length) {
        extrasList.innerHTML = '<li>Додаткових послуг ще не обрано</li>';
        return;
      }
      selected.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.dataset.title} (+${item.value} грн)`;
        extrasList.appendChild(li);
      });
    };

    const updateSummary = () => {
      const nights = getNights();
      const base = Number(roomTypeInput.value) * nights;
      const extra = getExtrasTotal();
      const total = base + extra;

      nightsCount.textContent = String(nights);
      basePrice.textContent = `${base} грн`;
      extrasPrice.textContent = `${extra} грн`;
      totalPrice.textContent = `${total} грн`;
      updateExtrasList();
    };

    const validate = () => {
      let valid = true;
      nameError.textContent = '';
      phoneError.textContent = '';
      dateError.textContent = '';

      if (nameInput.value.trim().length < 2) {
        nameError.textContent = 'Введіть ім’я щонайменше з 2 символів.';
        valid = false;
      }

      const phoneClean = phoneInput.value.replace(/\D/g, '');
      if (phoneClean.length < 10) {
        phoneError.textContent = 'Введіть коректний номер телефону.';
        valid = false;
      }

      if (!checkinInput.value || !checkoutInput.value) {
        dateError.textContent = 'Оберіть дати заїзду та виїзду.';
        valid = false;
      } else if (new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
        dateError.textContent = 'Дата виїзду має бути пізніше за дату заїзду.';
        valid = false;
      }

      return valid;
    };

    [roomTypeInput, checkinInput, checkoutInput].forEach(el => {
      el.addEventListener('change', updateSummary);
    });

    extras.forEach(extra => extra.addEventListener('change', updateSummary));

    bookingForm.addEventListener('submit', function (event) {
      event.preventDefault();
      updateSummary();
      if (!validate()) return;
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      bookingForm.reset();
      updateSummary();
    });

    if (closeModal) {
      closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      });
    }

    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
        }
      });
    }

    updateSummary();
  }
})();
