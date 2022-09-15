// blair subbaraman
// 2022.09.14

// ** laser cutting parameters **
let k = 10/3.528 // scale conversion to mm for laser cutting
let sw = 0.001; // trotec speedy wants a stroke width of 0.001mm

// ** phenakistoscope parameters **
let num_frames = 3; // how many frames in the animation? used for rotation guides

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

    let R; // overall spiral
    let r; // smaller circles which make up the spiral
    let minR = 20*k;
    let maxR = 70*k;
    let minr = 0.5*k;
    let maxr = 20*k;
    let phi = 0;
    let dtheta_i = TWO_PI/500;
    let dtheta_f = TWO_PI/150;
    let dtheta = dtheta_i;
    let last_pt = [100, 100];
    for (let theta = 0; theta < TWO_PI; theta += dtheta) {
        // R = map(sin(theta), -1, 1, minR, maxR);
        R = maxR*sin(12*theta);
        if (R < 7*k) {
            continue;
        }
        // R = map(sin(5*theta + phi), -1, 1, minR, maxR); // spiral radius
        r = 5*k;
        // r = map(theta, 0, num_rotations*TWO_PI, minr, maxr); // shape radius
        // shapeTheta = map(theta, 0, num_rotations*TWO_PI, 0, TWO_PI); // spin the shapes, too

        let x = R*cos(theta);
        let y = R*sin(theta)
        // if (dist(last_pt[0], last_pt[1], x, y) < r/2) {
        //     // last_pt[0] = x;
        //     // last_pt[1] = y;
        //     continue;
        // }
        // figure out rotation before translation
        let v1 = createVector(0, 100);
        let v2 = createVector(x, y);
        let angleBetween = v1.angleBetween(v2);
        
        push()
        translate(x, y);
        w = map(abs(R), 0, maxR, r/16, r);
        rotate(angleBetween);//+ phi);
        ellipse(0,0,w,r);
        pop()

        last_pt[0] = x;
        last_pt[1] = y;
        phi += dtheta
        // dtheta += PI/1000;
        // dtheta = map(abs(R), 0, maxR, dtheta_i, dtheta_f);
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