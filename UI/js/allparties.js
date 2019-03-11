const partyTableBody = document.getElementById('party_table_body');
const token = localStorage.getItem('token');

const url = 'http://localhost:3000/api/v1/parties';
const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    token,
    authorization: `Bearer ${token}`,
  },
};

fetch(url, options)
  .then(res => res.json())
  .then((resp) => {
    // console.log(resp.data);
    if (resp.status === 200) {
      const { data } = resp;
      // console.log(data);
      if (data.length) {
        let row;
        data.forEach((party) => {
          row = `<tr>
                  <td>${party.id}</td>
                  <td>${party.name}</td>
                  <td>${party.hqaddress}</td>
                  <td>${party.logourl}</td>
                  </tr> 
                  `;
          partyTableBody.insertAdjacentHTML('beforeend', row);
        });
      } else {
        partyTableBody.insertAdjacentHTML('afterbegin', '<p>No party available at the moment</p>');
      }
    }
  });

// <td><img src="${party.logoUrl}" alt="${party.name} class="party-logo"></td>

// const allUsersEndpoint =
// `${basepath}/users/?userid=${e.target.parentElement.getAttribute('data-id')}`
// <button data-id=${e.target.parentElement.getAttribute('data-id')}
// id='confirm-delete'>Yes</button>
// <h3>Update User</h3><form id="update-user-form" data-id=${id}></form>

const getAparty = (event) => {
  event.preventDefault();

  // const token = localStorage.getItem('token');
  const partyid = event.target.getAttribute('data-partyid');

  const partyUrl = `http://localhost:3000/api/v1/parties/${partyid}`;
  const partyOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      token,
      authorization: `Bearer ${token}`,
    },
  };

  fetch(partyUrl, partyOptions)
    .then(res => res.json())
    .then((resp) => {
      if (resp === 200) {
        const { data } = resp;
        if (data) {
          let row;
          data.forEach((party) => {
            row = `<tr>
            <td>${party.id}</td>
            <td>${party.name}</td>
            <td>${party.hqaddress}</td>
            <td>${party.logourl}</td>
            </tr> 
            `;
            partyTableBody.insertAdjacentHTML('beforeend', row);
          });
        }
      } else {
        partyTableBody.insertAdjacentHTML('beforebegin', '<p>There is no party with this ID</p>');
      }
    });
};

document.getElementById('sort__id').addEventListener('submit', getAparty);
