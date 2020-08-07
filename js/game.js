import Loader from "./loader";
import Actions from "./actions";
import Tutorial from "./tutorial";
import Cell from "./cell";
import Tower from "./tower";
import { Slime, Gork, Uwo } from "./creep";

export default class Game {
  constructor(dom, sprites) {
    // * add canvas
    this.dom = dom;
    this.sprites = sprites;
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
    this.lives = 1;
    this.bits = 2000;
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
    this.selectedCells = [];

    // * pathing
    this.validated = false;
    this.loadGrid();
    this.loadPaths();

    // * draw path
    this.path = this.getPath();
    this.vertices = this.getVertices(this.path);
    this.point = 10;

    // * tower buttons
    this.tileDivs = this.createTiles();

    // * track towers
    this.showTowerDivInfo = null;
    this.placingTower = false;
    this.selectedTowers = [];

    // * wave tracking
    this.autoWave = false;
    this.sendingWave = false;
    this.waveTimer = 0;

    // * music
    // this.handleSoundButton();
    // this.muted = false;

    // * trackers
    // this.cr = 220;
    // this.c = 0;
    // this.f;

    // * bounds
    this.gameStarted = false;
    this.gameOver = false;

    // * add game element handlers
    this.tutorial = new Tutorial(this, dom);
    this.loader = new Loader(this, dom, sprites);
    this.actions = new Actions(this, dom, this.tutorial, this.tileDivs);
  }

  // handleSoundButton() {
  //   const muteButton = this.dom.mute("#mute-button");
  //   muteButton.addEventListener("click", this.audioToggle);
  // }

  // audioToggle() {
  //   if (this.muted) {
  //     this.classList.add("mute-off");
  //     this.classList.remove("mute-on");
  //     this.muted = false;
  //     music.play();
  //   } else {
  //     this.classList.add("mute-on");
  //     this.classList.remove("mute-off");
  //     this.muted = true;
  //     music.stop();
  //   }
  // }

  checkTowerPlacement(cell) {
    if (cell.static || cell.occupied) return;
    cell.occupied = true;
    this.loadPaths();

    if (this.checkPaths(cell) && this.checkRoute()) {
      this.placeTower(cell);
    } else {
      cell.cancel();
      this.loadPaths();
    }
  }

  checkPaths(cell) {
    return this.creeps.every((creep) => {
      if (creep.currentCell === cell) return false;
      const route = [creep.currentCell];

      while (route.length) {
        const checkCell = route.pop();
        if (checkCell) {
          if (checkCell.value === -1) {
            continue;
          } else if (checkCell === this.goal) {
            return true;
          }
          route.push(checkCell.smallestAdjacent);
        }
      }

      return false;
    });
  }

  checkRoute() {
    const route = [this.start];

    while (route.length) {
      const cell = route.pop();
      if (cell.value === -1) {
        return false;
      } else if (cell === this.goal) {
        return true;
      }
      route.push(cell.smallestAdjacent);
    }

    return false;
  }

  resetSelects() {
    this.selectedTowers.forEach((tower) => {
      tower.deselect(true);
    });
    this.selectedTowers = [];
    this.selectedCells = [];
  }

  selectAllTowers(type, level) {
    this.resetSelects();
    for (let i = 0; i < this.towers.length; i++) {
      let tower = this.towers[i];
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
      this,
      this.dom,
      this.sprites,
      this.context,
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
    const tower = this.towers[this.towers.length - 1];
    tower.cell = cell;
    tower.location = cell.center.copy();
    this.bits -= tower.cost;
    // this.cr -= tower.cost;
    tower.placed = true;
    this.placingTower = false;
    this.path = this.getPath();
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
            this.sprites.wall,
            this.sprites.wallSelected,
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
    cell.img = this.sprites.border;
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

  nextWave() {
    // this.cr -= this.bits;
    this.bits = Math.ceil(this.bits / 5) * 5;
    // this.cr += this.bits;
    if (this.wave % 10 === 0) {
      this.difficulty += 0.5;
    }
    if (this.wave % 30 === 0) {
      this.difficulty += 0.5;
    }
    this.bits += 5 * this.wave;
    // this.cr += 5 * this.wave;
    this.loadCreeps(200);
  }

  loadCreeps(numCreeps) {
    const creeps = [];
    for (let i = 0; i < numCreeps; i++) {
      const location = this.start.center.copy();
      let creep;
      if (i === 0) {
        if (this.wave % 5 === 0) {
          creep = new Uwo(this, this.sprites, location, this.difficulty);
        } else {
          creep = new Gork(this, this.sprites, location, this.difficulty);
        }
      } else {
        creep = new Slime(this, this.sprites, location, this.difficulty);
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
          this.creeps.push(creeps.shift());
          this.stages[wave][1] = curr;
        }
      } else {
        delete this.stages[wave];
      }
    }
  }

  checkHit(attack) {
    const gridCol = Math.floor(attack.location.x / this.cellSize);
    const gridRow = Math.floor(attack.location.y / this.cellSize);

    if (this.grid[gridCol] && this.grid[gridCol][gridRow]) {
      const cell = this.grid[gridCol][gridRow];
      cell.attack(attack.damage, attack.type === "water");
      for (let j = 0; j < this.creeps.length; j++) {
        if (cell === this.creeps[j].currentCell) {
          if (attack.type !== "air") attack.hit = true;
        }
      }
    }
  }

  checkWave() {
    if (this.waveTimer > 0) {
      this.waveTimer--;
      this.dom.progress.style.width = `${this.waveTimer / 4}%`;
    } else {
      this.sendingWave = false;
      this.dom.wave.classList.add("clickable");
    }

    if (this.creeps.length) {
      this.dom.wave.classList.remove("active");
    } else if (!this.sendingWave) {
      if (this.autoWave) {
        this.dom.wave.click();
      } else if (this.wave > 0) {
        this.dom.wave.classList.add("active");
      } else if (this.bits < 50) {
        this.dom.wave.classList.add("active");
        this.dom.towerMenu.classList.remove("active");
        this.tutorial.showInfo("canvas");
      }
    }
  }

  // checkStats() {
  //   if (this.cr !== this.lives + this.score + this.bits + this.c) {
  //     console.log("oh so you think you're clever");
  //     this.score = 0;
  //     this.bits = 0;
  //     this.lives = 1;
  //     this.cr = this.lives + this.score + this.bits + this.c;
  //   }
  // }

  getPath() {
    const path = [this.start];
    while (path[path.length - 1] !== this.goal) {
      path.push(path[path.length - 1].smallestAdjacent);
    }
    this.vertices = this.getVertices(path);
    return path;
  }

  getVertices(path) {
    var vertices = [];
    for (var i = 1; i < path.length; i++) {
      var cell0 = path[i - 1];
      var cell1 = path[i];
      var dx = cell1.center.x - cell0.center.x;
      var dy = cell1.center.y - cell0.center.y;
      for (var j = 0; j < 15; j++) {
        var x = cell0.center.x + (dx * j) / 15;
        var y = cell0.center.y + (dy * j) / 15;
        vertices.push({
          x: x,
          y: y,
        });
      }
    }
    return vertices;
  }

  animatePath() {
    this.context.beginPath();
    this.context.moveTo(this.start.center.x, this.start.center.y);
    for (var i = 1; i < this.path.length; i++) {
      let cell = this.path[i];
      this.context.lineTo(cell.center.x, cell.center.y);
    }
    this.context.strokeStyle = "rgba(164, 124, 194, 0.3)";
    this.context.lineWidth = 4;
    this.context.stroke();
    this.animateTravel();
    this.point++;
  }

  animateTravel() {
    if (this.vertices.length <= this.point) this.point = 10;

    this.context.beginPath();
    this.context.arc(
      this.vertices[this.point - 10].x,
      this.vertices[this.point - 10].y,
      4,
      0,
      Math.PI * 2
    );
    this.context.fillStyle = "rgba(164, 124, 194, 0.3)";
    this.context.fill();

    this.context.beginPath();
    this.context.arc(
      this.vertices[this.point - 5].x,
      this.vertices[this.point - 5].y,
      5,
      0,
      Math.PI * 2
    );
    this.context.fillStyle = "rgba(164, 124, 194, 0.3)";
    this.context.fill();

    this.context.beginPath();
    this.context.arc(
      this.vertices[this.point].x,
      this.vertices[this.point].y,
      6,
      0,
      Math.PI * 2
    );
    this.context.fillStyle = "rgba(164, 124, 194, 0.3)";
    this.context.fill();
  }

  animateBorder() {
    if (this.border.length) {
      for (let i = 0; i < this.border.length; i++) {
        const cell1 = this.border[i];
        const cell2 = this.border[this.border.length - 1 - i];
        this.blinkCell(cell1, i);
        this.blinkCell(cell2, i);
      }
      this.border = [];
    }
  }

  animateBlocks() {
    if (this.blocks.length) {
      for (let i = 0; i < this.blocks.length; i++) {
        const cell = this.blocks[i];
        this.blinkCell(cell, i + 20);
      }
      this.blocks = [];
    }
  }

  blinkCell(cell, time) {
    cell.occupied = false;
    cell.static = false;
    setTimeout(() => {
      cell.occupied = true;
      cell.static = true;
    }, time * 15);
  }

  run() {
    // this.checkStats();
    this.actions.updateStats();
    if (!this.gameOver && this.gameStarted) {
      this.actions.showTowerInfo();
      this.checkWave();
      this.sendCreeps();
      this.render();
      if (this.lives <= 0) {
        setTimeout(this.actions.handleGameOver(), 1000);
      }
    }
  }

  render() {
    this.context.clearRect(0, 0, 840, 560);
    // if (this.creeps.length === 0 && !this.sendingWave) {
    this.animatePath();
    // }
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
        const cell = this.grid[c][r];
        if (!cell.selected) cell.run();
      }
    }
    for (let i = 0; i < this.selectedCells.length; i++) {
      this.selectedCells[i].renderImage("selectImg");
    }
    for (let i = 0; i < this.towers.length; i++) {
      const tower = this.towers[i];
      if (!tower.removed) {
        tower.run();
      } else {
        this.towers.splice(i, 1);
        i--;
      }
    }
    for (let i = 0; i < this.creeps.length; i++) {
      const creep = this.creeps[i];
      if (creep.alive) {
        creep.run();
      } else {
        this.creeps.splice(i, 1);
        i--;
      }
    }
    for (let i = 0; i < this.selectedTowers.length; i++) {
      this.selectedTowers[i].drawRange();
    }
    for (let i = 0; i < this.attacks.length; i++) {
      const attack = this.attacks[i];
      this.checkHit(attack);
      if (!attack.hit) {
        attack.run();
      } else {
        this.attacks.splice(i, 1);
        i--;
      }
    }
  }
}
