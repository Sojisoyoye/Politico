const postData = (event) => {
  event.preventDefault();

  const firstname = document.getElementById('firstname').value;
  const lastname = document.getElementById('lastname').value;
  const othername = document.getElementById('othername').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const phonenumber = document.getElementById('phonenumber').value;
  const firstnameerror = document.getElementById('first_name_error');
  const lastnameerror = document.getElementById('last_name_error');
  const emailerror = document.getElementById('email_error');
  const errorclass = document.querySelector('.app_signup_text_input_error_message');
  const passworderror = document.getElementById('password_error');
  const othernameerror = document.getElementById('other_name_error');
  const phonenumbererror = document.getElementById('phone_number_error');
  // const signupform = document.getElementById('sign_up_form');
  const url = 'http://localhost:3000/api/v1/auth/signup';
  const options = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstname, lastname, othername, email, password, phonenumber,
    }),
  };

  fetch(url, options)
    .then(async res => (res.ok ? res.json() : Promise.reject(await res.json())))
    .then((response) => {
      const { token } = response.data[0];
      localStorage.setItem('token', token);
      window.location.replace('userprofilepage.html');
    })
    .catch((err) => {
      errorclass.innerHTML = '';
      const {
        status, message, error,
      } = err;
      if (status === 406) {
        emailerror.innerHTML = message;
      }
      if (error.param === 'firstname') {
        // firstnameerror.innerHTML = error.msg;
        const ndiv = document.createElement('div');
        ndiv.className = 'error_alert';
        ndiv.innerHTML = error.msg;
        firstnameerror.appendChild(ndiv);
        if (errorclass.children.classList.contains('error_alert')) {
          // errorclass.removeChild(ndiv);
          errorclass.removeChild(errorclass.children[0]);
        }
      }
      if (error.param === 'lastname') {
        const ndiv = document.createElement('div');
        ndiv.className = 'error_alert';
        ndiv.innerHTML = error.msg;
        lastnameerror.appendChild(ndiv);
        if (errorclass.children.classList.contains('error_alert')) {
          errorclass.removeChild(errorclass.children[0]);
        }
      }
      if (error.param === 'othername') {
        const ndiv = document.createElement('div');
        ndiv.className = 'error_alert';
        ndiv.innerHTML = error.msg;
        othernameerror.appendChild(ndiv);
        if (errorclass.children.classList.contains('error_alert')) {
          errorclass.removeChild(errorclass.children[0]);
        }
      }
      if (error.param === 'password') {
        const ndiv = document.createElement('div');
        ndiv.className = 'error_alert';
        ndiv.innerHTML = error.msg;
        passworderror.appendChild(ndiv);
        if (errorclass.children.classList.contains('error_alert')) {
          errorclass.removeChild(errorclass.children[0]);
        }
      }
      if (error.param === 'phonenumber') {
        const ndiv = document.createElement('div');
        ndiv.className = 'error_alert';
        ndiv.innerHTML = error.msg;
        phonenumbererror.appendChild(ndiv);
        if (errorclass.children.classList.contains('error_alert')) {
          errorclass.removeChild(errorclass.children[0]);
        }
      }
    });
};

document.getElementById('sign_up_form').addEventListener('submit', postData);
