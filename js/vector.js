'use strict'

class JSVector {
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

    addGetNew(vec1, vec2) {
        const x = vec1.x + vec2.x;
        const y = vec1.y + vec2.y;

        const newVec = new JSVector(x,y)
        return newVec;
    };

    subGetNew(vec1, vec2) {
        const x = vec1.x - vec2.x;
        const y = vec1.y - vec2.y;

        const newVec = new JSVector(x,y);
        return newVec;
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
}

// export default JSVector