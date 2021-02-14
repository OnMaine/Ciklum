/* eslint-disable global-require */
import '../styles/index.scss';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

/* eslint-env browser */
let storageEvents = [];
let filterMember = 'all';
let filteredEvents = [];

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
const membersFilters = document.getElementById('membersFilters');
function getMembersFilter() {
  filterMember = membersFilters.options[membersFilters.selectedIndex].value;
  filteredEvents = [];
  if (filterMember === 'all') {
    updateTable();
  } else {
    filteredTable();
  }
  return filterMember;
}

membersFilters.addEventListener('change', () => {
  getMembersFilter();
});

// get click coordinates
let cellIndex;
let rowIndex;

function openModal() {
  const overlay = document.getElementById('popup-wrapp');
  overlay.style.display = 'block';
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

const overlay = document.getElementById('popup-wrapp');
function closeModal() {
  overlay.style.display = 'none';
}

const escBtnPopUp = document.getElementById('escBtnPopUp');
escBtnPopUp.addEventListener('click', () => {
  closeModal();
});
