'use strict';

class Tutorial {
  constructor() {

    this.tutorialWindow = document.getElementById('tutorial-window');
    this.tutorialWindow.addEventListener("click", this.toggleInfo, false);

    this.textPar = document.getElementById('text-p');
    this.default = 'move your mouse anywhere to learn more or click here to dismiss';

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
    if (ele === "score") {
      text.innerText = "your current score, increased by every enemy stopped before it reaches the red square";
    } else if (ele === "type") {
      text.innerText = "the name of the current tower";
    } else if (ele === "damage") {
      text.innerText = "amount of damage the current tower will deal every time it fires";
    } else if (ele === "range") {
      text.innerText = "distance the current tower will fire at enemies - shown by a light blue circle";
    } else if (ele === "cooldown") {
      text.innerText = "number of miliseconds the current tower needs before firing again";
    } else if (ele === "next") {
      text.innerText = "cost of the current tower's next upgrade";
    };
  };

  hideInfo() {
    tutorial.textPar.innerHTML = tutorial.default
  };

}




