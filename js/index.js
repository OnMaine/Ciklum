let x = 1;
let y = 1;
let eventName = '';
let someEvent = {};
let membersInvited;
let storageEvents = [];
let isUniq = false;
let expanded = false;
let isEmpty;
let filterMember = 'all';
let filteredEvents = [];

function getDay() {
  const select = document.getElementById('days');
  x = select.options[select.selectedIndex].value;
  return +x;
}

function getTime() {
  const select = document.getElementById('time');
  y = select.options[select.selectedIndex].value;
  return +y;
}

function getName() {
  const select = document.getElementById('eventName');
  eventName = select.value;
  return eventName;
}

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

// update filtered table
function filteredTable() {
  function isRightMember(elem) {
    const eventMembers = elem.members;
    const checked = eventMembers.some((member) => {
      if (member === filterMember) {
        return true;
      }
      return false;
    });
    if (checked) {
      filteredEvents.push(elem);
    }
  }
  storageEvents.filter(isRightMember);
  for (let i = 1; i < userTable.rows.length; i += 1) {
    for (let j = 1; j < userTable.rows[i].cells.length; j += 1) {
      const tableEvent = userTable.rows[i].cells[j];
      tableEvent.removeAttribute('id');
      userTable.rows[i].cells[j].innerHTML = '';
      filteredEvents.forEach((event) => {
        if (i === event.time && j === event.day) {
          tableEvent.id = 'tableEvent';
          const content = `<div class="events">
          <div class="eventName"> ${event.eventName} </div>
          <button id="closeBtn" type="button" class="close closeBtn" aria-label="Close">
          <span aria-hidden="true" class="close closeBtn">&times;</span>
          </button>
         </div>`;
          userTable.rows[i].cells[j].innerHTML = content;
        }
      });
    }
  }
}

// get select filter value
function getMembersFilter() {
  const select = document.getElementById('membersFilters');
  filterMember = select.options[select.selectedIndex].value;
  filteredEvents = [];
  if (filterMember === 'all') {
    updateTable();
  } else {
    filteredTable();
  }
  return filterMember;
}

// checkbox multiselect
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

// selectAll btn func
function toggle(source) {
  const checkboxes = document.getElementsByClassName('checkbox');
  for (let i = 0, n = checkboxes.length; i < n; i += 1) {
    checkboxes[i].checked = source.checked;
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
if (window.location.pathname === '/Ciklum/create.html') {
  btnCheckAll.addEventListener('click', () => {
    toggle(btnCheckAll);
    getCheckedCheckBoxes();
  });
}

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
if (window.location.pathname === '/Ciklum/create.html') {
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
}

// get click coordinates
let cellIndex;
let rowIndex;

function openModal() {
  const overlay = document.getElementById('popup-wrapp');
  overlay.setAttribute('style', 'visibility: visible; opacity: 1;');
}

// delete event function
function removeEvent() {
  function isDeleted(elem) {
    if (rowIndex === elem.time && cellIndex === elem.day) {
      return false;
    }
    return true;
  }
  const newStorageEvents = storageEvents.filter(isDeleted);
  localStorage.setItem('allEvents', JSON.stringify(newStorageEvents));
  window.location.reload();
}

if (window.location.pathname === '/Ciklum/index.html') {
  userTable.addEventListener('click', (event) => {
    if (event.target.classList.contains('closeBtn')) {
      cellIndex = event.target.closest('td').cellIndex;
      rowIndex = event.target.closest('tr').rowIndex;
      openModal();
    }
  });
  const deleteBtnPopUp = document.getElementById('deleteBtnPopUp');
  deleteBtnPopUp.addEventListener('click', () => {
    removeEvent(rowIndex, cellIndex);
  });
}

function closeModal() {
  const overlay = document.getElementById('popup-wrapp');
  overlay.setAttribute('style', 'visibility: hiden; opacity: 0;');
}
