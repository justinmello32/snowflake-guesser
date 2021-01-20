//Initial Variables
let gameStarted = false;
let startButton;
let score = 0;
let scoreBoard;


function setup() {
    //Setup Canvas
    var canvas = createCanvas(500, 500);
    canvas.parent('main');



        //Define Start Button
        startButton = createButton('Start Game');
        startButton.addClass('btn');
        startButton.addClass('btn-success');
        startButton.position(450, 650);
        startButton.mousePressed(startGame);

        //Define Score Area
        scoreBoard = createDiv('Current Score: ');
        scoreBoard.position(450, 700);
        scoreBoard.hide();

}

function draw() {

    if (mouseIsPressed) {
        fill(0);
    } else {
        fill(255);
    }
    ellipse(mouseX, mouseY, 80, 80);
}

function startGame() {
    //Hide start button and show scores
    startButton.hide();
    scoreBoard.show();
}

function loadImage() {

}

function loadDrawing() {

}