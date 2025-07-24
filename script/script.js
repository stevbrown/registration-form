import { getEmojiFlags } from "./getEmoji.js";
import { createAlert } from "./alert.js";
import { blockCyrillic } from "./corrector.js"; 

var code;
var number_conf;

document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.remove("unloaded");
    document.body.classList.add("loaded");
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);

    const select = document.querySelector("#phone-code");

    fetch("./lib/phone_country_codes.json")
        .then(response => response.json())
        .then(data => {
            const emojiFlags = getEmojiFlags();

            const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));

            entries.forEach(([country, code]) => {
                const option = document.createElement("option");
                const flag = emojiFlags[country] || "";
                option.value = code.replace("+", "").replace(/[^0-9]/g, "");
                option.textContent = `${flag} ${code}`;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Ошибка загрузки phone_country_codes.json:", error);
        });
});

function closeNotify() {
        const element = document.getElementById('notification');

        element.classList.add('closed');
};

function closePage() {
    location.reload();
}

document.querySelector('#sendCode').addEventListener('click', function() {
    try {
        const phoneInput = document.querySelector('#phone-number');
        const phoneNumber = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
        const phoneCode = document.querySelector('#phone-code').value;

        // const code = phoneCode.value;
        const number = phoneInput.value.replace(/\s+/g, '');

        const step1 = document.getElementById('step1');
        const step2 = document.getElementById('step2');
        const progress = document.getElementById('progress-bar');
        const bar = document.querySelector('.progress-bar');

        if(!phoneNumber || !phoneCode || !phoneInput) {
            createAlert('Oops! We couldn’t proceed without your phone number. Please enter your phone number to continue.', "error");
        } else if (phoneNumber.length < 10) {
            createAlert('The phone number you entered is incorrect or not in the correct format. Please check and try again.', "warning");
        } else {
            createAlert(`Your verification code has been successfully sent to +${phoneCode}${number}. We have sent an SMS with a verification code to the number you provided. Please check your messages to proceed.`, 'success');
            bar.classList.remove('active');
            setTimeout(() => {
                progress.src = './img/progress_bar/SecondCheck.svg'
                bar.classList.add('active');
            }, 550);

            step1.classList.remove('active');
            step1.classList.add('disactive');
            setTimeout(() => {
                step1.style.display = 'none';
                step2.style.display = 'flex';
                setTimeout(() => {
                    step2.classList.add('active');
                }, 25)
            }, 1300);
            pushCode(`+${phoneCode} ${phoneInput.value}`);
            number_conf = `+${phoneCode} ${phoneInput.value}`;
        }
    } catch(error) {
        alert(`Error ${error}`);
    };
});

document.querySelector('#confirmCode').addEventListener('click', function() {
    try {
        const codeInput = document.getElementById('code-enter').value;
        const progress = document.getElementById('progress-bar');
        const bar = document.querySelector('.progress-bar');
        const step2 = document.getElementById('step2');
        const step3 = document.getElementById('step3');

        const confirmedNumber = document.getElementById('confirmed-number');

        if (!codeInput || codeInput.length < 4) {
            createAlert('Attention! The verification code cannot be empty or incorrect.', 'error');
        } else if (codeInput != code) {
            createAlert('The verification code you entered does not match the code sent to your phone.', 'warning')
        } else {
            createAlert('Congratulations! Your verification code is correct.', 'success');

            bar.classList.remove('active');
            setTimeout(() => {
                progress.src = './img/progress_bar/ThirdCheck.svg'
                bar.classList.add('active');
            }, 550);

            step2.classList.remove('active');
            step2.classList.add('disactive');
            setTimeout(() => {
                step2.style.display = 'none';
                step3.style.display = 'flex';
                setTimeout(() => {
                    step3.classList.add('active');
                }, 25)
            }, 1300);
            confirmedNumber.textContent = `${number_conf}`
        }
    } catch (error) {
        alert(`Error ${error}`);
    }
});

// document.querySelector('#open-edit').addEventListener('click', function() {
//     try {
        
//     } catch (error) {
//         alert(`Error ${error}`);
//     }
// });

function pushCode(phone) {
    const choicedNumber = document.getElementById('choiced-number');

    choicedNumber.textContent = phone;
    code = generateRandomCode();
    setTimeout(() => {
        alert(`We have sent a verification code to your phone number.

            Send to: ${phone}
            Status: Code delivery initiated
            Code: ${code}`);
    }, 1500);
}

function resendCode() {
    alert(`We have sent a verification code to your phone number.

            Status: Code delivery initiated
            Code: ${code}`);
}

function generateRandomCode() {
    return Math.floor(1000 + Math.random() * 9000);
}

function setActive(step) {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');

    step1.classList.remove('active');
    step2.classList.remove('active');
    step3.classList.remove('active');

    step1.style.display = 'none';
    step2.style.display = 'none';
    step3.style.display = 'none';


    switch (step) {
        case 1:
            step1.style.display = 'flex';
            step1.classList.add('active');
            break;

        case 2:
            step2.style.display = 'flex';
            step2.classList.add('active');
            break;  
            
        case 3:
            step3.style.display = 'flex';
            step3.classList.add('active');
            break;
    
        default:
            break;
    }
}

document.querySelector('#showPass').addEventListener('click', function() {
    try {
        const element = document.getElementById('pass-word');
        const img = document.getElementById('showPass__img');

        if (element.getAttribute('type') === 'password') {
            element.type = 'text';
            img.src = './img/EyeSlash.svg';
        } else if (element.getAttribute('type') === 'text') {
            element.type = 'password';
            img.src = './img/OpenEye.svg';
        }
    } catch (error) {
        alert(`Error ${error}`);
    }
});

function checkPassword(event) {
    const element = document.getElementById('pass-word');
    const caption = document.getElementById('caption__status');
    const imgstatus = document.getElementById('caption-img__status');
    const status = document.getElementById('caption-text__status');

    blockCyrillic(event);

    if (element.value.length != 0 && element.value.length > 0) {
        caption.style.display = 'flex';

        imgstatus.src = './img/Prohibit.svg';
        status.textContent = 'Bad password';
        status.style.color = '#E94747';
    } else caption.style.display = 'none';

    if (element.value.length >= 6) {
        imgstatus.src = './img/WarningSm.svg';
        status.innerText = 'Weak password';
        status.style.color = '#FFC506';
    }

    if (element.value.length >= 12) {
        imgstatus.src = './img/Mark.svg';
        status.innerText = 'Good password';
        status.style.color = '#34C759';
    }
}

window.getEmojiFlags = getEmojiFlags;
window.closeNotify = closeNotify;
window.closePage = closePage;
window.resendCode = resendCode;
window.checkPassword =  checkPassword;


window.setActive = setActive;