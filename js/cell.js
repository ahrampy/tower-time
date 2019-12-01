'use strict'

class Cell{
    constructor(game, id, col, row) {
        this.id = id;
        this.location = new Vector(col * game.cellSize, row * game.cellSize);
        this.center = new Vector(this.location.x + game.cellSize / 2, this.location.y + game.cellSize / 2)
        this.game = game;
        this.context = game.context;
        this.size = game.cellSize;
        this.col = col;
        this.row = row;
        
        this.adjacent = [];
        this.value = -1;
        this.smallestAdjacent = null;
        this.smallestAdjacentIndex = 0;
        
        this.occupied = false;
        this.attacked = false
    }

    loadAdjacentCells() {

        const grid = this.game.grid

        //up
        if (this.row > 0
            && !this.occupied
            && !grid[this.col][this.row - 1].occupied
            ) {
            this.adjacent.push(grid[this.col][this.row - 1]);
        }
        //right
        if (this.col < grid.length - 1
            && !this.occupied
            && !grid[this.col + 1][this.row].occupied
            ) {
            this.adjacent.push(grid[this.col + 1][this.row]);
        }
        //down
        if (this.row < grid[this.col].length - 1
            && !this.occupied
            && !grid[this.col][this.row + 1].occupied
            ) {
            this.adjacent.push(grid[this.col][this.row + 1]);
        }
        //left
        if (this.col > 0
            && !this.occupied
            && !grid[this.col - 1][this.row].occupied
            ) {
            this.adjacent.push(grid[this.col - 1][this.row]);
        }
    }

    getShortestRoute() {
        let smallest = 10000;
        for (let i = 0; i < this.adjacent.length; i++) {
            if (this.adjacent[i].value < smallest) {
                smallest = this.adjacent[i].value;
                this.smallestAdjacentIndex = i
            }
        }
        this.smallestAdjacent = this.adjacent[this.smallestAdjacentIndex];
    }

    run(){
        this.render();
        setTimeout(() => (this.attacked = false), 500)
    }

    render(){
        if (this === towerTime.goal) {
            this.context.fillStyle = "rgba(222, 23, 10, 0.7)"
        } else if (this === towerTime.start) {
            this.context.fillStyle = "rgba(68, 74, 110, 0.33)"
        } else if (this.occupied) {
            this.context.fillStyle = "rgba(57, 255, 47, 0.27)"
        // } else if (this.attacked) {
            // this.context.fillStyle = "rgb(206, 202, 202)"
        } else {
            this.context.fillStyle = "rgba(150, 151, 129, 0.06)"
        }

        this.context.fillRect(this.location.x, this.location.y, this.size, this.size)
        // this.context.strokeStyle = "#333333"
        // this.context.strokeRect(this.location.x, this.location.y, this.size, this.size)
        // this.context.font = "11px Arial"
        // this.context.fillStyle = "#333333"
        // this.context.fillText(this.value, this.location.x + 5, this.location.y + 10)
    }
}