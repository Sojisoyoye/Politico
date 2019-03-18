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
    if (resp.status === 200) {
      const { data } = resp;
      if (data.length) {
        let row;
        data.forEach((party) => {
          row = `<tr>
                  <td>${party.id}</td>
                  <td>${party.name}</td>
                  <td>${party.hqaddress}</td>
                  <td><img src="${party.logourl}" alt="${party.name} class="party-logo"></td>
                  </tr> 
                  `;
          partyTableBody.insertAdjacentHTML('beforeend', row);
        });
      } else {
        partyTableBody.insertAdjacentHTML('afterbegin', '<p>No party available at the moment</p>');
      }
    }
  });

const getAparty = (event) => {
  event.preventDefault();

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
