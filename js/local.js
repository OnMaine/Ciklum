let x = 0;
let y = 0;
let eventName = '';
let someEvent = {};
let membersInvited;
let storageEvents = [];
let isUniq = false;

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
    storageEvents.push(someEvent);
    localStorage.setItem('allEvents', JSON.stringify(storageEvents));
  } else {
    storageEvents = JSON.parse(localStorage.getItem('allEvents'));
    let check = storageEvents.some(function(elem) {
      if (elem.day == someEvent.day && elem.time == someEvent.time) {
        return true;
      } else {
        return false;
      }
    });
    if (check) {
      console.log("Занято");
    } else {
      isUniq = true;
      storageEvents.push(someEvent);
      localStorage.setItem('allEvents', JSON.stringify(storageEvents));
    }
  }
}

window.onload = function updateTable() {
  storageEvents = JSON.parse(localStorage.getItem('allEvents'));
  let userTable = document.querySelector('table');
  for (let i = 0; i < userTable.rows.length; i++) {
    for (let j = 0; j < userTable.rows[i].cells.length; j++)
    storageEvents.forEach(event => {
      if (i == event.time && j == event.day) {
        userTable.rows[i].cells[j].innerHTML = event.eventName;
      }
    });
  }
};

//checkbox multiselect
let expanded = false;

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
check.forEach(function(i) {
  i.addEventListener('click', function() {
    getCheckedCheckBoxes();
  });
});

// listener for selectAll
let btnCheckAll = document.getElementById("allChecked");
btnCheckAll.addEventListener("click", function() {
  toggle(this);
  getCheckedCheckBoxes();
});


//validate checkboxes
let validated = false;

function inputsValidate() {
  let a = document.querySelector(".checkbox:checked");
  if (a && eventName.trim() !== '') {
    inputsValid = true;
  } else {
    alert("Заполните все поля и выберите хотя бы один чекбокс!");
    inputsValid = false;
  }
  return inputsValid;
};



//add Event to table
let createEventBtn = document.getElementById("createEventBtn");
createEventBtn.addEventListener("click", function(e) {
  e.preventDefault();
  inputsValidate();
  if (inputsValid) {
    createEvent();
    if (isUniq) {
      location.href="index.html";
    }
  }
});
