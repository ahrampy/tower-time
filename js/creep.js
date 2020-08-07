import Vector from "./vector";

class Creep {
  constructor(game, sprites, location, difficulty) {
    // * stats
    this.game = game;
    this.sprites = sprites;
    this.difficulty = difficulty;
    this.worth = 5 * this.difficulty;
    this.pointValue = 100 * this.difficulty;
    this.alive = true;
    this.w = this.maxHealth;

    // * movement
    this.location = location;
    this.prevCell = null;
    this.currentCell = this.getCell();
    this.nextCell = null;
    this.stuck = false;
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);

    // * default
    this.context = this.game.context;
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

  checkBorder() {
    if (this.location.x <= 45 || this.location.x > 795) {
      this.velocity.x = -this.velocity.x / 2;
    }
    if (this.location.y <= 45 || this.location.y > 515) {
      this.velocity.y = -this.velocity.y / 2;
    }
  }

  checkWalls() {
    const cell = this.getCell();
    if (cell.occupied && !this.stuck && this.prevCell) {
      this.velocity.x = -this.velocity.x / 2;
      this.velocity.y = -this.velocity.y / 2;
    }
  }

  checkHit() {
    if (this.currentCell.attacked) {
      this.health -= this.currentCell.attackDamage;
      if (this.currentCell.attackSlow) this.slow();
    }
  }

  checkAlive() {
    if (this.health <= 0) {
      this.game.bits += this.worth;
      this.game.score += this.pointValue;
      this.game.cr += this.worth + this.pointValue;
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
    if (!this.game.gameOver) {
      this.game.lives -= 1;
      this.game.cr -= 1;
      const lives = document.querySelector("#info-lives");
      if (!lives.classList.contains("flashing")) {
        lives.classList.add("flashing");
        setTimeout(() => {
          lives.classList.remove("flashing");
        }, 1000);
      }
    }
    // if (!this.game.muted) {
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

  moveSlow() {
    this.velocity.slow();
    this.slowTimeout--;
    if (this.slowTimeout <= 0) {
      this.slowed = false;
    }
  }

  move() {
    this.acceleration = this.acceleration.subGetNew(
      this.nextCell.center,
      this.currentCell.center
    );

    this.acceleration.setMag(0.05);
    this.setDir(this.nextCell.location);

    this.velocity.add(this.acceleration);

    this.velocity.normalize(this.slowed || this.stuck);

    if (this.slowed) {
      this.moveSlow();
    }

    this.location.add(this.velocity);
  }

  getCell() {
    const col = Math.floor(this.location.x / this.game.cellSize);
    const row = Math.floor(this.location.y / this.game.cellSize);
    return this.game.grid[col][row];
  }

  setCells() {
    const cell = this.getCell();

    if (cell === this.game.goal) {
      this.takeLife();
      return;
    }

    this.stuck = cell.occupied;

    if (this.stuck) {
      this.nextCell = this.prevCell;
    } else {
      this.prevCell = this.currentCell;
      this.nextCell = cell.smallestAdjacent;
    }

    this.currentCell = cell;
  }

  setDir(dest) {
    const loc = this.currentCell.location;
    if (dest.x > loc.x) {
      // * right
      this.dir = 2;
    } else if (dest.x < loc.x) {
      // * left
      this.dir = 1;
    } else if (dest.y < loc.y) {
      // * up
      this.dir = 3;
    } else {
      // * down
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
      this.sprites[this.type][this.currSheet],
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

  run() {
    this.update();
    this.render();
  }

  update() {
    this.checkWalls();
    this.checkBorder();
    this.checkHit();
    this.checkAlive();
    this.setCells();
    this.move();
  }

  render() {
    this.checkSheet();
    this.stepAnimation();
    // this.drawCircle();
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
  //   this.context.fillStyle = this.color;
  //   this.context.fill();
  // }
}

class Slime extends Creep {
  constructor(game, sprites, location, difficulty) {
    super(game, sprites, location, difficulty);
    this.type = "slime";
    this.maxHealth = game.wave * 350 * this.difficulty;
    this.health = this.maxHealth;
    this.size = 16;
    this.offset = 4;
  }
}

class Gork extends Creep {
  constructor(game, sprites, location, difficulty) {
    super(game, sprites, location, difficulty);
    this.type = "gork";
    this.maxHealth = game.wave * 800 * this.difficulty;
    this.health = this.maxHealth;
    this.size = 18;
    this.offset = 4;
  }
}

class Uwo extends Creep {
  constructor(game, sprites, location, difficulty) {
    super(game, sprites, location, difficulty);
    this.type = "uwo";
    this.maxHealth = game.wave * 1200 * this.difficulty;
    this.health = this.maxHealth;
    this.size = 32;
    this.offset = 16;
  }
}

export { Slime, Gork, Uwo };
