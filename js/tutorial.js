"use strict";

class Tutorial {
  constructor() {
    this.frame = document.querySelector("#tutorial-window");
    this.frame.addEventListener("click", this.toggleInfo, false);

    this.text = document.querySelector("#tutorial-text");
    this.textPar = document.querySelector("#text-p");
    this.default =
      "move your mouse anywhere to learn more or click here to hide tooltips";
    this.tips = this.makeTips();
    this.addListeners(this.tips);
  }

  addListeners(tips) {
    tips.forEach((tip) => {
      const div = document.querySelector(tip[0]);
      div.addEventListener(
        "mouseover",
        () => this.showInfo(tip[0], tip[1]),
        false
      );
      div.addEventListener("click", () => this.showInfo(tip[0], tip[1]), false);
      div.addEventListener("mouseout", this.clearTip, false);
    });
  }

  toggleInfo() {
    tutorial.text.toggleAttribute("hidden");
  }

  showInfo(name, tip) {
    const text = tutorial.textPar;
    if (game.wave === 0 && game.gameStarted && name === "canvas") {
      this.startTips(text);
    } else {
      text.innerHTML = tip;
    }
  }

  clearTip() {
    tutorial.textPar.innerHTML = tutorial.default;
  }

  startTips(text) {
    if (game.bits >= 50) {
      text.innerHTML =
        "to get started, use your bank to place towers on the board from the menu on the bottom left";
    } else {
      text.innerHTML =
        "now that you have some towers, its time to send the first wave, good luck!";
    }
  }

  makeTips() {
    return [
      [
        "#info-score",
        "your current score: increases for every enemy stopped before reaching the red square",
      ],
      [
        "#info-wave",
        "the amount of waves you have survived so far: including the current one",
      ],
      [
        "#info-creep",
        "the amount damage needed to stop the most recently sent enemies: increases every wave",
      ],
      [
        "#info-lives",
        "if an enemy makes it to the red square, you lose a life: reach zero lives and the game is over",
      ],
      [
        "#info-bits",
        "spend your bank on towers and upgrades: increase it by stopping enemies and sending waves",
      ],
      ["#tower-type", "the name of the selected tower"],
      [
        "#tower-damage",
        "amount of damage the selected tower deals every time it fires",
      ],
      ["#tower-range", "distance the selected tower attack enemies"],
      [
        "#tower-cooldown",
        "time in miliseconds the selected tower takes before each attack",
      ],
      ["#tower-next", "cost to your bank of the selected tower's next upgrade"],
      [
        "#auto-container",
        "select to send the next wave automatically once there are no more enemies",
      ],
      ["#wave-button", "sends the next wave of enemies"],
      [
        "#towers",
        "hovering over a tower will show the stats, clicking one will select it, and clicking again over the board will place a new tower of that type, while deducting the cost from your bank",
      ],
      [
        "#edit-tower-buttons",
        "when a placed tower is selected, you can upgrade it tower for its 'next' cost or sell it for its most recent cost",
      ],
      [
        "canvas",
        "enemies will start at the dark blue square, and try to get to the red one, but cannot move through walls: place towers to attack them, which will also create more walls",
      ],
    ];
  }
}
