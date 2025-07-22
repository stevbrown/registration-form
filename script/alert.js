let alertCounter = 0;

export function createAlert(message, type) {
    const alertId = alertCounter++;

    const alertsContainers = document.querySelectorAll('.notif-block');

    // Если контейнеров нет — выходим
    if (alertsContainers.length === 0) return;

    // Создаем основной контейнер для уведомления
    const alertBox = document.createElement('div');
    alertBox.classList.add('notification-c', `notification-c-${alertId}`);

    const alertImage = document.createElement('img'); // Создаем элемент для иконки уведомления

    // Переменные для пути к изображению и его альтернативного текста
    let alertImgSrc = '';
    let alertAltSrc = '';
    switch(type) {
        case 'success': // Тип успех
            alertImgSrc = './img/Mark.svg';
            alertAltSrc = 'SUC';
            break;
        case 'warning': // Тип предупреждение
            alertImgSrc = './img/Warning.svg';
            alertAltSrc = 'WRN';
            break;
        case 'error': // Тип ошибка
            alertImgSrc = './img/Prohibit.svg';
            alertAltSrc = 'ERR';
            break;
        default: // Значение по умолчанию (ошибка)
            alertImgSrc = './img/Warning.svg';
            alertAltSrc = 'ERR';
            break;
    }

    // Устанавливаем атрибуты изображения (src и alt)
    alertImage.src = alertImgSrc;
    alertImage.alt = alertAltSrc;

    // Создаем текстовый элемент для сообщения
    const alertText = document.createElement('p');
    alertText.classList.add('caption-text');
    alertText.textContent = message; // Устанавливаем текст уведомления

    // Создаем кнопку для закрытия уведомления
    const closeButton = document.createElement('button');
    const closeImg = document.createElement('img');
    closeButton.classList.add('closeNotify');
    closeImg.src = './img/Close.svg';  // Иконка кнопки закрытия
    closeImg.alt = 'X'; // Альтернативный текст кнопки закрытия
    closeButton.appendChild(closeImg);

    // Собираем все элементы в контейнер уведомления
    alertBox.appendChild(alertImage);
    alertBox.appendChild(alertText);
    alertBox.appendChild(closeButton);

    // Находим контейнер для всех уведомлений

    // Добавим клон alertBox в каждый контейнер
    alertsContainers.forEach(container => {
        const clone = alertBox.cloneNode(true);
        container.appendChild(clone);

        // Анимация появления
        setTimeout(() => {
            clone.classList.add('loaded');
        }, 10);

        // Закрытие при клике
        const btn = clone.querySelector('.closeNotify');
        btn.addEventListener('click', () => {
            removeAlert(clone);
        });

        // Автоудаление через 5 сек
        setTimeout(() => {
            removeAlert(clone);
        }, 5000);

        // Ограничение количества алертов
        const alertBoxes = container.querySelectorAll('.notification-c');
        if (alertBoxes.length > 1) {
            alertBoxes[0].remove();
        }
    });
}

// Функция для плавного удаления уведомления.
function removeAlert(alertBox) {
    alertBox.classList.add('closed'); // Убираем класс анимации появления (запускаем исчезновение)
    setTimeout(() => {
        alertBox.remove(); // Полностью удаляем элемент из DOM после завершения анимации
    }, 1249); // 1.5 секунды задержки на завершение анимации
}