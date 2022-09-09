// blair subbaraman
// 2022.09.09

// ** laser cutting parameters **
let k = 10/3.528 // scale conversion to mm for laser cutting
let sw = 0.001; // trotec speedy wants a stroke width of 0.001mm

// ** phenakistoscope parameters **
let num_frames = 18 // how many frames in the animation? used for rotation guides



function setup() {
    createCanvas(300*k, 300*k, SVG);
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
}

function draw() {
    background(255);

    // draw the overall material dimensions when editing,
    // but don't export it with the svg
    // if (isLooping()) { drawStockMaterial() }
    drawStockMaterial();
    drawGeometry();

}

function drawGeometry(rotation_guides = true) {
    // draw an ellipse at the center, for placement
    ellipse(width/2, height/2, 2*k,2*k);

    // make a spiral
    num_rotations = 3
    let R; // overall spiral
    let r; // smaller circles which make up the spiral
    let minR = 2*k;
    let maxR = 75*k;
    let minr = 0.5*k;
    let maxr = 20*k;
    for (let theta = 0; theta < num_rotations*TWO_PI; theta += TWO_PI/20) {
        R = map(theta, 0, num_rotations*TWO_PI, minR, maxR); // spiral radius
        r = map(theta, 0, num_rotations*TWO_PI, minr, maxr); // circle radius
        ellipse(R*cos(theta) + width/2, R*sin(theta)+height/2, r, r);
    }

    // outer circle to circumscribe the spiral
    noFill();
    let outerR = 2*(maxR + maxr);
    ellipse(width/2, height/2, outerR, outerR);


    if (rotation_guides){
        // draw rotation guides
        // make guides around the perimeter
        guideR = 2*k;
        p = 0.95; // draw just inside outer circle
        for (let theta = 0; theta < TWO_PI; theta += TWO_PI/num_frames) {
            ellipse(p*outerR/2*cos(theta) + width/2, p*outerR/2*sin(theta) + height/2, guideR, guideR);
        }
    }
}

function drawStockMaterial() {
    // A4 paper dimensions
    rectMode(CENTER);
    rect(width/2,height/2,210*k,297*k);
}