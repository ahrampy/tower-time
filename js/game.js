"use strict";

window.addEventListener("load", init, false);

var game;

function init() {
  game = new Game();
  window.setTimeout(animate, 100);
}

function animate() {
  game.run();
  window.requestAnimationFrame(animate);
}

class Game {
  constructor() {
    // * add dom handler
    this.dom = new DomHandler();

    // * add canvas
    this.canvas = this.dom.canvas;
    this.context = this.canvas.getContext("2d");

    // * game objects
    this.grid = [];
    this.towers = [];
    this.attacks = [];

    // * creep management
    this.creeps = [];
    this.stages = {};

    // * game stats
    this.lives = 20;
    this.bits = 200;
    this.score = 0;
    this.wave = 0;
    this.difficulty = 1;

    // * grid specs
    this.numBlocks = 35;
    this.cellSize = 40;
    this.numCols = 21;
    this.numRows = 14;
    this.start = null;
    this.goal = null;

    // * track cells
    this.border = [];
    this.blocks = [];
    this.cellsArr = [];

    // * pathing
    this.validated = false;
    this.loadGrid();
    this.loadPaths();

    // * load tower buttons
    this.tileDivs = this.createTiles();

    // * track towers
    this.showTowerDivInfo = null;
    this.placingTower = false;
    this.towersArr = [];

    // * auto wave
    this.autoWave = false;
    this.sendingWave = false;

    // * music
    // this.handleSoundButton();
    // this.muted = false;

    // * trackers
    this.cr = 220;
    this.c = 0;
    this.f;

    // * bounds
    this.gameStarted = false;
    this.gameOver = false;

    // * add game element handlers
    this.loader = new Loader(this.dom);
    this.actions = new ActionsHandler(this.dom, this.tileDivs);
    this.tutorial = new Tutorial(this.dom);
    this.scores = game ? game.scores : new Scores();
  }

  nextWave() {
    game.cr -= game.bits;
    game.bits = Math.ceil(game.bits / 5) * 5;
    game.cr += game.bits;
    if (game.wave % 10 === 0) {
      game.difficulty += 0.5;
    }
    if (game.wave % 30 === 0) {
      game.difficulty += 0.5;
    }
    game.bits += 5 * game.wave;
    game.cr += 5 * game.wave;
    game.loadCreeps(20);
  }

  // handleSoundButton() {
  //   const muteButton = dom.mute("#mute-button");
  //   muteButton.addEventListener("click", this.audioToggle, false);
  // }

  // audioToggle() {
  //   if (game.muted) {
  //     this.classList.add("mute-off");
  //     this.classList.remove("mute-on");
  //     game.muted = false;
  //     music.play();
  //   } else {
  //     this.classList.add("mute-on");
  //     this.classList.remove("mute-off");
  //     game.muted = true;
  //     music.stop();
  //   }
  // }

  checkTowerPlacement(cell) {
    if (!cell.occupied && cell !== game.goal && cell !== game.start) {
      cell.occupied = true;
      game.loadPaths();

      if (this.checkPaths(cell) && this.checkRoute()) {
        game.placeTower(cell);
      } else {
        cell.cancel();
        game.loadPaths();
      }
    }
  }

  checkPaths(cell) {
    return game.creeps.every((creep) => {
      if (creep.currentCell === cell) return false;
      const route = [creep.currentCell];
      while (route.length) {
        const checkCell = route.pop();
        if (checkCell) {
          if (checkCell.value === -1) {
            continue;
          } else if (checkCell === game.goal) {
            return true;
          }
          route.push(checkCell.smallestAdjacent);
        }
      }
      return false;
    });
  }

  checkRoute() {
    const route = [game.start];

    while (route.length) {
      const cell = route.pop();
      if (cell.value === -1) {
        return false;
      } else if (cell === game.goal) {
        return true;
      }
      route.push(cell.smallestAdjacent);
    }

    return false;
  }

  resetSelects() {
    this.towersArr.forEach((tower) => {
      tower.deselect(true);
    });
    this.towersArr = [];
    this.cellsArr = [];
  }

  selectAllTowers(type, level) {
    game.resetSelects();
    for (let i = 0; i < game.towers.length; i++) {
      let tower = game.towers[i];
      if (tower.type === type && tower.level === level) {
        tower.select();
      } else {
        tower.deselect(true);
      }
    }
  }

  createTiles() {
    const tileDivs = [];
    for (let i = 0; i < 4; i++) {
      let tileDiv = this.addTowerStats(i);
      this.dom.towerMenu.appendChild(tileDiv);
      tileDivs.push(tileDiv);

      const tileImg = new Image();
      tileImg.src = `/images/towers/tiles/${tileDiv.type}.png`;
      tileDiv.appendChild(tileImg);

      const towerName = document.createElement("p");
      towerName.innerText = `${tileDiv.cost}¥`;
      tileDiv.appendChild(towerName);
    }
    return tileDivs;
  }

  addTowerStats(i) {
    const div = document.createElement("div");
    div.idx = i;
    if (i === 0) {
      div.type = "earth";
      div.cost = 15;
      div.upgrade = 30;
      div.range = 100;
      div.cooldown = 1000;
      div.damage = 30;
      div.speed = 8;
    } else if (i === 1) {
      div.type = "water";
      div.cost = 30;
      div.upgrade = 60;
      div.range = 120;
      div.cooldown = 400;
      div.damage = 10;
      div.speed = 1;
    } else if (i === 2) {
      div.type = "fire";
      div.cost = 50;
      div.upgrade = 100;
      div.range = 100;
      div.cooldown = 200;
      div.damage = 20;
      div.speed = 10;
    } else {
      div.type = "air";
      div.cost = 100;
      div.upgrade = 200;
      div.range = 150;
      div.cooldown = 1800;
      div.damage = 100;
      div.speed = 16;
    }
    return div;
  }

  createTower(tileDiv) {
    const tower = new Tower(
      game.context,
      tileDiv.idx,
      tileDiv.cost,
      tileDiv.upgrade,
      tileDiv.type,
      tileDiv.range,
      tileDiv.damage,
      tileDiv.cooldown,
      tileDiv.speed
    );
    this.towers.push(tower);
  }

  placeTower(cell) {
    const tower = game.towers[game.towers.length - 1];
    tower.cell = cell;
    tower.location = cell.center.copy();
    this.bits -= tower.cost;
    this.cr -= tower.cost;
    tower.placed = true;
    game.placingTower = false;
  }

  loadGrid() {
    let id = 0;

    for (let c = 0; c < this.numCols; c++) {
      this.grid.push([]);
      for (let r = 0; r < this.numRows; r++) {
        this.grid[c].push(
          new Cell(
            id++,
            this.grid,
            this.cellSize,
            this.context,
            sprites.wall,
            sprites.wallSelected,
            c,
            r
          )
        );
      }
    }
    this.initBorder();
    this.initPosts();
    this.initBlocks();
  }

  initBorder() {
    for (let c = 0; c < this.numCols; c++) {
      this.addBorderCell(c, 0);
      this.addBorderCell(c, this.numRows - 1);
    }
    for (let r = 0; r < this.numRows; r++) {
      this.addBorderCell(0, r);
      this.addBorderCell(this.numCols - 1, r);
    }
  }

  addBorderCell(col, row) {
    const cell = this.grid[col][row];
    cell.occupied = true;
    cell.static = true;
    cell.img = sprites.border;
    this.border.push(cell);
  }

  initPosts() {
    this.start = this.grid[Math.ceil(Math.random() * 3) + 1][
      Math.ceil(Math.random() * 10) + 1
    ];
    const startImg = new Image();
    startImg.src = "/images/board/start.png";
    this.start.img = startImg;
    this.start.static = true;
    this.goal = this.grid[Math.ceil(Math.random() * 3) + 15][
      Math.ceil(Math.random() * 10) + 1
    ];
    this.goal.value = 0;
    const goalImg = new Image();
    goalImg.src = "/images/board/goal.png";
    this.goal.img = goalImg;
    this.goal.static = true;
  }

  initBlocks() {
    this.resetBlocks();
    for (let i = 0; i < this.numBlocks; i++) {
      const randRow = Math.floor(Math.random() * 17) + 2;
      const randCol = Math.floor(Math.random() * 10) + 2;
      const cell = this.grid[randRow][randCol];
      if (cell !== this.start && cell !== this.goal && !cell.occupied) {
        cell.occupied = true;
        this.blocks.push(cell);
      } else {
        i--;
      }
    }
  }

  resetBlocks() {
    this.blocks.forEach((block) => {
      block.occupied = false;
    });
    this.blocks = [];
  }

  loadPaths() {
    this.resetPaths();
    const checkCells = [this.goal];
    while (checkCells.length) {
      const current = checkCells.shift();
      for (let i = 0; i < current.adjacent.length; i++) {
        const cell = current.adjacent[i];
        if (cell.value === -1) {
          checkCells.push(cell);
          cell.value = current.value + 1;
        }
      }
    }
    for (let col = 0; col < this.grid.length; col++) {
      for (let row = 0; row < this.grid[col].length; row++) {
        if (!this.grid[col][row].occupied) {
          this.grid[col][row].getShortestRoute();
        }
      }
    }
    if (!this.validated) {
      this.ensureValidMap();
    }
  }

  resetPaths() {
    this.grid.forEach((col) => {
      col.forEach((cell) => {
        if (cell !== this.goal) {
          cell.value = -1;
          cell.adjacent = [];
        }
      });
    });
    for (let c = 0; c < this.numCols; c++) {
      for (let r = 0; r < this.numRows; r++) {
        this.grid[c][r].loadAdjacentCells();
      }
    }
  }

  ensureValidMap() {
    let pathBlocked = false;

    for (let c = 0; c < this.numCols; c++) {
      for (let r = 0; r < this.numRows; r++)
        if (this.grid[c][r].value === -1 && !this.grid[c][r].occupied) {
          pathBlocked = true;
        }
    }

    if (pathBlocked) {
      this.initBlocks();
      this.loadPaths();
    } else {
      this.validated = true;
    }
  }

  loadCreeps(numCreeps) {
    const creeps = [];
    for (let i = 0; i < numCreeps; i++) {
      const location = this.start.center.copy();
      let creep;
      if (i === 0) {
        if (this.wave % 5 === 0) {
          creep = new Uwo(location, this.difficulty);
        } else {
          creep = new Gork(location, this.difficulty);
        }
      } else {
        creep = new Slime(location, this.difficulty);
      }
      creeps.push(creep);
    }
    this.stages[this.wave] = [creeps, new Date() - 1500];
  }

  sendCreeps() {
    for (const wave in this.stages) {
      const creeps = this.stages[wave][0];
      if (creeps.length) {
        const curr = new Date();
        const lastSent = this.stages[wave][1];
        if (curr - lastSent > 1500) {
          game.creeps.push(creeps.shift());
          this.stages[wave][1] = curr;
        }
      } else {
        delete this.stages[wave];
      }
    }
  }

  checkHit(attack) {
    const gridCol = Math.floor(attack.location.x / game.cellSize);
    const gridRow = Math.floor(attack.location.y / game.cellSize);

    if (game.grid[gridCol] && game.grid[gridCol][gridRow]) {
      const cell = game.grid[gridCol][gridRow];
      cell.attack(attack.damage, attack.type === "water");
      for (let j = 0; j < this.creeps.length; j++) {
        if (cell === this.creeps[j].currentCell) {
          if (attack.type !== "air") attack.hit = true;
        }
      }
    }
  }

  checkWave() {
    if (game.autoWave && !game.sendingWave && !game.creeps.length) {
      game.dom.wave.click();
      game.sendingWave = true;
      setTimeout(() => {
        game.sendingWave = false;
      }, 1000);
    }
    if (!game.creeps.length && !game.sendingWave && game.wave > 0) {
      game.dom.wave.classList.add("active");
    } else {
      game.dom.wave.classList.remove("active");
    }
    if (game.wave === 0 && game.bits < 50) {
      game.dom.towerMenu.classList.remove("active");
      game.dom.wave.classList.add("active");
      game.tutorial.showInfo("canvas");
    }
  }

  checkStats() {
    if (this.cr !== this.lives + this.score + this.bits + this.c) {
      console.log("oh so you think you're clever");
      this.score = 0;
      this.bits = 0;
      this.lives = 1;
      this.cr = this.lives + this.score + this.bits + this.c;
    }
  }

  animateBorder() {
    if (game.border.length) {
      for (let i = 0; i < Math.ceil(game.border.length) / 2; i++) {
        const cell1 = game.border[i];
        const cell2 = game.border[game.border.length - 1 - i];
        this.blinkCell(cell1, i);
        this.blinkCell(cell2, i);
      }
      game.border = [];
    }
  }

  animateBlocks() {
    if (game.blocks.length) {
      for (let i = 0; i < game.blocks.length; i++) {
        const cell = game.blocks[i];
        this.blinkCell(cell, i + 20);
      }
      game.blocks = [];
    }
  }

  blinkCell(cell, time) {
    cell.occupied = false;
    cell.static = false;
    setTimeout(() => {
      cell.occupied = true;
      cell.static = true;
    }, time * 10);
  }

  handleGameOver() {
    this.gameOver = true;
    this.context.fillStyle = "rgba(125, 125, 125, 0.6)";
    this.context.fillRect(0, 0, 840, 560);
    this.dom.gameOver.style.display = "flex";
    this.dom.wave.style.opacity = 0;
    this.dom.wave.removeEventListener("click", this.waveClick, false);
    this.dom.tutorial.style.opacity = 0;
    const highscores = firebase
      .database()
      .ref("scores")
      .orderByChild("score")
      .limitToLast(10);
    setTimeout(() => {
      this.canvas.classList.add("over");
    }, 3000);
    game.f = game.score;
    setTimeout(() => {
      const gameOverScreen = document.createElement("div");
      gameOverScreen.classList.add("game-over");
      this.dom.wrapper.replaceChild(gameOverScreen, this.canvas);
      this.dom.gameOver.style.opacity = 0;
      setTimeout(() => {
        gameOverScreen.classList.add("scores");
        this.dom.gameOver.style.display = "none";
        setTimeout(() => {
          this.dom.wave.innerText = "New Game";
          this.dom.wave.addEventListener("click", this.newGame, false);
          this.dom.wave.classList.add("active");
          this.dom.wave.style.opacity = 100;
          this.dom.gameOver.style.opacity = 100;
          this.scores.handleScores(gameOverScreen, highscores);
        }, 500);
      }, 500);
    }, 5000);
  }

  newGame() {
    const gameOverScreen = document.querySelector(".game-over");
    game.dom.canvas = document.createElement("canvas");
    game.dom.wave.removeEventListener("click", game.newGame, false);
    game.dom.canvas.width = 840;
    game.dom.canvas.height = 560;
    game.dom.wrapper.replaceChild(game.dom.canvas, gameOverScreen);
    game.dom.auto.checked = false;
    while (game.dom.towerMenu.firstChild) {
      game.dom.towerMenu.removeChild(game.dom.towerMenu.lastChild);
    }
    game.dom.wave.innerText = "First Wave";
    game.dom.wave.classList.remove("active");
    game.dom.topBar.style.opacity = 0;
    game.dom.bottomBar.style.opacity = 0;
    game.dom.play.style.display = "";
    game.dom.startText.style.display = "flex";
    game = new Game();
  }

  run() {
    this.actions.updateStats();
    this.checkStats();

    if (!this.gameOver && this.gameStarted) {
      this.actions.showTowerInfo();
      this.render();
      this.checkWave();
      this.sendCreeps();
      for (let c = 0; c < this.numCols; c++) {
        this.grid[c][0].run();
        this.grid[c][this.numRows - 1].run();
      }
      for (let r = 1; r < this.numRows - 1; r++) {
        this.grid[0][r].run();
        this.grid[this.numCols - 1][r].run();
      }
      for (let c = 1; c < this.numCols - 1; c++) {
        for (let r = 1; r < this.numRows - 1; r++) {
          this.grid[c][r].run();
        }
      }
      for (let i = 0; i < this.cellsArr.length; i++) {
        this.cellsArr[i].renderImage();
      }
      for (let i = 0; i < this.towers.length; i++) {
        let tower = this.towers[i];
        if (!tower.removed) {
          tower.run();
        } else {
          this.towers.splice(i, 1);
        }
      }
      for (let i = 0; i < this.creeps.length; i++) {
        let creep = this.creeps[i];
        if (creep.alive) {
          creep.run();
        } else {
          this.creeps.splice(i, 1);
        }
      }
      for (let i = 0; i < this.towersArr.length; i++) {
        this.towersArr[i].drawRange();
      }
      for (let i = 0; i < this.attacks.length; i++) {
        let attack = this.attacks[i];
        this.checkHit(attack);
        if (!attack.hit) {
          attack.run();
        } else {
          this.attacks.splice(i, 1);
        }
      }
      if (this.lives <= 0) {
        setTimeout(this.handleGameOver(), 1000);
      }
    }
  }

  render() {
    this.context.clearRect(0, 0, 840, 560);
  }
}
