/* eslint-disable react/no-array-index-key */
// Disabling index key is fine for now because it's static array

import produce from 'immer';
import { useCallback, useState } from 'react';

const NUMBER_OF_ROWS = 10;
const NUMBER_OF_COLUMNS = 10;

const CELL_SIZE = 30;

const NEIGHBOURS_POSITION = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [-1, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
];

const generateEmptyGrid = (): Array<Array<number>> => Array(NUMBER_OF_ROWS).fill(Array(NUMBER_OF_COLUMNS).fill(0));

// Pass in 2 grids that are identical but refers to a different object
const updateGridWithRules = (currentGrid: Array<Array<number>>, draftGrid: Array<Array<number>>): Array<Array<number>> => {
// Go through all cells in the grid
  for (let i = 0; i < NUMBER_OF_ROWS; i++) {
    for (let j = 0; j < NUMBER_OF_COLUMNS; j++) {
    // Calculate how many neighbours each cell has
      let cellNeighbours = 0;
      NEIGHBOURS_POSITION.forEach(([iModifier, jModifier]) => {
        let neighbourI = i + iModifier;
        let neighbourJ = j + jModifier;

        // Make the board wraps around
        if (neighbourI < 0) {
          neighbourI = NUMBER_OF_ROWS - 1;
        }
        if (neighbourI === NUMBER_OF_ROWS) {
          neighbourI = 0;
        }
        if (neighbourJ < 0) {
          neighbourJ = NUMBER_OF_COLUMNS - 1;
        }
        if (neighbourJ === NUMBER_OF_COLUMNS) {
          neighbourJ = 0;
        }
        cellNeighbours += currentGrid[neighbourI][neighbourJ];
      });
      // Rule for underpopulation & overpopulation
      if (cellNeighbours < 2 || cellNeighbours > 3) {
        draftGrid[i][j] = 0;
      // If the cell is dead and there are 3 neighbours, the cell comes alive
      } else if (currentGrid[i][j] === 0 && cellNeighbours === 3) {
        draftGrid[i][j] = 1;
      }
    // Other than these 2 rules, the cell will continue to live (no change/use previous value)
    }
  }
  return draftGrid;
};

const App: React.FC = () => {
  const [grid, setGrid] = useState<Array<Array<number>>>(generateEmptyGrid());
  const spawnNextGeneration = useCallback(() => {
    setGrid((currentGrid) => produce(currentGrid, (draftGrid) => {
      updateGridWithRules(currentGrid, draftGrid);
    }));
  }, []);
  return (
    <div style={{
      display: 'flex',
      width: '100vw',
      height: '100vh',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}
    >

      <div>
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
      </div>
      <div style={{ marginTop: '8px' }}>
        <button
          type="button"
          onClick={() => {
            setGrid(generateEmptyGrid());
          }}
          style={{ marginRight: '8px' }}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => {
            spawnNextGeneration();
          }}
        >
          Next Generation
        </button>
      </div>
    </div>
  );
};

export default App;
