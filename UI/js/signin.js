const postData = (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const emailerror = document.getElementById('email_error');
  const passworderror = document.getElementById('password_error');

  const url = 'http://localhost:3000/api/v1/auth/login';
  const options = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  };

  fetch(url, options)
    .then(res => res.json())
    .then((resp) => {
      if (resp.status === 404) {
        emailerror.innerHTML = resp.message;
      }
      if (resp.status === 401) {
        passworderror.innerHTML = resp.message;
      }
      if (resp.status === 422) {
        emailerror.innerHTML = resp.error.msg;
      }
      const { data } = resp;
      const { token, user } = data[0];
      localStorage.setItem('token', token);
      localStorage.setItem('authUser', JSON.stringify(user));
      setTimeout(() => {
        if (user.isadmin === 'true') {
          localStorage.setItem('isAdmin', user.isadmin);
          window.location.replace('adminpage.html');
        } else window.location.replace('userprofilepage.html');
      }, 3000);
    })
    .catch(err => console.log(err));
};

document.getElementById('sign_in_form').addEventListener('submit', postData);

// document.getElementsById('sign_in_btn').addEventListener('submit', () => {
// document.getElementsByClassName('e-err').innerHTML = '';
// });
