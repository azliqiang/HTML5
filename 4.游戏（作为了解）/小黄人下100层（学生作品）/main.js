// 初始相位，并创建一个600x800px游戏
var game = new Phaser.Game(612, 710, Phaser.AUTO, 'game_div');
var game_state = {};

// 创建一个新的“main”状态，将包含游戏
game_state.main = function() {
	this.bird=null;
	
};  
game_state.main.prototype = {

    // 首先调用的函数：加载所有资源
    preload: function() { 
      
      
		 this.game.load.image('bk', 'assets/bk.jpg');
	  this.game.load.image('birdL', 'assets/birdL.png');
    this.game.load.image('birdR', 'assets/birdR.png');
  this.game.load.image('jumppipe', 'assets/jumppipe.jpg');  
        // 加载管子
        this.game.load.image('pipe', 'assets/pipe.jpg');   	
		//加载带刺的木板	
        this.game.load.image('thorn', 'assets/c.png');
	 
		 //加载左右边框
		this.game.load.image('side','assets/side.jpg');	
		
		this.game.load.audio('right', 'assets/music.mp3');
		this.game.load.audio('left', 'assets/music.mp3');
		this.game.load.audio('restart_game', 'assets/gg.mp3');
		 
		 
    },

    // preload后调用的函数：设置游戏
    create: function() { 
        // 在屏幕上显示鸟
	this.game.add.sprite(0, 0, 'bk');
        this.bird = this.game.add.sprite(100, 30, 'birdR');
         
        // 给鸟添加重力，使其能够下降
        this.bird.body.gravity.y = 600; 

        // 点击空格时调用jump函数
        //var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        //space_key.onDown.add(this.jump, this); 
		//按左键
		 var right_key = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        right_key.onDown.add(this.right, this); 
		
		 var left_key = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        left_key.onDown.add(this.left, this); 

        // 创建一个包含20个管道的组
        this.pipes = game.add.group();
        this.pipes.createMultiple(200, 'pipe');  

        // 定时器每1.5秒调用一次add_row_of_pipes方法
        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);       
		
		this.sides = game.add.group();
        this.sides.createMultiple(200, 'side');
		// 定时器每1.5秒调用一次add_row_of_pipes方法
        this.timer2 = this.game.time.events.loop(700, this.add_row_of_sides, this);
		
		this.jumppipes = game.add.group();
        this.jumppipes.createMultiple(200, 'jumppipe');   
		
		// 创建一个包含20个管道的组
        this.thorns = game.add.group();
        this.thorns.createMultiple(200, 'thorn');  

        // 定时器每1.5秒调用一次add_row_of_pipes方法
        this.timer3 = this.game.time.events.loop(5300, this.add_row_of_thorns, this);

        // 在屏幕左侧添加一个计分文本框
        this.score = 0;
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.label_score = this.game.add.text(20, 20, "0", style);  
		//预先设置的3组木板 
		this.add_one_pipe(100,600);   
		this.add_one_pipe(250,800);
		this.add_one_pipe(200,1000);
		
		this.right_sound = this.game.add.audio('right'); 
		this.left_sound = this.game.add.audio('left'); 
		this.restart_game_sound = this.game.add.audio('restart_game');
    },
	
	

    // 这个函数每秒会被调用60次：执行碰撞检测
    update: function() {
        // If the bird is out of the world (too high or too low), call the 'restart_game' function
        if (this.bird.inWorld == false)
            this.restart_game(); 

        // If the bird overlap any pipes, call 'restart_game'
        this.game.physics.overlap(this.bird, this.pipes, this.land, null, this);      
		this.game.physics.overlap(this.bird,this.sides,this.onside,null,this);
		
		this.game.physics.overlap(this.bird, this.jumppipes, this.jumpland, null, this);   
		//踩到带刺的木板死亡
		this.game.physics.overlap(this.bird, this.thorns, this.restart_game, null, this); 
    },
    start: function() {
       this.add_one_pipe(100,200);   
    },
    
	//落到板上之后跟随板一起上移
	land: function() {
      
       this.bird.body.velocity.y = -170;
	   
    },
	jumpland: function() {
      
       this.bird.body.velocity.y = -350;
	   
    },

    onside:function(){
		this.bird.body.velocity.x = 0;
	},
	//左移的设置
    left: function() {
    
        this.bird.body.velocity.x = -150;
			this.bird.loadTexture('birdL', 0);
			
			this.left_sound.play();
		
    }, 
	
	//右移的设置
	right: function() {
       this.bird.loadTexture('birdR', 0);
        this.bird.body.velocity.x = 150;
		this.right_sound.play();
    },
    // Restart the game
    restart_game: function() {
        // Remove the timer
		this.restart_game_sound.play();
        this.game.time.events.remove(this.timer);
		
		this.game.time.events.remove(this.timer3);

        // Start the 'main' state, which restarts the game
        this.game.state.start('main');
    },

    // Add a pipe on the screen
    add_one_pipe: function(x, y) {
        // Get the first dead pipe of our group
        var pipe = this.pipes.getFirstDead();

        // Set the new position of the pipe
        pipe.reset(x, y);

         // 木板上移的速度
        pipe.body.velocity.y = -150; 
               
        // Kill the pipe when it's no longer visible 
        pipe.outOfBoundsKill = true;
    },

   
    add_row_of_pipes: function() {
        var hole = Math.floor(Math.random()*10)+1;
        var i = hole;
		if(i%4==0){
			this.add_one_jumppipe(i*40+10,800);
		}
		else
            this.add_one_pipe(i*40+10,800);   
    
        this.score += 1;
        this.label_score.content = "第"+this.score+"层";  
    },
	
	// Add a pipe on the screen
    add_one_jumppipe: function(x, y) {
        // Get the first dead pipe of our group
        var jumppipe = this.jumppipes.getFirstDead();

        // Set the new position of the pipe
        jumppipe.reset(x, y);

         // 木板上移的速度
        jumppipe.body.velocity.y = -150; 
               
        // Kill the pipe when it's no longer visible 
        jumppipe.outOfBoundsKill = true;
    },
	
	add_one_side: function(x, y) {
        // Get the first dead pipe of our group
        var side = this.sides.getFirstDead();

        // Set the new position of the side
        side.reset(x, y);

         // Add velocity to the pipe to make it move left
        side.body.velocity.y = -150; 
               
        // Kill the pipe when it's no longer visible 
        side.outOfBoundsKill = true;
    },
	// 添加边缘的一组边框
    add_row_of_sides: function() {
        var hole = Math.floor(Math.random()*1)+1;
        var i = hole;
	
            this.add_one_side(589,i*30);   
			this.add_one_side(0,i*30);
		
        //this.score += 1;
        //this.label_score.content = this.score;  
    },
	
	// Add a pipe on the screen
    add_one_thorn: function(x, y) {
        // Get the first dead pipe of our group
        var thorn = this.thorns.getFirstDead();

        // Set the new position of the pipe
        thorn.reset(x, y);

         // 木板上移的速度
        thorn.body.velocity.y = -150; 
               
        // Kill the pipe when it's no longer visible 
        thorn.outOfBoundsKill = true;
    },

   
    add_row_of_thorns: function() {
        var hole = Math.floor(Math.random()*10)+1;
        var i = hole;
        this.add_one_thorn(i*40+10,800);     
    },
};

// Add and start the 'main' state to start the game
game.state.add('main', game_state.main);  
game.state.start('main'); 