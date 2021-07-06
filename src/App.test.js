import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'jest';
import App, { NUMBER_OF_ROWS, NUMBER_OF_COLUMNS } from './App';

describe('<App />', () => {
  describe('initial rendering', () => {
    let AppComponent;

    beforeEach(() => {
      AppComponent = render(<App />);
    });
    it('should render correctly', () => {
      const { container } = AppComponent;
      expect(container).toMatchSnapshot();
    });
    it('should have all cells initialized to dead', () => {
      const cells = screen.getAllByRole('presentation');
      cells.forEach((cell) => {
        expect(cell).toHaveStyle('background-color: #fff');
      });
    });
  });

  describe('when clicking specific cell', () => {
    beforeEach(() => {
      render(<App />);
    });
    it('should change the cell state from dead to alive', () => {
      const firstCell = screen.getByTestId('00');
      userEvent.click(firstCell);
      expect(firstCell).toHaveStyle('background-color: #444');
    });
    it('should change the cell state from alive to dead', () => {
      const firstCell = screen.getByTestId('00');
      userEvent.click(firstCell);
      expect(firstCell).toHaveStyle('background-color: #444');
      userEvent.click(firstCell);
      expect(firstCell).toHaveStyle('background-color: #fff');
    });
  });

  describe('when clicking reset button', () => {
    beforeEach(() => {
      render(<App />);
    });
    it('should change the state of all cells to be dead', () => {
      userEvent.click(screen.getByTestId('00'));
      userEvent.click(screen.getByTestId(`${NUMBER_OF_ROWS - 1}${NUMBER_OF_COLUMNS - 1}`));
      userEvent.click(screen.getByTestId(`${NUMBER_OF_ROWS - 1}${NUMBER_OF_COLUMNS - 2}`));
      userEvent.click(screen.getByText('Reset'));
      const cells = screen.getAllByRole('presentation');
      cells.forEach((cell) => {
        expect(cell).toHaveStyle('background-color: #fff');
      });
    });
  });

  describe('when clicking next generation button', () => {
    let testCell;
    let AppComponent;
    beforeEach(() => {
      AppComponent = render(<App />);
      testCell = screen.getByTestId('00');
    });
    it('should kill a cell with fewer than two live neighbours (under-population rule)', () => {
      userEvent.click(testCell);
      userEvent.click(screen.getByText('Next Generation'));
      expect(testCell).toHaveStyle('background-color: #fff');
      const { container } = AppComponent;
      expect(container).toMatchSnapshot();
    });
    it('should preserve cell with 2 or 3 live neighbours', () => {
      userEvent.click(testCell);
      userEvent.click(screen.getByTestId('01'));
      userEvent.click(screen.getByTestId('11'));
      userEvent.click(screen.getByText('Next Generation'));
      expect(testCell).toHaveStyle('background-color: #444');
      const { container } = AppComponent;
      expect(container).toMatchSnapshot();
    });
    it('should kill a cell with more than 3 live neighbours (overcrowding rule)', () => {
      userEvent.click(testCell);
      userEvent.click(screen.getByTestId('01'));
      userEvent.click(screen.getByTestId('11'));
      userEvent.click(screen.getByTestId('10'));
      userEvent.click(screen.getByTestId(`${NUMBER_OF_ROWS - 1}0`));
      userEvent.click(screen.getByText('Next Generation'));
      expect(testCell).toHaveStyle('background-color: #fff');
      const { container } = AppComponent;
      expect(container).toMatchSnapshot();
    });
    it('should bring back to live an empty cell with exactly 3 live neighbours', () => {
      userEvent.click(screen.getByTestId('01'));
      userEvent.click(screen.getByTestId('10'));
      userEvent.click(screen.getByTestId('11'));
      userEvent.click(screen.getByText('Next Generation'));
      expect(testCell).toHaveStyle('background-color: #444');
      const { container } = AppComponent;
      expect(container).toMatchSnapshot();
    });
    it('should bring back to live a cell that comes to live outside the board (board wrapping rule)', () => {
      userEvent.click(screen.getByTestId(`0${NUMBER_OF_COLUMNS - 1}`));
      userEvent.click(screen.getByTestId(`1${NUMBER_OF_COLUMNS - 1}`));
      userEvent.click(screen.getByTestId(`${NUMBER_OF_ROWS - 1}0`));
      userEvent.click(screen.getByText('Next Generation'));
      expect(testCell).toHaveStyle('background-color: #444');
      const { container } = AppComponent;
      expect(container).toMatchSnapshot();
    });
  });
});
