"use strict";

window.addEventListener("load", init, false);

var game;
var tutorial;
var scores;

function init() {
  game = new Game();
  tutorial = new Tutorial();
  scores = new Scores();
  window.setTimeout(animate, 100);
}

function animate() {
  game.run();
  window.requestAnimationFrame(animate);
}

class Game {
  constructor() {
    // * add canvas
    this.canvas = document.querySelector("canvas");
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
    this.gameOver = false;

    // * grid specs
    this.numBlocks = 35;
    this.cellSize = this.mobile ? 20 : 40;
    this.numCols = 20;
    this.numRows = 13;
    this.start = null;
    this.goal = null;

    // * pathing
    this.validated = false;
    this.loadGrid();
    this.loadPaths();

    // * track towers
    this.showTowerDivInfo = null;
    this.placingTower = false;
    this.towersArr = [];

    // * track cells
    this.cellsArr = [];

    // * increase difficulty
    this.multiplier = 1;
    this.creepHealth = this.wave * 400 * this.multiplier;

    // * auto wave
    this.autoWave = false;
    this.sendingWave = false;

    // * canvas handlers
    this.canvas.addEventListener("mousemove", this.handleCanvasMove, false);
    this.canvas.addEventListener("mouseover", this.handleCanvasOver, false);
    this.canvas.addEventListener("mouseout", this.handleCanvasOut, false);
    this.canvas.addEventListener("click", this.handleCanvasClick, false);
    this.canvas.addEventListener("dblclick", this.handleCanvasDblClick, false);

    // * load buttons
    this.waveButton = document.querySelector("#wave-button");
    this.tileDivs = this.createTiles();
    this.handleTileListeners(this.tileDivs);
    this.handleButtonClicks();
    this.handleKeyListeners();

    // * music
    // this.handleSoundButton();
    // this.muted = false;

    // * trackers
    this.cr = 220;
    this.c = 0;
    this.f;

    // * init
    this.handleGameStart();
    this.gameStarted = false;
  }

  handleButtonClicks() {
    const upgradeButton = document.querySelector("#upgrade-button");
    const sellButton = document.querySelector("#sell-button");
    const autoWave = document.querySelector("input[name=auto-wave]");
    this.waveButton.addEventListener("click", this.waveClick, false);
    upgradeButton.addEventListener("click", this.upgradeClick, false);
    sellButton.addEventListener("click", this.sellClick, false);
    autoWave.addEventListener("change", this.autoWaveToggle, false);
  }

  waveClick() {
    game.wave += 1;
    if (game.wave === 1) {
      this.innerText = "Next Wave";
      document.querySelector("#towers").classList.remove("active");
      tutorial.showInfo("start");
    }
    game.nextWave();
  }

  nextWave() {
    game.cr -= game.bits;
    game.bits = Math.ceil(game.bits / 5) * 5;
    game.cr += game.bits;
    if (game.wave % 10 === 0) {
      game.multiplier += 0.5;
    }
    if (game.wave % 30 === 0) {
      game.multiplier += 0.5;
    }
    game.creepHealth = game.wave * 400 * game.multiplier;
    game.bits += 5 * game.wave;
    game.cr += 5 * game.wave;
    game.loadCreeps(20);
  }

  upgradeClick() {
    game.towersArr.forEach((tower, i) => {
      if (tower.canUpgrade && game.bits - tower.upgrade >= 0) {
        game.bits -= tower.upgrade;
        game.cr -= tower.upgrade;
        tower.handleUpgrade();
      }
    });
  }

  sellClick() {
    if (game.towersArr.length) {
      game.towersArr.forEach((tower) => {
        tower.deselect(false);
        game.bits += tower.upgrade / 2;
        game.cr += tower.upgrade / 2;
      });

      game.resetSelects();

      game.loadPaths();
      for (let c = 0; c < game.numCols; c++) {
        for (let r = 0; r < game.numRows; r++) {
          game.grid[c][r].loadAdjacentCells();
        }
      }
    }
  }

  autoWaveToggle() {
    if (this.checked) {
      game.autoWave = true;
    } else {
      game.autoWave = false;
    }
  }

  handleKeyListeners() {
    document.addEventListener("keydown", (event) => {
      if (event.keyCode === 27) {
        game.placingTower = false;
        if (game.towersArr.length) {
          game.resetSelects();
        }
        if (game.towers.length && !game.towers[game.towers.length - 1].placed) {
          game.towers.splice(game.towers.length - 1, 1);
        }
      } else if (event.keyCode === 49) {
        this.towerKey(0);
      } else if (event.keyCode === 50) {
        this.towerKey(1);
      } else if (event.keyCode === 51) {
        this.towerKey(2);
      } else if (event.keyCode === 52) {
        this.towerKey(3);
      } else if (event.keyCode === 83) {
        this.sellClick();
      } else if (event.keyCode === 81) {
        this.upgradeClick();
      } else if (event.keyCode === 73) {
        tutorial.toggleInfo();
      }
    });
  }

  towerKey(towerNum) {
    game.placingTower = false;
    const towers = game.towers;
    if (towers.length && !towers[towers.length - 1].placed) {
      towers.splice(towers.length - 1, 1);
    }
    this.tileDivs[towerNum].click();
    const currentTower = towers[towers.length - 1];
    if (currentTower.location.x === 0 && currentTower.location.y === 0) {
      currentTower.location = new Vector(
        game.canvas.mouseX,
        game.canvas.mouseY
      );
    }
    currentTower.visible = true;
  }

  // handleSoundButton() {
  //   const muteButton = document.querySelector("#mute-button");
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

  handleCanvasMove(event) {
    this.mouseX = event.offsetX;
    this.mouseY = event.offsetY;
    const towers = game.towers;
    if (towers.length < 1) return;
    const tower = towers[towers.length - 1];
    if (!tower.placed && game.placingTower === true) {
      tower.location.x = this.mouseX;
      tower.location.y = this.mouseY;
    }
  }

  handleCanvasOver() {
    if (game.towers.length < 1) return;
    game.towers[game.towers.length - 1].visible = true;
  }

  handleCanvasOut() {
    if (game.placingTower) {
      game.placingTower = false;
      game.towers.splice(game.towers.length - 1, 1);
    }
  }

  handleCanvasClick(event) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    const gridCol = Math.floor(mouseX / game.cellSize);
    const gridRow = Math.floor(mouseY / game.cellSize);

    const cell = game.grid[gridCol][gridRow];

    game.resetSelects();

    if (game.placingTower) {
      game.checkTowerPlacement(cell);
    } else {
      for (let i = 0; i < game.towers.length; i++) {
        let tower = game.towers[i];
        if (
          tower.location.x === cell.center.x &&
          tower.location.y === cell.center.y
        ) {
          if (tower.selected) {
            tower.deselect(true);
          } else {
            tower.select();
          }
        } else {
          tower.selected = false;
        }
      }
    }
  }

  handleCanvasDblClick(event) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    const gridCol = Math.floor(mouseX / game.cellSize);
    const gridRow = Math.floor(mouseY / game.cellSize);

    const cell = game.grid[gridCol][gridRow];

    for (let i = 0; i < game.towers.length; i++) {
      let tower = game.towers[i];
      if (
        tower.location.x === cell.center.x &&
        tower.location.y === cell.center.y
      ) {
        game.selectAllTowers(tower.type, tower.level);
        return;
      }
    }
  }

  handleTileListeners(tiles) {
    for (let i = 0; i < tiles.length; i++) {
      const tileDiv = tiles[i];
      tileDiv.addEventListener("mouseover", this.tileRollOver, false);
      tileDiv.addEventListener("mouseout", this.tileRollOut, false);
      tileDiv.addEventListener("click", this.tileClicked, false);
    }
  }

  tileRollOver() {
    game.showTowerDivInfo = this;
  }

  tileRollOut() {
    game.showTowerDivInfo = null;
  }

  tileClicked() {
    if (game.placingTower === true) {
      if (!game.towers[game.towers.length - 1].placed) {
        game.towers.splice(game.towers.length - 1, 1);
      }
    }
    if (game.bits >= this.cost) {
      game.createTower(this);
      game.currentTileDiv = this;
      game.placingTower = true;
      if (game.towersArr) {
        game.resetSelects();
      }
    } else {
      const bank = document.querySelector("#info-bits");
      if (!bank.classList.contains("flashing")) {
        bank.classList.add("flashing");
        setTimeout(() => {
          bank.classList.remove("flashing");
        }, 1000);
      }
    }
  }

  checkTowerPlacement(cell) {
    if (!cell.occupied && cell !== game.goal && cell !== game.start) {
      cell.occupied = true;
      game.loadPaths();

      if (this.checkPaths() && this.checkRoute()) {
        game.placeTower(cell);
      } else {
        cell.cancel();
        game.loadPaths();
      }
    }
  }

  checkPaths() {
    return game.creeps.every((creep) => {
      const route = [creep.currentCell];
      while (route.length) {
        const currCell = route.pop();
        if (currCell) {
          if (currCell.value === -1) {
            continue;
          } else if (currCell === game.goal) {
            return true;
          }
          route.push(currCell.smallestAdjacent);
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
        continue;
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
      let tileDiv = this.getTowerStats(i);
      let imgPath, attackImgPath;

      imgPath = this.makeUrl(tileDiv.type, false, 1);
      attackImgPath = this.makeUrl(tileDiv.type, true, 1);

      tileDiv.tileDivImg = new Image();
      tileDiv.tileDivImg.src = imgPath;

      tileDiv.atkImg = new Image();
      tileDiv.atkImg.src = attackImgPath;

      document.querySelector("#towers").appendChild(tileDiv);
      tileDivs.push(tileDiv);

      const tileImg = new Image();
      tileImg.src = imgPath;
      tileDiv.appendChild(tileImg);

      const towerName = document.createElement("p");
      towerName.innerText = `${tileDiv.cost} ¥`;
      tileDiv.appendChild(towerName);
    }
    return tileDivs;
  }

  makeUrl(name, atk, lvl) {
    return `images/towers/${name}/${name}-tower-${atk ? "atk-" : ""}${lvl}.png`;
  }

  getTowerStats(i) {
    const div = document.createElement("div");
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
      div.cooldown = 300;
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
      div.cooldown = 2000;
      div.damage = 120;
      div.speed = 16;
    }
    return div;
  }

  createTower(tileDiv) {
    const tower = new Tower(
      game.context,
      tileDiv.cost,
      tileDiv.upgrade,
      tileDiv.tileDivImg,
      tileDiv.atkImg,
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

  updateInfo() {
    let infoTiles = document.querySelectorAll("#info > .info-tile");
    for (let i = 0; i < infoTiles.length; i++) {
      let title = infoTiles[i];
      const value = document.createElement("p");

      if (title.innerHTML.includes("Bank")) {
        title.innerHTML = "<h4>Bank</h4> <br/>";
        value.innerHTML = this.bits + "	¥";
      } else if (title.innerHTML.includes("Lives")) {
        title.innerHTML = "<h4>Lives</h4> <br/>";
        value.innerHTML = this.lives;
      } else if (title.innerHTML.includes("Score")) {
        title.innerHTML = "<h4>Score</h4> <br/>";
        value.innerHTML = this.score;
      } else if (title.innerHTML.includes("Wave")) {
        title.innerHTML = "<h4>Wave</h4> <br/>";
        value.innerHTML = this.wave;
      } else if (title.innerHTML.includes("Enemy")) {
        title.innerHTML = "<h4>Enemy</h4> <br/>";
        value.innerHTML = this.creepHealth;
      }
      title.appendChild(value);
    }
  }

  showTowerInfo() {
    let tower, div, obj;

    if (game.showTowerDivInfo) {
      tower = game.showTowerDivInfo;
      div = true;
    } else if (game.towersArr.length) {
      tower = game.towersArr[game.towersArr.length - 1];
      obj = true;
    }

    let towerEditButtons = document.querySelectorAll(
      "#edit-tower-buttons > .edit-button"
    );

    if (obj) {
      towerEditButtons[0].style.opacity = tower.canUpgrade ? 100 : 0;
      towerEditButtons[1].style.opacity = 100;
    } else {
      towerEditButtons[0].style.opacity = 0;
      towerEditButtons[1].style.opacity = 0;
    }

    if (!tower) return;

    let towerInfoTiles = document.querySelectorAll(
      "#tower-details > .detail-tile"
    );

    for (let i = 0; i < towerInfoTiles.length; i++) {
      const title = towerInfoTiles[i];
      const value = document.createElement("p");

      if (i === 0) {
        title.innerHTML = "<h5>Type</h5>";
        value.innerHTML = tower.type.toUpperCase();
      } else if (i === 1) {
        title.innerHTML = "<h5>Damage</h5>";
        value.innerHTML = tower.damage;
      } else if (i === 2) {
        title.innerHTML = "<h5>Range</h5>";
        value.innerHTML = tower.range;
      } else if (i === 3) {
        title.innerHTML = "<h5>Cooldown</h5>";
        value.innerHTML = tower.cooldown;
      } else if (i === 4) {
        title.innerHTML = "<h5>Next</h5>";
        if (tower.canUpgrade || game.showTowerDivInfo) {
          value.innerHTML = tower.upgrade + " ¥";
        } else {
          value.innerHTML = "Max";
        }
      }

      title.appendChild(value);
    }
  }

  loadGrid() {
    let id = 0;

    for (let c = 0; c < this.numCols; c++) {
      this.grid.push([]);
      for (let r = 0; r < this.numRows; r++) {
        const wallImg = new Image();
        wallImg.src = "/images/wall.png";
        const selectImg = new Image();
        selectImg.src = "/images/wall-selected.png";
        this.grid[c].push(
          new Cell(
            id++,
            this.grid,
            this.cellSize,
            this.context,
            wallImg,
            selectImg,
            c,
            r
          )
        );
      }
    }
    this.initPosts();
    this.initBlocks();
  }

  initPosts() {
    this.start = this.grid[Math.ceil(Math.random() * 2)][
      Math.ceil(Math.random() * 10)
    ];
    const startImg = new Image();
    startImg.src = "/images/start.png";
    this.start.img = startImg;
    this.start.static = true;
    this.goal = this.grid[Math.ceil(Math.random() * 3) + 15][
      Math.ceil(Math.random() * 10) + 1
    ];
    this.goal.value = 0;
    const goalImg = new Image();
    goalImg.src = "/images/goal.png";
    this.goal.img = goalImg;
    this.goal.static = true;
  }

  initBlocks() {
    this.resetBlocks();
    for (let i = 0; i < this.numBlocks; i++) {
      const randRow = Math.floor(Math.random() * 18) + 1;
      const randCol = Math.floor(Math.random() * 11) + 1;
      const cell = this.grid[randRow][randCol];
      if (cell !== this.start && cell !== this.goal && !cell.occupied) {
        cell.occupied = true;
      } else {
        i--;
      }
    }
  }

  resetBlocks() {
    for (let c = 0; c < this.numCols; c++) {
      for (let r = 0; r < this.numRows; r++) {
        const cell = this.grid[c][r];
        cell.occupied = false;
      }
    }
  }

  loadPaths() {
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

  ensureValidMap() {
    let checkBlock = false;

    for (let c = 0; c < this.numCols; c++) {
      for (let r = 0; r < this.numRows; r++)
        if (this.grid[c][r].value === -1 && !this.grid[c][r].occupied) {
          checkBlock = true;
        }
    }

    if (checkBlock) {
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
      const creep = new Creep(location, this.multiplier);
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
      game.waveButton.click();
      game.sendingWave = true;
      setTimeout(() => {
        game.sendingWave = false;
      }, 1000);
    }
    if (!game.creeps.length && !game.sendingWave && game.wave > 0) {
      game.waveButton.classList.add("active");
    } else {
      game.waveButton.classList.remove("active");
    }
    if (game.wave === 0 && game.bits < 50) {
      document.querySelector("#towers").classList.remove("active");
      document.querySelector("#info-bits").classList.remove("active");
      game.waveButton.classList.add("active");
      tutorial.showInfo("canvas");
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

  handleGameStart() {
    const towerEditButtons = document.querySelectorAll(
      "#edit-tower-buttons > .edit-button"
    );
    towerEditButtons[0].style.opacity = 0;
    towerEditButtons[1].style.opacity = 0;
    this.context.textAlign = "center";
    const title = new Image();
    title.src = "images/splash/tower-time-title.png";
    title.onload = () =>
      this.context.drawImage(
        title,
        this.canvas.width / 2 - title.width / 2,
        30
      );
    this.addPlayButton();
    this.context.font = "27px Trebuchet MS";
    this.context.fillStyle = "#333";
    this.context.font = "18px Trebuchet MS";
    this.context.fillStyle = "rgba(68, 74, 110, 1)";
    this.context.font = "25px Trebuchet MS";
    this.context.fillStyle = "#333";
    this.context.fillText("Tower Abilities", 400, 340);
    this.context.font = "15px Trebuchet MS";
    this.context.fillStyle = "rgba(68, 74, 110, 1)";
    this.context.fillText(
      "Earth: None     Water: Slows Enemies     Fire: Fast Attack     Air: Through Attack",
      400,
      370
    );
    this.context.font = "25px Trebuchet MS";
    this.context.fillStyle = "#333";
    this.context.fillText("Optional Hotkeys", 400, 425);
    this.context.font = "15px Trebuchet MS";
    this.context.fillStyle = "rgba(68, 74, 110, 1)";
    this.context.fillText(
      "Earth: 1    Water: 2    Fire: 3    Air: 4    Upgrade: Q    Sell: S    Deselect: Esc    Toggle Info: I",
      400,
      455
    );
    this.context.fillText("hover over anything to get tooltips", 400, 500);
  }

  addPlayButton() {
    const playButton = document.querySelector("#play-button");
    playButton.style.backgroundImage =
      "url('../images/splash/play-button.png')";
    playButton.addEventListener("mouseover", () => {
      playButton.style.backgroundImage =
        "url('../images/splash/play-button-hover.png')";
    });
    playButton.addEventListener("mouseout", () => {
      playButton.style.backgroundImage =
        "url('../images/splash/play-button.png')";
    });
    playButton.addEventListener("mousedown", () => {
      playButton.style.backgroundImage =
        "url('../images/splash/play-button-pressed.png')";
    });
    playButton.addEventListener("mouseup", () => {
      playButton.style.backgroundImage =
        "url('../images/splash/play-button-hover.png')";
    });
    playButton.addEventListener("click", (e) => {
      e.preventDefault();
      playButton.style.backgroundImage =
        "url('../images/splash/play-button-hover.png')";
      setTimeout(() => this.handleStart(playButton), 300);
    });
  }

  handleStart(playButton) {
    playButton.style.display = "none";
    game.gameStarted = true;
    game.handleGameStart();
    game.run();
    document.querySelector("canvas").style.backgroundColor =
      "rgba(187, 186, 186, 0.8)";
    document.querySelector("#towers").classList.add("active");
    document.querySelector("#game-controls").style.opacity = 100;
    document.querySelector("#content-box").style.opacity = 100;
    document.querySelector("#tutorial-window").style.opacity = 100;
  }

  handleGameOver() {
    game.waveButton.style.opacity = 0;
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
      document
        .querySelector("#canvas-wrapper")
        .replaceChild(gameOverScreen, this.canvas);
      setTimeout(() => {
        gameOverScreen.classList.add("scores");
        setTimeout(() => {
          game.waveButton.style.opacity = 100;
          scores.handleScores(gameOverScreen, highscores);
        }, 500);
      }, 500);
    }, 5000);

    this.context.fillStyle = "rgba(125, 125, 125, 0.7)";
    this.context.fillRect(0, 0, 800, 520);
    this.context.font = "100px Trebuchet MS";
    this.context.fillStyle = "#333";
    this.context.textAlign = "center";
    this.context.fillText("Game Over", 400, 210);
    this.context.font = "40px Trebuchet MS";
    this.context.fillStyle = "#333";
    this.context.textAlign = "center";
    this.context.fillText(`Final Score: ${this.score}`, 400, 280);
    this.context.font = "25px Trebuchet MS";
    // this.lives = 0;
    this.gameOver = true;
    this.waveButton.innerText = "New Game";
    this.waveButton.addEventListener("click", this.newGame, false);
    this.waveButton.classList.add("active");
    tutorial.showInfo("game-over");
  }

  newGame() {
    const gameOverScreen = document.querySelector(".game-over");
    const newCanvas = document.createElement("canvas");
    const playButton = document.querySelector("#play-button");
    const waveButton = document.querySelector("#wave-button");
    const autoWaveButton = document.querySelector("input[name=auto-wave]");
    const towers = document.querySelector("#towers");
    waveButton.removeEventListener("click", game.newGame, false);
    autoWaveButton.checked = false;
    newCanvas.width = 800;
    newCanvas.height = 520;
    document
      .querySelector("#canvas-wrapper")
      .replaceChild(newCanvas, gameOverScreen);
    while (towers.firstChild) {
      towers.removeChild(towers.lastChild);
    }
    waveButton.innerText = "First Wave";
    waveButton.classList.remove("active");
    document.querySelector("#game-controls").style.opacity = 0;
    document.querySelector("#content-box").style.opacity = 0;
    document.querySelector("#tutorial-window").style.opacity = 0;
    playButton.style.display = "";
    game = new Game();
  }

  run() {
    this.updateInfo();
    this.checkStats();

    if (!this.gameOver && this.gameStarted) {
      this.render();
      this.showTowerInfo();
      this.checkWave();
      this.sendCreeps();
      for (let c = 0; c < this.numCols; c++) {
        for (let r = 0; r < this.numRows; r++) this.grid[c][r].run();
      }
      for (let i = 0; i < this.cellsArr.length; i++) {
        this.cellsArr[i].run();
      }
      for (let i = 0; i < this.towers.length; i++) {
        let tower = this.towers[i];
        if (!tower.removed) {
          tower.run();
        } else {
          this.towers.splice(i, 1);
        }
      }
      for (let i = 0; i < this.towersArr.length; i++) {
        this.towersArr[i].run();
      }
      for (let i = 0; i < this.creeps.length; i++) {
        let creep = this.creeps[i];
        if (creep.alive) {
          creep.run();
        } else {
          this.creeps.splice(i, 1);
        }
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
    this.context.clearRect(0, 0, 800, 520);
  }
}
