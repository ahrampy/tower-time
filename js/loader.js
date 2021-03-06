import { Howl } from "howler";

export default class Loader {
  constructor(game, dom, sprites) {
    this.game = game;
    this.dom = dom;
    this.sprites = sprites;
    this.handleTitleScreen();
  }

  handleTitleScreen() {
    this.dom.upgrade.style.opacity = 0;
    this.dom.sell.style.opacity = 0;
    const title = new Image();
    title.src = "/images/splash/tower-time-title.png";
    title.onload = () => {
      this.game.context.drawImage(
        title,
        this.dom.canvas.width / 2 - title.width / 2,
        40
      );
      this.dom.holder.style.opacity = 100;
    };
    this.addPlayButton();
  }

  addPlayButton() {
    this.dom.play.style.backgroundImage = `url(${this.sprites.play.plain.src})`;
    this.addListener("mouseover", "hover");
    this.addListener("mouseout", "plain");
    this.addListener("mousedown", "pressed");
    this.addListener("mouseup", "hover");
    this.addListener("click", "hover", true);
  }

  addListener(action, img, start) {
    this.dom.play.addEventListener(action, (e) => {
      e.target.style.backgroundImage = `url(${this.sprites.play[img].src})`;
      if (start) setTimeout(this.handleStart.bind(this), 300);
    });
  }

  handleStart() {
    this.hideSplash();
    this.addHowl();
    this.showBoard();
    this.game.animateBorder();
    this.game.animateBlocks();
    this.game.gameStarted = true;
  }

  hideSplash() {
    this.dom.play.style.display = "none";
    this.dom.startText.style.display = "none";
    this.dom.footer.style.opacity = 0;
  }

  showBoard() {
    this.dom.canvas.style.backgroundColor = "rgb(186, 186, 186)";
    this.dom.towerMenu.classList.add("active");
    this.dom.topBar.style.opacity = 100;
    this.dom.bottomBar.style.opacity = 100;
    this.dom.tutorial.style.opacity = 100;
  }

  addHowl() {
    this.game.sound = new Howl({
      src: "../audio/towertime.mp3",
      loop: true,
    });
    if (!this.game.muted) this.game.sound.play();
  }
}
