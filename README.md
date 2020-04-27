# Tower Time
A live pathing tower defense game.

[Tower Time Live](https://towertime.herokuapp.com/)

Build, upgrade, and sell towers to create a maze for enemies, and stop them from reaching the red square! Every wave, 20 more enemies, led by a fearsome boss, try to get from one side of the board to the other, and will always find the quickest path there. If you're starting to feel safe, don't worry, every tenth level the game gets harder, so stay on your toes and keep those towers upgraded and well positioned. If you misplaced or want to reposition a tower, you can sell it back at full price, unless it has already upgraded, in which case you can sell it for the last upgrade price. If you're tired of clicking around on tower and upgrade buttons, use hotkeys! If you have any feedback, please add an issue or send me a message here: [ahrampy.com]( https://www.ahrampy.com). Thanks for taking a look, and I hope you enjoy the game!

## Technologies

* Javascript
* HTML5
* CSS3
* FireBase

## About

#### General

Tower Time was built on HTML5 canvas, and uses the Dijkstra algorithm for pathfinding combined with vector movement. It features custom pixel animations and is a fully-featured game, with different enemy types, upgrade and sell options, hotkeys, group selection, and randomized map generation.

#### Tower Abilities
Different towers have different abilities, inluding decreasing the speed of enemies and being able to attack multiple targets with one shot. This adds a considerable strategic element to the game, giving players the chance to try out various combinations of towers and upgrade levels to make their maze more effective.

#### Difficulty
Every 10th and 30th level, the difficulty, along with points and income, increase by a multiplier to keep the game competative and challanging to commited players. It scales at a balanced level to make it a continued challange, but not a defeating one.

#### Path Finding
Live path finding and valid tower placement checking are an essential element to the game, running a check for the fastest route for enemies every time a tower is placed or removed, and, before a tower is placed, making sure it does not block the path completely or trap any moving units.

#### Vectors
Enemies use a vector class to traverse towers and blocked squares. Upon choosing the correct direction based on Dijkstra's path creation pattern, they are propelled in that direction but limited to a defined speed, and "bounce" off objects or borders they get too close to.

#### High Scores

A FireBase realtime storage database for an ulta-lightweight backend, to save the score and 3-character name of every player who chooses to add it at the end of the game, and show the all-time high scores.
