let x = 1;
let y = 1;
let eventName = '';
let someEvent = {};
let membersInvited;
let storageEvents = [];
let isUniq = false;
let expanded = false;
let isEmpty;
let filterMember ="all";
let filteredEvents = [];

function getDay() {
  let select = document.getElementById("days");
  x = select.options[select.selectedIndex].value;
  return x;
};

function getTime() {
  let select = document.getElementById("time");
  y = select.options[select.selectedIndex].value;
  return y;
};

function getName() {
  let select = document.getElementById("eventName");
  eventName = select.value;
  return eventName;
};

// create new Event . Push to DB, serch from DB ect.
function createEvent() {
  getCheckedCheckBoxes();
  someEvent = {
    day: x,
    time: y,
    members: membersInvited,
    eventName: eventName
  };
  let storageBD = JSON.parse(localStorage.getItem('allEvents'));
  if (storageBD == null) {
  	isEmpty = true;
  	let storageEvents = [];
    storageEvents.push(someEvent);
    localStorage.setItem('allEvents', JSON.stringify(storageEvents));
  } else {
  	isEmpty = false;
    storageEvents = JSON.parse(localStorage.getItem('allEvents'));
    let check = storageEvents.some(function(elem) {
      if (elem.day == someEvent.day && elem.time == someEvent.time) {
        return true;
      } else {
        return false;
      }
    });
    if (check) {
      formAlert.style.display = "none";
      timeAlert.style.display = "block";
      showAlert();
    } else {
      isUniq = true;
      storageEvents.push(someEvent);
      localStorage.setItem('allEvents', JSON.stringify(storageEvents));
    }
  }
};

// upload data with all events to table 
let userTable = document.querySelector('table');

const updateTable = function updateTable() {
  storageEvents = JSON.parse(localStorage.getItem('allEvents'));
  if (storageEvents) {
    for (let i = 1; i < userTable.rows.length; i++) {
      for (let j = 1; j < userTable.rows[i].cells.length; j++)
      storageEvents.forEach(event => {
        if (i == event.time && j == event.day) {
          let tableEvent = userTable.rows[i].cells[j];
          tableEvent.id = "tableEvent";
          let content = `<div class="events">
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
};

window.onload = updateTable;

//get select filter value
function getMembersFilter() {
  let select = document.getElementById("membersFilters");
  filterMember = select.options[select.selectedIndex].value;
  filteredEvents = [];
  if (filterMember == "all") {
    updateTable();
  } else {
    filteredTable();
  }
  return filterMember;
};

//update filtered table
function filteredTable() {
  function isRightMember(elem) {
    let eventMembers = elem.members;
    let checked = eventMembers.some(function(member) {
      if (member == filterMember) {
        return true;
      } else {
        return false;
      }
    });
    if (checked) {
      filteredEvents.push(elem);
    } 
  }
  storageEvents.filter(isRightMember);
  for (let i = 1; i < userTable.rows.length; i++) {
    for (let j = 1; j < userTable.rows[i].cells.length; j++) {
      let tableEvent = userTable.rows[i].cells[j];
      tableEvent.removeAttribute('id');
      userTable.rows[i].cells[j].innerHTML = '';
      filteredEvents.forEach(event => {
        if (i == event.time && j == event.day) {
          tableEvent.id = "tableEvent";
          let content = `<div class="events">
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
};

//checkbox multiselect
function showCheckboxes() {
  let checkboxes = document.getElementById("checkboxes");
  if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
  } else {
    checkboxes.style.display = "none";
    expanded = false;
  }
};

//checkbox Value + write placeholder func
function getCheckedCheckBoxes() {
  let selectedCheckBoxes = document.querySelectorAll('input.checkbox:checked');
  let checkedValues = Array.from(selectedCheckBoxes).map(cb => cb.value);
  membersInvited = checkedValues;
  let members = document.getElementById("members");
  members.innerText = membersInvited;
  return checkedValues;
};

// selectAll btn func
function toggle(source) {
  checkboxes = document.getElementsByClassName('checkbox');
  for (let i = 0, n = checkboxes.length; i < n; i++) {
    checkboxes[i].checked = source.checked;
  }
};

//listener for checkboxes
let check = document.querySelectorAll('.checkbox');
check.forEach(function(items) {
  items.addEventListener('click', function() {
    getCheckedCheckBoxes();
  });
});

// listener for selectAll
let btnCheckAll = document.getElementById("allChecked");
if (window.location.pathname == "/create.html") {
  btnCheckAll.addEventListener("click", function() {
    toggle(btnCheckAll);
    getCheckedCheckBoxes();
  });
  console.log(window.location.pathname);
}

//validate checkboxes
let validated = false;

function inputsValidate() {
  let a = document.querySelector(".checkbox:checked");
  if (a && eventName.trim() !== '') {
    inputsValid = true;
  } else {
    timeAlert.style.display = "none";
    formAlert.style.display = "block";
    showAlert();
    inputsValid = false;
  }
  return inputsValid;
};

let alertMassage = document.getElementById("alertMassage");
let timeAlert = document.getElementById("timeAlert");
let formAlert = document.getElementById("formAlert");

function hideAlert() {
  alertMassage.style.display = "none";
};

function showAlert() {
  alertMassage.style.display = "flex";
  setTimeout(hideAlert, 3000);
};


//add Event to table on click
if (window.location.pathname == "/create.html") {
  let createEventBtn = document.getElementById("createEventBtn");
  createEventBtn.addEventListener("click", function(e) {
    e.preventDefault();
    inputsValidate();
    if (inputsValid) {
      createEvent();
      if (isUniq || isEmpty) {
        location.href="index.html";
      }
    }
  });
}

// get click coordinates 
let cellIndex;
let rowIndex;
if (window.location.pathname == "/index.html") {
  userTable.addEventListener('click', event => { 
    if (event.target.classList.contains('closeBtn')) { 
      cellIndex = event.target.closest('td').cellIndex;
      rowIndex = event.target.closest('tr').rowIndex;
      openModal();
    }
  });
  let deleteBtnPopUp = document.getElementById("deleteBtnPopUp");
  deleteBtnPopUp.addEventListener("click", function() {
    removeEvent(rowIndex, cellIndex);
  });
}
// delete event function
function removeEvent(rowIndex, cellIndex) {
  function isDeleted(elem) {
    if (rowIndex == elem.time && cellIndex == elem.day) {
      return false;
    } else {
      return true;
    }
  }
  let newStorageEvents = storageEvents.filter(isDeleted);
  localStorage.setItem('allEvents', JSON.stringify(newStorageEvents));
  window.location.reload();
};

function openModal() {
  let overlay = document.getElementById('popup-wrapp');
  overlay.setAttribute("style", "visibility: visible; opacity: 1;");
}

function closeModal() {
  let overlay = document.getElementById('popup-wrapp');
  overlay.setAttribute("style", "visibility: hiden; opacity: 0;");
}

