/* eslint-disable react/no-array-index-key */
// Disabling index key is fine for now because it's static array

import produce from 'immer';
import { useState } from 'react';
import './App.css';

const NUMBER_OF_ROWS = 10;
const NUMBER_OF_COLUMNS = 10;

const CELL_SIZE = 30;

const generateEmptyGrid = () => Array(NUMBER_OF_ROWS).fill(Array(NUMBER_OF_COLUMNS).fill(0));

const App: React.FC = () => {
  const [grid, setGrid] = useState(generateEmptyGrid());
  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${NUMBER_OF_COLUMNS}, ${CELL_SIZE}px`,
      }}
      >
        {grid.map((rows, rowIndex) => rows.map((columns, columnIndex) => (
          <div
            key={`${rowIndex}${columnIndex}`}
            onClick={() => {
              // Use immer produce to create a draft copy that you can modify, then it creates an immutable next state
              const newGrid = produce(grid, (draftGrid) => {
                draftGrid[rowIndex][columnIndex] = grid[rowIndex][columnIndex] ? 0 : 1;
              });
              setGrid(newGrid);
            }}
            role="presentation"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: grid[rowIndex][columnIndex] ? '#444' : '#fff',
              border: 'solid 1px black',
            }}
          />
        )))}
      </div>
      <button type="button">Next Generation</button>
      <button
        type="button"
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}
      >
        Reset
      </button>
    </>
  );
};

export default App;
