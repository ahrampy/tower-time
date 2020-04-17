"use strict";

class Tutorial {
  constructor() {
    this.frame = document.querySelector("#tutorial-window");
    this.frame.addEventListener("click", this.toggleInfo, false);

    this.text = document.querySelector("#tutorial-text");
    this.textPar = document.querySelector("#text-p");
    this.default =
      "move your mouse anywhere to learn more or click here to hide tooltips";

    this.addListeners();
  }

  addListeners() {
    const elements = [
      [
        "score",
        "#info-score",
        "your current score: increases for every enemy stopped before reaching the red square",
      ],
      [
        "wave",
        "#info-wave",
        "the amount of waves you have survived so far: including the current one",
      ],
      [
        "creep",
        "#info-creep",
        "the amount damage needed to stop the most recently sent enemies: increases every wave",
      ],
      [
        "lives",
        "#info-lives",
        "if an enemy makes it to the red square, you lose a life: reach zero lives and the game is over",
      ],
      [
        "bits",
        "#info-bits",
        "spend your bank on towers and upgrades: increase it by stopping enemies and sending waves",
      ],
      ["type", "#tower-type", "the name of the selected tower"],
      [
        "damage",
        "#tower-damage",
        "amount of damage the selected tower deals every time it fires",
      ],
      ["range", "#tower-range", "distance the selected tower attack enemies"],
      [
        "cooldown",
        "#tower-cooldown",
        "time in miliseconds the selected tower takes before each attack",
      ],
      [
        "next",
        "#tower-next",
        "cost to your bank of the selected tower's next upgrade",
      ],
      [
        "auto",
        "#auto-container",
        "select to send the next wave automatically once there are no more enemies",
      ],
      ["send", "#wave-button", "sends the next wave of enemies"],
      [
        "towers",
        "#towers",
        "hovering over a tower will show the stats, clicking one will select it, and clicking again over the board will place a new tower of that type, while deducting the cost from your bank",
      ],
      [
        "edit",
        "#edit-tower-buttons",
        "when a placed tower is selected, you can upgrade it tower for its 'next' cost or sell it for its most recent cost",
      ],
      [
        "canvas",
        "canvas",
        "enemies will start at the dark blue square, and try to get to the red one, but cannot move through walls: place towers to attack them, which will also create more walls",
      ],
    ];

    elements.forEach((ele) => {
      const div = document.querySelector(ele[1]);
      div.addEventListener(
        "mouseover",
        () => this.showInfo(ele[0], ele[2]),
        false
      );
      div.addEventListener("mouseout", this.hideInfo, false);
    });
  }

  toggleInfo() {
    tutorial.text.toggleAttribute("hidden");
  }

  showInfo(name, tip) {
    const text = tutorial.textPar;
    if (game.wave === 0 && game.gameStarted && name === "canvas") {
      if (game.bits >= 50) {
        text.innerHTML =
          "to get started, use your bank to place towers on the board from the blinking menu on the bottom left";
      } else {
        text.innerHTML =
          "now that you have some towers, its time to send the first wave - good luck!";
      }
    } else {
      text.innerHTML = tip;
    }
  }

  hideInfo() {
    tutorial.textPar.innerHTML = tutorial.default;
  }
}
