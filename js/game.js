'use strict';

window.addEventListener('load', init, false);

var towerTime;
var tutorial;

function init() {
    towerTime = new Game();
    tutorial = new Tutorial();
    window.setTimeout(animate, 100);
}

function animate() {
    towerTime.run();
    window.requestAnimationFrame(animate);
}

function round5(x) {
    return Math.ceil(x / 5) * 5;
}

class Game {
    constructor() {

        // game objects
        this.towers = [];
        this.creeps = [];
        this.attacks = [];
        this.grid = [];

        // game stats
        this.lives = 20;
        this.bits = 200;
        this.score = 0;
        this.wave = 0;
        this.gameOver = false;

        // increase difficulty
        this.multiplier = 1;
        this.creepHealth = this.wave * 400 * this.multiplier;

        // load canvas
        this.canvas = document.createElement("canvas");
        this.canvas.classList.add('canvas');
        this.canvas.width = 800;
        this.canvas.height = 520;
        document.querySelector('#game-canvas').appendChild(this.canvas);
        this.canvas.addEventListener('mousemove', this.handleCanvasMouseMoved, false);
        this.canvas.addEventListener('mouseover', this.handleCanvasMouseOver, false);
        this.canvas.addEventListener('click', this.handleCanvasMouseClicked, false);
        this.context = this.canvas.getContext("2d");

        // init
        this.handleGameStart();
        this.gameStarted = false;

        // audio
        // this.handleSoundButton();
        // this.muted = false;
        // this.music = document.createElement('audio');

        // auto send waves
        this.handleAutoWaveButton();
        this.autoWave = false;
        this.sendingWave = false;

        // grid specs
        this.numBlocks = 40;
        this.cellSize = 40;
        this.numCols = 20;
        this.numRows = 13;
        this.start = null;
        this.goal = null;

        // load buttons
        this.tileDivs = this.createTiles();
        this.handleTileCallbacks(this.tileDivs);
        this.handleStartClick();
        this.handleEditClicks();
        this.handleKeyCallbacks();

        // Dijkstra's
        this.validated = false;
        this.loadGrid();
        this.findPath();

        // track tower
        this.placingTower = false;
        this.selectedTower = null;

        // show tower tile info
        this.showTowerStats = false;
    }

    handleStartClick() {
        const button = document.querySelector("#start-button");
        button.addEventListener('click', this.startClick, false );
    }

    startClick() {
        if (!towerTime.gameStarted) {
            towerTime.gameStarted = true;
            towerTime.handleGameStart();
            towerTime.run();
            this.innerText = "First Wave";
            this.classList.remove('active');
            document.querySelector('#towers').classList.add('active');
            document.querySelector('#info-bits').classList.add("active");
            // if (!towerTime.muted) {
            //     // setTimeout(() => (
            //     towerTime.music.setAttribute('src', 'sounds/splash.mp3');
            //     towerTime.music.load();
            //     towerTime.music.playbackRate = 0.9
            //     towerTime.music.play();
            //     // ), 0);
            // } else {
            //     towerTime.music.setAttribute('src', '');
            // }
            return;
        // } else {
            // if (!towerTime.muted) {
            //     // setTimeout(() => (
            //     towerTime.music.setAttribute('src', 'sounds/in_game.mp3');
            //     towerTime.music.load();
            //     towerTime.music.playbackRate = 0.95
            //     towerTime.music.play();
            //     // ), 0);
            // } else {
            //     towerTime.music.setAttribute('src', '');
            // }
        }
        if (towerTime.wave === 0) {
            document.querySelector("#towers").classList.remove("active");
            document.querySelector("#info-bits").classList.remove("active");
        }
        this.innerText = "Next Wave";
        towerTime.bits = round5(towerTime.bits);
        towerTime.wave += 1;
        if (towerTime.wave % 10 === 0) {
            towerTime.multiplier += 0.5;
        }
        if (towerTime.wave % 30 === 0) {
            towerTime.multiplier += 0.5;
        }
        towerTime.creepHealth = towerTime.wave * 400 * towerTime.multiplier;
        towerTime.bits += (10 * towerTime.wave) / 2
        this.style.backgroundColor = "rgba(68, 74, 110, 0.33)";
        towerTime.loadCreeps(20);
    }
    
    handleKeyCallbacks() {
        document.addEventListener("keydown", event => {
            if (event.keyCode === 27) {
                towerTime.placingTower = false;
                if (towerTime.selectedTower) {
                    towerTime.selectedTower.selected = false;
                    towerTime.selectedTower = null;
                }
                if (towerTime.towers.length && !towerTime.towers[towerTime.towers.length - 1].placed) {
                    towerTime.towers.splice(towerTime.towers.length - 1, 1);
                }
            } else if (event.keyCode === 49) {
                this.towerKey(0);
            } else if (event.keyCode === 50) {
                this.towerKey(1);
            } else if (event.keyCode === 51) {
                this.towerKey(2);
            } else if (event.keyCode === 52) {
                this.towerKey(3);
            } else if (event.keyCode === 83) {
                this.sellClick();
            } else if (event.keyCode === 81) {
                this.upgradeClick();
            }
            
        })
    }

    towerKey(towerNum) {
        towerTime.placingTower = false;
        if (towerTime.towers.length && !towerTime.towers[towerTime.towers.length - 1].placed) {
            towerTime.towers.splice(towerTime.towers.length - 1, 1);
        }
        this.tileDivs[towerNum].click();
        let currentTower = towerTime.towers[towerTime.towers.length - 1];
        if (currentTower.location.x === 0 && currentTower.location.y === 0) {
            currentTower.location = new Vector(towerTime.canvas.mouseX, towerTime.canvas.mouseY);
        }
        currentTower.visible = true;
    }
    
    // handleSoundButton() {
    //     const muteButton = document.querySelector("#mute-button");
    //     muteButton.addEventListener('click', this.audioToggle, false);
    // }

    handleAutoWaveButton() {
        const autoWave = document.querySelector("input[name=auto-wave]");
        autoWave.addEventListener('change', this.autoWaveToggle, false);
    }

    // audioToggle() {
    //     if (towerTime.muted) {
    //         this.classList.add('mute-off');
    //         this.classList.remove('mute-on');
    //         towerTime.muted = false;
    //         towerTime.music.muted = false;
    //     } else {
    //         this.classList.add('mute-on');
    //         this.classList.remove('mute-off');
    //         towerTime.music.muted = true;
    //         towerTime.muted = true;
    //     }
    // }

    autoWaveToggle() {
        if (this.checked) {
            towerTime.autoWave = true;
        } else {
            towerTime.autoWave = false;
        }
    }
    
    handleEditClicks() {
        const upgradeButton = document.querySelector("#upgrade-button");
        const sellButton = document.querySelector("#sell-button");
        upgradeButton.addEventListener('click', this.upgradeClick, false);
        sellButton.addEventListener('click', this.sellClick, false);
    }

    upgradeClick() {
        if (towerTime.selectedTower) {
            const tower = towerTime.selectedTower
            
            if (towerTime.selectedTower && tower.canUpgrade && towerTime.bits - tower.upgrade >= 0) {
                towerTime.bits -= tower.upgrade;
                tower.handleUpgrade();
            }
        }
    }

    sellClick() {
        if (towerTime.selectedTower) {
            const tower = towerTime.selectedTower;
    
            const gridCol = Math.floor(tower.location.x / towerTime.cellSize);
            const gridRow = Math.floor(tower.location.y / towerTime.cellSize);
    
            const cell = towerTime.grid[gridCol][gridRow];
            cell.occupied = false;
    
            towerTime.findPath();
            for (let c = 0; c < towerTime.numCols; c++) {
                for (let r = 0; r < towerTime.numRows; r++) {
                    towerTime.grid[c][r].loadAdjacentCells();
                }
            }
    
            towerTime.bits += tower.upgrade / 2;
            towerTime.selectedTower = null;
            tower.removed = true;
        }
    }

    handleCanvasMouseMoved(event) {
        this.mouseX = event.offsetX;
        this.mouseY = event.offsetY;
        if (towerTime.towers.length < 1) return;
        if (!towerTime.towers[towerTime.towers.length - 1].placed &&
            towerTime.placingTower === true ) {
                towerTime.towers[towerTime.towers.length - 1].location.x = this.mouseX;
                towerTime.towers[towerTime.towers.length - 1].location.y = this.mouseY;
            }
    }

    handleCanvasMouseOver() {
        if(towerTime.towers.length < 1) return;
        towerTime.towers[towerTime.towers.length - 1].visible = true;
    }

    handleCanvasMouseClicked() {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        const gridCol = Math.floor(mouseX/towerTime.cellSize);
        const gridRow = Math.floor(mouseY/towerTime.cellSize);

        const cell = towerTime.grid[gridCol][gridRow];

        if (towerTime.placingTower){

            if (!cell.occupied && cell !== towerTime.goal && cell !== towerTime.start) {
                cell.occupied = true; 

                towerTime.findPath();
                for (let c = 0; c < towerTime.numCols; c++) {
                    for (let r = 0; r < towerTime.numRows; r++) {
                        towerTime.grid[c][r].loadAdjacentCells();
                    }
                }
                
                let checkBlock = false;

                for (let c = 0; c < towerTime.numCols; c++) {
                    for (let r = 0; r < towerTime.numRows; r++)
                        if (towerTime.grid[c][r].value === -1 && !towerTime.grid[c][r].occupied) {
                            checkBlock = true;
                        }
                }

                if (checkBlock) {
                    cell.occupied = false
                    towerTime.findPath();
                    for (let c = 0; c < towerTime.numCols; c++) {
                        for (let r = 0; r < towerTime.numRows; r++)
                            towerTime.grid[c][r].loadAdjacentCells()
                    }
                } else {
                    towerTime.placeTower(cell.center);
                }

            }
        } else {
            for (let i = 0; i < towerTime.towers.length; i++) {
                let tower = towerTime.towers[i]
                if (tower.location.x === cell.center.x
                    && tower.location.y === cell.center.y) {
                    tower.selected = !tower.selected;
                    if (tower.selected) {
                        towerTime.selectedTower = tower;
                    }
                } else {
                    tower.selected = false;
                }
            }
        }
    }

    createTiles() {
        const tileDivs = [];
        for (let i = 0; i < 4; i++) {
            const tileDiv = document.createElement("div");

            let tileImgPath;
            let boardImgPath;
            let attackImgPath;
            let cost;
            let upgrade;
            let type;
            let range;
            let cooldown;
            let damage;
            let speed;

            if (i === 0) {
                tileImgPath = "images/earth/green-tower-1.png";
                boardImgPath = "images/earth/green-tower-1.png";
                attackImgPath = "images/earth/green-tower-atk-1.png";
                cost = 15;
                upgrade = 30;
                type = "Earth";
                range = 100;
                cooldown = 1000;
                damage = 30;
                speed = 8;
            } else if (i === 1) {
                tileImgPath = "images/water/blue-tower-1.png";
                boardImgPath = "images/water/blue-tower-1.png";
                attackImgPath = "images/water/blue-tower-atk-1.png";
                cost = 30;
                upgrade = 60;
                type = "Water";
                range = 120;
                cooldown = 300;
                damage = 10;
                speed = 1;
            } else if (i === 2) {
                tileImgPath = "images/fire/red-tower-1.png";
                boardImgPath = "images/fire/red-tower-1.png";
                attackImgPath = "images/fire/red-tower-atk-1.png";
                cost = 50;
                upgrade = 100;
                type = "Fire";
                range = 120;
                cooldown = 200;
                damage = 20;
                speed = 12;
            } else if (i === 3) {
                tileImgPath = "images/air/yellow-tower-1.png";
                boardImgPath = "images/air/yellow-tower-1.png";
                attackImgPath = "images/air/yellow-tower-atk-1.png";
                cost = 100;
                upgrade = 200;
                type = "Air";
                range = 150;
                cooldown = 2000;
                damage = 120;
                speed = 16;
            }


            tileDiv.tileDivImg = new Image();
            tileDiv.tileDivImg.src = boardImgPath;

            tileDiv.tileDivAttackImg = new Image();
            tileDiv.tileDivAttackImg.src = attackImgPath;

            document.querySelector('#towers').appendChild(tileDiv);

            tileDiv.cost = cost;
            tileDiv.upgrade = upgrade;
            tileDiv.id = i;
            tileDiv.type = type;
            tileDiv.range = range;
            tileDiv.cooldown = cooldown;
            tileDiv.damage = damage;
            tileDiv.speed = speed;
            tileDivs.push(tileDiv);
            
            const tileImg = new Image();
            tileImg.src = tileImgPath;
            tileDiv.appendChild(tileImg)

            const towerName = document.createElement("p");

            if (i === 0) {
                towerName.innerText = "15 ¥"
            } else if (i=== 1) {
                towerName.innerText = "30 ¥"
            } else if (i === 2) {
                towerName.innerText = "50 ¥"
            } else if (i === 3) {
                towerName.innerText = "100 ¥"
            }

            tileDiv.appendChild(towerName)
            
        }
        return tileDivs;
    }

    handleTileCallbacks(tiles) {
        for(let i = 0; i < tiles.length; i++) {
            const tileDiv = tiles[i];
            tileDiv.addEventListener('mouseover', this.tileRollOver, false)
            tileDiv.addEventListener('mouseout', this.tileRollOut, false)
            tileDiv.addEventListener('click', this.tileClicked, false)
        }
    }

    tileRollOver() {
        if (towerTime.selectedTower) {
            towerTime.selectedTower.selected = false;
            towerTime.selectedTower = null;
        }
        this.showTowerStats = true;
        let towerInfoTiles = document.querySelector('#tower-details').getElementsByClassName('detail-tile');
        for (let i = 0; i < towerInfoTiles.length; i++) {
            let info = towerInfoTiles[i];

            if (info.innerHTML.indexOf('Type') != -1) {
                info.innerHTML = '<h5>Type</h5>';
                const value = document.createElement('p');
                value.style.fontSize = '10pt';
                value.innerHTML = this.type;
                info.appendChild(value)
            } else if (info.innerHTML.indexOf('Range') != -1) {
                info.innerHTML = '<h5>Range</h5>';
                const value = document.createElement('p');
                value.style.fontSize = '10pt';
                value.innerHTML = this.range;
                info.appendChild(value);
            } else if (info.innerHTML.indexOf('Damage') != -1) {
                info.innerHTML = '<h5>Damage</h5>';
                const value = document.createElement('p');
                value.style.fontSize = '10pt';
                value.innerHTML = this.damage;
                info.appendChild(value);
            } else if (info.innerHTML.indexOf('Cooldown') != -1) {
                info.innerHTML = '<h5>Cooldown</h5>';
                const value = document.createElement('p');
                value.style.fontSize = '10pt';
                value.innerHTML = this.cooldown;
                info.appendChild(value);
            }else if (info.innerHTML.indexOf('Next') != -1) {
                info.innerHTML = '<h5>Next</h5>';
                const value = document.createElement('p');
                value.style.fontSize = '10pt';
                value.innerHTML = this.upgrade + " ¥";
                info.appendChild(value);
            }

        }
    }

    tileRollOut() {
        this.showTowerStats = false;
    }

    tileClicked() {        
        if (towerTime.placingTower === true) {
            if (!towerTime.towers[towerTime.towers.length - 1].placed) {
                towerTime.towers.splice(towerTime.towers.length - 1, 1);
            }
        }
        if (towerTime.bits >= this.cost) {            
            towerTime.createTower(this);
            towerTime.currentTileDiv = this;
            towerTime.placingTower = true;
        }
    }

    createTower(tileDiv) {
        const tower = new Tower(
            tileDiv.cost,
            tileDiv.upgrade,
            tileDiv.tileDivImg,
            tileDiv.tileDivAttackImg,
            tileDiv.type,
            tileDiv.range,
            tileDiv.damage,
            tileDiv.cooldown,
            tileDiv.speed
            );
        this.towers.push(tower);
    }

    placeTower(location) {
        const tower = towerTime.towers[towerTime.towers.length - 1]
        tower.location = new Vector( location.x, location.y )
        this.bits -= tower.cost
        tower.placed = true;
        towerTime.placingTower = false;
    }

    updateInfo() {
        let infoTiles = document.querySelectorAll('#info > .info-tile');
        for (let i = 0; i < infoTiles.length; i++) {
            let info = infoTiles[i];

            if (info.innerHTML.indexOf('Bank') != -1) {
                info.innerHTML = '<h4>Bank</h4> <br/>';
                const value = document.createElement('p');
                value.style.fontSize = '10pt';
                value.innerHTML = this.bits + "	¥";
                info.appendChild(value)
            } else if (info.innerHTML.indexOf('Lives') != -1) {
                info.innerHTML = '<h4>Lives</h4> <br/>';
                const value = document.createElement('p');
                value.style.fontSize = '10pt';
                value.innerHTML = this.lives;
                info.appendChild(value);
             } else if (info.innerHTML.indexOf('Score') != -1) {
                info.innerHTML = '<h4>Score</h4> <br/>';
                const value = document.createElement('p');
                value.style.fontSize = '10pt';
                value.innerHTML = this.score;
                info.appendChild(value);
            } else if (info.innerHTML.indexOf('Wave') != -1) {
                info.innerHTML = '<h4>Wave</h4> <br/>';
                const value = document.createElement('p');
                value.style.fontSize = '10pt';
                value.innerHTML = this.wave;
                info.appendChild(value);
            } else if (info.innerHTML.indexOf('Enemy') != -1) {
                info.innerHTML = '<h4>Enemy</h4> <br/>';
                const value = document.createElement('p');
                value.style.fontSize = '10pt';
                value.innerHTML = this.creepHealth;
                info.appendChild(value);
            }

        }
    }

    showTowerInfo() {
        let towerInfoTiles = document.querySelector('#tower-details').getElementsByClassName('detail-tile');
        let towerEditButtons = document.querySelector('#edit-tower-buttons').getElementsByClassName('edit-button');
        if (towerTime.selectedTower) {
            towerEditButtons[0].style.opacity = 100
            towerEditButtons[1].style.opacity = 100
            for (let i = 0; i < towerInfoTiles.length; i++) {
                let info = towerInfoTiles[i];
    
                if (info.innerHTML.indexOf('Type') != -1) {
                    info.innerHTML = '<h5>Type</h5>';
                    const value = document.createElement('p');
                    value.style.fontSize = '10pt';
                    value.innerHTML = towerTime.selectedTower.type;
                    info.appendChild(value)
                } else if (info.innerHTML.indexOf('Range') != -1) {
                    info.innerHTML = '<h5>Range</h5>';
                    const value = document.createElement('p');
                    value.style.fontSize = '10pt';
                    value.innerHTML = towerTime.selectedTower.range;
                    info.appendChild(value);
                } else if (info.innerHTML.indexOf('Damage') != -1) {
                    info.innerHTML = '<h5>Damage</h5>';
                    const value = document.createElement('p');
                    value.style.fontSize = '10pt';
                    value.innerHTML = towerTime.selectedTower.damage;
                    info.appendChild(value);
                } else if (info.innerHTML.indexOf('Cooldown') != -1) {
                    info.innerHTML = '<h5>Cooldown</h5>';
                    const value = document.createElement('p');
                    value.style.fontSize = '10pt';
                    value.innerHTML = towerTime.selectedTower.cooldown;
                    info.appendChild(value);
                }else if (info.innerHTML.indexOf('Next') != -1) {
                    info.innerHTML = '<h5>Next</h5>';
                    const value = document.createElement('p');
                    value.style.fontSize = '10pt';
                    if (towerTime.selectedTower.canUpgrade) {
                        value.innerHTML = towerTime.selectedTower.upgrade + " ¥";
                    } else {
                        value.innerHTML = "Max";
                    }
                    info.appendChild(value);
                }
                if (!towerTime.selectedTower.canUpgrade) {
                    towerEditButtons[0].style.opacity = 0
                }
    
            }
        } else {
            towerEditButtons[0].style.opacity = 0
            towerEditButtons[1].style.opacity = 0
        }
    }

    loadGrid() {
        let id = 1;

        for (let c = 0; c < this.numCols; c++) {
            this.grid.push([]);
            for (let r = 0; r < this.numRows; r++)
                this.grid[c].push(new Cell(this, id++, c, r));
        }

        this.initBlocks();
    }

    initBlocks() {
        for (let c = 0; c < this.numCols; c++) {
            for (let r = 0; r < this.numRows; r++)
                this.grid[c][r].occupied = false;
        }

        for (let i = 0; i < this.numBlocks; i++) {
            this.grid[Math.floor(Math.random() * 20)][Math.floor(Math.random() * 13)].occupied = true;
        }

        this.goal = this.grid[Math.floor(Math.random() * 5) + 15][Math.floor(Math.random() * 12) + 1];
        this.start = this.grid[Math.floor(Math.random() * 1) + 1][Math.floor(Math.random() * 10) + 1];
        this.start.occupied = false;
        this.goal.occupied = false;
        this.goal.value = 0;
    }

    findPath() {
        this.grid.forEach(col => {
            col.forEach(cell => {
                if (cell !== this.goal) {
                    cell.value = -1;
                    cell.adjacent = [];
                }
            })
        })
        for (let c = 0; c < this.numCols; c++) {
            for (let r = 0; r < this.numRows; r++)
                this.grid[c][r].loadAdjacentCells();
        }
        const checkCells = [this.goal]
        while (checkCells.length) {
            const current = checkCells.shift();
            for (let i = 0; i < current.adjacent.length; i++) {  
                const cell = current.adjacent[i];
                if(cell.value === -1){
                    checkCells.push(cell);
                    cell.value = current.value + 1;
                }             
            }
        }
        for (let col = 0; col < this.grid.length; col++) {
            for (let row = 0; row < this.grid[col].length; row++) {
                if (!this.grid[col][row].occupied) {
                    this.grid[col][row].getShortestRoute()
                }
            }
        }
        if (!this.validated) {
            this.ensureValidMap();
        }
    }

    ensureValidMap() {
        
        let checkBlock = false;

        for (let c = 0; c < this.numCols; c++) {
            for (let r = 0; r < this.numRows; r++)
                if (this.grid[c][r].value === -1 && !this.grid[c][r].occupied) {
                    checkBlock = true;
                }
        }

        if (checkBlock) {
            this.initBlocks();
            this.findPath();
        } else {
            this.validated = true
        }
    }

    loadCreeps(numCreeps) {
        for (let i = 0; i < numCreeps; i++) {
            setTimeout(this.sendCreep,1500*i)
        }
    }

    sendCreep() {
        const location = towerTime.start.center.copy();
        const creep = new Creep(location, towerTime.multiplier)
        towerTime.creeps.push(creep)
    }

    gridAttacks() {
        for (let i = 0; i < this.attacks.length; i++) {
            const attack = this.attacks[i]
            const gridCol = Math.floor(attack.location.x / towerTime.cellSize)
            const gridRow = Math.floor(attack.location.y / towerTime.cellSize)
            if (towerTime.grid[gridCol] && towerTime.grid[gridCol][gridRow]) {
                const cell = towerTime.grid[gridCol][gridRow];
                cell.attacked = true;
                cell.attackDamage = attack.damage;
                if (attack.type === "Water") {
                    cell.attackSlow = true;
                    setTimeout(()=> cell.attackSlow = false, 1000); 
                }

                for (let j = 0; j < this.creeps.length; j++) {
                    if (cell === this.creeps[j].currentCell) {
                        if (attack.type != "Air") {
                            attack.hit = true;
                        }
                    }
                }
            }

        }
    }

    checkWave() {
        const send = document.querySelector("#start-button");
        if (towerTime.autoWave && !towerTime.sendingWave && !towerTime.creeps.length ) {
            send.click();
            towerTime.sendingWave = true;
            setTimeout(()=>{
                towerTime.sendingWave = false
            }, 1000);
        }
        if (!towerTime.creeps.length && !towerTime.sendingWave && towerTime.wave > 0) {
            send.classList.add("active");
        } else {
            send.classList.remove("active");
        }
        if (towerTime.wave === 0 && towerTime.bits < 50) { 
            document.querySelector("#towers").classList.remove("active");
            document.querySelector("#info-bits").classList.remove('active');
            send.classList.add("active");
            tutorial.showInfo("canvas");
        }
    }

    handleGameStart() {
        if (!this.gameStarted) {
            const towerEditButtons = document.querySelector('#edit-tower-buttons').getElementsByClassName('edit-button');
            towerEditButtons[0].style.opacity = 0;
            towerEditButtons[1].style.opacity = 0;
            this.context.fillStyle = "rgba(200, 200, 200, .1)";
            this.context.fillRect(0, 0, 800, 520);
            this.context.font = "100px Trebuchet MS";
            this.context.fillStyle = "#333";
            this.context.textAlign = "center";
            this.context.fillText("Tower Time", 400, 150);
            const titleUnderline = new Image();
            titleUnderline.onload = () => (
                this.context.drawImage(titleUnderline, this.canvas.width / 2 - titleUnderline.width / 2, 170))
            titleUnderline.src = "images/title-underline.png";
            this.context.font = "27px Trebuchet MS";
            this.context.fillStyle = "#333";
            this.context.fillText("Click 'Play' to Start Building Towers", 400, 240)
            this.context.font = "18px Trebuchet MS";
            this.context.fillStyle = "rgba(68, 74, 110, 1)";
            this.context.fillText("hover over anything to get tooltips", 400, 280);
            this.context.font = "25px Trebuchet MS";
            this.context.fillStyle = "#333";
            this.context.fillText("Tower Abilities", 400, 350);
            this.context.font = "15px Trebuchet MS";
            this.context.fillStyle = "rgba(68, 74, 110, 1)";
            this.context.fillText("Earth: None     Water: Slows Enemies     Fire: Fast Attack     Air: Through Attack", 400, 380);
            this.context.font = "25px Trebuchet MS";
            this.context.fillStyle = "#333";
            this.context.fillText("Optional Hotkeys", 400, 430);
            this.context.font = "15px Trebuchet MS";
            this.context.fillStyle = "rgba(68, 74, 110, 1)";
            this.context.fillText("Earth: 1    Water: 2    Fire: 3    Air: 4    Upgrade: Q    Sell: S    Deselect: Esc", 400, 460);
            this.context.font = "20px Trebuchet MS";
            this.context.fillStyle = "#333";
            // this.context.fillText("Click 'Play' when Ready!", 400, 500);

        } else {
            this.render();
        }
    }

    handleGameOver() {
        // towerTime.music.setAttribute('src', 'sounds/game_over.mp3');
        // towerTime.music.load();
        // if (!towerTime.muted) {
        //     towerTime.music.playbackRate = 0.95;
        //     towerTime.music.play();
        // }
        this.context.fillStyle = "rgba(125, 125, 125, 0.7)";
        this.context.fillRect(0, 0, 800, 520);
        this.context.font = "100px Trebuchet MS";
        this.context.fillStyle = "#333"
        this.context.textAlign = "center";
        this.context.fillText("Game Over", 400, 210);
        this.context.font = "40px Trebuchet MS";
        this.context.fillStyle = "#333"
        this.context.textAlign = "center";
        this.context.fillText(`Final Score: ${this.score}`, 400, 280);
        this.lives = 0;
        this.gameOver = true;
        const button = document.querySelector("#start-button");
        button.innerText = "New Game";
        button.addEventListener('click', this.newGame, false);
    }

    newGame() {
        window.location.reload(false);
    }

    run() {

        this.updateInfo();
        if (!this.gameOver && this.gameStarted) {
            this.render();
            this.showTowerInfo();
            this.gridAttacks();
            this.checkWave();
            for (let c = 0; c < this.numCols; c++) {
                for (let r = 0; r < this.numRows; r++)
                this.grid[c][r].run();
            }
            for (let i = 0; i < this.towers.length; i++) {
                let tower = this.towers[i];
                if (!tower.removed) {
                    tower.run();
                } else {
                    this.towers.splice(i, 1);
                }
            }
            for (let i = 0; i < this.creeps.length; i++) {
                let creep = this.creeps[i];
                if (creep.alive) {
                    creep.run();
                } else {
                    this.creeps.splice(i, 1);
                }
            }
            for (let i = 0; i < this.attacks.length; i++) {
                let attack = this.attacks[i]
                if (!attack.hit) {
                    attack.run();
                } else {
                    this.attacks.splice(i, 1);
                }
            }
            if (this.lives <= 0) {
                setTimeout(this.handleGameOver(), 1000);
            }
        }
    }

    render() {
        this.context.clearRect(0, 0, 800, 520);
    }

}