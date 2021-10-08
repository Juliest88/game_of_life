import readline from 'readline';
import Board from "./Board";

export default class Game {
    private board: Board = new Board(30, 30);

    public start(): void {
        this.board.turn();
        this.registerKeypressEvent();
    }

    private registerKeypressEvent(): void {
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.on('keypress', (str, key) => {
            if (key.sequence === 'enter' || key.name === 'return') {
                this.board.turn();
            }
            if (key.ctrl && key.name === 'c') {
                console.log('Hope you enjoyed the game! 😊');
                process.exit();
            }
        });
    }
}