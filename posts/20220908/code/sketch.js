// an ellipse of d=10 opens in illustrator at d=3.528
// manually convert to mm with this scale factor
k = 10/3.528

// trotec speedy wants a stroke width of 0.001mm
sw = 0.001;


function setup() {
    createCanvas(250*k, 250*k, SVG);
    background(255);
    stroke(0);
    strokeWeight(sw*k);
    
    
    let saveButton = createButton('save svg!');
    saveButton.position(20, 20);
    saveButton.mousePressed(function() {
      save('phenakistoscope.svg'); 
    });
}

function draw() {
    background(255);
    // fill(255);
    // draw an ellipse at the center, for placement
    ellipse(width/2, height/2, 2*k,2*k);
    for (let theta = 0; theta < 2*TWO_PI; theta += TWO_PI/20) {
        let R = map(theta, 0, 2*TWO_PI, 10*k, 100*k);
        // let r = 10*k;
        let r = map(theta, 0, 2*TWO_PI, 3*k, 20*k);
        ellipse(R*cos(theta) + width/2, R*sin(theta)+height/2, r, r)
    }
}