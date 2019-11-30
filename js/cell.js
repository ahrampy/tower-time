'use strict'

class Cell{
    constructor(game, id, col, row) {
        this.id = id;
        this.location = new JSVector(col * game.cellSize, row * game.cellSize);
        this.game = game;
        this.context = game.context;
        this.size = game.cellSize;
        this.occupied = false;
    }

    run(){
        this.render()
    }

    render(){
        // this.context.strokeStyle = "#112233"
        // this.context.fillRect(this.location.x, this.location.y, this.size, this.size)
        // this.context.strokeRect(this.location.x, this.location.y, this.size, this.size)
    }
}