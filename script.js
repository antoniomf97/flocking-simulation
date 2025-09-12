const flock = [];

let alignSlider, cohesionSlider, separationSlider;

function setup() {
    createCanvas(1200, 600);

    let sliderDiv = createDiv();
    sliderDiv.style("display", "flex");
    

    let sepDiv = createDiv();
    sepDiv.html("Separation: ");
    sepDiv.style("align-items", "center");
    separationSlider = createSlider(0, 1, 1, 0.01);
    separationSlider.parent(sepDiv);
    sepDiv.parent(sliderDiv);

    let algDiv = createDiv();
    algDiv.html("Align: ");
    alignSlider = createSlider(0, 1, 0.75, 0.01);
    alignSlider.parent(algDiv);
    algDiv.parent(sliderDiv);

    let cohDiv = createDiv();
    cohDiv.html("Cohesion: ");
    cohesionSlider = createSlider(0, 1, 0.5, 0.01); 
    cohesionSlider.parent(cohDiv);
    cohDiv.parent(sliderDiv);

    let mxsDiv = createDiv();
    mxsDiv.html("MaxSpeed: ");
    maxspeedSlider = createSlider(1, 10, 3, 0.5); 
    maxspeedSlider.parent(mxsDiv);
    mxsDiv.parent(sliderDiv);

    for  (let i = 0; i < 300; i++) {
        flock.push(new Boid());
    }
}

function draw() {
    background(51);

    for (let boid of flock) {
        boid.edges();
        boid.flock(flock);
        boid.update();
        boid.show();
    }
}