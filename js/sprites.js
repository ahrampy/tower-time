"use strict";

class Sprites {
  constructor() {
    this.border = new Image();
    this.wall = new Image();
    this.wallSelected = new Image();
    this.tower = new Image();
    this.attack = new Image();
    this.slime = {};
    this.gork = {};
    this.uwo = {};
    this.play = {
      plain: new Image(),
      hover: new Image(),
      pressed: new Image(),
    };
    this.addTileSources();
    this.addCreepImages();
  }

  addTileSources() {
    this.border.src = "/images/board/border.png";
    this.border.style.opacity = 0.4;

    this.wall.src = "/images/board/wall.png";
    this.wallSelected.src = "/images/board/wall-selected.png";

    this.tower.src = "/images/towers/towers.png";
    this.attack.src = "/images/towers/attacks.png";

    this.play.plain.src = "/images/splash/play-button.png";
    this.play.hover.src = "/images/splash/play-button-hover.png";
    this.play.pressed.src = "/images/splash/play-button-pressed.png";
  }

  addCreepImages() {
    for (let i = 0; i < 5; i++) {
      this.slime[i] = new Image();
      this.slime[i].src = `/images/creeps/slime/slime-${i}.png`;

      this.gork[i] = new Image();
      this.gork[i].src = `/images/creeps/gork/gork-${i}.png`;

      this.uwo[i] = new Image();
      this.uwo[i].src = `/images/creeps/uwo/uwo-${i}.png`;
    }
  }
}
