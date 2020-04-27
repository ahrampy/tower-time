"use strict";

class Tutorial {
  constructor() {
    this.frame = dom.tutorial;
    this.frame.addEventListener("click", this.toggleInfo, false);

    this.box = dom.tutorialBox;
    this.textPar = dom.tutorialText;
    this.default =
      "move your mouse anywhere to learn more or click here to hide tooltips";
    this.tips = this.makeTips();
    this.addListeners(this.tips);
  }

  addListeners(tips) {
    for (var key in tips) {
      const text = tips[key];
      const div = dom[key];
      div.addEventListener("mouseover", () => this.showInfo(key, text), false);
      div.addEventListener("mouseout", this.clearTip, false);
    }
  }

  toggleInfo() {
    tutorial.box.toggleAttribute("hidden");
  }

  showInfo(name, tip) {
    if (name === "canvas" && game.wave === 0 && game.gameStarted) {
      this.startTips();
    } else {
      tutorial.textPar.innerHTML = tip;
    }
    this.ensureDefault();
  }

  ensureDefault() {
    if (tutorial.textPar.innerHTML === "undefined") {
      tutorial.textPar.innerHTML = tutorial.default;
    }
  }

  clearTip() {
    tutorial.textPar.innerHTML = tutorial.default;
  }

  startTips() {
    if (game.bits <= 50) {
      tutorial.textPar.innerHTML =
        "now that you have some towers, its time to send the first wave!";
    }
  }

  makeTips() {
    return {
      canvas:
        "enemies will start at the dark blue square and try to get to the red one, but cannot move through walls. place towers to attack enemies and add more walls",
      score:
        "your score increases for every enemy stopped before it reaches the red square",
      currWave:
        "the amount of waves you have survived so far, including the current wave",
      lives:
        "if an enemy makes it to the red square, you lose a life; reach zero lives and the game is over",
      bank:
        "spend your bank on towers and upgrades: increase it by stopping enemies and sending waves",
      autoBox:
        "select to send the next wave automatically once there are no more enemies",
      wave: "sends the next wave of enemies",
      towerMenu:
        "hover over a tower to show its stats, click one to select it, then click again over the board to buy a new tower of that type",
      type: "the name of the selected tower",
      damage: "amount of damage the tower deals when it fires",
      range: "how far the tower can fire",
      speed: "how quickly the tower fires",
      next: "cost to upgrade the tower",
      upgrade: "upgrade the current tower for its 'next' cost",
      sell: "sell the current tower for its most recent cost",
    };
  }
}
