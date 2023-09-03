var PLAY = 1;
var END = 0;
var gameState = PLAY;
var girl, girlrunning, girlcollided
var cloudImage, cloudsGroup
var background
var obstaclesGroup, obstacle1, obstacle2, obstacle3
var gameOver, restart
var jumpSound, collidedSound;
var score











function preload(){
    jumpSound = loadSound("jump.wav")
    collidedSound = loadSound("collided.wav")
    
    backgroundImg = loadImage("background.png")
   
    
  
    
    groundImage = loadImage("ground.png");
    
    cloudImage = loadImage("clouds.png");
    
  
    obstacle1 = loadImage("obstacle1.png");
    obstacle2 = loadImage("obstacle2.png");
    obstacle3 = loadImage("obstacle3.png");
    
    gameOverImg = loadImage("game_over.png");
    restartImg = loadImage("restart.png");

   girlrunning = loadImage("girl_running.png")
   girlcollided = loadImage("girl_collided.png")
  }

  function setup() {
    createCanvas(windowWidth, windowHeight);

    
    girl = createSprite(50,height-70,20,50);
    
    
    girl.addAnimation("running", girlrunning);
    
    girl.addAnimation("collided", girlcollided);
    girl.setCollider('circle',0,0,350)
    girl.scale = 0.08;
    
    invisibleGround = createSprite(width/2,height-10,width,125);  
    invisibleGround.shapeColor = "#f4cbaa";
    
    ground = createSprite(width/2,height,width,2);
    ground.addImage("ground",groundImage);
    ground.x = width/2
    ground.velocityX = -(6 + 3*score/100);
    
    gameOver = createSprite(width/2,height/2- 50);
    gameOver.addImage(gameOverImg);
    
    restart = createSprite(width/2,height/2);
    restart.addImage(restartImg);
    
    gameOver.scale = 0.5;
    restart.scale = 0.1;
  
    gameOver.visible = false;
    restart.visible = false;
    
   
    // invisibleGround.visible =false
  
    cloudsGroup = new Group();
    obstaclesGroup = new Group();
    
    score = 0;
  }
  
  function draw() {
    //girl.debug = true;
    background(backgroundImg);
    textSize(20);
    fill("black")
    text("Score: "+ score,30,50);
    
    
    if (gameState===PLAY){
      score = score + Math.round(getFrameRate()/60);
      ground.velocityX = -(6 + 3*score/100);
      
      if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-120) {
        jumpSound.play( )
        girl.velocityY = -10;
         touches = [];
      }
      
     girl.velocityY = girl.velocityY + 0.8
    
      if (ground.x < 0){
        ground.x = ground.width/2;
      }
    
      girl.collide(invisibleGround);
      spawnClouds();
      spawnObstacles();
    
      if(obstaclesGroup.isTouching(girl)){
          collidedSound.play()
          gameState = END;
      }
    }
    else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
      
      //set velcity of each game object to 0
      ground.velocityX = 0;
      girl.velocityY = 0;
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);
      
      //change the trex animation
      girl.changeAnimation("collided",girl_collided);
      
      //set lifetime of the game objects so that they are never destroyed
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);
      
      if(touches.length>0 || keyDown("SPACE") || mousePressedOver(restart)) {      
        reset();
        touches = []
      }
    }
    
    
    drawSprites();
  }
  
  function spawnClouds() {
    //write code here to spawn the clouds
    if (frameCount % 60 === 0) {
      var cloud = createSprite(width+20,height-300,40,10);
      cloud.y = Math.round(random(100,220));
      cloud.addImage(cloudImage);
      cloud.scale = 0.5;
      cloud.velocityX = -3;
      
       //assign lifetime to the variable
      cloud.lifetime = 300;
      
      //adjust the depth
      cloud.depth = trex.depth;
      girl.depth = girl.depth+1;
      
      //add each cloud to the group
      cloudsGroup.add(cloud);
    }
    
  }
  
  function spawnObstacles() {
    if(frameCount % 60 === 0) {
      var obstacle = createSprite(600,height-95,20,30);
      obstacle.setCollider('circle',0,0,45)
      // obstacle.debug = true
    
      obstacle.velocityX = -(6 + 3*score/100);
      
      //generate random obstacles
      var rand = Math.round(random(1,2));
      switch(rand) {
        case 1: obstacle.addImage(obstacle1);
                break;
        case 2: obstacle.addImage(obstacle2);
                break;
        default: break;
      }
      
      //assign scale and lifetime to the obstacle           
      obstacle.scale = 0.3;
      obstacle.lifetime = 300;
      obstacle.depth = trex.depth;
      girl.depth +=1;
      //add each obstacle to the group
      obstaclesGroup.add(obstacle);
    }
  }
  
  function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    
    girl.changeAnimation("running",girl_running);
    
    score = 0;
    
  }
  