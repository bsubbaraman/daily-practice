// blair subbaraman
// 2022.09.13

// ** laser cutting parameters **
let k = 10/3.528 // scale conversion to mm for laser cutting
let sw = 0.001; // trotec speedy wants a stroke width of 0.001mm

// ** phenakistoscope parameters **
let num_frames = 15; // how many frames in the animation? used for rotation guides

// ** simulation parameters **
let simulate = false;
let sim_theta = 0;
let frame_delay = 10;


function setup() {
    createCanvas(windowWidth, windowHeight, SVG);
    background(255);
    stroke(0);
    
    
    // need to change strokweight for laser cutting, but can't see it before that
    let saveButton = createButton('save svg!');
    saveButton.position(20, 20);
    saveButton.mousePressed(function() {
        simulate = false;
        noLoop();
        strokeWeight(sw*k);
        redraw();
        save('phenakistoscope.svg'); 
        strokeWeight(1);
        loop();
    });

    simulateButton = createButton('start/stop simulation');
    simulateButton.position(20, 50);
    simulateButton.mousePressed(function() {
        simulate = !simulate;
    })
}

function draw() {
    background(255);
    push()
    translate(width/2, height/2);
    // draw the overall material dimensions when editing, but don't export it with the svg
    if (isLooping() && !simulate) { drawStockMaterial() }

    if (simulate) {
        sim_theta += TWO_PI/num_frames;
        rotate(sim_theta);
        frameRate(frame_delay);
    }
    drawGeometry();
    pop()
}

function drawGeometry(rotation_guides = true) {
    // draw an ellipse at the center, for placement
    ellipse(0, 0, 2*k,2*k);

    let r = 3*k;
    let denominator = 18;
    for (let R = 20*k; R < 75*k; R += 10*k) {
        // let dtheta = map(R, 25*k, 75*k, TWO_PI/20, TWO_PI/65);
        for (let theta = 0; theta < TWO_PI; theta += TWO_PI/denominator) {
            push()
            translate(R*cos(theta), R*sin(theta));
            // rotate(shapeTheta);
            let theta_ = map(theta, 0, TWO_PI, 0, PI); // longer period
            let num_sides = int(map(sin(theta_), -1, 1, 25, 6));
            polygon(0, 0, r, num_sides);
            pop()
        }

        denominator += 8;
    }
    

    // outer circle to circumscribe the spiral
    noFill();
    let outerR = 2*80*k;
    ellipse(0, 0, outerR, outerR);


    if (rotation_guides){
        // draw rotation guides
        // make guides around the perimeter
        guideR = 2*k;
        p = 0.95; // draw just inside outer circle
        for (let theta = 0; theta < TWO_PI; theta += TWO_PI/num_frames) {
            ellipse(p*outerR/2*cos(theta), p*outerR/2*sin(theta), guideR, guideR);
        }
    }
}

function drawStockMaterial() {
    // A4 paper dimensions
    rectMode(CENTER);
    rect(0,0,210*k,297*k);
}

function polygon(x, y, radius, num_sides) {
    let angle = TWO_PI / num_sides;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + sin(a) * radius;
      let sy = y + cos(a) * radius;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }
  
  function easeInCubic(x) {
      return x*x*x;
  }