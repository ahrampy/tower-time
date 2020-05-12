"use strict";

class Loader {
  constructor(dom) {
    this.dom = dom;
    this.handleTitleScreen();
  }

  handleTitleScreen() {
    this.dom.upgrade.style.opacity = 0;
    this.dom.sell.style.opacity = 0;
    const title = new Image();
    title.src = "/images/splash/tower-time-title.png";
    title.onload = () =>
      game.context.drawImage(
        title,
        this.dom.canvas.width / 2 - title.width / 2,
        40
      );
    this.addPlayButton();
  }

  addPlayButton() {
    this.dom.play.style.backgroundImage = sprites.play.plain;
    this.dom.play.addEventListener("mouseover", (e) => {
      e.target.style.backgroundImage = sprites.play.hover;
    });
    this.dom.play.addEventListener("mouseout", (e) => {
      e.target.style.backgroundImage = sprites.play.plain;
    });
    this.dom.play.addEventListener("mousedown", (e) => {
      e.target.style.backgroundImage = sprites.play.pressed;
    });
    this.dom.play.addEventListener("mouseup", (e) => {
      e.target.style.backgroundImage = sprites.play.hover;
    });
    this.dom.play.addEventListener("click", (e) => {
      e.preventDefault();
      e.target.style.backgroundImage = sprites.play.hover;
      setTimeout(this.handleStart, 300);
    });
  }

  handleStart() {
    game.dom.play.style.display = "none";
    game.dom.startText.style.display = "none";
    game.gameStarted = true;
    game.run();
    game.dom.canvas.style.backgroundColor = "rgba(186, 186, 186, 0.9)";
    game.dom.towerMenu.classList.add("active");
    game.dom.topBar.style.opacity = 100;
    game.dom.bottomBar.style.opacity = 100;
    game.dom.tutorial.style.opacity = 100;
    game.animateBorder();
    game.animateBlocks();
  }
}
