import DomHandler from "./dom";
import Sprites from "./sprites";
import Game from "./game";
import Scores from "./scores";

window.addEventListener("load", init, false);

// var dom, sprites, game, tutorial, scores;
var dom;
var sprites;
var game;
var scores;

function init() {
  // var dom = "why"
  dom = new DomHandler();
  sprites = new Sprites();
  game = new Game(dom, sprites);
  // scores = new Scores();
  window.setTimeout(animate, 100);
}

// console.log(dom + "first");

function animate() {
  game.run();
  window.requestAnimationFrame(animate);
}
