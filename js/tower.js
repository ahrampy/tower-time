"use strict";

class Tower {
  constructor(
    context,
    idx,
    cost,
    upgrade,
    type,
    range,
    damage,
    cooldown,
    speed
  ) {
    // * images
    this.width = 32;
    this.height = 32;

    // * stats
    this.idx = idx;
    this.cost = cost;
    this.upgrade = upgrade;
    this.type = type;
    this.range = range;
    this.cooldown = cooldown;
    this.damage = damage;
    this.speed = speed;

    // * location
    this.cell = null;
    this.location = new Vector(0, 0);

    // * attack time
    this.lastFired = Date.now();

    // * direction
    this.context = context;
    this.angle = 0;
    this.target = null;
    this.follow = true;

    // * display
    this.selected = false;

    // * init
    this.level = 0;
    this.canUpgrade = true;
    this.visible = false;
    this.placed = false;
    this.removed = false;
  }

  findTarget() {
    for (let i = 0; i < game.creeps.length; i++) {
      if (
        game.creeps[i].location.dist(this.location) < this.range &&
        game.creeps[i].alive
      ) {
        this.follow = false;
        return game.creeps[i].location;
      }
    }
    this.target = new Vector(game.canvas.mouseX, game.canvas.mouseY);
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
      game.creeps.length !== 0 &&
      !this.follow
    ) {
      this.lastFired = mils;
      const attackLocation = new Vector(this.location.x, this.location.y);
      const attack = new Attack(
        attackLocation,
        this.context,
        this.angle,
        this.idx,
        this.level,
        this.type,
        this.damage,
        this.speed
      );
      game.attacks.push(attack);
    }
  }

  handleUpgrade() {
    this.level += 1;
    this.upgrade *= 2;
    this.damage = Math.ceil((this.damage * 2.5) / 5) * 5;
    this.range += 25;
    this.speed += 2;
    if (this.level === 2) {
      this.canUpgrade = false;
    }
  }

  select() {
    this.selected = true;
    game.towersArr.push(this);
    this.cell.selected = true;
    game.cellsArr.push(this.cell);
  }

  deselect(present) {
    this.selected = false;
    this.cell.selected = false;

    if (!present) {
      this.removed = true;
      this.cell.occupied = false;
    }
  }

  drawRange() {
    this.context.beginPath();
    this.context.arc(
      this.location.x,
      this.location.y,
      this.range,
      0,
      Math.PI * 2
    );
    this.context.strokeStyle = "rgba(222, 255, 252, 0.4)";
    this.context.lineWidth = 4;
    this.context.stroke();
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
    this.context.save();
    if (this.visible) {
      if (!this.placed) this.drawRange();
      this.context.translate(this.location.x, this.location.y);
      this.context.rotate(this.angle);
      this.context.drawImage(
        sprites.tower,
        this.level * this.width,
        this.idx * this.height,
        this.width,
        this.height,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    }

    this.context.restore();
  }
}
