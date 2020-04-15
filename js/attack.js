"use strict";

class Attack {
  constructor(location, angle, atkImg, type, damage, speed) {
    this.location = location.copy();
    this.angle = angle;
    this.radius = 10;
    this.atkImg = atkImg;
    this.type = type;
    this.speed = 5;
    this.hit = false;
    this.damage = damage;
    this.speed = speed;
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
    const context = tt.context;
    context.save();

    context.translate(this.location.x, this.location.y);
    context.rotate(this.angle);
    context.drawImage(
      this.atkImg,
      -this.atkImg.width / 2,
      -this.atkImg.height / 2
    );

    context.restore();
  }
}
