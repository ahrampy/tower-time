'use strict';

class Tutorial {
  constructor() {

    this.tutorialWindow = document.getElementById('tutorial-window');
    this.tutorialWindow.addEventListener("click", this.toggleInfo, false);

    this.textPar = document.getElementById('text-p');
    this.default = 'move your mouse anywhere to learn more or click here to dismiss tooltips';

    this.score = document.getElementById('info-score');
    this.addListeners(this.score, "score");

    this.wave = document.getElementById('info-wave');
    this.addListeners(this.wave, "wave");

    this.creep = document.getElementById('info-creep');
    this.addListeners(this.creep, "creep");

    this.lives = document.getElementById('info-lives');
    this.addListeners(this.lives, "lives");

    this.bits = document.getElementById('info-bits');
    this.addListeners(this.bits, "bits");

    this.type = document.getElementById('tower-type');
    this.addListeners(this.type, "type");

    this.damage = document.getElementById('tower-damage');
    this.addListeners(this.damage, "damage");

    this.range = document.getElementById('tower-range');
    this.addListeners(this.range, "range");

    this.cooldown = document.getElementById('tower-cooldown');
    this.addListeners(this.cooldown, "cooldown");

    this.next = document.getElementById('tower-next');
    this.addListeners(this.next, "next");

    // this.mute = document.getElementById('mute-button');
    // this.addListeners(this.mute, "mute");

    this.auto = document.getElementById("auto-container");
    this.addListeners(this.auto, "auto");

    this.start = document.getElementById("start-button");
    this.addListeners(this.start, "start");

    this.towers = document.getElementById("towers");
    this.addListeners(this.towers, "towers");

    this.edit = document.getElementById("edit-tower-buttons");
    this.addListeners(this.edit, "edit");

    this.canvas = document.getElementById("game-canvas");
    this.addListeners(this.canvas, "canvas");

  };

  addListeners(ele, name) {
    ele.addEventListener("mouseover", () => this.showInfo(name), false);
    ele.addEventListener("mouseout", this.hideInfo, false);
  };
 
  toggleInfo() {
    const text = document.getElementById("tutorial-text");
    if (text.classList.contains("hidden")) {
      text.classList.remove('hidden');
      text.classList.add("show");
    } else {
      text.classList.remove("show");
      text.classList.add('hidden');
    };
  };

  showInfo(ele) {
    const text = tutorial.textPar;
    if (towerTime.wave === 0 && towerTime.gameStarted && ele === "canvas") {
      if (towerTime.bits >= 50) {
        text.innerHTML = "to get started, place a few towers on the board"
      } else {
        text.innerHTML = "now that you have some towers, send the first wave - good luck!"
      }
    } else if (ele === "score") {
      text.innerText = "your current score - increases for every enemy stopped";
    } else if (ele === "wave") {
      text.innerText = "the amount of waves you have survived so far";
    } else if (ele === "creep") {
      text.innerText =
        "the amount damage needed to stop the most recent enemies - increases every wave";
    } else if (ele === "lives") {
      text.innerText =
        "your precious lives - if an enemy makes it to the red square, you lose a life - reach zero lives and the game is over";
    } else if (ele === "bits") {
      text.innerText =
        "spend your bank on towers and tower upgrades - increase it by stopping enemies and sending waves";
    } else if (ele === "type") {
      text.innerText = "the name of the current tower";
    } else if (ele === "damage") {
      text.innerText =
        "amount of damage the current tower will deal every time it fires";
    } else if (ele === "range") {
      text.innerText =
        "distance the current tower can watch for enemies to attack";
    } else if (ele === "cooldown") {
      text.innerText =
        "number of miliseconds the current tower needs before firing again";
    } else if (ele === "next") {
      text.innerText = "cost of the current tower's next upgrade in bits";
    } else if (ele === "auto") {
      text.innerText =
        "select to send the next wave automatically if there are no more enemies";
    } else if (ele === "start") {
      text.innerText = "starts game and will send the next wave";
    } else if (ele === "towers") {
      text.innerText =
        "the four tower types - hover over one to see its stats - click one to select it, move your mouse over the board, and click again to place the tower - the cost will be deducted from your bank";
    } else if (ele === "edit") {
      text.innerText =
        "when a placed tower is selected, upgrade and sell give you the options to upgrade your tower for 'next' cost or sell it back for its most recent cost";
    } else if (ele === "canvas") {
      if (towerTime.gameStarted) {
        text.innerText =
          "the board - the dark gray sqaure on the left will spawn enemies every wave - enemies will try to get to the red sqaure - light gray spaces are occupied and act as walls for enemies - place towers anywhere else that doesn't block off unoccupied sqaures, and make more walls with your towers!";
      }
    }
  };

  hideInfo() {
    tutorial.textPar.innerHTML = tutorial.default
  };

}




