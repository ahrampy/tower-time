"use strict";

class Loader {
  constructor() {
    this.handleTitleScreen();
  }

  handleTitleScreen() {
    dom.upgrade.style.opacity = 0;
    dom.sell.style.opacity = 0;
    dom.canvas.style.opacity = 100;
    const title = new Image();
    title.src = "/images/splash/tower-time-title.png";
    title.onload = () =>
      game.context.drawImage(title, dom.canvas.width / 2 - title.width / 2, 40);
    this.addPlayButton();
  }

  addPlayButton() {
    dom.play.style.backgroundImage = sprites.play.plain;
    dom.play.addEventListener("mouseover", (e) => {
      e.target.style.backgroundImage = sprites.play.hover;
    });
    dom.play.addEventListener("mouseout", (e) => {
      e.target.style.backgroundImage = sprites.play.plain;
    });
    dom.play.addEventListener("mousedown", (e) => {
      e.target.style.backgroundImage = sprites.play.pressed;
    });
    dom.play.addEventListener("mouseup", (e) => {
      e.target.style.backgroundImage = sprites.play.hover;
    });
    dom.play.addEventListener("click", (e) => {
      e.preventDefault();
      e.target.style.backgroundImage = sprites.play.hover;
      setTimeout(this.handleStart, 300);
    });
  }

  handleStart() {
    dom.play.style.display = "none";
    dom.startText.style.display = "none";
    dom.footer.style.opacity = 0;
    game.gameStarted = true;
    game.run();
    dom.canvas.style.backgroundColor = "rgb(186, 186, 186)";
    dom.towerMenu.classList.add("active");
    dom.topBar.style.opacity = 100;
    dom.bottomBar.style.opacity = 100;
    dom.tutorial.style.opacity = 100;
    game.animateBorder();
    game.animateBlocks();
  }
}
