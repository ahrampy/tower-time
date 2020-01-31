'use strict';

class Tutorial {
  constructor() {

    this.tutorialWindow = document.getElementById('tutorial-window');
    this.tutorialWindow.addEventListener("click", this.toggleInfo, false);

    this.textPar = document.getElementById('text-p');
    this.default = 'move your mouse anywhere to learn more or click here to dismiss';

    this.score = document.getElementById('info-score');
    this.addListeners(this.score, "score");

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
    if (ele === "score") {
      tutorial.textPar.innerHTML = "score";
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




