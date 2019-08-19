'use strict';

let form_auth = document.getElementById("form-auth");

// Можно было проще реализовать: через свойство элемента формы авторизации - innerHTML.
// Но это свойство в отношении безопасности не рекомендуется применять.

let templateLogin = document.getElementById('login').content;
let form_window = templateLogin.querySelector('.form-window');
let error_msg = templateLogin.querySelector('.error_msg');
let email_put = templateLogin.getElementById('email');
let password_put = templateLogin.getElementById('password');
let submit_btn = templateLogin.getElementById('submit_btn');

let templateLogout = document.getElementById('logout').content;
let formLogoutTemplate = templateLogout.querySelector('.form-window');
let avatar = templateLogout.querySelector('.avatar');
let userName = templateLogout.querySelector('.userName');
let logout_btn = templateLogout.getElementById('logout_btn');

logout_btn.addEventListener('click', function () {
    email_put.value = '';
    password_put.value = '';
    error_msg.textContent = '';
    error_msg.classList.add('hidden');
    form_auth.replaceChild(form_window, formLogoutTemplate);
});

function validData() {
    let regEmail = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    let validEmail = regEmail.test(email_put.value);
    let valid = true;
    if (!validEmail) {
        error_msg.classList.remove('hidden');
        error_msg.textContent = 'Invalid input E-Mail';
        incorrectEmailPass();
        valid = false
    } else if (password_put.value.length === 0) {
        error_msg.classList.remove('hidden');
        error_msg.textContent = 'Password is empty';
        valid = false;
    }
    return valid;
};

submit_btn.addEventListener('click', function (evt) {
    evt.preventDefault();
    let xhr = new XMLHttpRequest();
    submit_btn.setAttribute("disabled", "disabled");
    initXMLHttpRequest(xhr);

    if (validData()) {
        request(xhr).then(successLogin).catch(failLogin);
    }
    submit_btn.removeAttribute("disabled");
});

function initXMLHttpRequest(xhr) {
    xhr.timeout = 3000;
    xhr.open("POST", 'https://us-central1-mercdev-academy.cloudfunctions.net/login', true);
    xhr.setRequestHeader("Content-type", "application/json");
}

function request(xhr) {
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

function successLogin(data) {
    let request = JSON.parse(data);
    avatar.src = request.photoUrl;
    userName.textContent = request.name;
    form_auth.replaceChild(formLogoutTemplate, form_window);
}

function failLogin(error_code) {
    if (error_code === 400) {
        incorrectEmailPass();
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

function incorrectEmailPass() {
    error_msg.classList.remove('hidden');
    email_put.style.color = '#ed4159';
    email_put.style.borderColor = '#ed4159';
    email_put.addEventListener('click', function () {
        email_put.style.color = '#262626';
        email_put.style.borderColor = '#f1f1f1';
    });  
}

form_auth.appendChild(form_window);