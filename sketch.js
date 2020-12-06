var dogImg;
var happyDogImg;

var dog;
var database;
var foodS;
var foodStock;

var foodObj;
var fedTime;
var lastFed;
var feed;
var addFood;



function preload(){
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
}

function setup() {
  createCanvas(800, 800);

  database = firebase.database();
  
  dog = createSprite(400, 400);
  dog.scale=0.5;
  dog.addImage("dog", dogImg);
  dog.addImage("happyDog", happyDogImg);

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  
}


function draw() { 
  background(46, 139, 87);
  foodObj.display();
  
  fedTime=database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed=data.val();
  });

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350, 30);
  } else if(lastFed===0){
    text("Last Feed : "+ lastFed + " AM", 350, 30);
  } else{
    text("Last Feed : "+ lastFed + " AM", 350, 30)
  }

  drawSprites();

}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){

  if(x<=0){
    x=0;
  } else {
    x=x-1;
  }

  database.ref('/').update({
    Food:x
  })
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFood(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
