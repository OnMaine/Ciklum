function getDay() {
        let select = document.getElementById("days");
        let value = select.options[select.selectedIndex].value;
        // console.log(value);
        return value;
}

function getTime() {
        let select = document.getElementById("time");
        let value = select.options[select.selectedIndex].value;
        // console.log(value);
        return value;
}



function matrixArray(rows,columns){
  let arr = [];
  for(let i=0; i<rows; i++){
    arr[i] = [];
    for(let j=0; j<columns; j++){
      arr[i][j] = "1";//вместо "" пишем любой наполнитель. В простейшем случае - null       было arr[i][j] = i+j+1;
    }
  }
  return arr;
};
let myMatrix = matrixArray(9,5);

function getCoordinate() {
  let x = getDay();
  let y = getTime();
  let position = {x, y};
  // console.log(position);
  return position;
}
 let position = getCoordinate();
 let event = "event";

function addEvents() {
  for(let j = 0; j < myMatrix.length; j++) {
    for(let n = 0; n < myMatrix.length; n++) {
      if (n === myMatrix.length - 1)
        document.write(myMatrix[j][n]);
      else
        document.write(myMatrix[j][n] + ", ");
    }
    document.write("<br>");
  }
}
addEvents();

console.log(myMatrix);
