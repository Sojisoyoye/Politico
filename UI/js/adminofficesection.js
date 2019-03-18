const nil = undefined;
const officeTableBody = document.getElementById('office_admin_table_body');

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

const getOfficeTable = async () => {
  const resp = await reqProcess('http://localhost:3000/api/v1/offices');

  if (!resp.data.length) {
    officeTableBody.insertAdjacentHTML('afterbegin', '<p>No office available at the moment</p>');
  }
  let row;
  const { data } = resp;
  const { id } = data;
  data.forEach((office) => {
    row = `<tr data-id=${id}>
      <td>${office.id}</td>
      <td>${office.name}</td>
      <td>${office.type}</td>
      </tr> 
      `;
    officeTableBody.insertAdjacentHTML('beforeend', row);
  });
};

window.onload = getOfficeTable();

const getAOffice = async (event) => {
  event.preventDefault();

  const partyid = event.target.getAttribute('data-id');

  const resp = await reqProcess(`http://localhost:3000/api/v1/offices/${partyid}`);

  if (resp === 200) {
    const { data } = resp;
    if (data) {
      let row;
      data.forEach((office) => {
        row = `<tr>
              <td>${office.id}</td>
              <td>${office.name}</td>
              <td>${office.type}</td>
              </tr> 
              `;
        officeTableBody.insertAdjacentHTML('beforeend', row);
      });
    }
  } else {
    officeTableBody.insertAdjacentHTML('beforebegin', '<p>There is no party with this ID</p>');
  }
};

document.getElementById('sort__id').addEventListener('submit', getAOffice);
