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
    
    const datalist = document.getElementById("cities");

    fetch("./lib/cities.json")
        .then(response => response.json())
        .then(data => {
            const emojiFlags = getEmojiFlags();

            Object.values(data).forEach(region => {
                Object.entries(region).forEach(([country, cities]) => {
                    const flag = emojiFlags[country] || "";
                    cities.forEach(city => {
                        const option = document.createElement("option");
                        option.value = `${city}, ${flag}`;
                        datalist.appendChild(option);
                    });
                });
            });
        })
        .catch(error => {
            console.error("Ошибка загрузки cities.json:", error);
        });

        const selecte = document.getElementById('soc-media');

        fetch('./lib/social_networks.json')
            .then(response => response.json())
            .then(data => {
                const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));

                entries.forEach(([network, details]) => {
                    const option = document.createElement('option');
                    
                    option.value = network;
                    option.textContent = network;
                    selecte.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Ошибка загрузки social_networks.json:', error);
            });



        const today = new Date();
        const minAge = new Date(today.getFullYear() - 14, today.getMonth(), today.getDate());
        document.querySelector('#dob').max = minAge.toISOString().split('T')[0];
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

            const confirmedPhne = document.getElementById('phone-confirm');
            confirmedPhne.value = `+${phoneCode} ${phoneInput.value}`;
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

document.querySelector('#registerNow').addEventListener('click', function() {
    try {
        const progress = document.getElementById('progress-bar');
        const bar = document.querySelector('.progress-bar');
        const step3 = document.getElementById('step3');
        const step4 = document.getElementById('step4');
        const userid = document.getElementById('user-id');

        const emailInput = document.getElementById('email-id').value;
        const passwordInput = document.getElementById('pass-word').value;

        if (!emailInput || !passwordInput) {
            createAlert('Attention! Fields cannot be empty or incorrect.', 'error');
        } else if (passwordInput.length < 6) {
            createAlert('Password length is insufficient. Please enter a longer password.', 'error');
        } else if (!mailCorrectAfterCheck('email-id')) {
            createAlert('The provided email address is too short and lacks the necessary components to be considered valid.', 'error');
        } else {
            bar.classList.remove('active');
            setTimeout(() => {
                progress.src = './img/progress_bar/FirstCheck.svg'
                bar.classList.add('active');
            }, 550);

            step3.classList.remove('active');
            step3.classList.add('disactive');
            setTimeout(() => {
                step3.style.display = 'none';
                step4.style.display = 'flex';
                setTimeout(() => {
                    step4.classList.add('active');
                }, 25)
            }, 1300);

            userid.textContent = generateUUIDID();

            const confirmedEmail = document.getElementById('email-confirm');
            confirmedEmail.value = `${emailInput}`;
        }
    } catch (error) {
        alert(`Error ${error}`);
    }
});

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

function generateUUIDID() {
    const uuid = crypto.randomUUID();
    return (
        uuid.slice(0, 3) + '-' +
        uuid.slice(3, 5) + '-' +
        uuid.slice(5, 7)
    );
}

function setActive(step) {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const step4 = document.getElementById('step4');
    const step5 = document.getElementById('step5');
    const step6 = document.getElementById('step6');

    step1.classList.remove('active');
    step2.classList.remove('active');
    step3.classList.remove('active');
    step4.classList.remove('active');
    step5.classList.remove('active');
    step6.classList.remove('active');

    step1.style.display = 'none';
    step2.style.display = 'none';
    step3.style.display = 'none';
    step4.style.display = 'none';
    step5.style.display = 'none';
    step6.style.display = 'none';

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
        case 4:
            step4.style.display = 'flex';
            step4.classList.add('active');
            break;
        case 5:
            step5.style.display = 'flex';
            step5.classList.add('active');
            break;
        case 6:
            step6.style.display = 'flex';
            step6.classList.add('active');
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

var counter = 0;

document.querySelector('#addMore').addEventListener('click', function() {
    try {
        const socialspace = document.getElementById('socialspace');

        if (counter < 10) {
            counter++;

            const fieldscreate = document.createElement('section');
            const seleccreate  = document.createElement('select');
            const inputcreate = document.createElement('input');

            seleccreate.id = `soc-media-${counter}`;
            seleccreate.classList.add('soc-mediaa');

            inputcreate.id = `soc-profile-${counter}`;
            inputcreate.classList.add('phone-number');
            inputcreate.autocomplete = 'nickname';
            inputcreate.maxLength = '255';
            inputcreate.type = 'text';
            inputcreate.placeholder = '@profile';

            fetch('./lib/social_networks.json')
                .then(response => response.json())
                .then(data => {
                    const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));

                    entries.forEach(([network, details]) => {
                        const option = document.createElement('option');
                        
                        option.value = network;
                        option.textContent = network;
                        seleccreate.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error('Ошибка загрузки social_networks.json:', error);
                });

            fieldscreate.appendChild(seleccreate);
            fieldscreate.appendChild(inputcreate);
            fieldscreate.classList.add('fields');

            socialspace.appendChild(fieldscreate);
        } else {
            createAlert('Has the maximum number of social networks been reached.', 'warning');
            scrollToElement('.step#step5 .notif-block');
        }
    } catch (error) {
        alert(`Error ${error}`);
    }
});

function scrollToElement(targetSelector) {
    const targetDiv = document.querySelector(targetSelector);
    if (targetDiv) {
        targetDiv.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

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