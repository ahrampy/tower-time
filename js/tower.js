'use strict'

class Tower{
    constructor(cost, img, atkImg) {
        this.cost = cost;
        this.img = img;
        this.atkImg = atkImg;
        this.cooldown = 500 // add input
        this.range = 200 //add input
        this.location = new Vector(0,0);
        this.angle = 0;
        this.visible = false
        this.placed = false
        this.lastFired = Date.now()
        this.target = null;
        this.follow = true;
    }
    
    run(){
        this.update();
        this.render();
    }

    findTarget() {
        for (let i = 0; i < towerTime.creeps.length; i++) {
            if (towerTime.creeps[i].location.dist(this.location) < this.range && towerTime.creeps[i].alive) {
                this.follow = false
                return towerTime.creeps[i].location
            } 
        }
        this.target = new Vector(towerTime.canvas.mouseX, towerTime.canvas.mouseY)
        this.follow = true // mouse default
        return this.target
    }

    checkCreeps() {

    }
    
    checkFire() {
        let mils = Date.now()
        // let dx= this.location.x - towerTime.canvas.mouseX
        // let dy= this.location.y - towerTime.canvas.mouseY
        // let dx= this.location.x - this.target.x
        // let dy= this.location.y - this.target.y
        // let dist = Math.sqrt(dx*dx + dy*dy);
        let dist = this.location.dist(this.target)
        if (dist < this.range && this.placed && mils - this.lastFired > this.cooldown
            && towerTime.creeps.length !== 0 && !this.follow) {
            this.lastFired = mils
            const attackLocation = new Vector(this.location.x, this.location.y);
            const attack = new Attack(attackLocation, this.angle, this.atkImg);
            towerTime.attacks.push(attack);
        }
    }

    update(){
        this.target = this.findTarget()
        let dx = this.location.x - this.target.x;
        let dy = this.location.y - this.target.y;
        this.angle = Math.atan2(dy, dx) - Math.PI;
        this.checkFire();
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
}