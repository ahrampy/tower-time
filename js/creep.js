'use strict'

class Creep {
    constructor(location) {
        this.location = location;
        this.velocity = new JSVector(Math.random() * 2 - 1, Math.random() * 2 - 1);
        this.acceleration = new JSVector(0, 0.025) //add to input
        this.radius = 10;
        this.color = "rgb(200, 200, 200)" //add to input
    }

    checkEdges() {
        if(this.location.x < 0 || this.location.x > 750) {
            this.velocity.x = - this.velocity.x
        }
        if(this.location.y < 0 || this.location.y > 500) {
            this.velocity.y = - this.velocity.y
        }
    }

    run() {
        this.checkEdges()
        this.update()
        this.render()
    }

    update() {
        this.velocity.add(this.acceleration)
        this.location.add(this.velocity)
    }

    render() {
        const context = towerTime.context
        context.beginPath();
        context.arc(this.location.x, this.location.y, this.radius, 0, Math.PI * 2);
        context.strokeStyle = "rgb(0,0,0)";
        context.stroke();
        context.fillStyle = this.color
        context.fill();
    }
}