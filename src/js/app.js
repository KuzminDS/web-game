import '../style.css';

class Item
{
	constructor(image, x, y, isPlayer, isBonus)
	{
		this.x = x;
		this.y = y;
		this.loaded = false;
		this.dead = false;
		this.isPlayer = isPlayer;
		this.isBonus = isBonus;

		this.image = new Image();

		var obj = this;

		this.image.addEventListener("load", function () { obj.loaded = true; });

		this.image.src = image;
	}

	Update()
	{
		if(!this.isPlayer)
		{
			this.y += speed + levelSpeed;
		}

		if(this.y > canvas.height + 50)
		{
			this.dead = true;
		}
	}

	Collide(item)
	{
		var hit = false;

		if(this.y < item.y + item.image.height * scaleY && this.y + this.image.height * scaleY > item.y)
		{
			if(this.x + this.image.width * scaleX > item.x && this.x < item.x + item.image.width * scaleX)
			{
				hit = true;
			}
		}

		return hit;
	}

	Move(v, d) 
	{
		if(v == "x")
		{
			d *= 2;
			this.x += d;
			if(this.x + this.image.width * scaleX > canvas.width)
			{
				this.x -= d; 
			}
			if(this.x < 0)
			{
				this.x = 0;
			}
		}
		else
		{
			this.y += d;
			if(this.y + this.image.height * scaleY > canvas.height)
			{
				this.y -= d;
			}
			if(this.y < 0)
			{
				this.y = 0;
			}
		}
		
	}
}


const UPDATE_TIME = 1000 / 60;

var timer = null;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var scoreCount = document.getElementById("scoreCount")
var demandCount = document.getElementById("demandCount")
var level = document.getElementById("level")

var scaleX = 0.3
var scaleY = 0.3
var levelSpeed = 0.1

Resize();

window.addEventListener("resize", Resize);

window.addEventListener("keydown", function (e) { KeyDown(e); });

var objects = [];

var player = new Item("../images/content/dino.png", canvas.width / 2, canvas.height / 2, true, false);

var startGame = true;
var isGameTime = false;
var speed = 2;

setInterval(() => {
	if (startGame) {
		ClearScore()
		startGame = false;
		isGameTime = true;
		player.dead = false;
		objects = []
		Start();
	}
}, UPDATE_TIME)

function ClearScore() 
{
	level.innerHTML = 1
	scoreCount.innerHTML = 0
	demandCount.innerHTML = 5
}

function Start()
{
	if(!player.dead)
	{
		timer = setInterval(Update, UPDATE_TIME);
	}
	
}

function Stop()
{
	clearInterval(timer);
	timer = null;
}

function Update() 
{
	if(RandomInteger(0, 10000) > 9900)
	{
		switch(RandomInteger(0, 5)) {
			case 0:
				objects.push(new Item("../images/content/star.png", RandomInteger(30, canvas.width - 50), RandomInteger(250, 400) * -1, false, true));
				break;
			default:
				objects.push(new Item("../images/content/cactus.png", RandomInteger(30, canvas.width - 50), RandomInteger(250, 400) * -1, false, false));
				break;
		}
	}

	player.Update();

	if(player.dead)
	{
		alert("Crash!");
		Stop();
	}

	var isDead = false; 

	for(var i = 0; i < objects.length; i++)
	{
		objects[i].Update();

		if(objects[i].dead)
		{
			isDead = true;
		}
	}

	if(isDead)
	{
		objects.shift();
	}

	var hit = false;

	for(var i = 0; i < objects.length; i++)
	{
		hit = player.Collide(objects[i]);

		if (hit && objects[i].isBonus)
		{
			UpdateScore()
			objects.splice(i, 1)
			i--
		}
		else if (hit)
		{
			player.dead = true;
			startGame = confirm("Game over! Do you want to start again?");
			isGameTime = false
			Stop();			
			break;
		}
	}

	Draw();
}

function UpdateScore() {
	var score = parseInt(scoreCount.innerHTML)
	score++
	var demand = parseInt(demandCount.innerHTML)
	var levelNumber = parseInt(level.innerHTML)
	if (score == demand) {
		scoreCount.innerHTML = 0
		demandCount.innerHTML = levelNumber * demand
		level.innerHTML = ++levelNumber
		levelSpeed *= levelNumber;
	}
	else {
		scoreCount.innerHTML = score
	}
}

function Draw()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	DrawItem(player);

	for(var i = 0; i < objects.length; i++)
	{
		DrawItem(objects[i]);
	}
}

function DrawItem(item)
{
	ctx.drawImage
	(
		item.image, 
		0, 
		0, 
		item.image.width, 
		item.image.height, 
		item.x, 
		item.y, 
		item.image.width * scaleX, 
		item.image.height * scaleY 
	);
}

function KeyDown(e)
{
	switch(e.keyCode)
	{
		case 37:
			player.Move("x", -speed * 3);
			break;

		case 39:
			player.Move("x", speed * 3);
			break;

		case 38:
			player.Move("y", -speed * 3);
			break;

		case 40:
			player.Move("y", speed * 3);
			break;

		case 27:
			if (isGameTime) {
				if(timer == null)
				{
					Start();
				}
				else
				{
					Stop();
				}
			}
			break;
	}
}

function Resize()
{
	canvas.width = 1200;
	canvas.height = 1000;
}

function RandomInteger(min, max) 
{
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

