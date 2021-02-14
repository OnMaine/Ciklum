/* eslint-disable global-require */
import '../styles/index.scss';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

/* eslint-env browser */
let x = 1;
let y = 1;
let eventName = '';
let someEvent = {};
let membersInvited;
let storageEvents = [];
let isUniq = false;
let expanded = false;
let isEmpty;

const setDay = document.getElementById('days');
function getDay() {
  x = setDay.options[setDay.selectedIndex].value;
  return +x;
}

setDay.addEventListener('change', () => {
  getDay();
});

const setTime = document.getElementById('time');
function getTime() {
  y = setTime.options[setTime.selectedIndex].value;
  return +y;
}

setTime.addEventListener('change', () => {
  getTime();
});

const setName = document.getElementById('eventName');
function getName() {
  eventName = setName.value;
  return eventName;
}

setName.addEventListener('input', () => {
  getName();
});

const alertMassage = document.getElementById('alertMassage');
const timeAlert = document.getElementById('timeAlert');
const formAlert = document.getElementById('formAlert');

function hideAlert() {
  alertMassage.style.display = 'none';
}

function showAlert() {
  alertMassage.style.display = 'flex';
  setTimeout(hideAlert, 3000);
}

// checkbox Value + write placeholder func
function getCheckedCheckBoxes() {
  const selectedCheckBoxes = document.querySelectorAll('input.checkbox:checked');
  const checkedValues = Array.from(selectedCheckBoxes).map((cb) => cb.value);
  membersInvited = checkedValues;
  const members = document.getElementById('members');
  members.innerText = membersInvited;
  return checkedValues;
}

// create new Event . Push to DB, serch from DB ect.
function createEvent() {
  getCheckedCheckBoxes();
  someEvent = {
    day: +x,
    time: +y,
    members: membersInvited,
    eventName,
  };
  const storageBD = JSON.parse(localStorage.getItem('allEvents'));
  if (storageBD == null) {
    isEmpty = true;
    storageEvents = [];
    storageEvents.push(someEvent);
    localStorage.setItem('allEvents', JSON.stringify(storageEvents));
  } else {
    isEmpty = false;
    storageEvents = JSON.parse(localStorage.getItem('allEvents'));
    const check = storageEvents.some((elem) => {
      if (elem.day === someEvent.day && elem.time === someEvent.time) {
        return true;
      }
      return false;
    });
    if (check) {
      formAlert.style.display = 'none';
      timeAlert.style.display = 'block';
      showAlert();
    } else {
      isUniq = true;
      storageEvents.push(someEvent);
      localStorage.setItem('allEvents', JSON.stringify(storageEvents));
    }
  }
}

// upload data with all events to table
const userTable = document.querySelector('table');

const updateTable = function updateTable() {
  storageEvents = JSON.parse(localStorage.getItem('allEvents'));
  if (storageEvents) {
    for (let i = 1; i < userTable.rows.length; i += 1) {
      for (let j = 1; j < userTable.rows[i].cells.length; j += 1) {
        storageEvents.forEach((event) => {
          if (i === event.time && j === event.day) {
            const tableEvent = userTable.rows[i].cells[j];
            tableEvent.id = 'tableEvent';
            const content = `<div class="events">
          <div class="eventName"> ${event.eventName} </div>
          <button id="closeBtn" type="button" class="close closeBtn" aria-label="Close">
          <span aria-hidden="true" class="close closeBtn">&times;</span>
          </button>
         </div>`;
            tableEvent.innerHTML = content;
          }
        });
      }
    }
  }
};

window.onload = updateTable;

// checkbox multiselect
const selectBox = document.getElementById('selectBox');
function showCheckboxes() {
  const checkboxes = document.getElementById('checkboxes');
  if (!expanded) {
    checkboxes.style.display = 'block';
    expanded = true;
  } else {
    checkboxes.style.display = 'none';
    expanded = false;
  }
}

selectBox.addEventListener('click', () => {
  showCheckboxes();
});

// selectAll btn func
function toggle(source) {
  const Allcheckboxes = document.getElementsByClassName('checkbox');
  for (let i = 0, n = Allcheckboxes.length; i < n; i += 1) {
    Allcheckboxes[i].checked = source.checked;
  }
}

// listener for checkboxes
const check = document.querySelectorAll('.checkbox');
check.forEach((items) => {
  items.addEventListener('click', () => {
    getCheckedCheckBoxes();
  });
});

// listener for selectAll
const btnCheckAll = document.getElementById('allChecked');
btnCheckAll.addEventListener('click', () => {
  toggle(btnCheckAll);
  getCheckedCheckBoxes();
});

// validate checkboxes
let inputsValid = false;

function inputsValidate() {
  const a = document.querySelector('.checkbox:checked');
  if (a && eventName.trim() !== '') {
    inputsValid = true;
  } else {
    timeAlert.style.display = 'none';
    formAlert.style.display = 'block';
    showAlert();
    inputsValid = false;
  }
  return inputsValid;
}

// add Event to table on click
const createEventBtn = document.getElementById('createEventBtn');
createEventBtn.addEventListener('click', (e) => {
  e.preventDefault();
  inputsValidate();
  if (inputsValid) {
    createEvent();
    if (isUniq || isEmpty) {
      window.location.href = 'index.html';
    }
  }
});
