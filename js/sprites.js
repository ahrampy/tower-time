"use strict";

const sprite = {}

for(let i = 0; i < 5; i++) {
  sprite[i] = new Image;
  sprite[i].src = `./images/creeps/creep-${i}`;
}