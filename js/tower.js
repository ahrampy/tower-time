'use strict'

// import JSVector from './vector';

class Tower{
    constructor(cost, img, atkImg) {
        this.cost = cost;
        this.img = img;
        this.atkImg = atkImg;
        this.cooldown = 500 // add input
        this.range = 200 //add input
        this.location = new JSVector(0,0);
        this.angle = 0;
        this.visible = false
        this.placed = false
        this.lastFired = Date.now()
    }
    
    run(){
        this.update();
        this.render();
        this.checkFire();
    }
    
    checkFire() {
        let mils = Date.now()
        let dx= this.location.x - towerTime.canvas.mouseX
        let dy= this.location.y - towerTime.canvas.mouseY
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < this.range && this.placed && mils - this.lastFired > this.cooldown) {
            this.lastFired = mils
            const attackLocation = new JSVector(this.location.x, this.location.y);
            const attack = new Attack(attackLocation, this.angle, this.atkImg);
            towerTime.attacks.push(attack);
        }
    }

    update(){
        let dx = this.location.x - towerTime.canvas.mouseX;
        let dy = this.location.y - towerTime.canvas.mouseY;
        this.angle = Math.atan2(dy, dx) - Math.PI;
    }

    render() {
        const context = towerTime.context;
        context.save()
            context.translate(this.location.x, this.location.y)
            context.rotate(this.angle);
            if (this.visible) {
                context.drawImage(this.img, -this.img.width/2, -this.img.height/2);
            }
        context.restore()
    }

    checkCreeps(){

    }
}

// export default Tower;