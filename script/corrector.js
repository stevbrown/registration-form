import { createAlert } from "./alert.js";

function phoneCorrector() {
    var input = document.getElementById('phone-number');

    input.addEventListener('input', function(e) {
        let value = this.value;

        this.value = value.replace(/[^\d\-]/g, '');
        
        let start = this.selectionStart;
        let end = this.selectionEnd;
        
        this.setSelectionRange(start, end);
    });
}

function formatPhoneNumber() {
    var phoneInput = document.getElementById('phone-number');
    var phoneValue = phoneInput.value.replace(/\D/g, '');

    if (phoneValue.length < 10) {
        return;
    }

    var formattedPhone = 
        "(" + phoneValue.substring(0, 3) + ") " +
        phoneValue.substring(3, 6) + "-" +
        phoneValue.substring(6, 8) + "-" +
        phoneValue.substring(8);

    phoneInput.value = formattedPhone;
}

function phoneInputClear() {
    var input = document.getElementById('phone-number');

    input.value = '';
}

function codeCorrector() {
    var input = document.getElementById('code-enter');

    input.addEventListener('input', function(e) {
        let value = this.value;

        this.value = value.replace(/[^\d]/g, '');
        
        let start = this.selectionStart;
        let end = this.selectionEnd;
        
        this.setSelectionRange(start, end);
    });
}

function blockCyrillic(event) {
    const input = event.target;
    const cyrillicPattern = /[А-Яа-яЁё]/;

    if (cyrillicPattern.test(input.value)) {
        input.value = input.value.replace(cyrillicPattern, '');
        createAlert(`You are using invalid characters!`, 'warning');
    }
}

function mailCorrector(event) {
    const input = event.target;
    const forbiddenPattern = /[ \t!#$%&'()*+,/:;<=>?[\]~]/;

    blockCyrillic(event);

    if (forbiddenPattern.test(input.value)) {
        input.value = input.value.replace(forbiddenPattern, '');
        createAlert(`You are using invalid characters!`, 'warning');
    }

    input.value = input.value.toLowerCase();

    const cleanedValue = input.value
        .replace(/\.{2,}/g, '.') 
        .replace(/^\./, '')
    input.value = cleanedValue;
}

function mailCorrectCheck(event) {
    const input = event.target;

    if (input.value.length < 5) {
        createAlert('The provided email address is too short and lacks the necessary components to be considered valid.', 'error');
        return;
    }

    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    if (!emailPattern.test(input.value)) {
        createAlert('The entered email address is invalid and does not meet the required format.', 'error');
    } 
}


window.phoneCorrector = phoneCorrector;
window.formatPhoneNumber = formatPhoneNumber;
window.phoneInputClear = phoneInputClear;
window.codeCorrector = codeCorrector;
window.blockCyrillic = blockCyrillic;
window.mailCorrector = mailCorrector;
window.mailCorrectCheck = mailCorrectCheck;