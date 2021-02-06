function matrixArray(rows,columns){
  let arr = [];
  for(let i=0; i<rows; i++){
    arr[i] = [];
    for(let j=0; j<columns; j++){
      arr[i][j] = "";
    }
  }
  return arr;
};

let x = 0;
let y = 0;
let myMatrix = matrixArray(9,5);
// let event = {};
// let allEvents = [];


function getDay() {
        let select = document.getElementById("days");
        let value = select.options[select.selectedIndex].value;
        return value;
}

function getTime() {
        let select = document.getElementById("time");
        let value = select.options[select.selectedIndex].value;
        return value;
}


function getCoordinate() {
  x = getDay();
  y = getTime();
  return;
}


function addEvents(x, y) {
  eventName  = document.getElementById("newEvent").value;
  // console.log(event);
  for (let i = 0; i < myMatrix.length; i++) {
      for(let j=0; j<myMatrix[i].length; j++){
      if (x == j && y == i && myMatrix[i][j] == '') {
        myMatrix[i][j] = eventName;
        // allEvents.push(event);
        // console.log(allEvents);
      }
    }
  }
  updateTable();
// location.href="index.html";
}

function updateTable() {
  let userTable = document.querySelector('table');
  for(let i = 0; i < userTable.rows.length; i++){
      for(let j = 0; j < userTable.rows[i].cells.length; j++)
          userTable.rows[i].cells[j].innerText = myMatrix[i][j];
  }
}


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
}


//checkbox Value + write placeholder func
function getCheckedCheckBoxes() {
  let selectedCheckBoxes = document.querySelectorAll('input.checkbox:checked');
  let checkedValues = Array.from(selectedCheckBoxes).map(cb => cb.value);
  let membersInvited = checkedValues;
  let members = document.getElementById("members");
  members.innerText = membersInvited;
  return checkedValues;
}

// selectAll btn func
function toggle(source) {
  checkboxes = document.getElementsByClassName('checkbox');
  for(let i=0, n=checkboxes.length;i<n;i++) {
    checkboxes[i].checked = source.checked;
  }
}

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
})


//validate checkboxes
let validated = false;
function validateCheckBox() {
    let a = !!document.querySelector(".checkbox:checked");
    a || alert("Выберите хотя бы один чекбокс!");
    validated = a;
    return a
};

//add Event to table
let createEventBtn = document.getElementById("createEventBtn");
createEventBtn.addEventListener("click", function() {
  validateCheckBox();
  if (validated) {
    addEvents(x, y);
  }
})
