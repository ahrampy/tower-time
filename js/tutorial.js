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
    const text = tutorial.textPar;
    if (name === "canvas" && game.wave === 0 && game.gameStarted) {
      this.startTips(text);
    } else {
      text.innerHTML = tip;
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

  startTips(text) {
    if (game.bits <= 50) {
      text.innerHTML =
        "now that you have some towers, its time to send the first wave!";
    }
  }

  makeTips() {
    return {
      canvas:
        "enemies will start at the dark blue square, and try to get to the red one, but cannot move through walls. place towers to attack enemies: towers also act as walls",
      score:
        "your current score: increases for every enemy stopped before reaching the red square",
      currWave:
        "the amount of waves you have survived so far: including the current one",
      lives:
        "if an enemy makes it to the red square, you lose a life: reach zero lives and the game is over",
      bank:
        "spend your bank on towers and upgrades: increase it by stopping enemies and sending waves",
      autoBox:
        "select to send the next wave automatically once there are no more enemies",
      wave: "sends the next wave of enemies",
      towerMenu:
        "hovering over a tower will show the stats, clicking one will select it, and clicking again over the board will place a new tower of that type, while deducting the cost from your bank",
      type: "the name of the selected tower",
      damage: "amount of damage the tower deals when it fires",
      range: "distance the selected tower attack enemies",
      speed: "how quickly the tower attacks",
      next: "cost to your bank of the selected tower's next upgrade",
      upgrade:
        "when a placed tower is selected, you can upgrade it for its 'next' cost",
      sell:
        "when a placed tower is selected, sell it for the most recent cost paid towards that tower",
    };
  }
}
