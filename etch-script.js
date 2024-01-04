const container = document.querySelector(".container")
let squareArray = []
container.style.border = "1px solid black"
const colourGrid = document.querySelector("#colourGrid")
const colourArray = ['brown','red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'grey', 'black']
let selectedColour = "grey"
const colourDisplay = document.querySelector("#colourDisplay")
let gridInput = document.querySelector("#gridInput")
const changeGridBtn = document.querySelector("#changeGrid")
let gridSize = 16
const eraserBtn = document.querySelector("#eraser")
const clearBtn = document.querySelector("#clear")
const clickModeBtn = document.querySelector("#clickMode")
const randomModeBtn = document.querySelector("#randomColours")
const normalModeBtn = document.querySelector("#normal")
let eraserTracker = false
let randomTracker = false
let clickTracker = false
let normTracker = false
let tempColour = "grey"
let normControl = new AbortController()
let clickControl = new AbortController()
let randomControl = new AbortController()
let eraserControl = new AbortController()

// function createGrid() {
//   for (i = 0; i < 256; i++) {
//     const square = document.createElement('div')
//     square.style.height = '31.25px'
//     square.style.width = '31.25px'
//     square.style.boxSizing = 'border-box'
//     square.style.border = "1px solid black"
//     container.appendChild(square)
//   }
// }

//Create size x size square grid

function createGridTwo(size){
  squareArray = []
  let squareDimension = 500/size
  for(let i = 0; i < size; i++){
    const row = document.createElement('div')
    for(let j = 0; j < size; j++){
      const square = document.createElement('div')
      square.style.height = `${squareDimension}px`
      square.style.width = `${squareDimension}px`
      square.style.boxSizing = 'border-box'
      // const colorChange = () => {
      //   square.style.backgroundColor = selectedColour
      // }
      squareArray.push(square)
      row.appendChild(square)
      container.appendChild(row)
    }
  }
  modeManager('normal')
}



function modeManager(mode){
  normTracker = !normTracker
  if(mode == 'normal' && normTracker == true){
    clickControl.abort()
    randomControl.abort()
    eraserControl.abort()
    randomTracker = false
    clickTracker = false
    eraserTracker = false
    btnState(randomModeBtn, 'off')
    btnState(clickModeBtn, 'off')
    btnState(eraserBtn, 'off')
    normControl = new AbortController()
    normalMode()
    btnState(normalModeBtn, 'on')
  }
  else if(mode == 'normal' && normTracker == false){
    console.log("Normal was false")
    normControl.abort()
    btnState(normalModeBtn, 'off')
    normControl = new AbortController()
  }

  if(mode == 'eraser'){
    eraserTracker = !eraserTracker
    if(eraserTracker == true){
      eraserControl = new AbortController()
      normControl.abort()
      randomControl.abort()
      clickControl.abort()
      randomTracker = false
      normTracker = false
      clickTracker = false
      eraser()
      btnState(eraserBtn, 'on')
      btnState(randomModeBtn, 'off')
      btnState(normalModeBtn, 'off')
      btnState(clickModeBtn, 'off')
      
    }
    else if(eraserTracker == false){
      eraserControl.abort()
      btnState(eraserBtn, 'off')
      eraserControl = new AbortController()
      eraser()
    }
  }

  if(mode == 'random'){
    randomTracker = !randomTracker
    if(randomTracker == true){
      normControl.abort()
      eraserControl.abort()
      randomControl = new AbortController()
      normTracker = false
      eraserTracker = false
      randomMode()
      btnState(randomModeBtn, 'on')
      btnState(normalModeBtn, 'off')
      btnState(eraserBtn, 'off')
      
      
    }
    else if(randomTracker == false){
      randomControl.abort()
      btnState(randomModeBtn, 'off')
      randomControl = new AbortController()
      randomMode()
    }
  }

  if(mode == 'click'){
    clickTracker = !clickTracker
    if(clickTracker == true){
        //click function has functionality to include random and erase event listeners if
        //either is selected alongside click so can abort everything else
      normControl.abort()
      randomControl.abort()
      eraserControl.abort()
      normTracker = false
      eraserTracker = false
      clickControl = new AbortController()
      btnState(eraserBtn, 'off') 
      btnState(normalModeBtn, 'off')
      clickMode()
      btnState(clickModeBtn, 'on')
      
    }
    else if(clickTracker == false){
      clickControl.abort()
      clickControl = new AbortController()
      btnState(clickModeBtn, 'off')
      clickMode()
    }
  }
}

function btnState(button, state){
  if(state == 'on'){
    button.style.border = "2.5px solid green"
  }

  else if(state == 'off'){
    button.style.border = "initial"
  }
  else{
    console.log("Enter 'on' or 'off' for state")
  }
}

function normalMode(){
  if(normTracker == true){
  for(let i = 0; i < squareArray.length; i++){
    let square = squareArray[i]
    const colorChange = () => {square.style.backgroundColor = 
    selectedColour}
    square.addEventListener('mouseenter', colorChange,{signal: normControl.signal})
    }
  }
}


function randomColour(){
selectedColour = colourArray[Math.floor(Math.random()*colourArray.length)]

   return selectedColour
}

function randomMode(){
  if(randomTracker == true){
    for(let i = 0; i < squareArray.length; i++){
      let square = squareArray[i]

      if(clickTracker == true){
        const colorChange = () => {square.style.backgroundColor = colourArray[Math.floor(Math.random()*colourArray.length)]};

        square.addEventListener('click', colorChange, {signal: randomControl.signal})
      }
      else if(clickTracker == false){
      const colorChange = () => {square.style.backgroundColor = colourArray[Math.floor(Math.random()*colourArray.length)]};
      square.addEventListener('mouseenter', colorChange, {signal: randomControl.signal})
    }
    }
  }
  if(randomTracker == false){
    if(clickTracker == true){
        clickTracker = false
      modeManager('click')
    }
  }
}

function clickMode(){
  if(clickTracker == true){
    for(let i = 0; i < squareArray.length; i++){
      let square = squareArray[i]
      if(randomTracker == true){
        const colorChange = () => {square.style.backgroundColor = colourArray[Math.floor(Math.random()*colourArray.length)]};
      square.addEventListener('click', colorChange, {signal: clickControl.signal})
    }
      else if(randomTracker == false){
        square.addEventListener('click', () => square.style.backgroundColor = selectedColour, {signal: clickControl.signal})
    }
    }
  }
  else if(clickTracker == false){
        if(randomTracker == true){
            randomTracker = false
            //will be made true in modeManager
            modeManager('random')
        }
      }
        else if(randomTracker == false && eraserTracker == true){
            eraserTracker = false
            //will be made true in modeManager
            modeManager('eraser') 
      }
  }

//Create colour picker and display
function createColourGrid(){
  for(i = 0; i < 10; i++){
    const colourSquare = document.createElement('div')
    colourSquare.style.height = "20px"
    colourSquare.style.width = "20px"
    colourSquare.style.boxSizing = 'border-box'
    colourSquare.style.backgroundColor = `${colourArray[i]}`
    colourSquare.addEventListener('click', () => {selectedColour  = colourSquare.style.backgroundColor})
    colourSquare.addEventListener('click', () =>       
      {colourDisplay.style.backgroundColor =     
      colourSquare.style.backgroundColor})
    colourSquare.addEventListener('click', () => {eraserTracker = false})
    colourSquare.addEventListener('click', () => {eraserBtn.style.border = "none"})
    colourGrid.appendChild(colourSquare)
  }
}

//Recursive function that clears grid
function clearGrid(parent){
  while(parent.firstChild){
    clearGrid(parent.firstChild)
    parent.removeChild(parent.firstChild)
  }
}

function clearButtonFunc(){
  clearGrid(container)
  normTracker = false
  randomTracker = false
  eraserTracker = false
  clickTracker = false
  clickControl.abort()
  randomControl.abort()
  eraserControl.abort()
  btnState(randomModeBtn, 'off')
  btnState(clickModeBtn, 'off')
  btnState(eraserBtn, 'off')
  normControl = new AbortController()
  createGridTwo(gridSize)
}

function eraser(){
  if(eraserTracker == true){
    tempColour = selectedColour
    for(let i = 0; i < squareArray.length; i++){
      let square = squareArray[i]
        square.addEventListener('mouseenter', () => {square.style.backgroundColor = 'transparent'}, {signal: eraserControl.signal})
    }
  }
  else if(eraserTracker == false){
    selectedColour = tempColour
    if(clickTracker == true){
        clickTracker = false
        //will be made true in modeManager()
      modeManager('click')
    }
    else if(clickTracker == false){
        normTracker = false
        //will be made true in modeManager()
        modeManager('normal')
    }
  }
}

function changeGrid(){
  if(gridInput.value <= 100){
  clearGrid(container)
  normTracker = false
  createGridTwo(gridInput.value)
    gridSize = gridInput.value
    }
  }

changeGridBtn.addEventListener('click', changeGrid)
clearBtn.addEventListener('click', clearButtonFunc)
eraserBtn.addEventListener('click', () => {modeManager('eraser')})
randomModeBtn.addEventListener('click', () => {modeManager('random')})
clickModeBtn.addEventListener('click', () => {modeManager('click')})
normalModeBtn.addEventListener('click', () => {modeManager('normal')})

createGridTwo(16)
createColourGrid()

//Isues:
//need to click random button twice to work when switching from normal - solved, needed to change randomTracker when calling normal mode
//click mode doesn't work - works intermittently, eventlistener is able to be removed, only clicks grey, all mouseenter event listeners should be aborted