const nil = undefined;
const toastSuccess = 'toast_success';
// const toastError = 'toast_error';
const createPartyForm = document.querySelector('#create_party_form');
const token = localStorage.getItem('token');

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

  const form = document.querySelector('form');
  const formData = new FormData(form);

  const url = 'http://localhost:3000/api/v1/parties';
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

document.getElementById('create_party_form').addEventListener('submit', postData);
