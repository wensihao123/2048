import { _decorator, Component, director, Label, Node } from 'cc';
import { GameManager } from '../GameManager';
const { ccclass, property } = _decorator;

@ccclass('NavBar')
export class NavBar extends Component {

    @property(Node)
    modePanel: Node = null;
    @property(Node)
    scorePanel: Node = null;
    @property(Node)
    trackBackPanel: Node = null;
    @property(Node)
    historyScorePanel: Node = null;

    start() {
        const mode = GameManager.getInstance().gameMode;
        this.modePanel.getComponent(Label).string = `${mode} X ${mode}`;
        this.historyScorePanel.getComponent(Label).string = GameManager.getInstance().historyScore.toString();
    }

    update(deltaTime: number) {
        this.scorePanel.getComponent(Label).string = GameManager.getInstance().score.toString();
        this.trackBackPanel.getComponent(Label).string = `撤 销 （${GameManager.getInstance().trackBackCount.toString()}）`;
    }

    onClickBack() {
        director.loadScene("Menu");
    }

    onClickRestart() {
        GameManager.getInstance().onRestart();
    }
}


