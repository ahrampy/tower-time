'use strict'

// import JSVector from './vector';

class Tower{
    constructor(cost, img, atkImg) {
        this.cost = cost;
        this.img = img;
        this.atkImg = atkImg;
        this.location = new JSVector(0,0);
        this.angle = 0;
        this.visible = false
        this.placed = false
    }

    checkFire() {
        let dx= this.location.x - towerTime.canvas.mouseX
        let dy= this.location.y - towerTime.canvas.mouseY
    }

    run(){
        this.update();
        this.render();
        this.checkFire();
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