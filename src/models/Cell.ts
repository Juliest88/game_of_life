import { State } from "../enums/State";

export default class Cell {
    private _currentState: State = State.dead;
    private _nextState: State = State.dead;
    private _isAlive: boolean = false;
    private _sign: string = '';

    constructor(state: State) {
        this._currentState = this._nextState = state;
    }

    set state(state: State) {
        this._currentState = state;
    }

    set nextState(nextState: State) {
        this._nextState = nextState;
    }

    get nextState() {
        return this._nextState;
    }

    get isAlive() {
        this._isAlive = this._currentState === State.alive;
        return this._isAlive;
    }

    get sign() {
        this._sign = this.isAlive ? 'X' : ' ';
        return this._sign;
    }

    public syncState() {
        this._currentState = this._nextState;
    }
}