import logUpdate from 'log-update';
import { State } from '../enums/State';
import Cell from './Cell';

export default class Board {
    private rows: number;
    private cols: number;
    private matrix: Cell[][] = [];

    constructor(rowNumber: number, colNumber: number) {
        this.rows = rowNumber;
        this.cols = colNumber;

        this.create();
    }

    private create(): void {
        for (let row = 0; row < this.rows; row++) {
            this.matrix[row] = [];
            for (let col = 0; col < this.cols; col++) {
                const cellState = this.getRandomState();
                const cell = new Cell(cellState);

                this.matrix[row][col] = cell;
            }
        }
    }

    private draw(): void {
        const drawing = this.matrix.map(row => {
            return row.map(cell => {
                return cell.sign;
            }).join('')
        }).join('\n');

        logUpdate(drawing);
    }

    public turn(): void {
        this.draw();

        // calculate for the future
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.matrix[row][col];
                const cellIsAlive = cell.isAlive;
                const cellNeigborsAmount = this.getCellNeigborsAmount(row, col);

                if (cellIsAlive && (cellNeigborsAmount === 3 || cellNeigborsAmount === 2)) {
                    continue;
                }

                if (!cellIsAlive && cellNeigborsAmount === 3) {
                    cell.nextState = State.alive;
                    continue;
                }

                // all the rest dead or alive will be dead
                cell.nextState = State.dead;
            }
        }

        // sync the current state to the nextstate.
        this.syncCellsState();
    }

    private syncCellsState(): void {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.matrix[row][col];
                cell.syncState();
            }
        }
    }

    private getCellNeigborsAmount(rowIndex: number, colIndex: number): number {
        let cellNeigborsAmount = 0;

        for (let neigborRowIndex = rowIndex - 1; neigborRowIndex <= rowIndex + 1; neigborRowIndex++) {
            // check if row is out of range
            if (neigborRowIndex < 0 || neigborRowIndex > this.rows - 1) continue;

            for (let neigborColIndex = colIndex - 1; neigborColIndex <= colIndex + 1; neigborColIndex++) {
                const isCurrentCell = neigborRowIndex === rowIndex && neigborColIndex === colIndex;

                // check if this cell is the current cell, and if the col is out of range
                if (isCurrentCell || neigborColIndex < 0 || neigborColIndex > this.cols - 1) continue;

                // if the neigbor cell is alive
                if (this.isCellAlive(neigborRowIndex, neigborColIndex)) cellNeigborsAmount++;
            }
        }

        return cellNeigborsAmount;
    }

    private getRandomState(): State {
        return Math.floor(Math.random() * 2) ? State.alive : State.dead;
    }

    private isCellAlive(rowIndex: number, colIndex: number): boolean {
        return this.matrix[rowIndex][colIndex].isAlive;
    }
}