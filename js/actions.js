"use strict";

export default class ActionsHandler {
  constructor(game, dom, tutorial, tiles) {
    this.game = game;
    this.dom = dom;
    this.tutorial = tutorial;
    this.handleCanvas();
    this.handleButtonClicks();
    this.handleKeyListeners();
    this.handleTileListeners(tiles);
  }

  handleCanvas() {
    this.dom.canvas.addEventListener(
      "mousemove",
      this.handleCanvasMove.bind(this),
      false
    );
    this.dom.canvas.addEventListener(
      "mouseover",
      this.handleCanvasOver.bind(this),
      false
    );
    this.dom.canvas.addEventListener(
      "mouseout",
      this.handleCanvasOut.bind(this),
      false
    );
    this.dom.canvas.addEventListener(
      "click",
      this.handleCanvasClick.bind(this),
      false
    );
    this.dom.canvas.addEventListener(
      "dblclick",
      this.handleCanvasDblClick.bind(this),
      false
    );
  }

  handleCanvasMove(event) {
    this.mouseX = event.offsetX;
    this.mouseY = event.offsetY;
    const towers = this.game.towers;
    if (towers.length < 1) return;
    const tower = towers[towers.length - 1];
    if (!tower.placed && this.game.placingTower === true) {
      tower.location.x = this.mouseX;
      tower.location.y = this.mouseY;
    }
  }

  handleCanvasOver() {
    if (this.game.towers.length < 1) return;
    this.game.towers[this.game.towers.length - 1].visible = true;
  }

  handleCanvasOut() {
    if (this.game.placingTower) {
      this.game.placingTower = false;
      this.game.towers.splice(this.game.towers.length - 1, 1);
    }
  }

  handleCanvasClick(event) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    const col = Math.floor(mouseX / this.game.cellSize);
    const row = Math.floor(mouseY / this.game.cellSize);

    const cell = this.game.grid[col][row];

    this.game.resetSelects();

    if (this.game.placingTower) {
      this.game.checkTowerPlacement(cell);
    } else {
      for (let i = 0; i < this.game.towers.length; i++) {
        let tower = this.game.towers[i];
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

    const gridCol = Math.floor(mouseX / this.game.cellSize);
    const gridRow = Math.floor(mouseY / this.game.cellSize);

    const cell = this.game.grid[gridCol][gridRow];

    this.game.resetSelects();

    for (let i = 0; i < this.game.towers.length; i++) {
      let tower = this.game.towers[i];
      if (
        tower.location.x === cell.center.x &&
        tower.location.y === cell.center.y
      ) {
        this.game.selectAllTowers(tower.type, tower.level);
        return;
      }
    }
  }

  handleButtonClicks() {
    this.dom.wave.addEventListener("click", this.waveClick.bind(this), false);
    this.dom.auto.addEventListener(
      "change",
      this.autoWaveToggle.bind(this),
      false
    );
    this.dom.upgrade.addEventListener(
      "click",
      this.upgradeClick.bind(this),
      false
    );
    this.dom.sell.addEventListener("click", this.sellClick.bind(this), false);
  }

  autoWaveToggle() {
    if (this.checked) {
      this.game.autoWave = true;
    } else {
      this.game.autoWave = false;
    }
  }

  waveClick() {
    if (
      !this.game.sendingWave &&
      this.game.gameStarted &&
      !this.game.gameOver
    ) {
      this.game.wave += 1;
      this.game.sendingWave = true;
      this.game.waveTimer = 400;
      if (this.game.wave === 1) {
        this.dom.waveText.innerText = "Next Wave";
        this.dom.towerMenu.classList.remove("active");
        this.tutorial.showInfo("start");
      }
      this.dom.wave.classList.remove("clickable");
      this.game.nextWave();
    }
  }

  upgradeClick() {
    this.game.selectedTowers.forEach((tower) => {
      if (tower.canUpgrade) {
        if (this.game.bits - tower.upgrade >= 0) {
          this.game.bits -= tower.upgrade;
          this.game.cr -= tower.upgrade;
          tower.handleUpgrade();
        } else {
          this.game.actions.blinkBank();
        }
      }
    });
  }

  sellClick() {
    this.game.selectedTowers.forEach((tower) => {
      tower.deselect(false);
      this.game.bits += tower.upgrade / 2;
      this.game.cr += tower.upgrade / 2;
    });

    this.game.resetSelects();

    this.game.loadPaths();
    for (let c = 0; c < this.game.numCols; c++) {
      for (let r = 0; r < this.game.numRows; r++) {
        this.game.grid[c][r].loadAdjacentCells();
      }
    }

    this.game.path = this.game.getPath();
  }

  handleKeyListeners() {
    document.addEventListener("keydown", (event) => {
      if (event.keyCode === 27) {
        this.game.placingTower = false;
        if (this.game.selectedTowers.length) {
          this.game.resetSelects();
        }
        if (
          this.game.towers.length &&
          !this.game.towers[this.game.towers.length - 1].placed
        ) {
          this.game.towers.splice(this.game.towers.length - 1, 1);
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
        this.tutorial.toggleTutorial();
      } else if (event.keyCode === 72) {
        this.tutorial.toggleHotkeys();
      }
    });
  }

  towerKey(towerNum) {
    this.game.placingTower = false;
    const towers = this.game.towers;
    if (towers.length && !towers[towers.length - 1].placed) {
      towers.pop();
    }
    this.game.tileDivs[towerNum].click();
    const currentTower = towers[towers.length - 1];
    if (!currentTower.placed) {
      currentTower.location = new Vector(
        this.dom.canvas.mouseX,
        this.dom.canvas.mouseY
      );
    }
    currentTower.visible = true;
  }

  handleTileListeners(tiles) {
    for (let i = 0; i < tiles.length; i++) {
      const tileDiv = tiles[i];
      tileDiv.addEventListener(
        "mouseover",
        () => this.tileRollOver(this.game),
        false
      );
      tileDiv.addEventListener(
        "mouseout",
        () => this.tileRollOut(this.game),
        false
      );
      tileDiv.addEventListener(
        "click",
        () => this.tileClicked(this.game),
        false
      );
    }
  }

  tileRollOver(game) {
    game.showTowerDivInfo = this;
  }

  tileRollOut(game) {
    game.showTowerDivInfo = null;
  }

  tileClicked(game) {
    if (game.placingTower === true) {
      if (!game.towers[game.towers.length - 1].placed) {
        game.towers.splice(game.towers.length - 1, 1);
      }
    }
    if (game.bits >= this.cost) {
      game.createTower(this);
      game.currentTileDiv = this;
      game.placingTower = true;
      if (game.selectedTowers) {
        game.resetSelects();
      }
    } else {
      game.actions.blinkBank();
    }
  }

  blinkBank() {
    const bank = this.dom.bank;
    if (!bank.classList.contains("flashing")) {
      bank.classList.add("flashing");
      setTimeout(() => {
        bank.classList.remove("flashing");
      }, 1000);
    }
  }

  showTowerInfo() {
    const tower = this.getTower();
    this.toggleEditButtons(tower);
    if (!tower) return;
    console.log(tower);
    let towerInfoTiles = this.dom.towerStats;

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
        title.innerHTML = "<h5>Speed</h5>";
        value.innerHTML = 2000 - tower.cooldown;
      } else if (i === 4) {
        title.innerHTML = "<h5>Next</h5>";
        if (tower.canUpgrade || this.game.showTowerDivInfo) {
          value.innerHTML = tower.upgrade + "¥";
        } else {
          value.innerHTML = "Max";
        }
      }

      title.appendChild(value);
    }
  }

  getTower() {
    return this.game.showTowerDivInfo
      ? this.game.showTowerDivInfo
      : this.game.selectedTowers[this.game.selectedTowers.length - 1];
  }

  toggleEditButtons(tower) {
    let upChange = this.dom.upgrade.style.opacity;
    let sellChange = this.dom.sell.style.opacity;

    if (tower) {
      this.dom.upgrade.style.opacity = tower.canUpgrade ? 100 : 0;
      this.dom.sell.style.opacity = tower.placed ? 100 : 0;
    } else {
      this.dom.upgrade.style.opacity = 0;
      this.dom.sell.style.opacity = 0;
    }

    if (upChange !== this.dom.upgrade.style.opacity) {
      this.dom.upgrade.classList.toggle("clickable");
    }
    if (sellChange !== this.dom.sell.style.opacity) {
      this.dom.sell.classList.toggle("clickable");
    }
  }

  updateStats() {
    for (let i = 0; i < this.dom.infoTiles.length; i++) {
      let title = this.dom.infoTiles[i];
      const value = document.createElement("p");

      if (title.innerHTML.includes("Bank")) {
        title.innerHTML = "<h4>Bank</h4> <br/>";
        value.innerHTML = this.game.bits + "¥";
      } else if (title.innerHTML.includes("Lives")) {
        title.innerHTML = "<h4>Lives</h4> <br/>";
        value.innerHTML = this.game.lives;
      } else if (title.innerHTML.includes("Score")) {
        title.innerHTML = "<h4>Score</h4> <br/>";
        value.innerHTML = this.game.score;
      } else if (title.innerHTML.includes("Wave")) {
        title.innerHTML = "<h4>Wave</h4> <br/>";
        value.innerHTML = this.game.wave;
      }
      title.appendChild(value);
    }
  }

  handleGameOver() {
    this.game.gameOver = true;
    this.game.context.fillStyle = "rgba(125, 125, 125, 0.6)";
    this.game.context.fillRect(0, 0, 840, 560);
    this.dom.gameOver.style.opacity = 100;
    this.dom.gameOver.style.width = "100%";
    this.dom.gameOver.style.height = "100%";
    this.dom.overTitle.style.display = "inline-block";
    const highscores = firebase
      .database()
      .ref("scores")
      .orderByChild("score")
      .limitToLast(10);
    this.game.f = this.game.score;
    let score = window.localStorage.getItem("score");
    if ((score && score < this.game.f) || !score) {
      score = this.game.f;
      window.localStorage.setItem("score", this.game.f);
    }
    this.dom.final.innerHTML = `Final Score: ${this.game.f}`;
    this.dom.local.innerHTML = `Local Highest: ${score}`;
    setTimeout(() => {
      this.dom.holder.style.opacity = 0;
      this.dom.gameOver.style.top = "15%";
      this.dom.overTitle.style.color = "rgb(171, 171, 171)";
      this.dom.terminal.style.display = "flex";
      this.dom.canvas.style.backgroundColor = "";
      this.dom.this.tutorial.style.opacity = 0;
      this.dom.topBar.style.opacity = 0;
      this.dom.bottomBar.style.opacity = 0;
      setTimeout(() => {
        this.dom.terminal.style.opacity = 100;
        scores.handleScores(highscores);
        setTimeout(() => {
          this.game.context.clearRect(0, 0, 840, 560);
        }, 1000);
      }, 1000);
    }, 1000);
  }

  newGame() {
    this.dom.gameOver.style.opacity = 0;
    this.dom.gameOver.style.width = "0px";
    this.dom.gameOver.style.height = "0px";
    this.dom.overTitle.style.display = "none";
    this.dom.terminal.style.display = "none";
    this.dom.holder.style.opacity = 100;
    this.dom.footer.style.opacity = 100;
    this.dom.gameOver.style.top = "40%";
    this.dom.progress.style.width = "0%";
    this.dom.terminal.removeChild(this.dom.terminal.lastChild);
    while (this.dom.scores.firstChild) {
      this.dom.scores.removeChild(this.dom.scores.lastChild);
    }
    while (this.dom.towerMenu.firstChild) {
      this.dom.towerMenu.removeChild(this.dom.towerMenu.lastChild);
    }
    this.dom.auto.checked = false;
    this.dom.waveText.innerText = "First Wave";
    this.dom.wave.classList.remove("active");
    this.dom.topBar.style.opacity = 0;
    this.dom.bottomBar.style.opacity = 0;
    this.dom.play.style.display = "";
    this.dom.startText.style.display = "flex";
    if (this.dom.tutorialOpen) {
      this.tutorial.toggleTutorial();
    }
    if (this.dom.hotkeysOpen) {
      this.tutorial.toggleHotkeys();
    }
    this.game = new Game();
  }
}
