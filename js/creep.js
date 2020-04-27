"use strict";

class Creep {
  constructor(location, multiplier) {
    // * stats
    this.multiplier = multiplier;
    this.worth = 5 * this.multiplier;
    this.pointValue = 100 * this.multiplier;
    this.alive = true;
    this.w = this.maxHealth;

    // * movement
    this.location = location;
    this.prevCell = null;
    this.currentCell = null;
    this.nextCell = null;
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);

    // * default
    this.context = game.context;
    this.radius = 12;
    this.color = "rgb(225, 225, 225)";

    // * img
    this.currSheet = 0;
    this.dir = 0;
    this.frame = 0;
    this.step = 0;

    // * slow
    this.slowed = false;
    this.slowTimeout = 0;
  }

  // checkEdges() {
  //   if (this.location.x <= 5 || this.location.x > 835) {
  //     this.velocity.x = -this.velocity.x / 2;
  //   }
  //   if (this.location.y <= 5 || this.location.y > 555) {
  //     this.velocity.y = -this.velocity.y / 2;
  //   }
  // }

  checkWalls() {
    const col = Math.floor(this.location.x / game.cellSize);
    const row = Math.floor(this.location.y / game.cellSize);
    if (game.grid && game.grid[col] && game.grid[col][row]) {
      if (game.grid[col][row].occupied && this.prevCell) {
        this.velocity.x = -this.velocity.x / 2;
        this.velocity.y = -this.velocity.y / 2;
      }
    }
  }

  checkHit() {
    if (this.currentCell && this.currentCell.attacked) {
      this.health -= this.currentCell.attackDamage;
      if (this.currentCell.attackSlow) {
        this.slow();
      }
    }
  }

  checkAlive() {
    if (this.health <= 0) {
      game.bits += this.worth;
      game.score += this.pointValue;
      game.cr += this.worth + this.pointValue;
      this.alive = false;
    }
  }

  checkSheet() {
    if (this.slowed) {
      this.currSheet = 4;
    } else if (this.health <= this.maxHealth * 0.25) {
      this.currSheet = 3;
    } else if (this.health <= this.maxHealth * 0.5) {
      this.currSheet = 2;
    } else if (this.health <= this.maxHealth * 0.75) {
      this.currSheet = 1;
    } else {
      this.currSheet = 0;
    }
  }

  takeLife() {
    this.alive = false;
    if (!game.gameOver) {
      game.lives -= 1;
      game.cr -= 1;
      const lives = document.querySelector("#info-lives");
      if (!lives.classList.contains("flashing")) {
        lives.classList.add("flashing");
        setTimeout(() => {
          lives.classList.remove("flashing");
        }, 1000);
      }
    }
    // if (!game.muted) {
    //     const lose = new Audio;
    //     lose.setAttribute('src', 'sounds/lose_life.mp3');
    //     lose.load();
    //     lose.play();
    // }
  }

  slow() {
    this.slowed = true;
    this.slowTimeout = 30;
  }

  move() {
    const col = Math.floor(this.location.x / game.cellSize);
    const row = Math.floor(this.location.y / game.cellSize);

    const cellCheck = game.grid[col][row];

    if (cellCheck === game.goal) {
      this.takeLife();
      return;
    }

    if (cellCheck && !cellCheck.occupied) {
      this.prevCell = this.currentCell;
      this.currentCell = cellCheck;
      this.nextCell = this.currentCell.smallestAdjacent;
      this.acceleration = this.acceleration.subGetNew(
        this.nextCell.center,
        this.currentCell.center
      );
      this.acceleration.setMag(0.05);
      this.setDir(this.nextCell.location);
    }

    this.velocity.add(this.acceleration);
    this.velocity.normalize();
    if (this.slowed) {
      this.velocity.slow();
      this.slowTimeout--;
      if (this.slowTimeout <= 0) {
        this.slowed = false;
      }
    }
    this.location.add(this.velocity);
  }

  setDir(dest) {
    const loc = this.currentCell.location;
    if (dest.x > loc.x) {
      // if (this.dir === 1) {
      //   console.log("turn left");
      // }
      // right
      this.dir = 2;
    } else if (dest.x < loc.x) {
      // if (this.dir === 2) {
      //   console.log("turn right");
      // }
      // left
      this.dir = 1;
    } else if (dest.y < loc.y) {
      // if (this.dir === 0) {
      //   console.log("turn down");
      // }
      // up
      this.dir = 3;
    } else {
      // if (this.dir === 3) {
      //   console.log("turn up");
      // }
      // down
      this.dir = 0;
    }
  }

  stepAnimation() {
    this.step++;
    if ((!this.slowed && this.step >= 10) || this.step >= 20) {
      this.step = 0;
      this.frame = (this.frame + 1) % 4;
    }
    this.drawFrame();
  }

  drawFrame() {
    this.context.save();
    this.context.translate(this.location.x, this.location.y);
    this.context.drawImage(
      sprites[this.type][this.currSheet],
      this.frame * this.size,
      this.dir * this.size,
      this.size,
      this.size,
      -this.size,
      -this.size - this.offset,
      this.size * 2,
      this.size * 2
    );
    this.context.restore();
  }

  // drawCircle() {
  //   this.context.beginPath();
  //   this.context.arc(
  //     this.location.x,
  //     this.location.y,
  //     this.radius,
  //     0,
  //     Math.PI * 2
  //   );
  //   if (this.health === this.maxHealth) {
  //     this.context.fillStyle = this.color;
  //   } else if (this.slowed) {
  //     this.context.fillStyle = "#49E2FA";
  //   } else if (
  //     this.health < this.maxHealth &&
  //     this.health > this.maxHealth * 0.75
  //   ) {
  //     this.context.fillStyle = "rgba(245, 242, 66)";
  //   } else if (
  //     this.health <= this.maxHealth * 0.75 &&
  //     this.health >= this.maxHealth * 0.5
  //   ) {
  //     this.context.fillStyle = "rgba(245, 182, 66)";
  //   } else if (
  //     this.health <= this.maxHealth * 0.5 &&
  //     this.health >= this.maxHealth * 0.25
  //   ) {
  //     this.context.fillStyle = "rgba(245, 147, 66)";
  //   } else if (this.health <= this.maxHealth * 0.25) {
  //     this.context.fillStyle = "rgba(245, 75, 66)";
  //   }
  //   this.context.fill();
  // }

  run() {
    this.update();
    this.render();
  }

  update() {
    this.move();
    this.checkWalls();
    // this.checkEdges();
    this.checkHit();
    this.checkAlive();
  }

  render() {
    this.checkSheet();
    this.stepAnimation();
    // this.drawCircle()
  }
}

class Slime extends Creep {
  constructor(location, multiplier) {
    super(location, multiplier);
    this.type = "slime";
    this.maxHealth = game.wave * 350 * this.multiplier;
    this.health = this.maxHealth;
    this.size = 16;
    this.offset = 4;
  }
}

class Gork extends Creep {
  constructor(location, multiplier) {
    super(location, multiplier);
    this.type = "gork";
    this.maxHealth = game.wave * 800 * this.multiplier;
    this.health = this.maxHealth;
    this.size = 18;
    this.offset = 4;
  }
}

class Uwo extends Creep {
  constructor(location, multiplier) {
    super(location, multiplier);
    this.type = "uwo";
    this.maxHealth = game.wave * 1200 * this.multiplier;
    this.health = this.maxHealth;
    this.size = 32;
    this.offset = 16;
  }
}
