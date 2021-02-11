//Buttons and Images
let startButton;
let startArea;
let mainArea;
let resultsArea;
let alertsArea;
let playArea;
let realSnowflakeButton;
let computerSnowflakeButton;
let images = [];
let c1, c2;
let snowflakes = []; // array to hold snowflake objects
let r;
let g;
let b;
let a;

//Misc Variables
let gameStarted = false;
let score = 0;
let round = 0;
let randomGraphic;

//Generation parameters for snowflakes
let symmetrieNumber = 6; //how many arms the snowflake has (typically 6)
let angleVarianzPIDivider = 4; //PI is divided by this number to define the variance in branching angles
let radius; //randius of the snowflake
let endLength; //length of the branch at which recursions stops

//Drawing parameters for snowflakes
let thickness = 6; //thicknes of the lines
let thicknesIsLengthDependent = false; //is the stroke thickness dependent on the length of the branch?
let thicknesFactor = 0.005; //if the stroke thicknes is dependent on the length of the branch, this is multiplied with the length which is multiplied with the thickness
let strokeAlpha = 25; //alpha of the lines


function preload() {
    for (let i = 1; i < 8; i++) {
        images[i] = loadImage('assets/snowflake' + i + '.jpg'); // store the image location in array only
    }
}

function setup() {

    //Setup Canvas
    var canvas = createCanvas(750, 550);
    canvas.parent('main');
    fill(240);
    noStroke();

    //Define Areas and Buttons
    startButton = select('#start-button');
    startArea = select('#start-area');
    mainArea = select('#main');
    resultsArea = select('#results-area');
    alertsArea = select('#alerts');
    playArea = select('#play-area');
    realSnowflakeButton = select('#real-snowflake');
    realSnowflakeButton.mousePressed(function() { checkAnswer(0);});
    computerSnowflakeButton = select('#computer-snowflake');
    computerSnowflakeButton.mousePressed(function() { checkAnswer(1);});
    playArea.hide();
    startButton.mousePressed(startGame);

}

function draw() {
    if(gameStarted === false){
        displayPlaceHolder();
    }
    else {
        console.log("This is round: " + round);
        playGame();
    }
}

function startGame() {
    //Hide start button, show buttons
    document.getElementById("alerts").innerHTML = "";
    document.getElementById('alerts').classList.remove('alert-success');
    document.getElementById('alerts').classList.remove('alert-danger');
    startArea.hide();
    playArea.show();
    gameStarted = true;
    redraw();
}
function endGame() {
    gameStarted = false;
    playArea.hide();
    if(score > 6) {
        document.getElementById("alerts").innerHTML = "Great job! You scored " + score + " out of 10 rounds!";
        document.getElementById('alerts').classList.remove('alert-danger');
        document.getElementById('alerts').classList.add('alert-success');
    }
    else {
        document.getElementById("alerts").innerHTML = "Sorry, you only scored " + score + " out of 10 rounds Better luck next time!";
        document.getElementById('alerts').classList.remove('alert-success');
        document.getElementById('alerts').classList.add('alert-danger');
    }

    loop();
    score = 0;
    round = 0;
    startArea.show();
    displayPlaceHolder();

}

function playGame() {
    noLoop();
    if(round > 10) {
        endGame();
    }
    else {
        randomGraphic = int(random(0, 2));
        if (randomGraphic === 0) {
            generateImage();
            round++;
        } else {
            generateSnowflake();
            round++;
        }
    }
}

function checkAnswer(choice) {
    if(choice === 0 && gameStarted === true) {
        if(randomGraphic === 0 ) {
            score++;
            displayAlert(1);
        }
        else {
            displayAlert(0);
        }
        redraw();
    }
    if(choice === 1 && gameStarted === true){
        if(randomGraphic === 1 ) {
            score++;
            displayAlert(1);
        }
        else {
            displayAlert(0);
        }
        redraw();
    }

}


function generateImage() {
    background(0);
    let randomNum = int(random(1,8));
    image(images[randomNum], 0, 0);

}

function generateSnowflake()  {
    background(0);

    //Generate Colors used for gradient
    r = random(255); // r is a random number between 0 - 255
    g = random(100,200); // g is a random number betwen 100 - 200
    b = random(100); // b is a random number between 0 - 100
    a = random(200,255); // a is a random number between 200 - 255
    c1 = color(r,g,b,a);
    r = random(255); // r is a random number between 0 - 255
    g = random(100,200); // g is a random number betwen 100 - 200
    b = random(100); // b is a random number between 0 - 100
    a = random(200,255); // a is a random number between 200 - 255
    c2 = color(r,g,b,a);

    //Apply gradient
    for(let y=0; y<height; y++){
        n = map(y,0,height,0,1);
        let newc = lerpColor(c1,c2,n);
        stroke(newc);
        line(0,y,width, y);
    }

    //Random radius and end lengths of snowflakes
    radius = int(random(45, 180));
    endLength = int(random(1, 6));

    let seed = random(255);
    for (let i = 0; i < symmetrieNumber; ++i) {
        randomSeed(seed);
        generateBranch(createVector(width / 2, height / 2), radius, (TWO_PI / symmetrieNumber) * i);
    }
}

function generateBranch(origin, length, angle) {
    if (length < endLength) {
        return;
    }

    let randomAngle = random(0, PI / angleVarianzPIDivider);
    push();
    translate(origin.x, origin.y);
    rotate(angle);
    generateBranch(createVector(0, 0), length / 2, 0);
    generateBranch(createVector(length, 0), length / 2, 0);
    generateBranch(createVector(length / 2, 0), length / 2, -randomAngle);
    generateBranch(createVector(length / 2, 0), length / 2, randomAngle);

    stroke(255, strokeAlpha);
    strokeWeight(thicknesIsLengthDependent ? (thickness * (length * thicknesFactor)) : thickness);
    line(0, 0, length, 0);
    pop();
}

function displayAlert(result) {
    if (result === 1) {
        document.getElementById("alerts").innerHTML = "That was correct! Nice Job! \n";
        document.getElementById("alerts").append("Your current score is " + score + " out of " + (round - 1) + " rounds.");
        document.getElementById('alerts').classList.remove('alert-danger');
        document.getElementById('alerts').classList.add('alert-success');
    } else {
        document.getElementById("alerts").innerHTML = "I'm sorry, that was incorrect. \n";
        document.getElementById("alerts").append("Your current score is " + score + " out of " + (round - 1) + " rounds.");
        document.getElementById('alerts').classList.remove('alert-success');
        document.getElementById('alerts').classList.add('alert-danger');
    }
}

function displayPlaceHolder() {
    background(0);
    let t = frameCount / 60; // update time

    // create a random number of snowflakes each frame
    for (let i = 0; i < random(5); i++) {
        snowflakes.push(new snowflake()); // append snowflake object
    }

    // loop through snowflakes with a for..of loop
    for (let flake of snowflakes) {
        flake.update(t); // update snowflake position
        flake.display(); // draw snowflake
    }
}

function snowflake() {
    // initialize coordinates
    this.posX = 0;
    this.posY = random(-50, 0);
    this.initialangle = random(0, 2 * PI);
    this.size = random(2, 5);

    // radius of snowflake spiral
    // chosen so the snowflakes are uniformly spread out in area
    this.radius = sqrt(random(pow(width / 2, 2)));

    this.update = function(time) {
        // x position follows a circle
        let w = 0.6; // angular speed
        let angle = w * time + this.initialangle;
        this.posX = width / 2 + this.radius * sin(angle);

        // different size snowflakes fall at slightly different y speeds
        this.posY += pow(this.size, 0.5);

        // delete snowflake if past end of screen
        if (this.posY > height) {
            let index = snowflakes.indexOf(this);
            snowflakes.splice(index, 1);
        }
    };

    this.display = function() {
        ellipse(this.posX, this.posY, this.size);
    };
}

