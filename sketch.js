//Initial Variables
let gameStarted = false;

//Buttons and Images
let startButton;
let realSnowflakeButton;
let computerSnowflakeButton;
let images = [];


//Misc Variables
let score = 0;
let round = 1;
let scoreBoard;
let randomGraphic;
let answerSelected = false;
let selection;
let answer;

//Generation parameters for snowflakes
let symmetrieNumber = 6; //how many arms the snowflake has (typically 6)
let angleVarianzPIDivider = 4; //PI is divided by this number to define the variance in branching angles
let radius = 200; //randius of the snowflake
let endLength = 2; //length of the branch at which recursions stops

//Drawing parameters for snowflakes
let thickness = 6; //thicknes of the lines
let thicknesIsLengthDependent = false; //is the stroke thickness dependent on the length of the branch?
let thicknesFactor = 0.005; //if the stroke thicknes is dependent on the length of the branch, this is multiplied with the length which is multiplied with the thickness
let strokeAlpha = 25; //alpha of the lines


function preload() {
    for (let i = 1; i < 3; i++) {
        images[i] = loadImage('assets/snowflake' + i + '.jpg'); // store the image location in array only
    }
}

function setup() {

    //Setup Canvas
    var canvas = createCanvas(500, 500);
    canvas.parent('main');
    noLoop();

    //Define Start Button
    startButton = createButton('Start Game');
    startButton.addClass('btn');
    startButton.addClass('btn-success');
    startButton.position(450, 650);
    startButton.mousePressed(startGame);

    //Define selection buttons and Score Area
    scoreBoard = createDiv('Current Score: ' + score);
    scoreBoard.position(450, 700);
    realSnowflakeButton = createButton('Real Snowflake');
    realSnowflakeButton.addClass('btn');
    realSnowflakeButton.addClass('btn-primary');
    realSnowflakeButton.position(100,650);

    computerSnowflakeButton = createButton("Graphic Snowflake");
    computerSnowflakeButton.addClass('btn');
    computerSnowflakeButton.addClass('btn-danger');
    computerSnowflakeButton.position(600,650);



    computerSnowflakeButton.hide();
    realSnowflakeButton.hide();
    scoreBoard.hide();
}

function draw() {
    if(gameStarted === false){
        //Placeholder Image for game that has not started
        background(220);
        let s = 'PlaceHolder Image appears here until game starts';
        fill(50);
        text(s, 200, 250, 300, 300);
    }
    else {
        playGame();
    }
}

function startGame() {
    //Hide start button, show buttons
    startButton.hide();
    scoreBoard.show();
    realSnowflakeButton.show();
    computerSnowflakeButton.show();
    gameStarted = true;
    redraw();
}
function endGame() {
    gameStarted = false;
    background(220);
    let s = 'The game has ended!';
    fill(50);
    text(s, 200, 250, 300, 300);
    realSnowflakeButton.hide();
    computerSnowflakeButton.hide();
    startButton.show();
    score = 0;
    round = 0;
}

function playGame() {

    if(round > 9) {
        endGame();
    }
    else {
        randomGraphic = int(random(0, 2));
        console.log(round);
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
            scoreBoard.html("Current Score: " + score);
            score++;
        }
        redraw();
    } else if (keyCode === RIGHT_ARROW && gameStarted === true) {

        if(randomGraphic === 1 ) {
            scoreBoard.html("Current Score: " + score);
            score++;
        }
        redraw();
    }
}

function generateImage() {
    background(0);
    let randomNum = int(random(1,3));
    image(images[randomNum], 0, 0);
}

function generateSnowflake()  {
    background(0);

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
