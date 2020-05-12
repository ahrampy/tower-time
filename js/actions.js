"use strict";

class ActionsHandler {
  constructor(tiles) {
    this.canvas = dom.canvas;
    this.handleCanvas();
    this.handleButtonClicks();
    this.handleKeyListeners();
    this.handleTileListeners(tiles);
  }

  handleCanvas() {
    this.canvas.addEventListener("mousemove", this.handleCanvasMove, false);
    this.canvas.addEventListener("mouseover", this.handleCanvasOver, false);
    this.canvas.addEventListener("mouseout", this.handleCanvasOut, false);
    this.canvas.addEventListener("click", this.handleCanvasClick, false);
    this.canvas.addEventListener("dblclick", this.handleCanvasDblClick, false);
  }

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

    const col = Math.floor(mouseX / game.cellSize);
    const row = Math.floor(mouseY / game.cellSize);

    const cell = game.grid[col][row];

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

  handleButtonClicks() {
    dom.wave.addEventListener("click", this.waveClick, false);
    dom.auto.addEventListener("change", this.autoWaveToggle, false);
    dom.upgrade.addEventListener("click", this.upgradeClick, false);
    dom.sell.addEventListener("click", this.sellClick, false);
  }

  autoWaveToggle() {
    if (this.checked) {
      game.autoWave = true;
    } else {
      game.autoWave = false;
    }
  }

  waveClick() {
    if (game.gameStarted && !game.gameOver) {
      game.wave += 1;
      if (game.wave === 1) {
        this.innerText = "Next Wave";
        dom.towerMenu.classList.remove("active");
        game.tutorial.showInfo("start");
      }
      game.nextWave();
    }
  }

  upgradeClick() {
    game.towersArr.forEach((tower) => {
      if (tower.canUpgrade) {
        if (game.bits - tower.upgrade >= 0) {
          game.bits -= tower.upgrade;
          game.cr -= tower.upgrade;
          tower.handleUpgrade();
        } else {
          game.actions.blinkBank();
        }
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
        game.tutorial.toggleInfo();
      }
    });
  }

  towerKey(towerNum) {
    game.placingTower = false;
    const towers = game.towers;
    if (towers.length && !towers[towers.length - 1].placed) {
      towers.splice(towers.length - 1, 1);
    }
    game.tileDivs[towerNum].click();
    const currentTower = towers[towers.length - 1];
    if (currentTower.location.x === 0 && currentTower.location.y === 0) {
      currentTower.location = new Vector(
        game.canvas.mouseX,
        game.canvas.mouseY
      );
    }
    currentTower.visible = true;
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
      game.actions.blinkBank();
    }
  }

  blinkBank() {
    const bank = dom.bank;
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

    let towerInfoTiles = dom.towerStats;

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
        if (tower.canUpgrade || game.showTowerDivInfo) {
          value.innerHTML = tower.upgrade + "¥";
        } else {
          value.innerHTML = "Max";
        }
      }

      title.appendChild(value);
    }
  }

  getTower() {
    return game.showTowerDivInfo
      ? game.showTowerDivInfo
      : game.towersArr[game.towersArr.length - 1];
  }

  toggleEditButtons(tower) {
    if (tower) {
      dom.upgrade.style.opacity = tower.canUpgrade ? 100 : 0;
      dom.sell.style.opacity = tower.placed ? 100 : 0;
    } else {
      dom.upgrade.style.opacity = 0;
      dom.sell.style.opacity = 0;
    }
  }

  updateStats() {
    for (let i = 0; i < dom.infoTiles.length; i++) {
      let title = dom.infoTiles[i];
      const value = document.createElement("p");

      if (title.innerHTML.includes("Bank")) {
        title.innerHTML = "<h4>Bank</h4> <br/>";
        value.innerHTML = game.bits + "¥";
      } else if (title.innerHTML.includes("Lives")) {
        title.innerHTML = "<h4>Lives</h4> <br/>";
        value.innerHTML = game.lives;
      } else if (title.innerHTML.includes("Score")) {
        title.innerHTML = "<h4>Score</h4> <br/>";
        value.innerHTML = game.score;
      } else if (title.innerHTML.includes("Wave")) {
        title.innerHTML = "<h4>Wave</h4> <br/>";
        value.innerHTML = game.wave;
      }
      title.appendChild(value);
    }
  }

  handleGameOver() {
    game.gameOver = true;
    game.context.fillStyle = "rgba(125, 125, 125, 0.6)";
    game.context.fillRect(0, 0, 840, 560);
    dom.gameOver.style.display = "flex";
    dom.wave.style.opacity = 0;
    dom.wave.removeEventListener("click", game.waveClick, false);
    dom.tutorial.style.opacity = 0;
    const highscores = firebase
      .database()
      .ref("scores")
      .orderByChild("score")
      .limitToLast(10);
    setTimeout(() => {
      game.canvas.classList.add("over");
    }, 3000);
    game.f = game.score;
    setTimeout(() => {
      const gameOverScreen = document.createElement("div");
      gameOverScreen.classList.add("game-over");
      dom.wrapper.replaceChild(gameOverScreen, game.canvas);
      dom.gameOver.style.opacity = 0;
      setTimeout(() => {
        gameOverScreen.classList.add("scores");
        dom.gameOver.style.display = "none";
        setTimeout(() => {
          dom.wave.innerText = "New Game";
          dom.wave.addEventListener("click", game.actions.newGame, false);
          dom.wave.classList.add("active");
          dom.wave.style.opacity = 100;
          dom.gameOver.style.opacity = 100;
          game.scores.handleScores(gameOverScreen, highscores);
        }, 500);
      }, 500);
    }, 5000);
  }

  newGame() {
    const gameOverScreen = document.querySelector(".game-over");
    dom.canvas = document.createElement("canvas");
    dom.wave.removeEventListener("click", game.actions.newGame, false);
    dom.canvas.width = 840;
    dom.canvas.height = 560;
    dom.wrapper.replaceChild(dom.canvas, gameOverScreen);
    dom.auto.checked = false;
    while (dom.towerMenu.firstChild) {
      dom.towerMenu.removeChild(dom.towerMenu.lastChild);
    }
    dom.wave.innerText = "First Wave";
    dom.wave.classList.remove("active");
    dom.topBar.style.opacity = 0;
    dom.bottomBar.style.opacity = 0;
    dom.play.style.display = "";
    dom.startText.style.display = "flex";
    game = new Game();
  }
}
