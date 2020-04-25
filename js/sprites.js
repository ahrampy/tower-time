"use strict";

const spritesheets = {}

for(let i = 0; i < 5; i++) {
  spritesheets[i] = new Image;
  spritesheets[i].src = `./images/creeps/creep-${i}.png`;
}