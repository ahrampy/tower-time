'use strict';

class Tutorial {
  constructor() {

    this.tutorialWindow = document.getElementById('tutorial-window');
    this.tutorialWindow.addEventListener("click", this.toggleInfo, false);

    this.textPar = document.getElementById('text-p');
    this.default = 'move your mouse anywhere to learn more about it or click here to dismiss';

    this.topBar = document.getElementById('game-controls');
    this.topBar.addEventListener('mouseover', () => this.showInfo("top"), false)
    this.topBar.addEventListener('mouseout', this.hideInfo, false)

    this.type = document.getElementById('tower-type');
    this.type.addEventListener('mouseover', () => this.showInfo("type"), false);
    this.type.addEventListener('mouseout', this.hideInfo, false);

    this.damage = document.getElementById('tower-damage');
    this.damage.addEventListener('mouseover', () => this.showInfo("damage"), false);
    this.damage.addEventListener('mouseout', this.hideInfo, false);

    this.range = document.getElementById('tower-range');
    this.range.addEventListener('mouseover', () => this.showInfo("range"), false);
    this.range.addEventListener('mouseout', this.hideInfo, false);

    this.cooldown = document.getElementById('tower-cooldown');
    this.cooldown.addEventListener('mouseover', () => this.showInfo("cooldown"), false);
    this.cooldown.addEventListener('mouseout', this.hideInfo, false);

    this.next = document.getElementById('tower-next');
    this.next.addEventListener('mouseover', () => this.showInfo("next"), false);
    this.next.addEventListener('mouseout', this.hideInfo, false);

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
    if (ele === "top") {
      tutorial.textPar.innerHTML = "top";
    } else if (ele === "type") {
      tutorial.textPar.innerHTML = "name of the current tower";
    } else if (ele === "damage") {
      tutorial.textPar.innerHTML = "amount of damage current tower will deal every time it fires";
    } else if (ele === "range") {
      tutorial.textPar.innerHTML = "distance from itself current tower will watch for enemies";
    } else if (ele === "cooldown") {
      tutorial.textPar.innerHTML = "number of miliseconds current tower takes before firing again";
    } else if (ele === "next") {
      tutorial.textPar.innerHTML = "cost of the current tower's next upgrade";
    };
  };

  hideInfo() {
    tutorial.textPar.innerHTML = tutorial.default
  };

}




