'use strict';

let auth_form = document.querySelector(".auth-form");

// Можно было проще реализовать: через свойство элемента формы авторизации - innerHTML.
// Но это свойство в отношении безопасности не рекомендуется применять.

let templateLogin = document.getElementById('login').content;
let form_window = templateLogin.querySelector('.auth-form__form-content');
let error_msg = templateLogin.querySelector('.auth-form__error-msg');
let email_put = templateLogin.querySelector('.auth-form__text-input_email');
let password_put = templateLogin.querySelector('.auth-form__text-input_password');
let login_btn = templateLogin.querySelector('.auth-form__submit-btn_login');

let templateLogout = document.getElementById('logout').content;
let formLogoutTemplate = templateLogout.querySelector('.auth-form__form-content');
let userAvatar = templateLogout.querySelector('.auth-form__user-avatar');
let userName = templateLogout.querySelector('.auth-form__user-name');
let logout_btn = templateLogout.querySelector('.auth-form__submit-btn_logout');

logout_btn.addEventListener('click', function () {
    email_put.value = '';
    password_put.value = '';
    error_msg.textContent = '';
    error_msg.classList.add('hidden');
    auth_form.replaceChild(form_window, formLogoutTemplate);
});

function validData() {
    let regEmail = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    let validEmail = regEmail.test(email_put.value);
    let valid = true;
    if (!validEmail) {
        error_msg.classList.remove('hidden');
        error_msg.textContent = 'Invalid input E-Mail';
        showIncorrectEmailPassMessage();
        valid = false
    } else if (password_put.value.length === 0) {
        error_msg.classList.remove('hidden');
        error_msg.textContent = 'Password is empty';
        valid = false;
    }
    return valid;
};

login_btn.addEventListener('click', function (evt) {
    evt.preventDefault();
    let xhr = new XMLHttpRequest();
    login_btn.setAttribute("disabled", "disabled");
    initXMLHttpRequest(xhr);

    if (validData()) {
        getDataWithPostRequest(xhr).then(showElementForLoginSuccessfully).catch(showLoginFailedMessage);
    }
    login_btn.removeAttribute("disabled");
});

function initXMLHttpRequest(xhr) {
    xhr.timeout = 3000;
    xhr.open("POST", 'https://us-central1-mercdev-academy.cloudfunctions.net/login', true);
    xhr.setRequestHeader("Content-type", "application/json");
}

function getDataWithPostRequest(xhr) {
    return new Promise(function (resolve, reject) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response)
                } else {
                    reject(xhr.status)
                }
            } else {
                error_msg.classList.remove('hidden');
                error_msg.textContent = 'Unidentified Error';
            }
        };
        xhr.send(JSON.stringify({
            email: email_put.value,
            password: password_put.value
        }));
    });
}

function showElementForLoginSuccessfully(data) {
    let getDataWithPostRequest = JSON.parse(data);
    userAvatar.src = getDataWithPostRequest.photoUrl;
    userName.textContent = getDataWithPostRequest.name;
    auth_form.replaceChild(formLogoutTemplate, form_window);
}

function showLoginFailedMessage(error_code) {
    if (error_code === 400) {
        showIncorrectEmailPassMessage();
        error_msg.textContent = 'E-Mail or password is incorrect';
    } else if (error_code === 403) {
        error_msg.classList.remove('hidden');
        error_msg.textContent = '403: Forbidden';
    } else if (error_code === 500) {
        error_msg.classList.remove('hidden');
        error_msg.textContent = '500: Internal Server Error';
    } else {
        error_msg.classList.remove('hidden');
        error_msg.textContent = 'Unidentified Error';
    }
}

function showIncorrectEmailPassMessage() {
    error_msg.classList.remove('hidden');
    email_put.style.color = '#ed4159';
    email_put.style.borderColor = '#ed4159';
    email_put.addEventListener('click', function () {
        email_put.style.color = '#262626';
        email_put.style.borderColor = '#f1f1f1';
    });
}

auth_form.appendChild(form_window);