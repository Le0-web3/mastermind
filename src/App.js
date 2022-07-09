import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';

function App() {

//   -----   USE STATE  -----

const [pattern, setPattern] = useState([0, 0, 0, 0]);
const [gameTrail, setGameTrail] = useState([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);
const [pickedColor, setPickedColor] = useState(0);
const [currentRow, setCurrentRow] = useState(11);
const [validated, setValidated] = useState([
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
]);
const [clue, setClue] = useState([ // white then red
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
]);
const [gameState, setGameState] = useState("running");
//   -----   CONSTANTS  -----
const pool = [1, 2, 3, 4, 5, 6];

//   -----   FUNCTIONS  -----

const getRandomPattern = () => {
  let varArr = [];
  for(let i = 0; i < 4; i++) {
    varArr.push(Math.floor(Math.random()*6)+1);
  }
  return varArr;
}

const currentLineFull = () => {
  let varBool = true;
    for(let i = 0; i < 4; i++) {
      if(gameTrail[currentRow][i] === 0) {
        varBool = false;
      }
    }
return varBool;
}

const handleClick = (i, s) => {
  const row = i;
  const column = s;
  let newArr = [...gameTrail];
  let belowRowValidated = (row == 11 || validated[row+1]);
  if(newArr[row][column] === 0 && pickedColor !== 0 && belowRowValidated && gameState === "running") {
    newArr[row][column] = pickedColor;
    setGameTrail(newArr);
    setCurrentRow(row);
  }
}

const onReset = () => {
  setGameTrail([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  setPattern(getRandomPattern());
  setPickedColor(0);
  setCurrentRow(11);
  setValidated([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  setClue([ // white then red
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
]);
  setGameState("running");
}

const handlePick = (j) => {
    setPickedColor(j+1);
}

const onValidate = () => {
  if(currentLineFull() && !validated[currentRow]) {
    let newArr = [...validated]; 
    newArr[currentRow] = true;
    setValidated(newArr);
    // clues
    let redClues = 0;
    let whiteClues = 0;
    let myRow = [...gameTrail[currentRow]];
    let myPattern = [...pattern];
    let myClue = [...clue];
    let notRedRow = [];
    let notRedPattern = [];
    // red clues
    for(let i = 0; i < 4; i++) {
      if(myRow[i] === myPattern[i]) {
        redClues +=1;
      } else {
        notRedRow.push(myRow[i]);
        notRedPattern.push(myPattern[i]);
      }
    }
    // white clue
    for(let i = 0; i < notRedRow.length; i++) {
      for(let j = 0; j < notRedPattern.length; j++) {
        if(notRedRow[i] === notRedPattern[j]) {
          whiteClues +=1;
          notRedRow[i] = 0;
          notRedPattern[j] = 0;
        }
      }
    }
  myClue[currentRow][0] = whiteClues;  
  myClue[currentRow][1] = redClues;  
  setClue(myClue);
  if(redClues === 4) {
    setGameState("won");
  }
  if(redClues !== 4 && currentRow === 0) {
    setGameState("failed");
  }
  }
}

//   -----   USE EFFECT  -----
useEffect(() => {
  setPattern(getRandomPattern());
}, []);


//   -----   RETURN  -----
  return (
    <div className="App">
      <h1>Mastermind</h1>
      
      <div id="gameboard">
        
        <div id="target" className="row">
          <>
          {pattern.map((d, j) =>
          <div className="case" style={{backgroundColor: gameState != "running"?"var(--color-peg"+pattern[j]+")":"var(--color-gameboard"}} key={j} j={j}>
          </div>
          )}
          </>
        </div>

        <div id="gametrail">
            <>
          {gameTrail.map((row, i)=>{
              return  (
              <div className="row">
              {gameTrail[i].map((d, j) =>
                <div className="case" style={{backgroundColor: "var(--color-peg"+gameTrail[i][j]+")"}} key={i + j} i={i} j={j} onClick={() => {handleClick(i, j);}}>
                </div>
              )}
              <div id="clue">
                <div id="whiteclues"> {clue[i][0]} </div><div id="redclues"> {clue[i][1]} </div>
              </div>
              </div>
              )})}    
          </>
        </div>

        <div className="button" id="resetbutton" onClick={onReset}>Reset</div>

        <div id="display">
          {gameState == "won"?"You Won !":gameState == "failed"?"You failed !":"Good Luck !"}
        </div>

        <div className="button" id="validatebutton" onClick={onValidate}>Validate</div>

        <div id="showcolor" className="case" style={{backgroundColor: "var(--color-peg"+pickedColor+")",}}></div>
        <div id="pool" className='row'>
          <>
          {pool.map((d, j) =>
          <div className="case" style={{backgroundColor: "var(--color-peg"+pool[j]+")",}} key={j} j={j} onClick={() => {handlePick(j);}}>
          </div>
          )}
          </>
        </div>
      </div>
    </div>
  );
}

export default App;