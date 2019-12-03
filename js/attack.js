'use strict'

class Attack {
    constructor(location, angle, atkImg, type, damage) {
        this.location = location.copy();
        this.angle = angle;
        this.radius = 10;
        this.atkImg = atkImg;
        this.type = type;
        this.speed = 5;
        this.hit = false;
        this.damage = damage;
    }

    run() {
        this.update();
        this.render();
    }

    update() {
        this.location.y += Math.sin(this.angle)*this.speed;
        this.location.x += Math.cos(this.angle)*this.speed;
        if ( this.location.x > 800 || this.location.x < 0 || this.location.y > 520 || this.location.y < 0) {
            this.hit = true;
        }
    }

    render() {
        const context = towerTime.context;
        context.save();
        
            // context.beginPath();
            // context.arc(this.location.x, this.location.y, this.radius, 0, Math.PI * 2);

            // if (this.type === 0) {
            //     context.fillStyle = "rgba(111, 193, 145, 0.5)"
            // } else if (this.type === 1) {
            //     context.fillStyle = "rgba(116, 206, 228, 0.5)"
            // } else if (this.type === 2) {
            //     context.fillStyle = "rgba(236, 119, 75, 0.5)"
            // } else if (this.type === 3) {
            //     context.fillStyle = "rgba(237, 191, 71, 0.5)"
            // }
            // context.fill();

            context.translate(this.location.x, this.location.y);
            context.rotate(this.angle);
            context.drawImage(this.atkImg, -this.atkImg.width/2, -this.atkImg.height/2)

        context.restore()

    }
}