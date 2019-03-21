const nil = undefined;
const toastSuccess = 'toast_success';
const token = localStorage.getItem('token');
const officeOption = document.querySelector('#office_option');
const candidateOption = document.querySelector('#candidate_option');

let url = 'http://localhost:3000/api/v1/offices';
let options = {
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
        data.forEach((office) => {
          row = `<option value="${office.id}" type="number" name="office">${office.id}</option>`;

          officeOption.insertAdjacentHTML('beforeend', row);
        });
      }
    }
  })
  .catch(err => console.log(err));


url = 'http://localhost:3000/api/v1/candidates';
options = {
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
        data.forEach((candidate) => {
          row = `<option value="${candidate.id}" type="number" name="candidate">${candidate.id}</option>`;

          candidateOption.insertAdjacentHTML('beforeend', row);
        });
      }
    }
  })
  .catch(err => console.log(err));

const append = (par, el) => par.appendChild(el);

const createNode = (element, className, content) => {
  const el = document.createElement(element);
  el.className = className;
  el.textContent = content;
  return el;
};

const removeInputErr = (elClass) => {
  const el = document.querySelector(elClass);
  if (el.children[0].classList.contains('err_container')) {
    el.removeChild(el.children[0]);
  }
};

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

const toastMessage = (msg, className, delay = 5000) => {
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


const postData = (event) => {
  event.preventDefault();

  const office = officeOption.value;
  const candidate = candidateOption.value;

  url = 'http://localhost:3000/api/v1/votes';
  options = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      token,
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ office, candidate }),
  };

  fetch(url, options)
    .then(res => res.json())
    .then((resp) => {
      if (resp.status === 201) {
        toastMessage(resp.message, toastSuccess, 9000);
        window.location.reload();
      } else {
        errHandler(resp, '#vote_form');
      }
    })
    .catch(err => console.log(err));
};

document.getElementById('vote_form').addEventListener('submit', postData);
