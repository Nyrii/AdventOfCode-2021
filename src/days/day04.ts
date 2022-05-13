import { fetchAocInput } from '../services/aoc.service.js';
import { DataProcessor } from '../interfaces';
import { v4 as uuid } from 'uuid';

/**
 * The definition of a board, containing {@link BoardNumber}s.
 *
 * Considering the board is a grid, the board is represented as a 2D array.
 */
type Board = BoardNumber[][]

/** The number within a {@link Board}. */
interface BoardNumber {
  value: number
  isMarked: boolean
}

/** The representation of the game. */
interface Bingo {
  boards: Board[]
  appearedNumbers: number[]
}

/** The position of a number within a {@link Board}. */
interface BoardNumberPosition {
  row: number
  column: number
}

const bingoProcessor: DataProcessor<Bingo> = (value: string) => {
  const [bingoNumbers, ...boards] = value.split(/\n\n/) ?? [];
  const finalBingoNumbers: number[] = bingoNumbers.split(',').map(num => Number(num)) ?? [];
  const finalBoards: Board[] =
    boards.map(board =>
      board.split('\n')
        .filter(boardLine => !!boardLine)
        .map(boardLine =>
          boardLine.trim().split(/\s+/)
            .map(num => ({ value: Number(num), isMarked: false } as BoardNumber))));
  if (finalBingoNumbers.length === 0 || finalBoards.length === 0) {
    return Promise.reject(new Error('Input for Day 4 failed to be mapped'))
  }
  return Promise.resolve({boards: finalBoards, appearedNumbers: finalBingoNumbers} as Bingo)
}

const computeScore = (board: Board, appearedNumber: number): number => {
  return board.flat().reduce((result, boardNumber) => boardNumber.isMarked ? result : result + boardNumber.value, 0) * appearedNumber
}

const isBoardWinner = (board: Board, appearedNumberPosition: BoardNumberPosition): boolean => {
  // Check the row associated with the number position which appeared
  const isRowCompleted = board[appearedNumberPosition.row].reduce((isCompleted, boardNumber) => isCompleted && boardNumber.isMarked, true)
  // Check the column associated with the number position which appeared
  const isColumnCompleted =
    board.map(boardNumber => boardNumber[appearedNumberPosition.column])
      .reduce((isCompleted, boardNumber) => isCompleted && boardNumber.isMarked, true)
  return isRowCompleted || isColumnCompleted
}

const findNumberInBoard = (board: Board, appearedNumber: number, row: number = 0, column: number = 0): BoardNumberPosition | undefined => {
  if (board[row][column].value === appearedNumber) {
    return { row: row, column: column } as BoardNumberPosition
  }
  if (column === board[row].length - 1 && row === board.length - 1) {
    return undefined
  }
  if (column === board[row].length - 1) {
    column = 0
    row += 1
  } else {
    column += 1
  }
  return findNumberInBoard(board, appearedNumber, row, column)
}

const isWinner = (board: Board, appearedNumber: number): boolean => {
  let boardNumberPosition = findNumberInBoard(board, appearedNumber);
  if (boardNumberPosition && !board[boardNumberPosition.row][boardNumberPosition.column].isMarked) {
    board[boardNumberPosition.row][boardNumberPosition.column].isMarked = true
    return isBoardWinner(board, boardNumberPosition)
  }
  return false
}

const computeBingoWinnerScore = (bingo: Bingo): Promise<number> => {
  for (let appearedNumber of bingo.appearedNumbers) {
    for (let board of bingo.boards) {
      if (isWinner(board, appearedNumber)) {
        return Promise.resolve(computeScore(board, appearedNumber))
      }
    }
  }
  return Promise.reject(new Error('No winner has been found in this game'));
}

const computeBingoLastWinnerScore = (bingo: Bingo): Promise<number> => {
  let bingoBoards = bingo.boards.map(board => ({id: uuid(), board: board}))
  for (let appearedNumber of bingo.appearedNumbers) {
    for (let bingoBoard of bingoBoards) {
      if (isWinner(bingoBoard.board, appearedNumber)) {
        bingoBoards = bingoBoards.filter(board => board.id !== bingoBoard.id)
        if (bingoBoards.length === 0) {
          return Promise.resolve(computeScore(bingoBoard.board, appearedNumber))
        }
      }
    }
  }
  return Promise.reject(new Error('Multiple boards have been predicted losers'));
}

const firstPart = (): void => {
  fetchAocInput(4, bingoProcessor)
    .then(data => computeBingoWinnerScore(data))
    .then(winnerScore => console.log('Winner score: ' + winnerScore))
    .catch(err => console.error('Unable to compute the winner score', err))
}

const secondPart = (): void => {
  fetchAocInput(4, bingoProcessor)
    .then(data => computeBingoLastWinnerScore(data))
    .then(lastWinnerScore => console.log('Last winner score: ' + lastWinnerScore))
    .catch(err => console.error('Unable to compute the last winner score', err))
}

// Result: 58374
firstPart()
// Result: 11377
secondPart()
