"use strict";

class Loader {
  constructor() {
    this.handleTitleScreen();
  }

  handleTitleScreen() {
    sprites.play.plain.onload = () => {
      dom.holder.style.opacity = 100;
    };
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
    dom.play.style.backgroundImage = `url(${sprites.play.plain.src})`;
    this.addListener("mouseover", "hover", false);
    this.addListener("mouseout", "plain", false);
    this.addListener("mousedown", "pressed", false);
    this.addListener("mouseup", "hover", false);
    this.addListener("click", "hover", true);
  }

  addListener(action, img, start) {
    dom.play.addEventListener(action, (e) => {
      e.target.style.backgroundImage = `url(${sprites.play[img].src})`;
      if (start) setTimeout(this.handleStart, 300);
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
