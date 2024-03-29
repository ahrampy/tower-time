# Tower Time

A live pathing tower defense game.

[Tower Time Live](https://towertime.netlify.app/)

Build, upgrade, and sell towers to create a maze for enemies, and stop them from reaching the red square! Every wave, 20 more enemies, led by a fearsome boss, try to get from one side of the board to the other, and will always find the quickest path there, but don't let them! If you have any feedback, please add an issue and I'll get back to you as soon as I can. Thanks for taking a look, and I hope you enjoy the game!

## Technologies

- Javascript
- HTML5
- CSS3
- FireBase
- Babel/Webpack

## About

### General

Tower Time was built on HTML5 canvas, and uses static grid-based pathfinding combined with vector movement. It features custom pixel animations and is a fully-featured game, with different enemy types, upgrade and sell options, hotkeys, group selection, and randomized map generation.

### Tower Abilities

Different towers have different abilities, inluding decreasing the speed of enemies and being able to attack multiple targets with one shot. This adds a considerable strategic element to the game, giving players the chance to try out various combinations of towers and upgrade levels to make their maze more effective.

### Difficulty

Every 10th and 30th level, the difficulty, along with points and income, increase by a difficulty to keep the game competative and challanging to commited players. It scales at a balanced level to make it a continued challange, but not a defeating one.

### Path Finding

Live path finding and valid tower placement checking are an essential element to the game, running a check for the fastest route for enemies to their goal every time a tower is placed or removed, and before a tower is placed, making sure it does not block all paths from the start to the goal, or trap any moving units.

### Vectors

Enemies use a vector class to traverse towers and blocked squares. Upon choosing the correct direction based on Dijkstra's path creation pattern, they are propelled in that direction but limited to a defined speed, and "bounce" off objects or borders they get too close to.

### High Scores

A FireBase realtime storage database for an ulta-lightweight backend, to save the score and 3-character name of every player who chooses to add it at the end of the game, and show the all-time high scores.

### Thank You!

To: openmusic.gallery for the custom soundtrack
To: Kemono on opengameart.org for the sprite inspiration
