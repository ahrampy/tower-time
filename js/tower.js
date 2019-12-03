'use strict'

class Tower{
    constructor(cost, img, atkImg, type, range, damage, cooldown) {
        // images
        this.img = img;
        this.atkImg = atkImg;

        // stats
        this.cost = cost;
        this.type = type;
        this.range = range;
        this.cooldown = cooldown;
        this.damage = damage;

        // location
        this.location = new Vector(0,0);
        
        // attack time
        this.lastFired = Date.now();
        
        // direction
        this.angle = 0;
        this.target = null;
        this.follow = true;

        //display
        this.selected = false;

        // init
        this.visible = false
        this.placed = false
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
            const attack = new Attack(
                attackLocation, this.angle, this.atkImg, this.type, this.damage);
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
            if (this.visible) {
                if (!this.placed || this.selected) {
                    context.beginPath();
                    context.arc(this.location.x, this.location.y, this.range, 0, Math.PI * 2);
                    context.fillStyle = "rgba(200, 200, 200, 0.5)"
                    context.fill();
                }
                context.translate(this.location.x, this.location.y)
                context.rotate(this.angle);
                context.drawImage(this.img, -this.img.width/2, -this.img.height/2);
            }
            
        context.restore()
    }
}