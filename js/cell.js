"use strict";

class Cell {
  constructor(game, id, col, row, img, angle) {
    this.id = id;
    this.location = new Vector(col * game.cellSize, row * game.cellSize);
    this.center = new Vector(
      this.location.x + game.cellSize / 2,
      this.location.y + game.cellSize / 2
    );
    this.game = game;
    this.context = game.context;
    this.size = game.cellSize;
    this.col = col;
    this.row = row;
    this.img = img;
    this.angle = angle;

    // path finding
    this.adjacent = [];
    this.value = -1;
    this.smallestAdjacent = null;
    this.smallestAdjacentIndex = 0;
    this.cancelled = false;

    // check state
    this.rock = false;
    this.occupied = false;
    this.attacked = false;
    this.attackDamage = null;
    this.attackSlow = false;
  }

  loadAdjacentCells() {
    const grid = this.game.grid;

    //up
    if (
      this.row > 0 &&
      !this.occupied &&
      !grid[this.col][this.row - 1].occupied
    ) {
      this.adjacent.push(grid[this.col][this.row - 1]);
    }
    //right
    if (
      this.col < grid.length - 1 &&
      !this.occupied &&
      !grid[this.col + 1][this.row].occupied
    ) {
      this.adjacent.push(grid[this.col + 1][this.row]);
    }
    //down
    if (
      this.row < grid[this.col].length - 1 &&
      !this.occupied &&
      !grid[this.col][this.row + 1].occupied
    ) {
      this.adjacent.push(grid[this.col][this.row + 1]);
    }
    //left
    if (
      this.col > 0 &&
      !this.occupied &&
      !grid[this.col - 1][this.row].occupied
    ) {
      this.adjacent.push(grid[this.col - 1][this.row]);
    }
  }

  getShortestRoute() {
    let smallest = 10000;
    for (let i = 0; i < this.adjacent.length; i++) {
      if (this.adjacent[i].value < smallest) {
        smallest = this.adjacent[i].value;
        this.smallestAdjacentIndex = i;
      }
    }
    this.smallestAdjacent = this.adjacent[this.smallestAdjacentIndex];
  }

  cancel() {
    this.cancelled = true;
    setTimeout(() => (this.cancelled = false), 100);
  }

  run() {
    this.render();
    setTimeout(() => (this.attacked = false), 500);
  }

  render() {
    if (this.rock) {
      const context = tt.context;
      context.save();
      context.translate(
        this.location.x + this.game.cellSize / 2,
        this.location.y + this.game.cellSize / 2
      );
      context.rotate(Math.PI / this.angle);
      context.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);
      context.restore();

      return;
    }

    if (this === tt.goal) {
      this.context.fillStyle = "rgba(184, 12, 0, 0.8)";
    } else if (this === tt.start) {
      this.context.fillStyle = "rgba(87, 95, 139, 0.8)";
    } else if (this.occupied) {
      this.context.fillStyle = "rgba(224, 224, 224, 0.6)";
    } else if (this.cancelled) {
      this.context.fillStyle = "rgba(255, 255, 255, 0.8)";
    } else {
      this.context.fillStyle = "rgba(150, 151, 129, 0.06)";
    }

    this.context.fillRect(
      this.location.x,
      this.location.y,
      this.size,
      this.size
    );
    // this.context.strokeStyle = "#333333"
    // this.context.strokeRect(this.location.x, this.location.y, this.size, this.size)
    // this.context.font = "15px Aerial"
    // this.context.fillStyle = "#333333"
    // this.context.fillText(this.value, this.location.x + 5, this.location.y + 10)
  }
}
