'use strict';

class Tutorial {
  constructor() {

    this.tutorialWindow = document.getElementById('tutorial-window');
    this.tutorialWindow.addEventListener("click", this.toggleInfo, false);

    this.topBar = document.getElementById('game-controls');
    this.topBar.addEventListener('mouseover', this.showTopInfo, false)

    this.tutorialText = document.getElementById('tutorial-text');
  }

  toggleInfo() {
    const text = document.getElementById("tutorial-text");
    if (text.classList.contains("hidden")) {
      text.classList.remove('hidden');
      text.classList.add("show");
    } else {
      text.classList.remove("show");
      text.classList.add('hidden');
    }
  }

  showTopInfo() {

  }

}




