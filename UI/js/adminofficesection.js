const nil = undefined;
const toastError = 'toast_error';
const officeTableBody = document.getElementById('office_admin_table_body');

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

  const modal = document.body.querySelector('.modal');
  const officeId = document.querySelector('#office_id').value;

  const officeid = event.target.getAttribute('data-id');

  const resultUrl = `http://localhost:3000/api/v1/office/${officeid}/result`;
  const resultBody = { office: officeId };

  const resultResp = await reqProcess(resultUrl, 'POST', resultBody);
  if (resultResp.status === 200) {
    document.body.removeChild(modal);
    const { data } = resultResp;
    data.forEach((result) => {
      document.body.insertAdjacentHTML(
        'afterbegin',
        `<div class="modal">
           <div class="form_body">
           <p>Office: ${result.office}</p>
           <p>Candidate: ${result.candidate}</p>
           <p>Result: ${result.count}</p>
           </div>
           </div>
        `,
      );
    });
  }
  toastMessage(resultResp.message, toastError);
};

const viewResultModal = async (event) => {
  const officeId = event.target.parentElement.getAttribute('data-officeid');
  const singleOfficeUrl = `http://localhost:3000/api/v1/offices/${officeId}`;

  const resp = await reqProcess(singleOfficeUrl);

  showOfficeModal(resp);

  const modal = document.body.querySelector('.modal');
  modal.addEventListener('click', removeModal);
  const resultForm = document.querySelector('#result_form');
  resultForm.addEventListener('submit', viewResult);
};

const getOfficeTable = async () => {
  const resp = await reqProcess('http://localhost:3000/api/v1/offices');

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
