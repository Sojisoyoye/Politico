const nil = undefined;
const toastError = 'toast_error';
const userTableBody = document.getElementById('user_admin_table_body');

const createNode = (element, className, content) => {
  const el = document.createElement(element);
  el.className = className;
  el.textContent = content;
  return el;
};

const toastMessage = (msg, className, delay = 4000) => {
  const errorParagraph = createNode('p', '', msg);
  const toastParent = createNode('div', 'toast_msg');
  toastParent.appendChild(errorParagraph);
  toastParent.classList.add(className);
  const section = document.querySelector('section');
  section.insertBefore(toastParent, section.children[0]);
  setTimeout(() => {
    section.removeChild(toastParent);
  }, delay);
};

const reqProcess = (url, method = 'GET', body = nil) => {
  const token = localStorage.getItem('token');
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      token,
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  };

  return fetch(url, options)
    .then(async res => (res.ok ? res.json() : Promise.reject(await res.json())))
    .then(resp => resp)
    .catch((err) => {
      const { message, error } = err;
      return { message, error };
    });
};

const removeModal = (event) => {
  if (event.target.classList.contains('modal')) document.body.removeChild(event.target);
};

const showUserModal = (resp) => {
  if (!resp.data) {
    console.log(resp);
    return;
  }
  const { data } = resp;
  const { id } = data;
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div class="modal">
        <div class="form_body">
        <h3>Register a User for an Office</h3>
        <form id="reg_user_form" data-id="${id}">
        <input type="number" id="office_id" placeholder="Enter office id" />
        <input type="number" id="party_id" placeholder="Enter party id" />
        <input type="number" value='${id}' />
        <button type="submit">Register User</button>
        </div>
        </div>`,
  );
};

const regUser = async (event) => {
  event.preventDefault();

  const modal = document.body.querySelector('.modal');
  const officeId = document.querySelector('#office_id').value;
  const partyId = document.querySelector('#party_id').value;

  const userid = event.target.getAttribute('data-id');

  const userRegUrl = `http://localhost:3000/api/v1/office/${userid}/register`;
  const regBody = { office: officeId, party: partyId };

  const regResp = await reqProcess(userRegUrl, 'POST', regBody);
  if (regResp.status === 200) {
    document.body.removeChild(modal);
    setTimeout(() => {
      window.location.replace('users.html');
    }, 2000);
  }
  toastMessage(regResp.message, toastError);
};


const registerModal = async (event) => {
  const userid = event.target.parentElement.getAttribute('data-userid');
  const singleUserUrl = `http://localhost:3000/api/v1/users/${userid}`;

  const resp = await reqProcess(singleUserUrl);

  showUserModal(resp);

  const modal = document.body.querySelector('.modal');
  modal.addEventListener('click', removeModal);
  const regForm = document.querySelector('#reg_user_form');
  regForm.addEventListener('submit', regUser);
};


const getUserTable = async () => {
  const resp = await reqProcess('http://localhost:3000/api/v1/users');

  if (!resp.data.length) {
    userTableBody.insertAdjacentHTML('afterbegin', '<p>No user available at the moment</p>');
  }
  let row;
  resp.data.forEach((user) => {
    row = `<tr>
    <td>${user.id}</td>
    <td>${user.firstname}</td>
    <td>${user.lastname}</td>
    <td>${user.email}</td>
    <td data-userid="${user.id}">
    <button class="blue" type="submit" data-userid="${user.id}">Register</button>
    </td>
    </tr> 
    `;
    userTableBody.insertAdjacentHTML('beforeend', row);

    const regButton = userTableBody.querySelectorAll('button.blue');
    regButton.forEach(btn => btn.addEventListener('click', registerModal));
  });
};

window.onload = getUserTable();
