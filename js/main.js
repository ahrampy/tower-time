import DomHandler from "./dom";
import Sprites from "./sprites";
import Game from "./game";
import Scores from "./scores";
import { Howl } from "howler";

window.addEventListener("load", init);

var soundtrack = new Howl({
  src: "../audio/towertime.mp3",
  loop: true,
});
var sprites = new Sprites();

var dom, game, scores, animation, soundtrack;

function init() {
  dom = dom ? dom : new DomHandler();
  game = new Game(dom, sprites, soundtrack);
  scores
    ? ((scores.game = game), (scores.dom = dom))
    : (scores = new Scores(dom, game));
  game.actions.scores = scores;
  game.actions.init = init;
  window.cancelAnimationFrame(animation);
  window.setTimeout(animate, 100);
}

function animate() {
  game.run();
  animation = window.requestAnimationFrame(animate);
}
