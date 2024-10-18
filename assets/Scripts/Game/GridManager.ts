import {
  _decorator,
  Component,
  director,
  Game,
  instantiate,
  Label,
  Node,
  Prefab,
  Sprite,
  tween,
  UITransform,
  Vec3,
} from "cc";
import { gridPadding } from "../Common/constants";
import { GameManager } from "../GameManager";
import { getBackground } from "../Common/helpers";
import { GameOverModal } from "./GameOverModal";
const { ccclass, property } = _decorator;

@ccclass("GridManager")
export class GridManager extends Component {
  @property(Node)
  Grid: Node = null;
  @property(Node)
  CellContainer: Node = null;
  @property(Prefab)
  CellBG: Prefab = null;
  @property(Prefab)
  Cell: Prefab = null;
  @property(Node)
  GameOverModal: Node = null;

  private gameGrid: number[][] = [];
  private cellSize: number = 0;
  private traceBackGrid: number[][] = [];
  private newCell: number[] = [];
  private newCellAnimated: boolean = false;

  start() {
    const dimension = GameManager.getInstance().gameMode;
    this.cellSize =
      (this.Grid.getComponent(UITransform).width - gridPadding) / dimension -
      gridPadding;
    this.drawGridBG(dimension);
    this.generateEmptyGrid(dimension);
    this.addNewCell();
    this.traceBackGrid = this.gameGrid;
    this.calculateScore();
    this.drwaCells();
  }

  update(deltaTime: number) {}

  drawGridBG(dimension: number) {
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        const cellBG = instantiate(this.CellBG);
        this.Grid.addChild(cellBG);
        cellBG.getComponent(UITransform).width = this.cellSize;
        cellBG.getComponent(UITransform).height = this.cellSize;
        cellBG.setPosition(
          j * (this.cellSize + gridPadding) + gridPadding,
          -i * (this.cellSize + gridPadding) - gridPadding - this.cellSize
        );
      }
    }
  }

  drwaCells() {
    this.CellContainer.removeAllChildren();
    for (let i = 0; i < this.gameGrid.length; i++) {
      for (let j = 0; j < this.gameGrid[i].length; j++) {
        if (this.gameGrid[i][j] !== 0) {
          const cell = instantiate(this.Cell);
          const label = cell.getComponentInChildren(Label);
          if (
            this.newCell[0] === i &&
            this.newCell[1] === j &&
            !this.newCellAnimated
          ) {
            cell.setScale(new Vec3(0.1, 0.1, 0));
            tween(cell)
              .to(0.2, { scale: new Vec3(1, 1, 1) })
              .call(() => {
                this.newCellAnimated = true;
              })
              .start();
          }
          this.CellContainer.addChild(cell);
          label.string = this.gameGrid[i][j].toString();
          cell.getComponent(Sprite).color = getBackground(this.gameGrid[i][j]);
          cell.getComponent(UITransform).width = this.cellSize;
          cell.getComponent(UITransform).height = this.cellSize;
          cell.setPosition(
            j * (this.cellSize + gridPadding) + gridPadding + this.cellSize / 2,
            -i * (this.cellSize + gridPadding) - gridPadding - this.cellSize / 2
          );
        }
      }
    }
  }

  generateEmptyGrid(dimension: number) {
    this.gameGrid = [];
    for (let i = 0; i < dimension; i++) {
      this.gameGrid.push([]);
      for (let j = 0; j < dimension; j++) {
        this.gameGrid[i].push(0);
      }
    }
  }

  addNewCell() {
    const emptyCells = [];
    for (let i = 0; i < this.gameGrid.length; i++) {
      for (let j = 0; j < this.gameGrid[i].length; j++) {
        if (this.gameGrid[i][j] === 0) {
          emptyCells.push({ i, j });
        }
      }
    }
    if (emptyCells.length === 0) {
      return;
    }
    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    this.newCell = [randomCell.i, randomCell.j];
    this.newCellAnimated = false;
    this.gameGrid[randomCell.i][randomCell.j] = Math.random() < 0.9 ? 2 : 4;
  }

  slide(_e, direction: string) {
    this.traceBackGrid = this.gameGrid;
    switch (direction) {
      case "up":
        this.gameGrid = this.slideUp();
        break;
      case "down":
        this.gameGrid = this.slideDown();
        break;
      case "left":
        this.gameGrid = this.slideLeft();
        break;
      case "right":
        this.gameGrid = this.slideRight();
        break;
    }
    this.addNewCell();
    this.calculateScore();
    this.drwaCells();
    if (!this.canSlide()) {
      console.log("Game Over");
      this.GameOverModal.getComponent(GameOverModal).onGameOver();
      return;
    }
  }

  slideUp() {
    const newGrid = this.transposeGrid(this.gameGrid);
    for (let i = 0; i < newGrid.length; i++) {
      newGrid[i] = this.collapse(newGrid[i]);
    }
    return this.transposeGrid(newGrid);
  }

  slideDown() {
    const newGrid = this.transposeGrid(this.gameGrid);
    for (let i = 0; i < newGrid.length; i++) {
      newGrid[i] = this.collapse(newGrid[i].reverse()).reverse();
    }
    return this.transposeGrid(newGrid);
  }

  slideLeft() {
    const newGrid = this.gameGrid.map((row) => this.collapse(row));
    return newGrid;
  }

  slideRight() {
    const newGrid = this.gameGrid.map((row) =>
      this.collapse(row.reverse()).reverse()
    );
    return newGrid;
  }

  collapse(row: number[]) {
    const newRow = row.filter((cell) => cell !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow[i + 1] = 0;
      }
    }
    const resultRow = newRow.filter((cell) => cell !== 0);
    while (resultRow.length < GameManager.getInstance().gameMode) {
      resultRow.push(0);
    }
    return resultRow;
  }

  transposeGrid(grid) {
    return grid[0].map((_, colIndex) => grid.map((row) => row[colIndex]));
  }

  canSlide() {
    for (let i = 0; i < this.gameGrid.length; i++) {
      for (let j = 0; j < this.gameGrid[i].length; j++) {
        if (this.gameGrid[i][j] === 0) {
          return true;
        }
        if (
          i !== this.gameGrid.length - 1 &&
          this.gameGrid[i][j] === this.gameGrid[i + 1][j]
        ) {
          return true;
        }
        if (
          j !== this.gameGrid[i].length - 1 &&
          this.gameGrid[i][j] === this.gameGrid[i][j + 1]
        ) {
          return true;
        }
      }
    }
    return false;
  }

  calculateScore() {
    let score = 0;
    for (let i = 0; i < this.gameGrid.length; i++) {
      for (let j = 0; j < this.gameGrid[i].length; j++) {
        score += this.gameGrid[i][j];
      }
    }
    GameManager.getInstance().onScoreChange(score);
  }

  isEquals(grid1: number[][], grid2: number[][]) {
    for (let i = 0; i < grid1.length; i++) {
      for (let j = 0; j < grid1[i].length; j++) {
        if (grid1[i][j] !== grid2[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  onUseTrackBack() {
    if (this.isEquals(this.gameGrid, this.traceBackGrid)) {
      return;
    }
    if (GameManager.getInstance().onUseTrackBack()) {
      this.gameGrid = this.traceBackGrid;
      this.CellContainer.removeAllChildren();
      this.drwaCells();
    }
  }
}
