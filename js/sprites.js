"use strict";

const sprites = {
  border: new Image(),
  wall: new Image(),
  wallSelected: new Image(),
  tower: new Image(),
  attack: new Image(),
  slime: {},
  gork: {},
  uwo: {},
  play: {
    plain: "url('../images/splash/play-button.png')",
    hover: "url('../images/splash/play-button-hover.png')",
    pressed: "url('../images/splash/play-button-pressed.png')",
  },
};


sprites.border.src = "/images/board/border.png";
sprites.border.style.opacity = 0.4;
sprites.wall.src = "/images/board/wall.png";
sprites.wallSelected.src = "/images/board/wall-selected.png";
sprites.tower.src = "/images/towers/towers.png";
sprites.attack.src = "/images/towers/attacks.png";

for (let i = 0; i < 5; i++) {
  sprites.slime[i] = new Image();
  sprites.slime[i].src = `/images/creeps/slime/slime-${i}.png`;

  sprites.gork[i] = new Image();
  sprites.gork[i].src = `/images/creeps/gork/gork-${i}.png`;

  sprites.uwo[i] = new Image();
  sprites.uwo[i].src = `/images/creeps/uwo/uwo-${i}.png`;
}
