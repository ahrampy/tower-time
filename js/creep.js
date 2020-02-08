"use strict";

class Creep {
  constructor(location, multiplier) {
    // movement
    this.location = location;
    this.currentCell = null;
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);

    // default
    this.radius = 12;
    this.color = "rgb(225, 225, 225)";

    // stats
    this.multiplier = multiplier;
    this.maxHealth = towerTime.wave * 400 * this.multiplier;
    this.worth = 5 * this.multiplier;
    this.pointValue = 100 * this.multiplier;
    this.health = this.maxHealth;
    this.alive = true;
    this.slowed = false;
  }

  checkEdges() {
    if (this.location.x <= 5 || this.location.x > 795) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.location.y <= 5 || this.location.y > 515) {
      this.velocity.y = -this.velocity.y;
    }
  }

  checkWalls() {
    let col = Math.floor(this.location.x / towerTime.cellSize);
    let row = Math.floor(this.location.y / towerTime.cellSize);
    if (
      towerTime.grid &&
      towerTime.grid[col] &&
      towerTime.grid[col][row].occupied
    ) {
      // if (this.velocity.x > this.velocity.y) {
      this.velocity.x = -this.velocity.x;
      // } else {
      this.velocity.y = -this.velocity.y;
      // }
    }
  }

  checkHit() {
    if (this.currentCell && this.currentCell.attacked) {
      this.health -= this.currentCell.attackDamage;
      if (this.currentCell.attackSlow) {
        this.slowed = true;
        setTimeout(() => (this.slowed = false), 2000);
      }
    }
  }

  checkAlive() {
    if (this.health <= 0) {
      towerTime.bits += this.worth;
      towerTime.score += this.pointValue;
      this.alive = false;
    }
  }

  move() {
    let col = Math.floor(this.location.x / towerTime.cellSize);
    let row = Math.floor(this.location.y / towerTime.cellSize);

    if (towerTime.grid[col][row] === towerTime.goal) {
      this.alive = false;
      towerTime.lives -= 1;
      // if (!towerTime.muted) {
      //     const lose = new Audio;
      //     lose.setAttribute('src', 'sounds/lose_life.mp3');
      //     lose.load();
      //     lose.play();
      // }
      return;
    }
    if (towerTime.grid[col][row] && !towerTime.grid[col][row].occupied) {
      this.currentCell = towerTime.grid[col][row];
      let nextCell = this.currentCell.smallestAdjacent;
      this.acceleration = this.acceleration.subGetNew(
        nextCell.center,
        this.currentCell.center
      );
      this.acceleration.setMag(0.05);
    }

    this.velocity.add(this.acceleration);
    this.velocity.normalize();
    if (this.slowed) {
      this.velocity.slow();
    }
    this.location.add(this.velocity);
  }

  run() {
    this.update();
    this.render();
  }

  update() {
    this.move();
    this.checkWalls();
    this.checkEdges();
    this.checkHit();
    this.checkAlive();
  }

  render() {
    const context = towerTime.context;
    context.beginPath();
    context.arc(this.location.x, this.location.y, this.radius, 0, Math.PI * 2);
    if (this.slowed) {
      context.fillStyle = "#49E2FA";
    } else if (
      this.health < this.maxHealth &&
      this.health > this.maxHealth * 0.75
    ) {
      context.fillStyle = "rgba(245, 242, 66)";
    } else if (
      this.health <= this.maxHealth * 0.75 &&
      this.health >= this.maxHealth * 0.5
    ) {
      context.fillStyle = "rgba(245, 182, 66)";
    } else if (
      this.health <= this.maxHealth * 0.5 &&
      this.health >= this.maxHealth * 0.25
    ) {
      context.fillStyle = "rgba(245, 147, 66)";
    } else if (this.health <= this.maxHealth * 0.25) {
      context.fillStyle = "rgba(245, 75, 66)";
    } else {
      context.fillStyle = this.color;
    }
    context.fill();
  }
}
