"use strict";

class Attack {
  constructor(location, context, angle, idx, level, type, damage, speed) {
    this.location = location.copy();
    this.context = context;
    this.angle = angle;
    this.radius = 10;
    this.idx = idx;
    this.level = level;
    this.type = type;
    this.speed = 5;
    this.hit = false;
    this.damage = damage;
    this.speed = speed;
    this.width = 18;
    this.height = 18;
  }

  run() {
    this.update();
    this.render();
  }

  update() {
    this.location.y += Math.sin(this.angle) * this.speed;
    this.location.x += Math.cos(this.angle) * this.speed;
    if (
      this.location.x > 800 ||
      this.location.x < 0 ||
      this.location.y > 520 ||
      this.location.y < 0
    ) {
      this.hit = true;
    }
  }

  render() {
    this.context.save();

    this.context.translate(this.location.x, this.location.y);
    this.context.rotate(this.angle);
    this.context.drawImage(
      attackSprites,
      this.level * this.width,
      this.idx * this.height,
      this.width,
      this.height,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    this.context.restore();
  }
}
