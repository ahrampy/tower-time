# Tower Time
Canvas tower defense game.

[Tower Time Live](https://towertime.herokuapp.com/)

Build, upgrade, and sell towers to create a maze for enemies to traverse through, and stop them from reaching the red square! As you play and place towers, the little circles come thirty at a time to try to get from the dark gray square to the red one, and will always find the quickest path there; so the make the quickest path long, and give your towers more time to take down the enemies' health, which grows every level. If you're starting to feel too safe, don't worry, every tenth level, the game gets harder by a hidden multiplier, so stay on your toes and keep those towers upgraded and well positioned. The income and points are increased as well. If you misplaced a tower, don't worry, you can sell it back at full price, unless it has already been upgraded. Tired of clicking around on tower and upgrade buttons? No problem, use hotkeys! They will cancel out anything you have selected to make for a smooth switch between options. Have feedback? I would love to hear it, just send me a message here: [ahrampy.com]( https://www.ahrampy.com). Thanks for taking a look, I hope you enjoy the game!

## Technologies

* Javascript
* HTML5
* CSS

## About

Tower Time was built on HTML5 canvas, and uses the Dijkstra algorithm or 'Brushfire' pathfinding combined with vector movement. It features custom pixel animation and is a fully-featured game, with upgrade / sell options, optional hotkeys to make for a polished user experience, and randomized map generation to always keep the game feeling fresh.

<img src="https://imgur.com/td8tiXC.png"/>

#### Tower Abilities
Different towers have different abilities, inluding decreasing the speed of enemies and being able to attack multiple targets with one shot. This adds a considerable strategic element to the game, giving players the chance to try out various combinations of towers and upgrade levels to make their maze more effective.

<img src="https://imgur.com/vlwicHs.png"/>

#### Difficulty
Every tenth level, the difficulty, along with points and income, increase to keep the game competative and challanging to commited players. It scales at a balanced level to make it a continued challange, but not a defeating one. This was playtested extensively with different levels of players to make sure the challenge was a appropriate, and gave advanced players a feeling of achievement on reaching higher levels while giving newer players a clear indication that skill could bring them further.

<img src="https://i.imgur.com/P400Hzf.png"/>

#### Path Finding
Live path finding and valid tower placement checking are an essential element to the game, running a check for the fastest route for enemies every time a tower is placed or removed, and, before a tower is placed, making sure it does not block any other squares on the map.

<img src="https://i.imgur.com/weSGoxK.png"/>

#### Vectors
Enemies use a JavaScript vector "class" to traverse towers and block squares. Upon choosing the correct direction based on Djikstra's path finding algorithm, they are propelled in that direction but limited to a defined speed, and "bounce" off of objects or a map border they get too close to by reversing their x and y velocities.

<img src="https://i.imgur.com/zHEqY6U.png"/>

## Future Plans

What had been repeatedly requested by testers and players is the addition of a highscore list, so I would add a simple Firebase backend to allow user to store their name along with their final score, and display a highscore list on the gameover screen. This would additionaly require some "locking down" of the game's interanal workings, which are currently too accesible on the browser;)
