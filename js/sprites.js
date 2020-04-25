"use strict";

const towerSprites = new Image()
const attackSprites = new Image()
const creepSprites = {}

towerSprites.src = "./images/towers/towers.png"
attackSprites.src = "./images/towers/attacks.png"
for(let i = 0; i < 5; i++) {
  creepSprites[i] = new Image;
  creepSprites[i].src = `./images/creeps/creep-${i}.png`;
}

