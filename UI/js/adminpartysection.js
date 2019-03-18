const nil = undefined;
const partyTableBody = document.getElementById('party_admin_table_body');

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

  const partyUpdateUrl = `http://localhost:3000/api/v1/parties/${partyid}`;
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
  const deletePartyUrl = `http://localhost:3000/api/v1/parties/${partyid}`;
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
  const singlePartyUrl = `http://localhost:3000/api/v1/parties/${partyid}`;

  const resp = await reqProcess(singlePartyUrl);

  showPartyModal(resp);

  const modal = document.body.querySelector('.modal');
  modal.addEventListener('click', removeModal);
  const updateForm = document.querySelector('#update_party_form');
  updateForm.addEventListener('submit', updateParty);
};


const getPartyTable = async () => {
  const resp = await reqProcess('http://localhost:3000/api/v1/parties');

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

window.onload = getPartyTable();
