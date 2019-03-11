const postData = (event) => {
  event.preventDefault();

  const form = document.querySelector('form');
  const formData = new FormData(form);

  const firstnameerror = document.getElementById('first_name_error');
  const lastnameerror = document.getElementById('last_name_error');
  const othernameerror = document.getElementById('other_name_error');
  const passworderror = document.getElementById('password_error');
  const emailerror = document.getElementById('email_error');
  const phonenumbererror = document.getElementById('phone_number_error');


  const url = 'http://localhost:3000/api/v1/auth/signup';
  const options = {
    method: 'POST',
    mode: 'cors',
    body: formData,
  };

  fetch(url, options)
    .then(res => res.json())
    .then((resp) => {
      if (resp.status === 201) {
        const { token } = resp.data[0];
        localStorage.setItem('token', token);
        window.location.replace('userprofilepage.html');
      } else if (resp.status === 406) {
        emailerror.innerHTML = resp.message;
      } else if (resp.status === 422) {
        if (resp.error.param === 'firstname') {
          firstnameerror.innerHTML = resp.error.msg;
        } else {
          firstnameerror.innerHTML = '';
        }
        if (resp.error.param === 'lastname') {
          lastnameerror.innerHTML = resp.error.msg;
        } else {
          lastnameerror.innerHTML = '';
        }
        if (resp.error.param === 'othername') {
          othernameerror.innerHTML = resp.error.msg;
        } else {
          othernameerror.innerHTML = '';
        }
        if (resp.error.param === 'password') {
          passworderror.innerHTML = resp.error.msg;
        } else {
          passworderror.innerHTML = '';
        }
        if (resp.error.param === 'phonenumber') {
          phonenumbererror.innerHTML = resp.error.msg;
        } else {
          phonenumbererror.innerHTML = '';
        }
      }
    })
    .catch(err => console.log(err));
};

document.getElementById('sign_up_form').addEventListener('submit', postData);

// if (resp.message) {
// emailerror.innerHTML = resp.message;
// } else if (!resp.message) {
// emailerror.remove();
// }

// const errorclass = document.querySelector('.app_signup_text_input_error_message');
// document.getElementById('sign_up_button').addEventListener('submit', () => {
// errorclass.remove();
// });


// .then(async res => (res.ok ? res.json() : Promise.reject(await res.json())))
// .then((response) => {
// console.log(response);
// const { token } = response.data[0];
// localStorage.setItem('token', token);
// window.location.replace('userprofilepage.html');
// })


// const firstnameerror = document.getElementById('first_name_error');
// const lastnameerror = document.getElementById('last_name_error');
// const emailerror = document.getElementById('email_error');
// const errorclass = document.querySelector('.app_signup_text_input_error_message');
// const passworderror = document.getElementById('password_error');
// const othernameerror = document.getElementById('other_name_error');
// const phonenumbererror = document.getElementById('phone_number_error');
// const passport = document.querySelector('[type="file"]').value;

// const signupform = document.getElementById('sign_up_form');

// const firstname = document.getElementById('firstname').value;
// const lastname = document.getElementById('lastname').value;
// const othername = document.getElementById('othername').value;
// const email = document.getElementById('email').value;
// const password = document.getElementById('password').value;
// const phonenumber = document.getElementById('phonenumber').value;
// const passport = document.getElementById('passport').value;


// const {
// status, message, error,
// } = err;
// if (status === 406) {
// emailerror.innerHTML = message;
// }
// if (error.param === 'firstname') {
// firstnameerror.innerHTML = error.msg;
//  const ndiv = document.createElement('div');
// ndiv.className = 'error_alert';
// ndiv.innerHTML = error.msg;
// firstnameerror.appendChild(ndiv);
// if (errorclass.children.classList.contains('error_alert')) {
// errorclass.removeChild(ndiv);
// errorclass.removeChild(errorclass.children[0]);
// }
// }
// if (error.param === 'lastname') {
// const ndiv = document.createElement('div');
// ndiv.className = 'error_alert';
// ndiv.innerHTML = error.msg;
// lastnameerror.appendChild(ndiv);
// if (errorclass.children.classList.contains('error_alert')) {
// errorclass.removeChild(errorclass.children[0]);
// }
// }
// if (error.param === 'othername') {
// const ndiv = document.createElement('div');
// ndiv.className = 'error_alert';
// ndiv.innerHTML = error.msg;
// othernameerror.appendChild(ndiv);
// if (errorclass.children.classList.contains('error_alert')) {
// errorclass.removeChild(errorclass.children[0]);
// }
// }
// if (error.param === 'password') {
//  const ndiv = document.createElement('div');
// ndiv.className = 'error_alert';
// ndiv.innerHTML = error.msg;
// passworderror.appendChild(ndiv);
// if (errorclass.children.classList.contains('error_alert')) {
//  errorclass.removeChild(errorclass.children[0]);
// }
// }
// if (error.param === 'phonenumber') {
// const ndiv = document.createElement('div');
// ndiv.className = 'error_alert';
// ndiv.innerHTML = error.msg;
// phonenumbererror.appendChild(ndiv);
// if (errorclass.children.classList.contains('error_alert')) {
// errorclass.removeChild(errorclass.children[0]);
// }
// }
