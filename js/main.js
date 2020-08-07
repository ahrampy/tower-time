import DomHandler from "./dom";
import Sprites from "./sprites";
import Game from "./game";
import Scores from "./scores";

window.addEventListener("load", init);

var dom, sprites, game, scores, animation;

function init() {
  dom = dom ? dom : new DomHandler();
  sprites = sprites ? sprites : new Sprites();
  game = new Game(dom, sprites);
  scores
    ? (scores.game = game, scores.dom = dom)
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
