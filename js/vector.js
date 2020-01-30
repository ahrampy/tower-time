'use strict';

class Vector {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    };

    add(vec) {
        this.x += vec.x
        this.y += vec.y
    };

    sub(vec) {
        this.x -= vec.x
        this.y -= vec.y
    };

    normalize() {
        const len = Math.sqrt(this.x * this.x + this.y * this.y);
        this.x /= len;
        this.y /= len;
        return new Vector(this.x, this.y)
    }

    slow() {
        this.x /=2;
        this.y /=2;
        return new Vector(this.x, this.y);
    }

    addGetNew(vec1, vec2) {
        const x = vec1.x + vec2.x;
        const y = vec1.y + vec2.y;

        return new Vector(x,y)
    };

    subGetNew(vec1, vec2) {
        const x = vec1.x - vec2.x;
        const y = vec1.y - vec2.y;

        return new Vector(x,y);
    };

    getDir() {
        return Math.atan2(this.y, this.x);
    };

    getMag() {
        const x2 = this.x * this.x;
        const y2 = this.y * this.y;

        return Math.sqrt.apply(x2 + y2)
    };

    setDir(newAngle) {
        const magnitude = this.getMag()
        this.x = Math.cos(newAngle) * magnitude;
        this.y = Math.sin(newAngle) * magnitude;
    };

    setMag(magnitude) {
        const angle = this.getDir();
        this.x = Math.cos(angle) * magnitude;
        this.y = Math.sin(angle) * magnitude;
    }

    dist(vector) {
        const x = this.x - vector.x;
        const y = this.y - vector.y;
        
        return Math.sqrt(x*x + y*y);
    }

    copy() {
        return new Vector(this.x, this.y);
    }
}