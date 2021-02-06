//Buttons and Images
let startButton;
let startArea;
let mainArea;
let resultsArea;
let alertsArea;
let realSnowflakeButton;
let computerSnowflakeButton;
let images = [];
let c1, c2;
let snowflakes = []; // array to hold snowflake objects

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
    var canvas = createCanvas(800, 600);
    canvas.parent('main');
    fill(240);
    noStroke();

    //Define Start Button
    startButton = select('#start-button');
    startArea = select('#start-area');
    mainArea = select('#main');
    resultsArea = select('#results-area');
    alertsArea = select('#alerts');
    startButton.mousePressed(startGame);

    //Define selection buttons and Score Area
    realSnowflakeButton = createButton('Real Snowflake');
    realSnowflakeButton.addClass('btn');
    realSnowflakeButton.addClass('btn-primary');
    realSnowflakeButton.position(700,750);

    computerSnowflakeButton = createButton("Graphic Snowflake");
    computerSnowflakeButton.addClass('btn');
    computerSnowflakeButton.addClass('btn-danger');
    computerSnowflakeButton.position(900,750);

    computerSnowflakeButton.hide();
    realSnowflakeButton.hide();
}

function draw() {
    if(gameStarted === false){

        displayPlaceHolder();
    }
    else {
        playGame();
    }
}

function startGame() {
    //Hide start button, show buttons
    resultsArea.hide();
    startArea.hide();
    realSnowflakeButton.show();
    computerSnowflakeButton.show();
    gameStarted = true;
    redraw();
}
function endGame() {
    gameStarted = false;

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

    realSnowflakeButton.hide();
    computerSnowflakeButton.hide();
    loop();
    displayPlaceHolder();
    score = 0;
    round = 0;
}

function playGame() {
    noLoop();
    if(round > 9) {
        endGame();
    }
    else {
        randomGraphic = int(random(0, 2));
        if (randomGraphic === 0) {
            generateImage();
        } else {
            generateSnowflake();
        }
        round++;
    }
}

function keyPressed() {
    if (keyCode === LEFT_ARROW && gameStarted  === true) {

        if(randomGraphic === 0 ) {
            score++;
            displayAlert(1);
        }
        else {
            displayAlert(0);
        }
        redraw();
    } else if (keyCode === RIGHT_ARROW && gameStarted === true) {

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
    c1 = color(255);
    c2 = color(63, 191, 191);

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
        document.getElementById("alerts").append("Your current score is " + score + " out of " + round + " rounds.");
        document.getElementById('alerts').classList.remove('alert-danger');
        document.getElementById('alerts').classList.add('alert-success');
    } else {
        document.getElementById("alerts").innerHTML = "I'm sorry, that was incorrect. \n";
        document.getElementById("alerts").append("Your current score is " + score + " out of " + round + " rounds.");
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

