"use strict";

class Tutorial {
  constructor() {
    this.slide1 = dom.tutorialSlide;
    this.slide2 = dom.hotkeysSlide;
    this.slide1.addEventListener("click", this.toggleTutorial, false);
    this.slide2.addEventListener("click", this.toggleHotkeys, false);
    this.default =
      "move your mouse anywhere to learn more, click here to hide tooltips";

    this.tips = this.makeTips();
    this.addListeners(this.tips);
  }

  addListeners(tips) {
    for (const key in tips) {
      const text = tips[key];
      const div = dom[key];

      div.addEventListener("mouseover", () => this.showInfo(key, text), false);
      div.addEventListener("mouseout", this.clearTip, false);
    }
  }

  toggleTutorial() {
    dom.tutorialText.classList.toggle("hidden");
    dom.tutorialOpen = !dom.tutorialOpen;
    dom.tutorialSlide.setAttribute(
      "class",
      dom.tutorialOpen ? "open" : "closed"
    );
    dom.tutorialIcon.classList.toggle("hidden");
  }

  toggleHotkeys() {
    dom.hotkeysText.classList.toggle("hidden");
    dom.hotkeysOpen = !dom.hotkeysOpen;
    dom.hotkeysSlide.setAttribute("class", dom.hotkeysOpen ? "open" : "closed");
    dom.hotkeysIcon.classList.toggle("hidden");
  }

  showInfo(name, tip) {
    if (game.wave === 0) {

      if (name === "canvas") {
        if (game.bits < 50) {          
          tip =
            "now that you have a few towers, you're ready to take on the first wave! good luck";
        } else {
          tip =
            "enemies will start at the blue square and try to get to the red one, build towers to stop them";
        }
      } else if (name === "towerMenu") {
        tip = "click a tower to select it, then click on the board to buy and place it";
      }

    }

    dom.tutorialP.innerHTML = tip;

    this.ensureDefault();
  }

  ensureDefault() {
    if (dom.tutorialP.innerHTML === "undefined") {
      dom.tutorialP.innerHTML = tutorial.default;
    }
  }

  clearTip() {
    dom.tutorialP.innerHTML = tutorial.default;
  }

  makeTips() {
    return {
      canvas:
        "enemies will start at the blue square and try to get to the red one, but cannot move through walls or towers; click on placed towers to edit them",
      score:
        "your score increases for every enemy stopped before it reaches the red square",
      currWave:
        "the amount of waves you have survived so far, including the current wave",
      lives:
        "if an enemy makes it to the red square, you lose a life; reach zero lives and the game is over",
      bank:
        "spend your bank on towers and upgrades; add to it by stopping enemies and sending waves",
      autoBox:
        "select to send the next wave once there are no more enemies on the board",
      wave: "send the next wave of enemies",
      towerMenu:
        "hover over a tower to show its stats, click one to select it, then click on the board to buy a new tower of that type",
      type: "the name of the current tower",
      damage: "amount of damage the tower deals to enemies when it fires",
      range: "how far the tower looks for enemies",
      speed: "how quickly the tower fires",
      next: "cost to upgrade the tower",
      upgrade: "upgrade the current tower for its 'next' cost",
      sell: "sell the current tower for its most recent cost",
    };
  }
}
