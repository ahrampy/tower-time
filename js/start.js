"use strict";

window.addEventListener("load", init(), false);

var loader;
var tt;
var tutorial;
var scores;

function init() {
  window.setTimeout(() => {
    tt = new Game();
    loader = new Loader();
    tutorial = new Tutorial();
    scores = new Scores();
    window.setTimeout(animate, 100);
  }, 300);
}

function animate() {
  tt.run();
  window.requestAnimationFrame(animate);
}

class Loader {
  constructor() {

    // splash screen
    this.addSplash;
    this.addPlayButton;

    // canvas handlers
    this.canvas = document.querySelector("#game-canvas");
    this.canvas.addEventListener(
      "mousemove",
      this.handleCanvasMouseMoved,
      false
    );
    this.canvas.addEventListener(
      "mouseover",
      this.handleCanvasMouseOver,
      false
    );
    this.canvas.addEventListener("mouseout", this.handleCanvasMouseOut, false);
    this.canvas.addEventListener("click", this.handleCanvasMouseClicked, false);
    this.canvas.addEventListener(
      "dblclick",
      this.handleCanvasMouseDoubleClicked,
      false
    );
    this.context = this.canvas.getContext("2d");

    // load buttons
    this.waveButton = document.querySelector("#wave-button");
    this.tileDivs = this.createTiles();
    this.handleTileCallbacks(this.tileDivs);
    this.handleEditClicks();
    this.handleKeyCallbacks();

    //start game
    tt.run();
  }

  addSplash() {
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
      "Earth: 1    Water: 2    Fire: 3    Air: 4    Upgrade: Q    Sell: S    Deselect: Esc",
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
      setTimeout(() => this.removeTitleScreen(playButton), 350);
    });
  }

  removeTitleScreen(playButton) {
    playButton.style.display = "none";
    tt.gameStarted = true;
    tt.handleGameStart();
    tt.run();
    document.querySelector("#towers").classList.add("active");
  }

  createTiles() {
    const tileDivs = [];
    for (let i = 0; i < 4; i++) {
      const tileDiv = document.createElement("div");

      let tileImgPath;
      let boardImgPath;
      let attackImgPath;
      let cost;
      let upgrade;
      let type;
      let range;
      let cooldown;
      let damage;
      let speed;

      if (i === 0) {
        tileImgPath = "images/earth/green-tower-1.png";
        boardImgPath = "images/earth/green-tower-1.png";
        attackImgPath = "images/earth/green-tower-atk-1.png";
        cost = 15;
        upgrade = 30;
        type = "Earth";
        range = 100;
        cooldown = 1000;
        damage = 30;
        speed = 8;
      } else if (i === 1) {
        tileImgPath = "images/water/blue-tower-1.png";
        boardImgPath = "images/water/blue-tower-1.png";
        attackImgPath = "images/water/blue-tower-atk-1.png";
        cost = 30;
        upgrade = 60;
        type = "Water";
        range = 120;
        cooldown = 300;
        damage = 10;
        speed = 1;
      } else if (i === 2) {
        tileImgPath = "images/fire/red-tower-1.png";
        boardImgPath = "images/fire/red-tower-1.png";
        attackImgPath = "images/fire/red-tower-atk-1.png";
        cost = 50;
        upgrade = 100;
        type = "Fire";
        range = 100;
        cooldown = 200;
        damage = 20;
        speed = 10;
      } else if (i === 3) {
        tileImgPath = "images/air/yellow-tower-1.png";
        boardImgPath = "images/air/yellow-tower-1.png";
        attackImgPath = "images/air/yellow-tower-atk-1.png";
        cost = 100;
        upgrade = 200;
        type = "Air";
        range = 150;
        cooldown = 2000;
        damage = 120;
        speed = 16;
      }

      tileDiv.tileDivImg = new Image();
      tileDiv.tileDivImg.src = boardImgPath;

      tileDiv.tileDivAttackImg = new Image();
      tileDiv.tileDivAttackImg.src = attackImgPath;

      document.querySelector("#towers").appendChild(tileDiv);

      tileDiv.cost = cost;
      tileDiv.upgrade = upgrade;
      tileDiv.id = i;
      tileDiv.type = type;
      tileDiv.range = range;
      tileDiv.cooldown = cooldown;
      tileDiv.damage = damage;
      tileDiv.speed = speed;
      tileDivs.push(tileDiv);

      const tileImg = new Image();
      tileImg.src = tileImgPath;
      tileDiv.appendChild(tileImg);

      const towerName = document.createElement("p");

      if (i === 0) {
        towerName.innerText = "15 ¥";
      } else if (i === 1) {
        towerName.innerText = "30 ¥";
      } else if (i === 2) {
        towerName.innerText = "50 ¥";
      } else if (i === 3) {
        towerName.innerText = "100 ¥";
      }

      tileDiv.appendChild(towerName);
    }
    return tileDivs;
  }

  handleTileCallbacks(tiles) {
    for (let i = 0; i < tiles.length; i++) {
      const tileDiv = tiles[i];
      tileDiv.addEventListener("mouseover", this.tileRollOver, false);
      tileDiv.addEventListener("mouseout", this.tileRollOut, false);
      tileDiv.addEventListener("click", this.tileClicked, false);
    }
  }

  handleEditClicks() {
    const upgradeButton = document.querySelector("#upgrade-button");
    const sellButton = document.querySelector("#sell-button");
    upgradeButton.addEventListener("click", tt.upgradeClick, false);
    sellButton.addEventListener("click", tt.sellClick, false);
  }

  handleKeyCallbacks() {
    document.addEventListener("keydown", (event) => {
      if (event.keyCode === 27) {
        tt.placingTower = false;
        if (tt.selectedTower) {
          tt.selectedTower.selected = false;
          tt.selectedTower = null;
        }
        if (tt.towers.length && !tt.towers[tt.towers.length - 1].placed) {
          tt.towers.splice(tt.towers.length - 1, 1);
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
      }
    });
  }

  towerKey(towerNum) {
    tt.placingTower = false;
    const towers = tt.towers;
    if (towers.length && !towers[towers.length - 1].placed) {
      towers.splice(towers.length - 1, 1);
    }
    this.tileDivs[towerNum].click();
    const currentTower = towers[towers.length - 1];
    if (currentTower.location.x === 0 && currentTower.location.y === 0) {
      currentTower.location = new Vector(tt.canvas.mouseX, tt.canvas.mouseY);
    }
    currentTower.visible = true;
  }
}
