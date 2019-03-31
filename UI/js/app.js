const nil = undefined;
const toastSuccess = 'toast_success';
const toastError = 'toast_error';
const signinForm = document.getElementById('sign_in_form');
const signupForm = document.querySelector('#sign_up_form');
const passwordResetForm = document.getElementById('forgot_password_form');
const createPartyForm = document.querySelector('#create_party_form');
const userPartyTableBody = document.getElementById('party_user_table_body');
const partyTableBody = document.getElementById('party_admin_table_body');
const PartysearchOption = document.querySelector('#search_input');
const partySearchForm = document.querySelector('#party_search_form');
const createOfficeForm = document.querySelector('#create_office_form');
const userOfficeTableBody = document.getElementById('office_user_table_body');
const officeTableBody = document.getElementById('office_admin_table_body');
const officeSearchOption = document.querySelector('#search_input');
const officeSearchForm = document.querySelector('#office_search_form');
const officeOption = document.querySelector('#office_option');
const candidateOption = document.querySelector('#candidate_option');
const voteForm = document.getElementById('vote_form');
const userTableBody = document.getElementById('user_admin_table_body');
const signoutButton = document.getElementById('sign_out_button');


const createNode = (element, className, content) => {
  const el = document.createElement(element);
  el.className = className;
  el.textContent = content;
  return el;
};

const toastMessage = (msg, className, delay = 5000) => {
  const errorParagraph = createNode('p', '', msg);
  const toastParent = createNode('div', 'toast_msg');
  toastParent.appendChild(errorParagraph);
  toastParent.classList.add(className);
  const body = document.querySelector('body');
  body.insertBefore(toastParent, body.children[0]);
  setTimeout(() => {
    body.removeChild(toastParent);
  }, delay);
};

const removeInputErr = (elClass) => {
  const el = document.querySelector(elClass);
  if (el.children[0].classList.contains('err_container')) {
    el.removeChild(el.children[0]);
  }
};

const append = (par, el) => par.appendChild(el);


const errHandler = (response, elClass) => {
  const ul = createNode('ul', 'err_container');
  const el = document.querySelector(elClass);
  removeInputErr(elClass);
  if (response.message) {
    const li = createNode('li', nil, response.message);
    append(ul, li);
    el.insertBefore(ul, el.children[0]);
  } else {
    response.error.forEach((msg) => {
      const li = createNode('li', nil, msg);
      append(ul, li);
      el.insertBefore(ul, el.children[0]);
    });
  }
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

const postLoginData = async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const url = 'https://app-politico.herokuapp.com/api/v1/auth/login';
  const loginData = { email, password };
  // showLoader();

  const resp = await reqProcess(url, 'POST', loginData);
  removeInputErr('#sign_in_form');
  if (resp.status === 200) {
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
  } else {
    errHandler(resp, '#sign_in_form');
  }
};

const postSignupData = async (event) => {
  event.preventDefault();

  const form = document.querySelector('form');
  const formData = new FormData(form);
  const url = 'https://app-politico.herokuapp.com/api/v1/auth/signup';
  const options = {
    method: 'POST',
    mode: 'cors',
    body: formData,
  };

  fetch(url, options)
    .then(res => res.json())
    .then((resp) => {
      removeInputErr('#sign_up_form');
      if (resp.status === 201) {
        toastMessage(resp.message, toastSuccess, 2000);
        const { token } = resp.data[0];
        localStorage.setItem('token', token);
        window.location.replace('userprofilepage.html');
      } else {
        errHandler(resp, '#sign_up_form');
      }
    })
    .catch(err => (err));
};

const postPasswordData = async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const url = 'http://localhost:3000/api/v1/auth/reset';
  const resetData = { email };

  const resp = await reqProcess(url, 'POST', resetData);
  removeInputErr('#forgot_password_form');
  if (resp.status === 200) {
    toastMessage(resp.message, toastSuccess, 9000);
    passwordResetForm.reset();
  }
};

// User party section

const getUserPartyTable = async () => {
  const url = 'https://app-politico.herokuapp.com/api/v1/parties';
  const resp = await reqProcess(url);

  if (!resp.data.length) {
    userPartyTableBody.insertAdjacentHTML('afterbegin', '<p>No party available at the moment</p>');
  }
  let row;
  resp.data.forEach((party) => {
    row = `<tr>
      <td>${party.id}</td>
      <td>${party.name}</td>
      <td>${party.hqaddress}</td>
      <td><img src="${party.logourl}" alt="${party.name} class="party-logo"></td>
      </tr>`;

    userPartyTableBody.insertAdjacentHTML('beforeend', row);
  });
};

const getParties = async () => {
  const url = 'https://app-politico.herokuapp.com/api/v1/parties';

  const resp = await reqProcess(url);
  const { data } = resp;
  if (data.length) {
    data.forEach((party) => {
      PartysearchOption.insertAdjacentHTML('beforeend',
        `<option value="${party.id}" data-id="${party.id}" type="number" name="search_input">${party.id}</option>
    `);
    });
  }
};

const searchParty = async (event) => {
  event.preventDefault();

  const partyId = document.querySelector('#search_input').value;

  const searchUrl = `http://localhost:3000/api/v1/parties/${partyId}`;
  const searchBody = { party: partyId };

  const resp = await reqProcess(searchUrl, 'POST', searchBody);
  if (!resp.data) {
    userPartyTableBody.insertAdjacentHTML('afterbegin', '<p>Party not available at the moment</p>');
  }
  userPartyTableBody.insertAdjacentHTML('afterbegin', `<tr>
    <td>${resp.data.id}</td>
    <td>${resp.data.name}</td>
    <td>${resp.data.hqaddress}</td>
    <td><img src="${resp.data.logourl}" alt="${resp.data.name} class="party-logo"></td>
    </tr>`);
};

// User Office Section

const showOfficeModal = (resp) => {
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
        <h3>View Office Result</h3>
        <form id="result_form" data-id="${id}">
        <input type="number" id="office_id" value='${id}' />
        <button type="submit">Result</button>
        </div>
        </div>`,
  );
};

const viewResult = async (event) => {
  event.preventDefault();

  // const modal = document.body.querySelector('.modal');
  const officeId = document.querySelector('#office_id').value;

  const officeid = event.target.getAttribute('data-id');

  const resultUrl = `https://app-politico.herokuapp.com/api/v1/office/${officeid}/result`;
  const resultBody = { office: officeId };

  const resultResp = await reqProcess(resultUrl, 'POST', resultBody);
  if (resultResp.status === 200) {
    // document.body.removeChild(modal);
    const { data } = resultResp;
    data.forEach((result) => {
      document.body.insertAdjacentHTML(
        'afterbegin',
        `<div class="modal">
           <div class="form_body">
           <h3>Office Result</h3>
           <p>Office: ${result.office}, Candidate: ${result.candidate}, Result: ${result.count}</p>
           </div>
           </div>
        `,
      );
    });
    const modal = document.body.querySelector('.modal');
    modal.addEventListener('click', removeModal);
  }
  // toastMessage(resultResp.message, toastError);
};

const viewResultModal = async (event) => {
  const officeId = event.target.parentElement.getAttribute('data-officeid');
  const singleOfficeUrl = `https://app-politico.herokuapp.com/api/v1/offices/${officeId}`;

  const resp = await reqProcess(singleOfficeUrl);

  showOfficeModal(resp);

  const modal = document.body.querySelector('.modal');
  modal.addEventListener('click', removeModal);
  const resultForm = document.querySelector('#result_form');
  resultForm.addEventListener('submit', viewResult);
};

const getUserOfficeTable = async () => {
  const resp = await reqProcess('https://app-politico.herokuapp.com/api/v1/offices');

  if (!resp.data.length) {
    userOfficeTableBody.insertAdjacentHTML('afterbegin', '<p>No office available at the moment</p>');
  }
  let row;
  const { data } = resp;
  data.forEach((office) => {
    row = `<tr>
      <td>${office.id}</td>
      <td>${office.name}</td>
      <td>${office.type}</td>
      <td data-officeid="${office.id}">
      <button class="blue" type="submit" data-officeid="${office.id}">View Result</button>
      </tr> 
      `;
    userOfficeTableBody.insertAdjacentHTML('beforeend', row);

    const resultButton = userOfficeTableBody.querySelectorAll('button.blue');
    resultButton.forEach(btn => btn.addEventListener('click', viewResultModal));
  });
};

const getOffices = async () => {
  const url = 'https://app-politico.herokuapp.com/api/v1/offices';

  const resp = await reqProcess(url);
  const { data } = resp;
  if (data.length) {
    data.forEach((office) => {
      officeSearchOption.insertAdjacentHTML('beforeend',
        `<option value="${office.id}" data-id="${office.id}" type="number" name="search_input">${office.id}</option>
    `);
    });
  }
};

const searchOffice = async (event) => {
  event.preventDefault();

  const officeId = document.querySelector('#search_input').value;

  const searchUrl = `http://localhost:3000/api/v1/offices/${officeId}`;
  const searchBody = { party: officeId };

  const resp = await reqProcess(searchUrl, 'POST', searchBody);
  if (!resp.data) {
    userOfficeTableBody.insertAdjacentHTML('afterbegin', '<p>Office not available at the moment</p>');
  }
  userOfficeTableBody.insertAdjacentHTML('afterbegin', `<tr>
    <td>${resp.data.id}</td>
    <td>${resp.data.name}</td>
    <td>${resp.data.type}</td>
    <td data-officeid="${resp.data.id}">
      <button class="blue" type="submit" data-officeid="${resp.data.id}">View Result</button>
    </tr>`);

  const resultButton = userOfficeTableBody.querySelectorAll('button.blue');
  resultButton.forEach(btn => btn.addEventListener('click', viewResultModal));
};

const getVoteOffice = async () => {
  const url = 'https://app-politico.herokuapp.com/api/v1/offices';

  const resp = await reqProcess(url);
  const { data } = resp;
  if (data.length) {
    let row;
    data.forEach((office) => {
      row = `<option value="${office.id}" type="number" name="office">${office.id}</option>`;

      officeOption.insertAdjacentHTML('beforeend', row);
    });
  }
};

const getVoteCandidate = async () => {
  const url = 'https://app-politico.herokuapp.com/api/v1/candidates';

  const resp = await reqProcess(url);
  const { data } = resp;
  if (data.length) {
    let row;
    data.forEach((candidate) => {
      row = `<option value="${candidate.id}" type="number" name="candidate">${candidate.id}</option>`;

      candidateOption.insertAdjacentHTML('beforeend', row);
    });
  }
};

const postVoteData = async (event) => {
  event.preventDefault();

  const office = officeOption.value;
  const candidate = candidateOption.value;
  const url = 'https://app-politico.herokuapp.com/api/v1/votes';
  const voteData = { office, candidate };

  const resp = await reqProcess(url, 'POST', voteData);
  if (resp.status === 201) {
    toastMessage(resp.message, toastSuccess);
    window.location.reload();
  } else {
    errHandler(resp, '#vote_form');
  }
};

// Admin Party Section
const showPartyModal = (resp) => {
  if (!resp.data) {
    console.log(resp);
    return;
  }
  const { data } = resp;
  const { id, name } = data;
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div class="modal">
        <div class ="form_body">
        <h3>Update Party</h3>
        <form id="update_party_form" data-id="${id}">
        <input type="text" id="update_name" placeholder="party name" value='${name}' />
        <button type="submit">Update Party</button>
        </div>
        </div>`,
  );
};

const updateParty = async (event) => {
  event.preventDefault();

  const modal = document.body.querySelector('.modal');
  const partyUpdateName = document.querySelector('#update_name').value;

  const partyid = event.target.getAttribute('data-id');

  const partyUpdateUrl = `https://app-politico.herokuapp.com/api/v1/parties/${partyid}`;
  const updateBody = { name: partyUpdateName };

  const updateResp = await reqProcess(partyUpdateUrl, 'PATCH', updateBody);
  if (updateResp.status === 200) {
    document.body.removeChild(modal);
    setTimeout(() => {
      window.location.replace('politicalparty.html');
    }, 2000);
  }
};

const deleteParty = async (event) => {
  const modal = document.body.querySelector('.modal');
  const partyid = Number(event.target.getAttribute('data-id'));
  const deletePartyUrl = `https://app-politico.herokuapp.com/api/v1/parties/${partyid}`;
  const deleteResp = await reqProcess(deletePartyUrl, 'DELETE');

  if (!deleteResp.status === 200) {
    document.body.removeChild(modal);
  }
  document.body.removeChild(modal);
  setTimeout(() => {
    window.location.replace('politicalparty.html');
  }, 2000);
};

const partyDeleteModal = async (event) => {
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div class="modal">
        <div class="form_body">
        <h3>Do you want to delete this party?</h3>
        <button data-id=${event.target.parentElement.getAttribute('data-partyid')} id='confirm_delete'>Yes</button>
        <button id='cancel'>No</button>
        </div>
        </div>`,
  );

  const modal = document.body.querySelector('.modal');
  modal.addEventListener('click', removeModal);

  const deletePartyButton = document.querySelector('#confirm_delete');
  const cancelButton = document.querySelector('#cancel');

  deletePartyButton.addEventListener('click', deleteParty);
  cancelButton.addEventListener('click', () => document.body.removeChild(modal));
};

const partyEditModal = async (event) => {
  const partyid = event.target.parentElement.getAttribute('data-partyid');
  const singlePartyUrl = `https://app-politico.herokuapp.com/api/v1/parties/${partyid}`;

  const resp = await reqProcess(singlePartyUrl);

  showPartyModal(resp);

  const modal = document.body.querySelector('.modal');
  modal.addEventListener('click', removeModal);
  const updateForm = document.querySelector('#update_party_form');
  updateForm.addEventListener('submit', updateParty);
};

const getPartyTable = async () => {
  const resp = await reqProcess('https://app-politico.herokuapp.com/api/v1/parties');

  if (!resp.data.length) {
    partyTableBody.insertAdjacentHTML('afterbegin', '<p>No party available at the moment</p>');
  }
  let row;
  resp.data.forEach((party) => {
    row = `<tr>
    <td>${party.id}</td>
    <td>${party.name}</td>
    <td>${party.hqaddress}</td>
    <td><img src="${party.logourl}" alt="${party.name} class="party-logo"></td>
    <td data-partyid="${party.id}" data-partyname="${party.name}">
    <button class="blue" type="submit" data-partyid="${party.id}"
    data-partyname="${party.name}"
    data-partyhqaddress="${party.hqaddress}">Edit</button>
    <button class="red" data-partyid="${party.id}">Delete</button>
    </td>
    </tr> 
    `;
    partyTableBody.insertAdjacentHTML('beforeend', row);

    const editButton = partyTableBody.querySelectorAll('button.blue');
    editButton.forEach(btn => btn.addEventListener('click', partyEditModal));
    const deleteButton = partyTableBody.querySelectorAll('button.red');
    deleteButton.forEach(btn => btn.addEventListener('click', partyDeleteModal));
  });
};

const postPartyData = async (event) => {
  event.preventDefault();

  const form = document.querySelector('form');
  const formData = new FormData(form);
  const token = localStorage.getItem('token');

  const url = 'https://app-politico.herokuapp.com/api/v1/parties';
  const options = {
    method: 'POST',
    mode: 'cors',
    headers: {
      token,
      authorization: `Bearer ${token}`,
    },
    body: formData,
  };

  fetch(url, options)
    .then(res => res.json())
    .then((resp) => {
      if (resp.status === 201) {
        toastMessage(resp.message, toastSuccess, 9000);
        createPartyForm.reset();
        removeInputErr('#create_party_form');
      } else {
        errHandler(resp, '#create_party_form');
      }
    })
    .catch(err => console.log(err));
};

// Admin Office Section
const getOfficeTable = async () => {
  const resp = await reqProcess('https://app-politico.herokuapp.com/api/v1/offices');

  if (!resp.data.length) {
    officeTableBody.insertAdjacentHTML('afterbegin', '<p>No office available at the moment</p>');
  }
  let row;
  const { data } = resp;
  data.forEach((office) => {
    row = `<tr>
      <td>${office.id}</td>
      <td>${office.name}</td>
      <td>${office.type}</td>
      <td data-officeid="${office.id}">
      <button class="blue" type="submit" data-officeid="${office.id}">View Result</button>
      </td>
      </tr> 
      `;
    officeTableBody.insertAdjacentHTML('beforeend', row);

    const resultButton = officeTableBody.querySelectorAll('button.blue');
    resultButton.forEach(btn => btn.addEventListener('click', viewResultModal));
  });
};

const postOfficeData = async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const type = document.getElementById('type').value;
  const url = 'https://app-politico.herokuapp.com/api/v1/offices';
  const officeData = { name, type };

  const resp = await reqProcess(url, 'POST', officeData);
  if (resp.status === 201) {
    toastMessage(resp.message, toastSuccess, 9000);
    createOfficeForm.reset();
    removeInputErr('#create_office_form');
  } else {
    errHandler(resp, '#create_office_form');
  }
};

// Admin User Section
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

  const userRegUrl = `https://app-politico.herokuapp.com/api/v1/office/${userid}/register`;
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
  const singleUserUrl = `https://app-politico.herokuapp.com/api/v1/users/${userid}`;

  const resp = await reqProcess(singleUserUrl);

  showUserModal(resp);

  const modal = document.body.querySelector('.modal');
  modal.addEventListener('click', removeModal);
  const regForm = document.querySelector('#reg_user_form');
  regForm.addEventListener('submit', regUser);
};

const getUserTable = async () => {
  const resp = await reqProcess('https://app-politico.herokuapp.com/api/v1/users');

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

if (signinForm) signinForm.addEventListener('submit', postLoginData);

if (signupForm) signupForm.addEventListener('submit', postSignupData);

if (passwordResetForm) passwordResetForm.addEventListener('submit', postPasswordData);

if (partySearchForm) partySearchForm.addEventListener('submit', searchParty);

if (officeSearchForm) officeSearchForm.addEventListener('submit', searchOffice);

if (voteForm) voteForm.addEventListener('submit', postVoteData);

if (createPartyForm) createPartyForm.addEventListener('submit', postPartyData);

if (createOfficeForm) createOfficeForm.addEventListener('submit', postOfficeData);

if (signoutButton) {
  signoutButton.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.clear();
    window.location.replace('index.html');
  });
}

if (window.location.pathname === 'Politico/UI/allpoliticalparty.html') {
  getUserPartyTable();
  getParties();
}
if (window.location.pathname === 'Politico/UI/allgovtoffices.html') {
  getUserOfficeTable();
  getOffices();
}
if (window.location.pathname === 'Politico/UI/vote.html') {
  getVoteOffice();
  getVoteCandidate();
}
if (window.location.pathname === 'Politico/UI/politicalparty.html') {
  getPartyTable();
}
if (window.location.pathname === 'Politico/UI/govtoffice.html') {
  getOfficeTable();
}
if (window.location.pathname === 'Politico/UI/users.html') {
  getUserTable();
}
