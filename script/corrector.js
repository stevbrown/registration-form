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