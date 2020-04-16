"use strict";

class Cell {
  constructor(id,grid, size, context, img, col, row) {
    this.id = id;
    this.grid = grid;
    this.size = size;
    this.location = new Vector(col * this.size, row * this.size);
    this.center = new Vector(
      this.location.x + this.size / 2,
      this.location.y + this.size / 2
    );
    this.context = context;
    this.img = img;
    this.col = col;
    this.row = row;

    // path finding
    this.adjacent = [];
    this.value = -1;
    this.smallestAdjacent = null;
    this.smallestAdjacentIndex = 0;

    // manage state
    this.occupied = false;
    this.attacked = false;

    // manage attack state
    this.attackDamage = null;
    this.attackSlow = false;
    this.attackTimeout = 0;

    // show invalid placement
    this.cancelled = false;
    this.cancTimeout = 0;
  }

  loadAdjacentCells() {
    //up
    if (
      this.row > 0 &&
      !this.occupied &&
      !this.grid[this.col][this.row - 1].occupied
    ) {
      this.adjacent.push(this.grid[this.col][this.row - 1]);
    }
    //right
    if (
      this.col < this.grid.length - 1 &&
      !this.occupied &&
      !this.grid[this.col + 1][this.row].occupied
    ) {
      this.adjacent.push(this.grid[this.col + 1][this.row]);
    }
    //down
    if (
      this.row < this.grid[this.col].length - 1 &&
      !this.occupied &&
      !this.grid[this.col][this.row + 1].occupied
    ) {
      this.adjacent.push(this.grid[this.col][this.row + 1]);
    }
    //left
    if (
      this.col > 0 &&
      !this.occupied &&
      !this.grid[this.col - 1][this.row].occupied
    ) {
      this.adjacent.push(this.grid[this.col - 1][this.row]);
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

  attack(damage, slow) {
    this.attacked = true;
    this.attackDamage = damage;
    this.attackSlow = slow;
    this.attackTimeout = 2 + slow;
  }

  cancel() {
    this.occupied = false;
    this.cancelled = true;
    this.cancTimeout = 3;
  }

  run() {
    this.checkAttack();
    this.renderImages();
    this.render();
  }

  checkAttack() {
    if (this.attacked) {
      this.attackTimeout--;
      if (this.attackTimeout <= 0) {
        this.attacked = false;
      }
    }
  }

  renderImages() {
    if (this.occupied) {
      this.context.save();
      this.context.translate(this.center.x, this.center.y);
      this.context.drawImage(
        this.img,
        -this.img.width / 2,
        -this.img.height / 2
      );
      this.context.restore();
    }
  }

  render() {
    if (this === tt.goal) {
      this.context.fillStyle = "rgba(184, 12, 0, 0.8)";
    } else if (this === tt.start) {
      this.context.fillStyle = "rgba(87, 95, 139, 0.8)";
    } else if (this.cancelled) {
      this.context.fillStyle = "rgba(255, 255, 255, 0.8)";
      this.cancTimeout--;
      if (this.cancTimeout <= 0) {
        this.cancelled = false;
      }
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
