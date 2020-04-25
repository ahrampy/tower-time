"use strict";

const creepSprites = {}

for(let i = 0; i < 5; i++) {
  creepSprites[i] = new Image;
  creepSprites[i].src = `./images/creeps/creep-${i}.png`;
}