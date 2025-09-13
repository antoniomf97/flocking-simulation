const flock = [];
let flockSize = 2000;
let perceptionRadius = 25;

let quadtree;
let boundary;
let capacity = flockSize/200;

let alignSlider, cohesionSlider, separationSlider;

function setup() {
    createCanvas(1000, 600);

    boundary = new Rectangle (width/2, height/2, width/2, height/2);
    quadtree = new QuadTree(boundary, capacity)

    separationSlider = createSlider(0, 1, 1, 0.01);
    alignSlider = createSlider(0, 1, 0.75, 0.01);
    cohesionSlider = createSlider(0, 1, 0.5, 0.01); 
    maxspeedSlider = createSlider(1, 10, 3, 0.5); 

    for  (let i = 0; i < flockSize; i++) {
        flock.push(new Boid());
    }
}

function draw() {
    background(20);

    quadtree.clear();

    for (let boid of flock) {
        let p = new Point(boid.position.x, boid.position.y, boid);
        quadtree.insert(p);

        let range = new Circle(boid.position.x, boid.position.y, perceptionRadius);
		let neighbors = quadtree.query(range);

        boid.flock(neighbors);
        boid.edges();
        boid.update();
        boid.show();
    }

    quadtree.display();
}