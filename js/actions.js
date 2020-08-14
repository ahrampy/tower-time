import Vector from "./vector";

export default class Actions {
  constructor(game, dom, tutorial, tiles) {
    this.game = game;
    this.dom = dom;
    this.tutorial = tutorial;
    this.scores = null;
    this.mouseX;
    this.mouseY;
    this.handleCanvas();
    this.handleButtonClicks();
    this.handleKeyListeners();
    this.handleTileListeners(tiles);

    this.towerInfo = null;
  }

  handleCanvas() {
    this.dom.canvas.addEventListener(
      "mousemove",
      this.handleCanvasMove.bind(this)
    );
    this.dom.canvas.addEventListener(
      "mouseover",
      this.handleCanvasOver.bind(this)
    );
    this.dom.canvas.addEventListener(
      "mouseout",
      this.handleCanvasOut.bind(this)
    );
    this.dom.canvas.addEventListener(
      "click",
      this.handleCanvasClick.bind(this)
    );
    this.dom.canvas.addEventListener(
      "dblclick",
      this.handleCanvasDblClick.bind(this)
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

  handleCanvasClick() {
    const col = Math.floor(this.mouseX / this.game.cellSize);
    const row = Math.floor(this.mouseY / this.game.cellSize);

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

  handleCanvasDblClick() {
    const gridCol = Math.floor(this.mouseX / this.game.cellSize);
    const gridRow = Math.floor(this.mouseY / this.game.cellSize);

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
    this.dom.audio.addEventListener("click", this.audioClick.bind(this));
    this.dom.wave.addEventListener("click", this.waveClick.bind(this));
    this.dom.upgrade.addEventListener("click", this.upgradeClick.bind(this));
    this.dom.sell.addEventListener("click", this.sellClick.bind(this));
    this.dom.auto.addEventListener("change", (e) =>
      this.autoWaveToggle(e, this.game)
    );
  }

  audioClick() {
    if (this.game.muted) {
      this.game.muted = false;
      this.game.sound.play();
      this.dom.audioImg.style.filter = "invert(70%)";
    } else {
      this.game.muted = true;
      this.game.sound.pause();
      this.dom.audioImg.style.filter = "invert(20%)";
    }
  }

  autoWaveToggle(e, game) {
    if (e.currentTarget.checked) {
      game.autoWave = true;
    } else {
      game.autoWave = false;
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
      currentTower.location = new Vector(this.mouseX, this.mouseY);
    }
    currentTower.visible = true;
  }

  handleTileListeners(tiles) {
    for (let i = 0; i < tiles.length; i++) {
      const tileDiv = tiles[i];
      tileDiv.addEventListener(
        "mouseover",
        (e) => this.tileRollOver(e, this.game),
        false
      );
      tileDiv.addEventListener(
        "mouseout",
        (e) => this.tileRollOut(e, this.game),
        false
      );
      tileDiv.addEventListener(
        "click",
        (e) => this.tileClicked(e, this.game),
        false
      );
    }
  }

  tileRollOver(e, game) {
    game.showTowerDivInfo = e.currentTarget;
  }

  tileRollOut(e, game) {
    game.showTowerDivInfo = null;
  }

  tileClicked(e, game) {
    const towerDiv = e.currentTarget;
    if (game.placingTower === true) {
      if (!game.towers[game.towers.length - 1].placed) {
        game.towers.splice(game.towers.length - 1, 1);
      }
    }
    if (game.bits >= towerDiv.cost) {
      game.createTower(towerDiv);
      game.currentTileDiv = towerDiv;
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
    if (!tower || tower === this.tower) return;
    this.tower = tower;
    this.dom.typeP.innerHTML = tower.type.toUpperCase();
    this.dom.damageP.innerHTML = tower.damage;
    this.dom.rangeP.innerHTML = tower.range;
    this.dom.speedP.innerHTML = 2000 - tower.cooldown;
    if (tower.canUpgrade || this.game.showTowerDivInfo) {
      this.dom.nextP.innerHTML = tower.upgrade + "¥";
    } else {
      this.dom.nextP.innerHTML = "Max";
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
    this.game.sound.stop();
    // this.game.sound.off();
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
      this.dom.tutorial.style.opacity = 0;
      this.dom.topBar.style.opacity = 0;
      this.dom.bottomBar.style.opacity = 0;
      setTimeout(() => {
        this.dom.terminal.style.opacity = 100;
        this.scores.handleScores(highscores);
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
    this.init();
  }
}
