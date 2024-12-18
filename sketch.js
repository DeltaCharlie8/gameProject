/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var cloud;
var mountain;
var trees_x;

var canyon;
var collectable;

var game_score;
var lives;

var jumpSound;
var mySound;
var eatSound;
var fallingSound;
var loseSound;
var winSound;

var c1,c2;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    mySound = loadSound('assets/birdsong.wav');
    mySound.setVolume(0.3);
    eatSound = loadSound('assets/eat.mp3');
    eatSound.setVolume(0.1);
    fallingSound = loadSound('assets/falling.mp3');
    fallingSound.setVolume(0.008);
    loseSound = loadSound('assets/lose.wav');
    loseSound.setVolume(0.1);
    winSound = loadSound('assets/win.wav');
    winSound.setVolume(0.1);
}


function setup()
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 4;    
    mySound.setLoop(true);
    mySound.play();
	startGame();    
}

function draw()
{	
    background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    push();
    translate(scrollPos, 0);
    
    //draw FlagPole
    renderFlagpole();

	// Draw clouds.
    drawCloud();

	// Draw mountains.
    drawMountain();

	// Draw trees.
    drawTrees();

	// Draw canyons.
    for(var i = 0; i < canyon.length; i++)
    {
        drawCanyon(canyon[i]);
        checkCanyon(canyon[i]);
    }

	// Draw collectable items.
    for(var i = 0; i < collectable.length; i++)
    {
        drawCollectable(collectable[i]);
        checkCollectable(collectable[i]);    
    }
    
    //Logic for checking the flagpole.
    if(flagPole.isReached == false)
    {
        checkFlagpole(); 
    }
    
    //Logic for checking the game character has fallen below the canvas
    if(gameChar_y > height +150 && lives > 0)
    {
        startGame();
        lives -= 1;
        console.log(lives);
    }
    
    //Draws the Game Score to the screen.
    noStroke();
    fill(0);
    textSize(20);
    textAlign(CENTER);
    text("Game Score = "+ str(game_score-1), gameChar_world_x, 30);
    
    //Draws the Lives remaining to the screen.
    noStroke();
    fill(0);
    textSize(20);
    textAlign(CENTER);
    text("Lives = "+ str(lives), gameChar_world_x-150, 30);
    
    pop();
	// Draw game character.
	
	drawGameChar();
    
    if(lives < 1)
    {
        mySound.stop();
        noStroke();
        fill(0);
        textSize(50);
        textAlign(CENTER);
        text("GAME OVER!", gameChar_world_x, 300);
        textSize(20);
        textAlign(CENTER);
        text("press 'C' to continue", gameChar_world_x, 330);
        loseSound.play();
        return
    }
    
    if(flagPole.isReached == true)
    {
        winSound.play();
        noStroke();
        fill(0);
        textSize(50);
        textAlign(CENTER);
        text("LEVEL COMPLETE!", gameChar_world_x, 100);
        textSize(20);
        textAlign(CENTER);
        text("press the spacebar to continue", gameChar_world_x, 130);
        return
    }

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    if (gameChar_y < floorPos_y)
    {
        gameChar_y += 4; //returns to the ground
        isFalling = true;
    }   else {
        isFalling = false;
    }
    if(isPlummeting)
    {
        fallingSound.play();
        gameChar_y += 4;
    }

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){

	console.log("press" + keyCode);
	console.log("press" + key);
    
    if(keyCode == 65) //the key 'A' or left
    {
        isLeft = true;
    }
    
    if(keyCode == 68) //the key 'D' or right
    {
        isRight = true;
    }
    
    if(keyCode == 87 && gameChar_y == floorPos_y) //the key 'W'
    {
        gameChar_y -= 100; //jumps in the air
        jumpSound.play();
    }
    
    if(keyCode == 32) //the spacebar
    {
        startGame();
    }

}

function keyReleased()
{

	console.log("release" + keyCode);
	console.log("release" + key);
    
    if(keyCode == 65) //the key 'A'
    {
        isLeft = false;
    }
    
    if(keyCode == 68) //the key 'D'
    {
        isRight = false;
    }

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    if(isLeft && isFalling)
	{
		// add your jumping-left code
        
        stroke(0);
        fill(255,235,170);
        ellipse(gameChar_x,gameChar_y-53,10,20); //head
        fill(0);
        rect(gameChar_x-10,gameChar_y-61,15,3); //base of the hat
        ellipse(gameChar_x,gameChar_y-63,10,5); //top of the hat
        fill(100,150,200);
        rect(gameChar_x-5,gameChar_y-43,10,20); //torso
        fill(255,235,170);
        rect(gameChar_x-6,gameChar_y-34,5,3); //hand
        fill(150,150,150);
        rect(gameChar_x-10,gameChar_y-23,15,7); //leg facing left
        fill(0);
        rect(gameChar_x-14,gameChar_y-24,5,8); //shoe

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        
        stroke(0);
        fill(255,235,170);
        ellipse(gameChar_x,gameChar_y-53,10,20); //head
        fill(0);
        rect(gameChar_x-5,gameChar_y-61,15,3); //base of the hat
        ellipse(gameChar_x,gameChar_y-62,10,5); //top of the hat
        fill(100,150,200);
        rect(gameChar_x-5,gameChar_y-43,10,20); //torso
        fill(255,235,170);
        rect(gameChar_x+1,gameChar_y-34,5,3); //hand
        fill(150,150,150);
        rect(gameChar_x-5,gameChar_y-23,15,7); //leg facing right
        fill(0);
        rect(gameChar_x+9,gameChar_y-24,5,8); //shoe

	}
	else if(isLeft)
	{
		// add your walking left code
        
        stroke(0);
        fill(255,235,170);
        ellipse(gameChar_x,gameChar_y-53,10,20); //head
        fill(0);
        rect(gameChar_x-10,gameChar_y-61,15,3.5); //base of the hat
        ellipse(gameChar_x,gameChar_y-62,10,5); //top of the hat
        fill(100,150,200);
        rect(gameChar_x-5,gameChar_y-43,10,20); //torso
        fill(255,235,170);
        rect(gameChar_x-6,gameChar_y-31,5,3); //hand
        fill(150,150,150);
        rect(gameChar_x-4,gameChar_y-23,7,23); //leg facing left
        fill(0);
        rect(gameChar_x-6,gameChar_y-5,9,5); //shoe facing left

	}
	else if(isRight)
	{
		// add your walking right code
        
        stroke(0);
        fill(255,235,170);
        ellipse(gameChar_x,gameChar_y-53,10,20); //head
        fill(0);
        rect(gameChar_x-5,gameChar_y-61,15,3.5); //base of the hat
        ellipse(gameChar_x,gameChar_y-62,10,5); //top of the hat
        fill(100,150,200);
        rect(gameChar_x-5,gameChar_y-43,10,20); //torso
        fill(255,235,170);
        rect(gameChar_x+1,gameChar_y-31,5,3); //hand
        fill(150,150,150);
        rect(gameChar_x-4,gameChar_y-23,7,23); //leg facing right
        fill(0);
        rect(gameChar_x-4,gameChar_y-5,9,5); //shoe facing right

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        
        stroke(0);
        fill(255,235,170);
        ellipse(gameChar_x, gameChar_y - 53, 20,20); //head
        fill(0);
        ellipse(gameChar_x+4,gameChar_y-53,3,1); //right eye
        ellipse(gameChar_x-4,gameChar_y-53,3,1); //left eye
        ellipse(gameChar_x,gameChar_y-48,3,3); //mouth
        rect(gameChar_x-13,gameChar_y - 61,25,3); //base of hat 
        ellipse(gameChar_x,gameChar_y - 63,15,7); //top of hat
        fill(100,150,200);
        rect(gameChar_x - 7,gameChar_y - 43,14,20); //torso
        fill(255,235,170);
        rect(gameChar_x+3.5,gameChar_y-41,5,4); //right hand
        rect(gameChar_x-3.5,gameChar_y-41,-5,4); //left hand
        fill(150,150,150);
        rect(gameChar_x+2,gameChar_y-28,5,20); //right leg
        rect(gameChar_x-2,gameChar_y-28,-5,20); //left leg
        fill(0);
        rect(gameChar_x+1,gameChar_y-13,8,5); //right shoe
        rect(gameChar_x-1,gameChar_y-13,-8,5); //left shoe

	}
	else
	{
		// add your standing front facing code
        
        stroke(0);
        fill(255,235,170);
        ellipse(gameChar_x, gameChar_y - 53, 20,20); //head
        fill(0);
        rect(gameChar_x-13,gameChar_y - 61,25,3); //base of hat
        ellipse(gameChar_x,gameChar_y - 63,15,7); //top of hat
        fill(100,150,200);
        rect(gameChar_x - 7,gameChar_y - 43,14,20); //torso
        fill(255,235,170);
        rect(gameChar_x+3.5,gameChar_y-31,5,4); //right hand
        rect(gameChar_x-3.5,gameChar_y-31,-5,4); //left hand
        fill(150,150,150);
        rect(gameChar_x+2,gameChar_y-23,5,23); //right leg
        rect(gameChar_x-2,gameChar_y-23,-5,23); //left leg
        fill(0);
        rect(gameChar_x+2,gameChar_y-5,8,5); //right shoe
        rect(gameChar_x-2,gameChar_y-5,-8,5); //left shoe

	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawCloud()
{
    for(var i = 0; i < cloud.length; i++)
    {
        noStroke();
        fill(255);
        ellipse(cloud[i].x_pos,
                cloud[i].y_pos,
                90*cloud[i].size,
                40*cloud[i].size);
        ellipse(cloud[i].x_pos+50*cloud[i].size,
                cloud[i].y_pos-20*cloud[i].size,
                100*cloud[i].size,
                50*cloud[i].size);
        ellipse(cloud[i].x_pos+100*cloud[i].size,
                cloud[i].y_pos,
                100*cloud[i].size,
                40*cloud[i].size);
        ellipse(cloud[i].x_pos+40*cloud[i].size,
                cloud[i].y_pos+20*cloud[i].size,
                80*cloud[i].size,
                40*cloud[i].size); //cloud
    }
}    

// Function to draw mountains objects.
function drawMountain()
{
    for(var i = 0; i < mountain.length; i++)
    {
        noStroke(0);
        fill(125,125,200);
        triangle(mountain[i].x_pos,
                 mountain[i].y_pos,
                 mountain[i].x_pos+100*mountain[i].size,
                 mountain[i].y_pos-180*mountain[i].size,
                 mountain[i].x_pos+200*mountain[i].size,
                 mountain[i].y_pos); //mountain
    }
}    

// Function to draw trees objects.
function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {
        noStroke(0);
        fill(150,150,100);
        rect(trees_x[i],floorPos_y-50,40,50); //tree stummp
        noStroke(0);
        fill(0,150,150);
        triangle(trees_x[i]-50,floorPos_y-50,
                 trees_x[i]+20,floorPos_y-100,
                 trees_x[i]+90,floorPos_y-50);
        triangle(trees_x[i]-45,floorPos_y-70,
                 trees_x[i]+20,floorPos_y-115,
                 trees_x[i]+85,floorPos_y-70);
        triangle(trees_x[i]-40,floorPos_y-90,
                 trees_x[i]+20,floorPos_y-130,
                 trees_x[i]+80,floorPos_y-90);
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill(0);
    rect(t_canyon.x_pos,
         floorPos_y,
         t_canyon.width,
         floorPos_y); //canyon
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if(gameChar_world_x >= t_canyon.x_pos+3 && gameChar_world_x <= t_canyon.x_pos+t_canyon.width-3 && gameChar_y >= floorPos_y)
    {
       isPlummeting = true; 
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
   if(t_collectable.isFound == false)
    {
        stroke(0);
        line(t_collectable.x_pos, 
         t_collectable.y_pos-6*t_collectable.size, 
         t_collectable.x_pos+5*t_collectable.size, 
         t_collectable.y_pos-18*t_collectable.size);
        line(t_collectable.x_pos+8*t_collectable.size, 
         t_collectable.y_pos-6*t_collectable.size, 
         t_collectable.x_pos+5*t_collectable.size, 
         t_collectable.y_pos-18*t_collectable.size); //stem
        fill(225,0,0);
        ellipse(t_collectable.x_pos,
            t_collectable.y_pos, 
            t_collectable.radius*t_collectable.size, 
            t_collectable.radius*t_collectable.size);
        ellipse(t_collectable.x_pos+8*t_collectable.size,
            t_collectable.y_pos, 
            t_collectable.radius*t_collectable.size, 
            t_collectable.radius*t_collectable.size); //cherry
    }
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    let d = dist(gameChar_world_x,
                 gameChar_y,
                 t_collectable.x_pos,
                 t_collectable.y_pos);
               
    if(d < 13)
    {
        t_collectable.isFound = true; 
        eatSound.play();
        console.log(t_collectable.isFound);
        game_score += 0.5;
    }   

}

//Function to draw FlagPole.
function renderFlagpole()
{
    if(flagPole.isReached == false)
    {
        noStroke();
        fill(0);
        rect(flagPole.x_pos,floorPos_y,10,-300);
        fill(255,120,120);
        triangle(flagPole.x_pos+10,flagPole.flag_y_pos-300,
                flagPole.x_pos+50, flagPole.flag_y_pos-290,
                flagPole.x_pos+10, flagPole.flag_y_pos-280);
    }
    
    if(flagPole.isReached == true)
   {
        noStroke();
        fill(0);
        rect(flagPole.x_pos,floorPos_y,10,-300);
        fill(255,120,120);
        triangle(flagPole.x_pos+10,floorPos_y-60,
                flagPole.x_pos+50, floorPos_y-50,
                flagPole.x_pos+10, floorPos_y-40);
       
       noStroke();
        fill(0);
        textSize(50);
        textAlign(CENTER);
        text("LEVEL COMPLETE!", gameChar_world_x-300, 100);
        textSize(20);
        textAlign(CENTER);
        text("press the spacebar to continue", gameChar_world_x-300, 130);
        return
    }
}

//Function to check the FlagPole has been reached.
function checkFlagpole()
{   
    if(gameChar_world_x > flagPole.x_pos)
   {
       flagPole.isReached = true;
       console.log(flagPole.isReached);
   }
}


//Function to start the game.
function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    
    game_score = 1;
    console.log(game_score);
        

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    trees_x = [-100,100,300,420,500,700,900,950,1100,
               1300,1250,1500,1700,1800,,1900,2100,
              2200,2400,2500,2700,2900,3000,3100,
              3300,3500,3650,3700,3900,4100,
              4150,4300,4500,4700,4900,5000,5100,
              5300,5500,5700,5600,5900,6100,
              6250,6350,6550,6700,6900,7000,7100,
              7300,7500,7700,7800,7900,8100,
              8200,8300,8500,8700,8800,8900,9100,
              9250,9380,9500,9700,9850,10000,10100,
              10300,10500,10400,10700,10900,10100,11100,
              11300,11420,11500,11700,11900,11950,12100,
               12300,12250,12500,12700,12800,12900,13100,
              13200,13400,13500,13700,13900,14000,14100,
              14300,14500,14650,14700,14900,15100,
              15150,15300,15500,15700,15900,16000,16100,
              16300,16500,16700,16600,16900,17100,
              17250,17350,17550,17700,18300,18500,18700,
               18800,18900,19100,19200,19300,19500,19700,
               19800,19900,20100];
    cloud = [
        {x_pos:120, y_pos:150, size:1.0},
        {x_pos:320, y_pos:60, size:1.0},
        {x_pos:520, y_pos:130, size:1.0},
        {x_pos:720, y_pos:120, size:1.0},
        {x_pos:920, y_pos:30, size:1.0},
        {x_pos:1120, y_pos:100, size:1.0},
        {x_pos:1320, y_pos:140, size:1.0},
        {x_pos:1520, y_pos:50, size:1.0},
        {x_pos:1720, y_pos:120, size:1.0},
        {x_pos:1950, y_pos:150, size:1.0},
        {x_pos:2190, y_pos:60, size:1.0},
        {x_pos:2370, y_pos:130, size:1.0},
        {x_pos:2520, y_pos:110, size:1.0},
        {x_pos:2760, y_pos:20, size:1.0},
        {x_pos:2930, y_pos:90, size:1.0},
        {x_pos:3120, y_pos:150, size:1.0},
        {x_pos:3390, y_pos:60, size:1.0},
        {x_pos:3520, y_pos:130, size:1.0},
        {x_pos:3740, y_pos:120, size:1.0},
        {x_pos:3910, y_pos:30, size:1.0},
        {x_pos:4120, y_pos:100, size:1.0},
        {x_pos:4300, y_pos:150, size:1.0},
        {x_pos:4590, y_pos:60, size:1.0},
        {x_pos:4750, y_pos:130, size:1.0},
        {x_pos:4940, y_pos:120, size:1.0},
        {x_pos:5110, y_pos:30, size:1.0},
        {x_pos:5320, y_pos:100, size:1.0},
        {x_pos:5500, y_pos:150, size:1.0},
        {x_pos:5790, y_pos:60, size:1.0},
        {x_pos:5950, y_pos:130, size:1.0},
        {x_pos:6140, y_pos:120, size:1.0},
        {x_pos:6310, y_pos:30, size:1.0},
        {x_pos:6520, y_pos:100, size:1.0},
        {x_pos:6700, y_pos:150, size:1.0},
        {x_pos:6990, y_pos:60, size:1.0},
        {x_pos:7150, y_pos:130, size:1.0},
        {x_pos:7340, y_pos:120, size:1.0},
        {x_pos:7510, y_pos:30, size:1.0},
        {x_pos:7720, y_pos:100, size:1.0},
        {x_pos:7900, y_pos:150, size:1.0},
        {x_pos:8190, y_pos:60, size:1.0},
        {x_pos:8350, y_pos:130, size:1.0},
        {x_pos:8590, y_pos:60, size:1.0},
        {x_pos:8750, y_pos:130, size:1.0},
        {x_pos:8940, y_pos:120, size:1.0},
        {x_pos:9110, y_pos:30, size:1.0},
        {x_pos:9320, y_pos:100, size:1.0},
        {x_pos:9500, y_pos:150, size:1.0},
        {x_pos:9790, y_pos:60, size:1.0},
        {x_pos:9900, y_pos:150, size:1.0},
        {x_pos:10120, y_pos:100, size:1.0},
        {x_pos:10320, y_pos:140, size:1.0},
        {x_pos:10520, y_pos:140, size:1.0},
        {x_pos:10720, y_pos:140, size:1.0},
        {x_pos:10920, y_pos:140, size:1.0},
        {x_pos:11120, y_pos:100, size:1.0},
        {x_pos:11320, y_pos:140, size:1.0},
        {x_pos:11520, y_pos:50, size:1.0},
        {x_pos:11720, y_pos:120, size:1.0},
        {x_pos:11950, y_pos:150, size:1.0},
        {x_pos:12190, y_pos:60, size:1.0},
        {x_pos:12370, y_pos:130, size:1.0},
        {x_pos:12520, y_pos:110, size:1.0},
        {x_pos:12760, y_pos:20, size:1.0},
        {x_pos:12930, y_pos:90, size:1.0},
        {x_pos:13120, y_pos:150, size:1.0},
        {x_pos:13390, y_pos:60, size:1.0},
        {x_pos:13520, y_pos:130, size:1.0},
        {x_pos:13740, y_pos:120, size:1.0},
        {x_pos:13910, y_pos:30, size:1.0},
        {x_pos:14120, y_pos:100, size:1.0},
        {x_pos:14300, y_pos:150, size:1.0},
        {x_pos:14590, y_pos:60, size:1.0},
        {x_pos:14750, y_pos:130, size:1.0},
        {x_pos:14940, y_pos:120, size:1.0},
        {x_pos:15110, y_pos:30, size:1.0},
        {x_pos:15320, y_pos:100, size:1.0},
        {x_pos:15500, y_pos:150, size:1.0},
        {x_pos:15790, y_pos:60, size:1.0},
        {x_pos:15950, y_pos:130, size:1.0},
        {x_pos:16140, y_pos:120, size:1.0},
        {x_pos:16310, y_pos:30, size:1.0},
        {x_pos:16520, y_pos:100, size:1.0},
        {x_pos:16700, y_pos:150, size:1.0},
        {x_pos:16990, y_pos:60, size:1.0},
        {x_pos:17150, y_pos:130, size:1.0},
        {x_pos:17340, y_pos:120, size:1.0},
        {x_pos:18350, y_pos:130, size:1.0},
        {x_pos:18590, y_pos:60, size:1.0},
        {x_pos:18750, y_pos:130, size:1.0},
        {x_pos:18940, y_pos:120, size:1.0},
    ]
    mountain = [
        {x_pos: 200, y_pos:floorPos_y, size:1.2},
        {x_pos: 600, y_pos:floorPos_y, size:1.5},
        {x_pos: 1000, y_pos:floorPos_y, size:1.8},        
        {x_pos: 1300, y_pos:floorPos_y, size:1.5},
        {x_pos: 1500, y_pos:floorPos_y, size:1.2},
        {x_pos: 1900, y_pos:floorPos_y, size:1.5},
        {x_pos: 2500, y_pos:floorPos_y, size:1.8},
        {x_pos: 2700, y_pos:floorPos_y, size:1.5},
        {x_pos: 3100, y_pos:floorPos_y, size:1.2},
        {x_pos: 3400, y_pos:floorPos_y, size:1.5},
        {x_pos: 3600, y_pos:floorPos_y, size:1.8},
        {x_pos: 3900, y_pos:floorPos_y, size:1.5},
        {x_pos: 4300, y_pos:floorPos_y, size:1.2},
        {x_pos: 4700, y_pos:floorPos_y, size:1.5},
        {x_pos: 4900, y_pos:floorPos_y, size:1.8},
        {x_pos: 5100, y_pos:floorPos_y, size:1.5},
        {x_pos: 5500, y_pos:floorPos_y, size:1.2},
        {x_pos: 5600, y_pos:floorPos_y, size:1.5},
        {x_pos: 5900, y_pos:floorPos_y, size:1.8},
        {x_pos: 6300, y_pos:floorPos_y, size:1.5},
        {x_pos: 6500, y_pos:floorPos_y, size:1.2},
        {x_pos: 6900, y_pos:floorPos_y, size:1.5},
        {x_pos: 7500, y_pos:floorPos_y, size:1.8},
        {x_pos: 7700, y_pos:floorPos_y, size:1.5},
        {x_pos: 8100, y_pos:floorPos_y, size:1.2},
        {x_pos: 8400, y_pos:floorPos_y, size:1.5},
        {x_pos: 8600, y_pos:floorPos_y, size:1.8},
        {x_pos: 8900, y_pos:floorPos_y, size:1.5},
        {x_pos: 9300, y_pos:floorPos_y, size:1.2},
        {x_pos: 9700, y_pos:floorPos_y, size:1.5},
        {x_pos: 9900, y_pos:floorPos_y, size:1.8},
        {x_pos: 10100, y_pos:floorPos_y, size:1.5},
        {x_pos: 10500, y_pos:floorPos_y, size:1.2},
        {x_pos: 10600, y_pos:floorPos_y, size:1.5},
        {x_pos: 10900, y_pos:floorPos_y, size:1.8},        
        {x_pos: 11300, y_pos:floorPos_y, size:1.5},
        {x_pos: 11500, y_pos:floorPos_y, size:1.2},
        {x_pos: 11900, y_pos:floorPos_y, size:1.5},
        {x_pos: 12500, y_pos:floorPos_y, size:1.8},
        {x_pos: 12700, y_pos:floorPos_y, size:1.5},
        {x_pos: 13100, y_pos:floorPos_y, size:1.2},
        {x_pos: 13400, y_pos:floorPos_y, size:1.5},
        {x_pos: 13600, y_pos:floorPos_y, size:1.8},
        {x_pos: 13900, y_pos:floorPos_y, size:1.5},
        {x_pos: 14300, y_pos:floorPos_y, size:1.2},
        {x_pos: 14700, y_pos:floorPos_y, size:1.5},
        {x_pos: 14900, y_pos:floorPos_y, size:1.8},
        {x_pos: 15100, y_pos:floorPos_y, size:1.5},
        {x_pos: 15500, y_pos:floorPos_y, size:1.2},
        {x_pos: 15600, y_pos:floorPos_y, size:1.5},
        {x_pos: 15900, y_pos:floorPos_y, size:1.8},
        {x_pos: 16300, y_pos:floorPos_y, size:1.5},
        {x_pos: 16500, y_pos:floorPos_y, size:1.2},
        {x_pos: 16900, y_pos:floorPos_y, size:1.5},
        {x_pos: 17500, y_pos:floorPos_y, size:1.2},
        {x_pos: 17700, y_pos:floorPos_y, size:1.1},
    ]
    canyon = [
        {x_pos:625, width:100},
        {x_pos:1350, width:100},
        {x_pos:1550, width:100},
        {x_pos:2050, width:100},
        {x_pos:2850, width:100},
        {x_pos:3350, width:100},
        {x_pos:4050, width:100},
        {x_pos:4550, width:100},
        {x_pos:4750, width:100},
        {x_pos:5150, width:100},
        {x_pos:5350, width:100},
        {x_pos:5550, width:100},
        {x_pos:5750, width:100},
        {x_pos:6700, width:100},
        {x_pos:7350, width:100},
        {x_pos:7550, width:100},
        {x_pos:8100, width:100},
        {x_pos:9300, width:100},
        {x_pos:10350, width:100},
        {x_pos:10550, width:100},
        {x_pos:10750, width:100},
        {x_pos:12350, width:100},
        {x_pos:13350, width:100},
        {x_pos:13550, width:100},
        {x_pos:13750, width:100},
        {x_pos:13950, width:100},
        {x_pos:14150, width:100},
        {x_pos:15350, width:100},
        {x_pos:15750, width:100}
    ]
    collectable = [
        {x_pos:1500, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:2000, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:2500, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:3000, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:3500, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:4000, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:4500, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:5000, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:5500, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:6000, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:6500, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:7000, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:7500, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:8000, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:8500, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:9000, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:9500, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:10000, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:10500, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:11000, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:11500, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:12000, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:12500, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:13000, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:13500, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:14500, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:15000, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:15500, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:16000, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:16500, y_pos:420, radius:15, size:1.0, isFound:false},
        {x_pos:17000, y_pos:420, radius:15, size:1.0, isFound:false},
        ]
    flagPole = {
        x_pos: 18000,
        flag_x_pos: 3200,
        flag_y_pos: floorPos_y,
        isReached: false
    }
}
