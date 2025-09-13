class Boid {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2.5, 5));
        this.acceleration = createVector();
        this.maxSpeed = 6;
        this.maxForce = 0.2;
        this.brightness = random(30, 100);
        this.saturation = random(50, 100);
        this.color = color(0, 150, 255);
    }

    steer(boids) {
		// console.log(boids);
		let align = createVector();
		let cohesion = createVector();
		let seperation = createVector();		
		let extraForce = createVector();
		let total = 0;
		let sTotal = 0;

		for (let b of boids) {
			let other = b.userData;
			if (!(other == this || other == "swirl")) {
				align.add(other.velocity);
				cohesion.add(other.position);
				let diff = p5.Vector.sub(
						this.position,
						other.position
					);
				let d = diff.x*diff.x + diff.y*diff.y;
				diff.div(d);
				seperation.add(diff);
				total++;
			} else if (other == "swirl") {
				let pos = createVector(b.x,b.y);
				extraForce.add(pos);
				sTotal ++;
			}
		}
		
		let steer = [align, cohesion, seperation];
		if (sTotal > 0) {
			steer.push(extraForce);
		}
		if (total > 0) {
			for (let vec = 0; vec < steer.length; vec++) {
				if (vec == 3) {
					steer[vec].div(sTotal);
					steer[vec].sub(this.position);
				;} else {steer[vec].div(total);}				
				if (vec == 1) {
					steer[vec].sub(this.position);		
				}
				steer[vec].setMag(this.maxSpeed);
				steer[vec].sub(this.velocity);
				steer[vec].limit(this.maxForce);
			}
		}
		return steer;
	}

    // separate(boids) {
    //     // steer to avoid crowding local flockmates 
    //     let steering = createVector();
    //     let total = 0;
    //     for (let other of boids) {
    //         let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
    //         if (other != this && d < perceptionRadius) {
    //             let diff = p5.Vector.sub(this.position, other.position);
    //             diff.div(d * d);
    //             steering.add(diff);
    //             total++;
    //         }
    //     }
    //     if (total > 0) {
    //         steering.div(total);
    //         steering.setMag(this.maxSpeed);
    //         steering.sub(this.velocity);
    //         steering.limit(this.maxForce);
    //     }

    //     return steering;
    // }

    // align(boids) {
    //     // steer towards the average heading of local flockmates
    //     let steering = createVector();
    //     let total = 0;
    //     for (let other of boids) {
    //         let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
    //         if (other != this && d < perceptionRadius) {
    //             steering.add(other.velocity);
    //             total++;
    //         }
    //     }

    //     if (total > 0) {
    //         steering.div(total);
    //         steering.setMag(this.maxSpeed);
    //         steering.sub(this.velocity);
    //         steering.limit(this.maxForce);
    //     }

    //     return steering;
    // }

    // cohesion(boids) {
    //     // steer to move toward the average position of local flockmates 
    //     let steering = createVector();
    //     let total = 0;
    //     for (let other of boids) {
    //         let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
    //         if (other != this && d < perceptionRadius+5) {
    //             steering.add(other.position);
    //             total++;
    //         }
    //     }
    //     if (total > 0) {
    //         steering.div(total);
    //         steering.sub(this.position);
    //         steering.setMag(this.maxSpeed);
    //         steering.sub(this.velocity);
    //         steering.limit(this.maxForce);
    //     }
    //     return steering;
    // }

    flock(boids) {
        let steer = this.steer(boids);
		let alignment = steer[0].mult(alignSlider.value());
		let cohesion = steer[1].mult(cohesionSlider.value());
		let separation = steer[2].mult(separationSlider.value());

        this.acceleration = alignment;
		this.acceleration.add(cohesion);
		this.acceleration.add(separation);
    }

    edges() {
		if(this.position.x > width + 10) {
			this.position.x = 0;
		} else if (this.position.x < 0 - 10) {
			this.position.x = width;
		}
		if (this.position.y > height + 10) {
			this.position.y = 0;
		} else if (this.position.y < - 10) {
			this.position.y = height;
		}
	}

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);

        this.velocity.limit(this.maxSpeed);
        this.maxSpeed = maxspeedSlider.value()
    }

    show() {
        strokeWeight(4);
        stroke(this.color, this.saturation, this.brightness);
        point(this.position.x, this.position.y);
    }
}