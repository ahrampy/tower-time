"use strict";

const sprites = {
  tower: new Image(),
  attack: new Image(),
  slime: {},
  gork: {},
  uwo: {}
};

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
