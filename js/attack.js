'use strict'

class Attack {
    constructor(location, angle, attackImg) {
        this.location = location;
        this.angle = angle;
        this.attackImg = attackImg;
        this.speed = 5;
    }

    run() {
        this.update();
        this.render();
    }

    update() {
        this.location.y += Math.sin(this.angle)*this.speed;
        this.location.x += Math.cos(this.angle)*this.speed;
    }

    render() {
        const context = towerTime.context;
            context.save();
                context.translate(this.location.x, this.location.y);
                context.rotate(this.angle);
                context.drawImage(this.attackImg, -this.attackImg.width/2, -this.attackImg.height/2);
            context.restore()
    }
}