


/**************************************************elements class start************************************************************************/
function Element(){
	this.getElement = function(element){
		this.element = element;
		return this;
	}
	this.getQuery = function(element){
		this.element = document.querySelector(element);
		return this;
	}
	this.createElement = function(element, parent, insertBefore){
		var d = document;
		if(!insertBefore){
			this.element = d.querySelector(parent).appendChild(d.createElement(element));
		}else{
			var newone = document.createElement(element);
			d.querySelector(parent).insertBefore(newone, d.querySelector(insertBefore));
			this.element = newone;
		}
		return  this;
	}
	this.delete = function(element){
		element.parentNode.removeChild(element);
	}
	this.this = function(){
		return this.element;
	}
	this.attr = function(attr, value){
		this.element.setAttribute(attr,value);
		return this;
	}
	this.innerHTML = function(text){
		this.element.innerHTML = text;
		return this;
	}
	this.css = function(css){
		this.style = "";
		if(css instanceof Array){
			for(var index = 0; index < css.length; index ++){
				this.style += css[index] + ";";
			}
		}else if(typeof css === 'object'){
			for(var key in css){
				this.style += key + ": " + css[key] + "; ";
			}
		}else{
			this.style = css;
		}
		this.element.setAttribute("style",  this.style);
		return this;
	}
}
/**/
class Operations{
	getRandom(min, max){
		return Math.floor(Math.random()*(max-min+1)+min);
	}
} 
/**************************************************end of element class ************************************************************************/

class Canvas{
	constructor(querySelector){
		this.canvas = document.querySelector(querySelector);
		this.ctx = this.canvas.getContext("2d");
	}
	drawLine(A, B, Fill = false, closePath = false){ // A[x,y]  B[x,y] 
		/*drawLine([0,0],[[20,40],[60,70]]) or drawLine([0,0],[60,70])*/
		this.ctx.beginPath(); // not testit but hope no error :D
		this.ctx.moveTo(A[0], A[1]);
		if(Array.isArray(B[0])){
			for(var i = 0; i < B.length; i ++){
				this.ctx.lineTo(B[i][0], B[i][1]);
			}
		}else{
			this.ctx.lineTo(B[0], B[1]);
		}
		if(closePath == true)
			this.ctx.closePath();
		this.ctx.stroke();
		if(Fill == true)
			this.ctx.fill();
		return this;
	}
	drawImage(img, A, WH){
		this.ctx.drawImage(img,A[0],A[1],WH[0],WH[1]);
		return this;
	}
	cropImage(img,sx,sy,swidth,sheight,x,y,width,height){
		this.ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height)
		return this
	}
	drawCircle(A, R){ //A[x,y] R=len
		this.ctx.arc(A[0], A[1], R, 0, 2*Math.PI);
		this.ctx.stroke();
		return this;
	}
	drawText(A, text, fontSize = 12, color = "black"){
		this.ctx.fillStyle = color;
		this.ctx.font = fontSize + "px dgt";
		this.ctx.fillText(text, A[0], A[1]);
		return this;
	}
	drawRect(A, WH, color){
		this.ctx.fillStyle = color?color:"black";
		this.ctx.fillRect(A[0], A[1], WH[0], WH[1]);
		return this;
	}
	strokeRect(A, WH){
		this.ctx.strokeRect(A[0], A[1], WH[0], WH[1]);
		return this;
	}
	clear(A, WH){
		this.ctx.clearRect(A[0], A[1], WH[0], WH[1]);
		return this;
	}
	getElement(){
		return this.canvas;
	}
}


/****************************************************end of canvas class*****************************************************************************/



/**************************************************Game is main claassssss ************************************************************************/

class Game{
	constructor(backgroundGame, bodyGame, userPopup){
		var w,h;
		w = new Element().getQuery(bodyGame).this().width;
		h = new Element().getQuery(bodyGame).this().height;
		this.canvas = {
			width: w,
			height: h,
			game : new Canvas(bodyGame),
			user : new Canvas(userPopup),
			back : new Canvas(backgroundGame),
			left: window.innerWidth > w ? (window.innerWidth - w) / 2 : window.innerWidth,
			top: window.innerHeight > h ? (window.innerHeight - h) / 2 : window.innerHeight
		}

		this.game = {
			level : 1,
			end : false,
			puased : false
		}
		this.texts = []

		this.bullets = [];
		this.enemyBullets = [];
		this.enemys = [];
		this.deadObjs = [];

		this.player = {
			width : 40,
			height : 40,
			x : this.canvas.width / 2,
			y : this.canvas.height - 50,
			bullet : 400,
			life  : 100,
			specialBullet : 10,
			direction : {
				left : false,
				right : false
			},
			shooting : false
		}
		this.shaking = false		
		this.bullet = {
			double : false,
			triple : false,
			maxPerShot : 6, // max 6
			speed : 1, //max 5
			width : 5,
			height : 10,
			x : 0,
			y : this.player.y-30
		}
		this.enemy = {
			width : 20,
			height : 20,
			damage : 50, // percentage of 100
			power : 1
		}

		this.pixels = {
			player : [0,0,200,170],
			playerLow : [0,200,200,165],
			enemy1 : [300,0,100,80],
			enemy2 : [400,0,100,80],
			enemy3 : [500,0,100,80],
			enemy4 : [300,85,100,80],
			enemy5 : [400,85,100,80],
			enemy6 : [500,85,100,80],
			enemyDown : [[600,0,100,85],[600,85,100,85]],
			bulletPlayer : [714,5,15,40],
			bulletEnemy : [770,0,20,40],
			collision : [735,5,30,40]
		}
		this.image = {
			image : "assets/images/imagenoback.png",
			player : "assets/images/playernoback.png",
			bullet : "assets/images/bullet.png",
			enemy : "assets/images/myenemynoback.png"
		}

		this.myImage = new Image()
		this.myImage.src = this.image.image
		this.sounds = {
			explode : new Audio("assets/sounds/explode.mp3"),
			shot : new Audio("assets/sounds/shot.mp3"),
			back : new Audio("assets/sounds/tier.mp3"),
			// back1 : new Audio("assets/sounds/flysound1.mp3"),
			mute : false,
			laser : new Audio("assets/sounds/laser.mp3"),
			gotbull : new Audio("assets/sounds/got.mp3")
		}
		this.enemyInterval = 100 // 100 is ok.. and decrising for fastering
		this.enemyShootRandom = 300 // 1000 is ok and decrising for fastering

		this.score = 0

		this.bonus = 10000

		this.counter = 0

		this.mobile = false

		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
		   	this.mobile = true
		}


	}

	setUpEnvironment(){
		new Element().getQuery("body").css("background-color:black;");
		var css = {
			"position" : "absolute",
			"top" : this.canvas.top + "px",
			"left": this.canvas.left + "px",
			"z-index": 0
		}
		var back = new Element().getElement(this.canvas.back.getElement()).css(css).this();
		var user = new Element().getElement(this.canvas.user.getElement()).css(css).this();
		var game = new Element().getElement(this.canvas.game.getElement()).css(css).this();
		user.style.zIndex = back.style.zIndex = 0;
		game.style.zIndex = 1;

		this.canvas.back.drawRect([0,0], [this.canvas.width, this.canvas.height],"#323232");
		this.createFireForplayer();
		

		if(this.mobile){
			back.style.left='0'
			user.style.left='0'
			this.moveLeft = new Element().createElement("span","body")
			this.moveLeft.css({
				'position':'fixed',
				'bottom':'0',
				'border':'solid 2px red',
				'font-weight':'bold',
				'font-size':'30px',
				'color':'red',
				'text-align':"center",
				'padding':'30px 20px'
			}).element.innerHTML = '&#8612;'

			this.moveRight = new Element().createElement("span","body")
			this.moveRight.css({
				'position':'fixed',
				'bottom':'0',
				'right':'0',
				'border':'solid 2px red',
				'font-weight':'bold',
				'font-size':'30px',
				'color':'red',
				'text-align':"center",
				'padding':'30px 20px'
			}).element.innerHTML = '&#8614;'

			this.fireButton = new Element().createElement("span","body")
			this.fireButton.css({
				'position':'fixed',
				'bottom':'0',
				'right':'0',
				'left':'0',
				'margin':'auto',
				'border':'solid 2px red',
				'font-weight':'bold',
				'font-size':'30px',
				'color':'red',
				'width':'30%',
				'text-align':"center",
				'padding':'30px 20px'
			}).element.innerHTML = '&#8607;'
		}


	}

	createFireForplayer(){
		this.smoke = new Element().createElement("img","body").css({
			"position" : "absolute",
			"top" : this.canvas.top + this.canvas.height - 10 + "px",
			"left": "0px",
			"width":"8px",
			"transform":"rotate(180deg)"
		}).attr("src","assets/images/fire2.gif-c200").this()
	}
	smokeFollowsPlayer(self){
		self.smoke.style.left = self.canvas.left + self.player.x + 16 + "px"
	}


		createEnemy(self){
			var count = 0
			for(var j = 20; j < 240; j +=80){
				for(var i = self.canvas.width / 10; i < self.canvas.width; i += self.canvas.width  / 20){
					count ++
					self.enemys.push({
						x : i,
						y : ((count%2==0)? j+40 : j),
						power : self.enemy.power,
						moving : true,
						direction : {
							left : ((count%2==0)? true : false),
							top : true 
						}
					})
				}
			}

		}

		drawObjSpecficPoint(self, A, width = 20, color="black"){
			self.canvas.game.drawRect([A[0], A[1]],[width, width], color)
		}


		drawEnemys(self){
			for(var i = 0; i < self.enemys.length; i ++){
				var a,b,c,d;
				switch(self.enemys[i].power){
					case 1: 
					a = self.pixels.enemy1[0]
					b = self.pixels.enemy1[1]
					c = self.pixels.enemy1[2]
					d = self.pixels.enemy1[3]
					break
					case 2: 
					a = self.pixels.enemy2[0]
					b = self.pixels.enemy2[1]
					c = self.pixels.enemy2[2]
					d = self.pixels.enemy2[3]
					break
					case 3: 
					a = self.pixels.enemy3[0]
					b = self.pixels.enemy3[1]
					c = self.pixels.enemy3[2]
					d = self.pixels.enemy3[3]
					break
					case 4: 
					a = self.pixels.enemy4[0]
					b = self.pixels.enemy4[1]
					c = self.pixels.enemy4[2]
					d = self.pixels.enemy4[3]
					break
					case 5: 
					a = self.pixels.enemy5[0]
					b = self.pixels.enemy5[1]
					c = self.pixels.enemy5[2]
					d = self.pixels.enemy5[3]
					break
					case 6: 
					a = self.pixels.enemy6[0]
					b = self.pixels.enemy6[1]
					c = self.pixels.enemy6[2]
					d = self.pixels.enemy6[3]
					break
					default: 
					a = self.pixels.enemy6[0]
					b = self.pixels.enemy6[1]
					c = self.pixels.enemy6[2]
					d = self.pixels.enemy6[3]
					break
				}
				self.canvas.game.clear([self.enemys[i].x,self.enemys[i].y],[self.enemy.width,self.enemy.height])
				self.canvas.game.cropImage(self.myImage,a,b,c,d,self.enemys[i].x,self.enemys[i].y,self.enemy.width,self.enemy.height)
			}

	}


	createDeadObj(self, A, enemy = true, width = 20, height = 20, color = "red", timer = 250){
		self.deadObjs.push({
			x : A[0],
			y : A[1],
			w : width,
			c : color,
			t : timer,
			e : enemy,
			h : height
		})
	}

	drawDeadObjs(self){
		for(var i = 0; i < self.deadObjs.length; i ++){
			if(self.deadObjs[i].t == 0){
				self.canvas.game.clear([self.deadObjs[i].x, self.deadObjs[i].y],[self.deadObjs[i].w, self.deadObjs[i].h])
				self.deadObjs.splice(i, 1)
				return
			}else{
				self.deadObjs[i].t --
				if(self.deadObjs[i].e == true){
					var rnd = new Operations().getRandom(0,1)
					var a = self.pixels.enemyDown[rnd][0]
					var b = self.pixels.enemyDown[rnd][1]
					var c = self.pixels.enemyDown[rnd][2]
					var d = self.pixels.enemyDown[rnd][3]
				}else{
					var a = self.pixels.collision[0]
					var b = self.pixels.collision[1]
					var c = self.pixels.collision[2]
					var d = self.pixels.collision[3]
				}

				self.canvas.game.cropImage(self.myImage,a,b,c,d,self.deadObjs[i].x, self.deadObjs[i].y,self.deadObjs[i].w, self.deadObjs[i].w)
			}
		}
	}

	createPlayer(self){
			self.canvas.game.clear([self.player.x-2,self.player.y],[self.player.width+4,self.player.height])
			var a,b,c,d;
			if(self.player.life < 50){
				a = self.pixels.playerLow[0]
				b = self.pixels.playerLow[1]
				c = self.pixels.playerLow[2]
				d = self.pixels.playerLow[3]
			}else{
				a = self.pixels.player[0]
				b = self.pixels.player[1]
				c = self.pixels.player[2]
				d = self.pixels.player[3]
			}
			self.canvas.game.cropImage(self.myImage,a,b,c,d,self.player.x,self.player.y,self.player.width,self.player.height)
		if(self.player.direction.left == true){
			self.player.x >= 0?self.player.x -- : self.player.x;
		}
		if(self.player.direction.right == true){
			self.player.x <= self.canvas.width - self.player.width?self.player.x ++ : self.player.x;
		}
		self.smokeFollowsPlayer(self)
	}

	shotSound(self){
		if(self.sounds.mute == true) return
			self.sounds.shot.currentTime = 0
		self.sounds.shot.volume = 0.8
		self.sounds.shot.play();
	}
	enemyShotSOund(self){
		if(self.sounds.mute == true) return
			self.sounds.laser.currentTime = 0
		self.sounds.laser.play();
	}

	gotBullet(self){
		if(self.sounds.mute == true) return
			self.sounds.gotbull.currentTime = 0
		self.sounds.gotbull.play();
	}

	createBullet(self){
		if(self.game.end == true || self.game.paused == true) return
			if(self.bullets.length < self.bullet.maxPerShot){
				if(self.bullet.double == true){
					if(self.player.bullet >= 2){
						self.shotSound(self);
						for(var i = self.player.width / 3; i < self.player.width; i += self.player.width / 3){
							self.bullets.push({
								x : self.player.x + i - (self.bullet.width / 2),
								y : self.player.y
							});
						}
						self.player.bullet -= 2
					} 
				}else if(self.bullet.triple == true){
					if(self.player.bullet >= 3){
						self.shotSound(self);
						var middle = 0
						for(var i = self.player.width / 4; i < self.player.width; i += self.player.width / 4){
							self.bullets.push({
								x : self.player.x + i - (self.bullet.width / 2),
								y : self.player.y - (middle == 1 ? 10 : 0)
							});
							middle ++;
						}
						self.player.bullet -= 3
					}
				}else{
					if(self.player.bullet >= 1){
						self.shotSound(self);
						self.bullets.push({
							x : self.player.x + (self.player.width / 2) - (self.bullet.width / 2),
							y : self.player.y
						});
						self.player.bullet -= 1
					}
				}
			}
		}

		animateBullet(self){
			for(var i = 0; i < self.bullets.length; i ++){
				if(self.bullets[i].y < 0){
					self.canvas.game.clear([self.bullets[i].x, self.bullets[i].y], [self.bullet.width, self.bullet.height])
					self.bullets.splice(i, 1);
				}else{
					var a,b,c,d;
					a = self.pixels.bulletPlayer[0]
					b = self.pixels.bulletPlayer[1]
					c = self.pixels.bulletPlayer[2]
					d = self.pixels.bulletPlayer[3]
					self.canvas.game.clear([self.bullets[i].x, self.bullets[i].y], [self.bullet.width, self.bullet.height])
					self.bullets[i].y -= self.bullet.speed;
					self.canvas.game.cropImage(self.myImage, a,b,c,d,self.bullets[i].x, self.bullets[i].y, self.bullet.width, self.bullet.height)
			}
		}
	}


	addListenerToCanvas(){
		var self = this;


		document.addEventListener("keydown", function(event){
			switch(event.keyCode){
				case 39:
				self.player.direction.right = true;
				break;
				case 37: 
				self.player.direction.left = true;
				break;
				case 32: //38 up 
				self.createBullet(self)
				break;
				case 80:
				self.game.paused = self.game.paused == true? false: true
				document.getElementById("pause").innerHTML = self.game.paused == true? "resume (p)":  "pause (p)"
				break 
				case 77:
				self.sounds.mute = self.sounds.mute == true? false: true
				document.getElementById("mute").innerHTML = self.sounds.mute == true? "unmute (m)":  "mute (m)"
				break 
				case 49:
				self.bullet.double = false
				self.bullet.triple = false
				break 
				case 50:
				self.bullet.double = true
				self.bullet.triple = false
				break 
				case 51:
				self.bullet.double = false
				self.bullet.triple = true
				break 
				case 83:
				self.shaking = self.shaking == true? false: true
				document.getElementById("shaking").innerHTML = self.shaking == true? "shake on (s)":  "shake off (s)"
				break 
				}
			});
		document.addEventListener("keyup", function(event){
			switch(event.keyCode){
				case 39:
				self.player.direction.right = false;
				break;
				case 37: 
				self.player.direction.left = false;
				break;
			}
		});


		if(this.mobile){
			this.moveLeft.element.onclick = function(){
				self.player.direction.left = true;
			}

			this.moveRight.element.onclick = function(){
				self.player.direction.right = true;
			}

			this.moveLeft.element.onmouseup = function(){
				self.player.direction.left = false;
				self.player.direction.right = false;

			}

			this.moveRight.element.onmouseup = function(){
				self.player.direction.left = false;
				self.player.direction.right = false;
			}

			this.fireButton.element.onclick = function(){
				self.createBullet(self)
			}
		}


	}

	explosionSound(self){
		if(self.sounds.mute == true) return
			self.sounds.explode.currentTime = 0
		self.sounds.explode.volume = 0.7
		self.sounds.explode.play()

	}

	backgroundSound(self){
		/*if(self.sounds.mute == true){
			self.sounds.back.pause()
			return;
		}
		if(self.sounds.paused == true){
			// self.sounds.back.currentTime = 11.2

			self.sounds.back.stop()
			return;
		}*/
	/*	self.sounds.back.play()
		self.sounds.back.volume = 0.2
		if(self.sounds.back.currentTime >= 31.2){
			self.sounds.back.currentTime = 11.2
		}
		if(self.sounds.back.currentTime < 10){
			self.sounds.back.currentTime = 11.2
		}*/

	}

	detectCollision(self){
		for(var i = 0; i < self.enemys.length; i ++){
			for(var j = 0; j < self.bullets.length; j ++){
				var x1, x2, y1, y2;
				x1 = self.enemys[i].x - self.bullet.width
				x2 = self.enemys[i].x + self.enemy.width
				y1 = self.enemys[i].y
				y2 = self.enemys[i].y + self.enemy.height
				if(x1 <= self.bullets[j].x && x2 >= self.bullets[j].x){
					if(y1 <= self.bullets[j].y && y2 >= self.bullets[j].y){
						self.canvas.game.clear([self.bullets[j].x, self.bullets[j].y], [self.bullet.width, self.bullet.height])
						self.bullets.splice(j, 1)

						if(self.enemys[i].power == 1){
							self.canvas.game.clear([self.enemys[i].x, self.enemys[i].y], [self.enemy.width, self.enemy.height])

							self.createDeadObj(self, [self.enemys[i].x, self.enemys[i].y])

								self.sheazanzarebliadz(self, self.canvas.top, self.canvas.left)

							self.explosionSound(self)
							// self.drawObjSpecficPoint(self, [self.enemys[i].x, self.enemys[i].y], self.enemy.width, "red")
							self.enemys.splice(i, 1)
						}else{
							self.gotBullet(self)
							self.enemys[i].power --
						}
						self.score += 20 * self.enemy.power

					}
				}
			}
		}
	}



	detectCollisionBetweenPlayerAndEnemyBullet(self){
		for(var i = 0; i < self.enemyBullets.length; i ++){
			var x1,x2,y1,y2;
			x1 = self.player.x - self.bullet.width
			x2 = self.player.x + self.player.width
			y1 = self.player.y - self.bullet.height
			y2 = self.player.y + self.player.height
			if(self.enemyBullets[i].x >= x1 && self.enemyBullets[i].x <= x2){
				if(self.enemyBullets[i].y >= y1 && self.enemyBullets[i].y <= y2){
					self.player.life -= new Operations().getRandom(self.enemy.damage / 2, self.enemy.damage)
					self.canvas.game.clear([self.enemyBullets[i].x, self.enemyBullets[i].y], [self.bullet.width, self.bullet.height])
					self.gotBullet(self)
					self.createDeadObj(self, [self.enemyBullets[i].x, self.enemyBullets[i].y])

					self.enemyBullets.splice(i, 1)

				}
			}
		}
	}


	enemyBulletsAndPlayerBuletsCollision(self){
		for(var i = 0; i < self.enemyBullets.length; i ++){
			for(var j = 0; j < self.bullets.length; j ++){
				var x1,x2,y1,y2;
				x1 = self.enemyBullets[i].x - self.bullet.width
				x2 = self.enemyBullets[i].x + self.bullet.width
				y1 = self.enemyBullets[i].y - self.bullet.height
				y2 = self.enemyBullets[i].y + self.bullet.height
				if(self.bullets[j].x >= x1 && self.bullets[j].x <= x2){
					if(self.bullets[j].y >= y1 && self.bullets[j].y <= y2){
						self.canvas.game.clear([self.bullets[j].x,self.bullets[j].y],[self.bullet.width,self.bullet.height])
						self.canvas.game.clear([self.enemyBullets[i].x,self.enemyBullets[i].y],[self.bullet.width,self.bullet.height])
						self.gotBullet(self)
						self.createDeadObj(self, [self.enemyBullets[i].x,self.enemyBullets[i].y],false, 10, 50)

						self.bullets.splice(j, 1)
						self.enemyBullets.splice(i, 1)

						self.score += 10

					}
				}
			}	
		}
	}


	createEnemyBullet(self){
		if((new Operations().getRandom(0, self.enemyShootRandom)) == (new Operations().getRandom(0, self.enemyShootRandom))){

			if(self.enemys.length <= 0) return;
			var enemyIndex = new Operations().getRandom(0, self.enemys.length - 1);
			self.enemyBullets.push({
				x : self.enemys[enemyIndex].x,
				y : self.enemys[enemyIndex].y + self.enemy.height
			})
			self.enemyShotSOund(self) 
		}

		self.drawEnemyBullets(self)
	}

	drawEnemyBullets(self){
		for (var i = 0; i < self.enemyBullets.length; i ++) {
			self.canvas.game.clear([self.enemyBullets[i].x, self.enemyBullets[i].y], [self.bullet.width, self.bullet.height])
			self.enemyBullets[i].y += self.bullet.speed;
			var a = self.pixels.bulletEnemy[0]
			var b = self.pixels.bulletEnemy[1]
			var c = self.pixels.bulletEnemy[2]
			var d = self.pixels.bulletEnemy[3]
			self.canvas.game.cropImage(self.myImage,a,b,c,d,self.enemyBullets[i].x, self.enemyBullets[i].y, self.bullet.width, self.bullet.height)
			if(self.enemyBullets[i].y >= self.canvas.height){
				self.canvas.game.clear([self.enemyBullets[i].x, self.enemyBullets[i].y], [self.bullet.width, self.bullet.height])
				self.enemyBullets.splice(i, 1)
			}
		}
	}

	drawBulletsCount(self){
		self.canvas.user.clear([0,0], [self.canvas.user.getElement().getAttribute("width"), 30]);
		self.canvas.user.drawText([10,30], "Bullets : " + self.player.bullet, 28, "red");
	}
	drawHelthCount(self){
		self.canvas.user.clear([0,30], [self.canvas.user.getElement().getAttribute("width"), 30]);
		self.canvas.user.drawText([10,60], "health : " + self.player.life + "%", 28, "green");
	}
	enemyLevel(self){
		self.canvas.user.clear([0,60], [self.canvas.user.getElement().getAttribute("width"), 30]);
		self.canvas.user.drawText([10,90], "Enemy Level : " + self.enemy.power , 25, "purple");
	}
	enemyCount(self){
		self.canvas.user.clear([0,90], [self.canvas.user.getElement().getAttribute("width"), 30]);
		self.canvas.user.drawText([10,120], "Enemys : " + self.enemys.length , 25, "red");
	}

	bulletLevel(self){
		self.canvas.user.clear([0,120], [self.canvas.user.getElement().getAttribute("width"), 30]);
		self.canvas.user.drawText([10,150], "Bullet Level : " + self.bullet.speed , 23, "blue");
	}

	bonusCOunterDown(self){
		if(self.bonus == 0) return
			self.bonus --
		self.canvas.user.clear([0,150], [self.canvas.user.getElement().getAttribute("width"), 30]);
		self.canvas.user.drawText([10,180], "Bonus + : " + self.bonus , 23, "navy");
	}

	levelCount(self){
		self.canvas.user.clear([0,180], [self.canvas.user.getElement().getAttribute("width"), 30]);
		self.canvas.user.drawText([10,210], "Level : " + self.game.level, 23, "green");
	}

	scoreCount(self){
		self.canvas.user.clear([0,210], [self.canvas.user.getElement().getAttribute("width"), 30]);
		self.canvas.user.drawText([10,240], "SCORE : " + self.score, 23, "black");
	}

	createLeftPanel(){
		new Element().getElement(this.canvas.user.getElement()).css({
			"position":"absolute",
			"top": this.canvas.top + "px",
			"left": this.canvas.left + this.canvas.width + "px",
			"background-color":"silver"
		}).attr("width",200).attr("height",this.canvas.height)
	}
	chekHelth(self){
		if(self.player.life <= 0){
			self.game.end = true
			return;
		}
	}

	enemyMoving(self){
		self.counter ++
		if(self.counter < self.enemyInterval) return
			self.counter = 0
		for(var i =  0; i < self.enemys.length; i ++){
			if(self.enemys[i].moving == true){
				if(self.enemys[i].direction.left == true){
					self.canvas.game.clear([self.enemys[i].x,self.enemys[i].y],[self.enemy.width,self.enemy.height])
					self.enemys[i].x -= 10	
					if(self.enemys[i].x <= 10){
						self.enemys[i].direction.left = false
						self.enemys[i].y += 40
					}
				}else{
					self.canvas.game.clear([self.enemys[i].x,self.enemys[i].y],[self.enemy.width,self.enemy.height])
					self.enemys[i].x += 10	
					if(self.enemys[i].x >= self.canvas.width - 30){
						self.enemys[i].direction.left = true
						self.enemys[i].y += 40
					}
				}

			}
		}	
	}
	enemyCollidesPlayer(self){
		for(var i = 0; i < self.enemys.length; i ++){
			var x1,x2,y1,y2;
			x1 = self.enemys[i].x - self.enemy.width
			x2 = self.enemys[i].x + self.enemy.width
			y1 = self.enemys[i].y - self.enemy.height
			y2 = self.enemys[i].y + self.enemy.height
			if(self.player.x >= x1 && self.player.x <= x2){
				if(self.player.y >= y1 && self.player.y <= y2){
					self.game.end = true
				}
			}
		}	
	}

	init(){
		this.setUpEnvironment()
		this.createLeftPanel()
		// this.createPlayer(this)
		this.addListenerToCanvas()
		this.createEnemy(this)
		var self  = this;
		this.myImage.onload = function(){
			console.log("image loaded")
			self.sounds.back.oncanplaythrough = function(){
				console.log("back loaded")
			}
			self.gameLoop();

		}
		this.createNewGame()



	}
	gameLoop(){

		var self = this;
		/*main loop for game*/
		setInterval(function(){
			if (self.game.end == true){
				self.explosionSound(self)
				self.sheazanzarebliadz(self, self.canvas.top, self.canvas.left)
				setTimeout(function(){
					document.getElementById("over").style.display = "block"
					document.getElementById("over1").style.display = "block"
					document.getElementById("scrio").innerHTML = "score : " + self.score
				},1000)
				return;	
			} 
			if (self.game.paused == true) return;
			self.enemyMoving(self)

			self.drawDeadObjs(self)

			self.chekHelth(self)
			self.enemyCollidesPlayer(self)
			self.drawBulletsCount(self)
			self.drawHelthCount(self)
			self.enemyLevel(self)
			self.enemyCount(self)
			self.bulletLevel(self)
			self.bonusCOunterDown(self)
			self.scoreCount(self)
			self.levelCount(self)
			/*bulets colision*/
			self.enemyBulletsAndPlayerBuletsCollision(self)
			/*es player da emeny*/
			self.detectCollisionBetweenPlayerAndEnemyBullet(self)
			/*create random shoot from enemy*/
			self.createEnemyBullet(self)
			/*collision detection*/
			self.detectCollision(self)
			/*repete sound*/
			self.backgroundSound(self)
			/*player moving*/
			self.createPlayer(self)
			/*create bullet if needed :)*/
			self.animateBullet(self)
			self.drawEnemys(self)


			if(self.score > localStorage.getItem("score")){
				localStorage.setItem("score",self.score)
			}


			if(self.enemys.length == 0 && self.enemyBullets.length == 0){
				self.score += self.bonus
				self.game.level ++
				(self.bullet.speed < 5)? self.bullet.speed++ : self.bullet.speed 
				self.enemy.power ++
				self.player.bullet += (self.enemy.power * 54) * 2 //54 is enemy quantity  2 times more bullet then enemy power * quantity
				self.bonus = self.game.level * 10000;
				self.enemyInterval = (self.enemyInterval > 10)?self.enemyInterval - 10 : 10
				self.enemyShootRandom = (self.enemyShootRandom > 50)?self.enemyShootRandom - 50 : 50
				self.createEnemy(self)
				self.game.paused = true
				document.getElementById("next").style.display = "block"
				document.getElementById("next1").style.display = "block"
				document.getElementById("scr").innerHTML = self.score

			}

		},5);
	}


		sheazanzarebliadz(self, top, left, c = 0){
			if(c == 30) return
			if(self.shaking == false) return
					c++
			if(new Operations().getRandom(0,1) == 1){
				self.canvas.game.getElement().style.left = parseInt(left) + new Operations().getRandom(0,1) + "px"
			}else{
				self.canvas.game.getElement().style.left = parseInt(left) - new Operations().getRandom(0,1) + "px"
			}

			if(new Operations().getRandom(0,1) == 1){
				self.canvas.game.getElement().style.top = parseInt(top) + new Operations().getRandom(0,1) + "px"
			}else{
				self.canvas.game.getElement().style.top = parseInt(top) - new Operations().getRandom(0,1) + "px"
			}

			setTimeout(function(){
				self.canvas.game.getElement().style.top = top
				self.canvas.game.getElement().style.left = left
				self.sheazanzarebliadz(self, top, left, c)
			},30)
		}




	createNewGame(){
		new Element().createElement("a","body").innerHTML("NEW GAME").attr("href","javascript:location.reload()").css({
			"position":"absolute",
			"top": this.canvas.top - 60 + "px",
			"left": "0",
			"right": "0",
			"width": "100px",
			"display": "block",
			"margin": "auto",
			"font-size":"20px",
			"font-family":"dgt"
		})




		new Element().createElement("div",'body').css({
			"position":"absolute",
			"width":"200px",
			"text-align":"center",
			"height":this.canvas.height + "px",
			"background-color":"silver",
			"top":this.canvas.top + "px",
			"left":this.canvas.left - 200 + "px",
			"display":this.mobile?"none":"block"
		}).attr("id","div").this()

		var self = this
		new Element().createElement("br","#div")
		new Element().createElement("span","#div").innerHTML("Change Bullet Type").css("color:purple;font-size:20px;")
		new Element().createElement("br","#div")
		new Element().createElement("br","#div")
		new Element().createElement("span","#div").innerHTML("single (1)").css("color:blue;font-size:20px;cursor:pointer;")
		.attr("onmouseover","this.style.fontWeight='bold'")
		.attr("onmouseout","this.style.fontWeight='normal'").this().onclick = function(){
			self.bullet.double = false
			self.bullet.triple = false
		};
		new Element().createElement("br","#div")
		new Element().createElement("br","#div")
		new Element().createElement("span","#div").innerHTML("double (2)").css("color:gree;font-size:20px;cursor:pointer;")
		.attr("onmouseover","this.style.fontWeight='bold'")
		.attr("onmouseout","this.style.fontWeight='normal'").this().onclick = function(){
			self.bullet.double = true
			self.bullet.triple = false
		};
		new Element().createElement("br","#div")
		new Element().createElement("br","#div")
		new Element().createElement("span","#div").innerHTML("triple (3)").css("color:red;font-size:20px;cursor:pointer;")
		.attr("onmouseover","this.style.fontWeight='bold'")
		.attr("onmouseout","this.style.fontWeight='normal'").this().onclick = function(){
			self.bullet.double = false
			self.bullet.triple = true
		};
		new Element().createElement("br","#div")
		new Element().createElement("br","#div")

		new Element().createElement("span","#div").innerHTML("Game controls").css("color:navy;font-size:20px;")
		new Element().createElement("br","#div")
		new Element().createElement("br","#div")

		new Element().createElement("span","#div").innerHTML("mute (m)").css("font-family:dgt;font-size:20px;cursor:pointer;")
		.attr("id","mute")
		.attr("onmouseover","this.style.fontWeight='bold'")
		.attr("onmouseout","this.style.fontWeight='normal'")
		.this().addEventListener("click", function(){
			if(self.sounds.mute == true){
				self.sounds.mute = false
				this.innerHTML = "mute (m)"
			} 
			else{
				self.sounds.mute = true
				this.innerHTML = "unmute (m)"
			}
		})

		new Element().createElement("br","#div")
		new Element().createElement("br","#div")

		new Element().createElement("span","#div").innerHTML("pause (p)").css("font-family:dgt;font-size:20px;cursor:pointer;")
		.attr("id","pause")
		.attr("onmouseover","this.style.fontWeight='bold'")
		.attr("onmouseout","this.style.fontWeight='normal'")
		.this().addEventListener("click", function(){
			if(self.game.paused == true){
				self.game.paused = false
				this.innerHTML = "pause (p)"
			} 
			else{
				self.game.paused = true
				this.innerHTML = "resume (p)"
			}
		})

	new Element().createElement("br","#div")
		new Element().createElement("br","#div")

		new Element().createElement("span","#div").innerHTML("shake off (s)").css("font-family:dgt;font-size:20px;cursor:pointer;")
		.attr("id","shaking")
		.attr("onmouseover","this.style.fontWeight='bold'")
		.attr("onmouseout","this.style.fontWeight='normal'")
		.this().addEventListener("click", function(){
			if(self.shaking == true){
				self.shaking = false
				this.innerHTML = "shake off (s)"
			} 
			else{
				self.shaking = true
				this.innerHTML = "shake on (s)"
			}
		})

		new Element().createElement("br","#div")

		new Element().createElement("br","#div")
		new Element().createElement("br","#div")

		new Element().createElement("span","#div").innerHTML("high score").css("color:red;font-family:dgt;font-size:30px;")
		new Element().createElement("br","#div")
		new Element().createElement("br","#div")
		var score = 0
		if(localStorage.getItem("score")){
			score = localStorage.getItem("score")
		}
		new Element().createElement("span","#div").innerHTML(score).css("color:red;font-family:dgt;font-size:30px;").attr("id","score")









		new Element().createElement("div","body").css({
			"position":"absolute",
			"width":"100%",
			"height":"100%",
			"background-color":"black",
			"opacity":"0.9",
			"top":0,
			"left":0,
			"z-index":"10",
			"display":"none"
		}).attr("id","next")

		new Element().createElement("div","body").css({
			"width":"400px",
			"height":"300px",
			"background-color":"rgb(34,34,34)",
			"position":"absolute",
			"left": (window.innerWidth - 400) /2 + "px",
			"top":"200px",
			"z-index":20,
			"display":"none"
		}).attr("id","next1")

		new Element().createElement("h3","#next1").innerHTML("Your score").css({
			"font-family":"dgt",
			"font-size":"30px",
			"color":"blue",
			"border":"nene",
			"text-align":"center",
			"background-color":"none"
		})

		new Element().createElement("h1","#next1").innerHTML(this.score).css({
			"text-align":"center",
			"font-family":"dgt",
			"color":"red"
		}).attr("id","scr")
		new Element().createElement("br","#next1")
		new Element().createElement("br","#next1")
		new Element().createElement("br","#next1")
		new Element().createElement("br","#next1")
		new Element().createElement("br","#next1")

		new Element().createElement("h3","#next1").innerHTML("next level").css({
			"font-family":"dgt",
			"font-size":"30px",
			"color":"green",
			"text-align":"center",
			"cursor":"pointer"
		}).this().onclick = function(){
			document.getElementById("next").style.display = "none"
			document.getElementById("next1").style.display = "none"
			self.game.paused = false
		}



























		new Element().createElement("div","body").css({
			"position":"absolute",
			"width":"100%",
			"height":"100%",
			"background-color":"black",
			"opacity":"0.9",
			"top":0,
			"left":0,
			"z-index":"10",
			"display":"none"
		}).attr("id","over")

		new Element().createElement("div","body").css({
			"width":"400px",
			"height":"300px",
			"background-color":"rgb(34,34,34)",
			"position":"absolute",
			"left": (window.innerWidth - 400) /2 + "px",
			"top":"200px",
			"z-index":20,
			"display":"none"
		}).attr("id","over1")

		new Element().createElement("h3","#over1").innerHTML("Game over").css({
			"font-family":"dgt",
			"font-size":"50px",
			"color":"red",
			"border":"nene",
			"text-align":"center",
			"background-color":"none"
		})
		new Element().createElement("br","#over1")


		new Element().createElement("h1","#over1").innerHTML("0").css({
			"text-align":"center",
			"font-family":"dgt",
			"color":"blue"
		}).attr("id","scrio")


		new Element().createElement("h1","#over1").innerHTML("new game").css({
			"text-align":"center",
			"font-family":"dgt",
			"color":"green",
			"cursor":"pointer"
		}).this().onclick = function(){location.reload()}







	}


}















new Game("#gameBack","#gameFront","#gamePopup").init()



