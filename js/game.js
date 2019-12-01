'use strict'

window.addEventListener('load', init, false)

var towerTime;
// const FRAME_RATE = 30;

function init() {
    towerTime = new Game();
    window.setTimeout(animate, 100);
}

function animate() {
    towerTime.run();
    window.requestAnimationFrame(animate)
}

class Game {
    constructor() {
        this.towers = [];
        this.creeps = [];
        this.attacks = []; //tower attacks/moves
        this.grid = [];

        this.start = null;
        this.goal = null;

        this.bits = 1000 // testing

        this.placingTower = false;

        this.canvas = document.createElement("canvas");
        this.canvas.width = 800
        this.canvas.height = 520
        document.getElementById('game-canvas').appendChild(this.canvas)
        this.canvas.addEventListener('mousemove', this.handleCanvasMouseMoved, false)
        this.canvas.addEventListener('mouseover', this.handleCanvasMouseOver, false)
        this.canvas.addEventListener('click', this.handleCanvasMouseClicked, false)
        this.context = this.canvas.getContext("2d");

        this.cellSize = 40
        this.numCols = 20
        this.numRows = 13

        this.tileDivs = this.createTileDivs();
        this.handleDomCallbacks(this.tileDivs);
        this.loadGrid();
        this.findPath()
        setTimeout(this.loadCreeps(20), 2000)
        // this.loadCreeps(45); //num enemies
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
        if (towerTime.placingTower){
            towerTime.placeTower();
            const mouseX = event.offsetX; //test
            const mouseY = event.offsetY; //test
    
            const gridCol = Math.floor(mouseX/towerTime.cellSize) //test
            const gridRow = Math.floor(mouseY/towerTime.cellSize) //test
    
            const cell = towerTime.grid[gridCol][gridRow];
            cell.occupied = true; 
    
            towerTime.findPath();
            for (let c = 0; c < this.numCols; c++) {
                for (let r = 0; r < this.numRows; r++)
                    this.grid[c][r].loadAdjacentCells()
            }
        }
    }

    createTileDivs() {
        const tileDivs = [];
        for (let i = 0; i < 4; i++) {
            const tileDiv = document.createElement("div");
            const tileImgPath = "images/dot.png"
            const lilImgPath = "images/lil-dot.png"
            const attackImgPath = "images/attack-dot.png"

            tileDiv.tileDivImg = new Image();
            tileDiv.tileDivImg.src = lilImgPath;
            // tileDiv.tileDivImg = addEventListener('load', this.hideElementImg, false);

            tileDiv.tileDivAttackImg = new Image();
            tileDiv.tileDivAttackImg.src = attackImgPath;
            // tileDiv.tileDivAttackImg = addEventListener('load', this.hideElementImg, false);

            document.getElementById('towers').appendChild(tileDiv);

            tileDiv.cost = 10 * (i + 1)
            tileDiv.id = i
            tileDivs.push(tileDiv);
            
            const tileImg = new Image();
            tileImg.src = tileImgPath;
            tileDiv.appendChild(tileImg)
            
        }
        return tileDivs;
    }

    handleDomCallbacks(tiles) {
        for(let i = 0; i < tiles.length; i++) {
            const tileDiv = tiles[i];
            tileDiv.addEventListener('mouseover',this.tileRollOver, false)
            tileDiv.addEventListener('mouseout',this.tileRollOut, false)
            tileDiv.addEventListener('mousedown',this.tilePressed, false)
            tileDiv.addEventListener('click',this.tileClicked, false)
        }
    }

    tileRollOver() {
        this.style.backgroundColor = 'rgba(57, 255, 47, 0.27)';
    }

    tileRollOut() {
        this.style.backgroundColor = 'rgba(68, 74, 129, 0.57)';
    }

    tilePressed() {
        this.style.backgroundColor = '#333333';
    }

    tileClicked() {        
        if (towerTime.placingTower === true) return;
        if (towerTime.bits > this.cost) {            
            towerTime.createTower(this);
            towerTime.placingTower = true;
        }
    }

    createTower(tileDiv) {
        const tower = new Tower(tileDiv.cost, tileDiv.tileDivImg, tileDiv.tileDivAttackImg);
        this.towers.push(tower);
    }

    placeTower() {
        towerTime.towers[towerTime.towers.length - 1].location = new Vector(
            this.canvas.mouseX, this.canvas.mouseY )
        towerTime.towers[towerTime.towers.length - 1].placed = true;
        towerTime.placingTower = false;
    }

    loadGrid() {
        let count = 1
        for (let c = 0; c < this.numCols; c++) {
            this.grid.push([])
            for (let r = 0; r < this.numRows; r++)
                this.grid[c].push(new Cell(this, count++, c, r))
        }
        for (let i = 0; i < 50; i++) {
            this.grid[Math.floor(Math.random() * 20)][Math.floor(Math.random() * 13)].occupied = true
        }
        // for (let c = 0; c < this.numCols; c++) {
        //     for (let r = 0; r < this.numRows; r++)
        //     this.grid[c][r].loadAdjacentCells()
        // }
        
        
        this.goal = this.grid[Math.floor(Math.random() * 5) + 15][Math.floor(Math.random() * 12) + 1];
        this.start = this.grid[Math.floor(Math.random() * 1) + 1][Math.floor(Math.random() * 10) + 1];
        this.start.occupied = false
        this.goal.occupied = false
        this.goal.value = 0
    }

    findPath() {
        this.grid.forEach(col => {
            col.forEach(cell => {
                if (cell !== this.goal) {
                    cell.value = -1
                    cell.adjacent = []
                }
            })
        })

        for (let c = 0; c < this.numCols; c++) {
            for (let r = 0; r < this.numRows; r++)
                this.grid[c][r].loadAdjacentCells()
        }

        const checkCells = [this.goal]
        while (checkCells.length) {
            const current = checkCells.shift();
            for (let i = 0; i < current.adjacent.length; i++) {  
                const cell = current.adjacent[i] 
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
    }

    loadCreeps(numCreeps) {
        for (let i = 0; i < numCreeps; i++) {
            setTimeout(this.sendCreep,1500*i)
        }
    }

    sendCreep() {
        const location = towerTime.start.center.copy();
        const creep = new Creep(location)
        towerTime.creeps.push(creep)
    }

    gridAttacks() {
        for (let i = 0; i < this.attacks.length; i++) {
            const attack = this.attacks[i].location
            const gridCol = Math.floor(attack.x / towerTime.cellSize)
            const gridRow = Math.floor(attack.y / towerTime.cellSize)
            if (towerTime.grid[gridCol] && towerTime.grid[gridCol][gridRow]) {
                const cell = towerTime.grid[gridCol][gridRow];
                cell.attacked = true
            }
        }
    }

    run() {

        this.render();
        this.gridAttacks()
        for (let c = 0; c < this.numCols; c++) {
            for (let r = 0; r < this.numRows; r++)
            this.grid[c][r].run()
        }
        for (let i = 0; i < this.towers.length; i++) {
            this.towers[i].run()
        }
        for (let i = 0; i < this.attacks.length; i++) {
            if (!this.attacks[i].hit) {
                this.attacks[i].run()
            }
        }
        for (let i = 0; i < this.creeps.length; i++) {
            if (this.creeps[i].alive) {
                this.creeps[i].run()
            }
        }
    }

    render() {
        this.context.clearRect(0, 0, 800, 520)
    }

}