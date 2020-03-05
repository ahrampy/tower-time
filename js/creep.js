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
    this.worth = 5 * this.multiplier;
    this.pointValue = 100 * this.multiplier;
    this.maxHealth = tt.wave * 400 * this.multiplier;
    this.health = this.maxHealth;
    this.alive = true;
    this.slowed = false;
    this.w = this.maxHealth;
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
    let col = Math.floor(this.location.x / tt.cellSize);
    let row = Math.floor(this.location.y / tt.cellSize);
    if (
      tt.grid &&
      tt.grid[col] &&
      tt.grid[col][row].occupied
    ) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = -this.velocity.y;
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
      tt.bits += this.worth;
      tt.score += this.pointValue;
      tt.cr += this.worth + this.pointValue;
      this.alive = false;
    }
  }

  move() {
    let col = Math.floor(this.location.x / tt.cellSize);
    let row = Math.floor(this.location.y / tt.cellSize);

    if (tt.grid[col][row] === tt.goal) {
      this.alive = false;
      tt.lives -= 1;
      tt.cr -= 1;
      // if (!tt.muted) {
      //     const lose = new Audio;
      //     lose.setAttribute('src', 'sounds/lose_life.mp3');
      //     lose.load();
      //     lose.play();
      // }
      return;
    }
    if (tt.grid[col][row] && !tt.grid[col][row].occupied) {
      this.currentCell = tt.grid[col][row];
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
    const context = tt.context;
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
