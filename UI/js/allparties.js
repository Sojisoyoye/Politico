const partyTableBody = document.getElementById('party_table_body');
const token = localStorage.getItem('token');

const url = 'http://localhost:3000/api/v1/parties';
const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    token,
    authorization: 'Bearer ' + token,
  },
};

fetch(url, options)
  .then(res => res.json())
  .then((resp) => {
    // console.log(resp.data);
    if (resp.status === 200) {
      const { data } = resp;
      console.log(data);
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

const getAparty = (event) => {
  event.preventDefault();

  const token = localStorage.getItem('token');

  const url = `http://localhost:3000/api/v1/parties/${id}`;
}
