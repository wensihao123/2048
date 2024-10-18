import {
  _decorator,
  Button,
  Component,
  director,
  Label,
  Node,
  Sprite,
  tween,
  Vec3,
} from "cc";
import { GameManager } from "../GameManager";
const { ccclass, property } = _decorator;

@ccclass("GameOverModal")
export class GameOverModal extends Component {
  @property(Node)
  modal: Node = null;
  @property(Node)
  scoreLabel: Node = null;
  @property(Node)
  controllButtons: Node = null;
  @property(Node)
  gameButtons: Node = null;

  start() {
    this.node.active = false;
  }

  update(deltaTime: number) {}

  onGameOver() {
    GameManager.getInstance().updateHistory();
    const controllButton = this.controllButtons.children;
    const gameButton = this.gameButtons.children;
    controllButton.forEach((button: Node) => {
      button.getComponent(Button).interactable = false;
    });
    gameButton.forEach((button: Node) => {
      button.getComponent(Button).interactable = false;
    });
    this.modal.setScale(new Vec3(0, 0, 1));
    this.node.active = true;
    tween(this.modal)
      .to(0.3, { scale: new Vec3(1, 1, 1) })
      .start();
    this.scoreLabel.getComponent(Label).string =
      GameManager.getInstance().score.toString();
  }

  onExit() {
    const controllButton = this.controllButtons.children;
    const gameButton = this.gameButtons.children;
    controllButton.forEach((button: Node) => {
      button.getComponent(Button).interactable = true;
    });
    gameButton.forEach((button: Node) => {
      button.getComponent(Button).interactable = true;
    });
    director.loadScene("Menu");
  }
}
