import { _decorator, Component, Node, director, sys } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  private static _instance: GameManager = null;
  static getInstance() {
    if (this._instance == null) {
      this._instance = new GameManager();
    }
    return this._instance;
  }

  private _gameMode: number = 4;
  private _trackBackCount: number = 3;
  private _score: number = 0;
  private _historyScore: number = 0;

  public get gameMode(): number {
    return this._gameMode;
  }

  public get score(): number {
    return this._score;
  }

  public get trackBackCount(): number {
    return this._trackBackCount;
  }

  public get historyScore(): number {
    return this._historyScore;
  }

  start() {
    GameManager._instance = this;
  }

  update(deltaTime: number) {}

  onUseTrackBack() {
    if (this._trackBackCount <= 0) {
      return false;
    }
    this._trackBackCount--;
    return this._trackBackCount >= 0;
  }

  onScoreChange(score: number) {
    this._score = score;
  }

  onClickButton(_event: Event, modeString: string) {
    const mode = parseInt(modeString);
    this._gameMode = mode;
    this._trackBackCount = 3;
    this._score = 0;
    const itemName = `HistoryScore_${mode}`;
    this._historyScore = parseInt(
      sys.localStorage.getItem(itemName) || "0"
    );
    director.loadScene("Game");
  }

  onRestart() {
    this._trackBackCount = 3;
    this._score = 0;
    director.loadScene("Game");
  }
  
  updateHistory() {
    const itemName = `HistoryScore_${this._gameMode}`;
    const historyScore = parseInt(
      sys.localStorage.getItem(itemName) || "0"
    );
    if (this._score > historyScore) {
      sys.localStorage.setItem(itemName, this._score.toString());
    }
  }
}
