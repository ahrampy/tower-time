"use strict";

class Tower {
  constructor(
    cost,
    upgrade,
    img,
    atkImg,
    type,
    range,
    damage,
    cooldown,
    speed
  ) {
    // images
    this.img = img;
    this.atkImg = atkImg;

    // stats
    this.cost = cost;
    this.upgrade = upgrade;
    this.type = type;
    this.range = range;
    this.cooldown = cooldown;
    this.damage = damage;
    this.speed = speed;

    // location
    this.location = new Vector(0, 0);

    // attack time
    this.lastFired = Date.now();

    // direction
    this.angle = 0;
    this.target = null;
    this.follow = true;

    //display
    this.selected = false;

    // init
    this.upgradeLevel = 1;
    this.canUpgrade = true;
    this.removed = false;
    this.visible = false;
    this.placed = false;
  }

  findTarget() {
    for (let i = 0; i < tt.creeps.length; i++) {
      if (
        tt.creeps[i].location.dist(this.location) < this.range &&
        tt.creeps[i].alive
      ) {
        this.follow = false;
        return tt.creeps[i].location;
      }
    }
    this.target = new Vector(tt.canvas.mouseX, tt.canvas.mouseY);
    this.follow = true;
    return this.target;
  }

  checkFire() {
    let mils = Date.now();

    let dist = this.location.dist(this.target);
    if (
      dist < this.range &&
      this.placed &&
      mils - this.lastFired > this.cooldown &&
      tt.creeps.length !== 0 &&
      !this.follow
    ) {
      this.lastFired = mils;
      const attackLocation = new Vector(this.location.x, this.location.y);
      const attack = new Attack(
        attackLocation,
        this.angle,
        this.atkImg,
        this.type,
        this.damage,
        this.speed
      );
      tt.attacks.push(attack);
    }
  }

  handleUpgrade() {
    this.upgradeLevel += 1;
    this.upgrade *= 2;
    this.damage = Math.ceil((this.damage * 2.5) / 5) * 5;
    this.range += 25;
    this.speed += 2;

    if (this.type === "Earth") {
      if (this.upgradeLevel === 2) {
        this.img = new Image();
        this.img.src = "images/earth/green-tower-2.png";
        this.atkImg = new Image();
        this.atkImg.src = "images/earth/green-tower-atk-2.png";
      } else {
        this.img = new Image();
        this.img.src = "images/earth/green-tower-3.png";
        this.atkImg = new Image();
        this.atkImg.src = "images/earth/green-tower-atk-3.png";
      }
    } else if (this.type === "Water") {
      if (this.upgradeLevel === 2) {
        this.img = new Image();
        this.img.src = "images/water/blue-tower-2.png";
        this.atkImg = new Image();
        this.atkImg.src = "images/water/blue-tower-atk-2.png";
      } else {
        this.img = new Image();
        this.img.src = "images/water/blue-tower-3.png";
        this.atkImg = new Image();
        this.atkImg.src = "images/water/blue-tower-atk-3.png";
      }
    } else if (this.type === "Fire") {
      if (this.upgradeLevel === 2) {
        this.img = new Image();
        this.img.src = "images/fire/red-tower-2.png";
        this.atkImg = new Image();
        this.atkImg.src = "images/fire/red-tower-atk-2.png";
      } else {
        this.img = new Image();
        this.img.src = "images/fire/red-tower-3.png";
        this.atkImg = new Image();
        this.atkImg.src = "images/fire/red-tower-atk-3.png";
      }
    } else if (this.type === "Air") {
      // this.cooldown += 200;
      if (this.upgradeLevel === 2) {
        this.img = new Image();
        this.img.src = "images/air/yellow-tower-2.png";
        this.atkImg = new Image();
        this.atkImg.src = "images/air/yellow-tower-atk-2.png";
      } else {
        this.img = new Image();
        this.img.src = "images/air/yellow-tower-3.png";
        this.atkImg = new Image();
        this.atkImg.src = "images/air/yellow-tower-atk-3.png";
      }
    }

    if (this.upgradeLevel === 3) {
      this.canUpgrade = false;
    }
  }

  run() {
    this.update();
    this.render();
  }

  update() {
    this.target = this.findTarget();
    let dx = this.location.x - this.target.x;
    let dy = this.location.y - this.target.y;
    this.angle = Math.atan2(dy, dx) - Math.PI;
    this.checkFire();
  }

  render() {
    const context = tt.context;
    context.save();
    if (this.visible) {
      if (!this.placed || this.selected) {
        context.beginPath();
        context.arc(
          this.location.x,
          this.location.y,
          this.range,
          0,
          Math.PI * 2
        );
        context.fillStyle = "rgba(222, 255, 252, 0.3)";
        context.fill();
      }
      context.translate(this.location.x, this.location.y);
      context.rotate(this.angle);
      context.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);
    }

    context.restore();
  }
}
