'use strict'

class Creep {
    constructor(location) {
        // this.currentCell = this.game.grid[0][1];
        // this.location = this.game.grid[0][8].center.copy();
        this.location = location
        this.velocity = new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
        this.acceleration = new Vector(0, .0015);
        this.radius = 12;
        this.color = "rgb(200, 200, 200)" //add to input
        this.alive = true;
    }



    run() {
        this.checkWalls()
        this.checkEdges()
        if (this.alive) {
            this.update();
            this.render();
        }
    }

    checkEdges() {
        if (this.location.x <= 5 || this.location.x > 795) {
            this.velocity.x = - this.velocity.x
        }
        if (this.location.y <= 5 || this.location.y > 515) {
            this.velocity.y = - this.velocity.y
        }
    }

    checkWalls() {
        let col = Math.floor(this.location.x / towerTime.cellSize);
        let row = Math.floor(this.location.y / towerTime.cellSize);
        if (towerTime.grid && towerTime.grid[col] && towerTime.grid[col][row].occupied) {
            // if (this.velocity.x > this.velocity.y) {
                this.velocity.x = - this.velocity.x
            // } else {
                this.velocity.y = - this.velocity.y
            // }
        }
    }

    update() {
        let col = Math.floor(this.location.x/towerTime.cellSize);
        let row = Math.floor(this.location.y/towerTime.cellSize);

        if (towerTime.grid[col][row] === towerTime.goal) {
            this.alive = false;
            // take life away
            return
        }
        if (towerTime.grid[col][row] && !towerTime.grid[col][row].occupied) {
            let currentCell = towerTime.grid[col][row];
            let nextCell = currentCell.smallestAdjacent;
            this.acceleration = this.acceleration.subGetNew(nextCell.center, currentCell.center);
            this.acceleration.setMag(0.05);
        }

        this.velocity.add(this.acceleration)
        // this.velocity.add(this.acceleration)
        this.velocity.limit(this.velocity);
        this.location.add(this.velocity);
    }

    render() {
        const context = towerTime.context;
        context.beginPath();
        context.arc(this.location.x, this.location.y, this.radius, 0, Math.PI * 2);
        context.strokeStyle = "rgb(0,0,0)";
        context.stroke();
        context.fillStyle = this.color;
        context.fill();
    }
    
}