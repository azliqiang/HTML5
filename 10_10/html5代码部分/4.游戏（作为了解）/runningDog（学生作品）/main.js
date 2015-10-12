// 初始相位，并创建一个400x490px游戏
var game = new Phaser.Game(900, 420, Phaser.AUTO, 'game_div');
var game_state = {};

var x=2;
var choose=0;
// 创建一个新的“main”状态，将包含游戏
game_state.main = function() { };  
game_state.main.prototype = {

    // 首先调用的函数：加载所有资源 
    preload: function() { 
        // 改变游戏的背景色
        //this.game.stage.backgroundColor = 'assets/background.png';
		this.game.load.image('bg','assets/bkg.png');

        // 载入鸟
        this.game.load.image('bird', 'assets/dog.png');
		this.game.load.image('birdL', 'assets/dogleft.png');
    
	    this.game.load.image('birdR', 'assets/dog.png');
	  
		
		//载入障碍物b6
		this.game.load.image('pipe','assets/master.png');
		this.game.load.image('ms2','assets/wood.png');
		
		//加载直线
		this.game.load.image('line','assets/line.PNG');
		
		//加载音乐
		this.game.load.audio('failed','assets/failed.wav');
		this.game.load.audio('jump','assets/jumpp.mp3');
		
		this.game.load.audio('game','assets/game.mp3');
		
		     
    },

    // preload后调用的函数：设置游戏
    create: function() {  
	    this.game.add.sprite(0,0,'bg');   
        // 在屏幕上显示鸟
        this.bird = this.game.add.sprite(100, 255, 'bird');
		
	//	this.ms1=this.game.add.sprite(300, 260, 'ms1');
		//this.ms2=this.game.add.sprite(400, 260, 'ms2'); 
		
		this.line=this.game.add.sprite(0,313,'line');
        
        // 给鸟添加重力，使其能够下降
        this.bird.body.gravity.y = 1000; 
		
		 
		 
		 var right_key = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        right_key.onDown.add(this.right, this); 
		
		 var left_key = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        left_key.onDown.add(this.left, this); 
		
		
		
		

        // 点击空格时调用jump函数
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this); 
		 
		
		this.pipes=game.add.group();
		this.pipes.createMultiple(20,'pipe');
		
		this.pipes1=game.add.group();
		this.pipes1.createMultiple(20,'ms2');
		
		// 定时器每1.5秒调用一次add_row_of_pipes方法
        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);          


        // 在屏幕左侧添加一个计分文本框
        this.score = 0;
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.label_score = this.game.add.text(20, 20, "0", style);  
		
		//游戏失败音效
		this.restart_game_sound = this.game.add.audio('failed');
		this.jump_sound = this.game.add.audio('jump');
		
		
		this.game_sound = this.game.add.audio('game');
		
		this.game_sound.play();
    
    },
	
	

    // 这个函数每秒会被调用60次：执行碰撞检测
    update: function() {
        // If the bird is out of the world (too high or too low), call the 'restart_game' function
		
		if(this.source==51)
		{
			this.game.sound.stop();
			this.game_sound.play();
			}
			
			
        if (this.bird.inWorld == false)
            this.restart_game(); 
		
		this.game.physics.overlap(this.bird, this.line, this.land, null, this);
        // If the bird overlap any pipes, call 'restart_game'
        this.game.physics.overlap(this.bird, this.pipes, this.restart_game, null, this);
		this.game.physics.overlap(this.bird, this.pipes1, this.restart_game, null, this);   
		
		   
    },
	
	//落到木板上
	land:function(){
	//	this.bird.body.gravity.y = 100; 
		this.bird.body.velocity.y =-150;
		x=2;
	//	this.bird.body.velocity.x = 100;
		},
		
		left: function() {
    
        this.bird.body.velocity.x = -150;
			this.bird.loadTexture('birdL', 0);
			
			
		
    }, 
	
	//右移的设置
	right: function() {
       this.bird.loadTexture('birdR', 0);
        this.bird.body.velocity.x = 150;
		
    },

    // Make the bird jump 
    jump: function() {
        // Add a vertical velocity to the bird
		if(x>0){
			this.jump_sound.play();
			this.bird.body.velocity.y = -320;
			x--;
			}
		
		
		
		
    },

    // Restart the game
    restart_game: function() {
        // Remove the timer
        this.game.time.events.remove(this.timer);
		this.game_sound.stop();
		this.restart_game_sound.play();
		
		if(this.score<10)
		{
			alert("分数："+this.score+"分  你是猪吗");
			}
		else if(this.score<20)
		{
			alert("分数："+this.score+"分  不错哦");
			}
		else 
		{
			alert("分数："+this.score+"分  这种游戏你都能玩的这么开心，你傻呀");
			}
		
		

        // Start the 'main' state, which restarts the game
        this.game.state.start('main');
    },

    // Add a pipe on the screen
    add_one_pipe: function(x, y) {
        // Get the first dead pipe of our group
		if(choose==0)
		{
			 var pipe = this.pipes.getFirstDead();

        // Set the new position of the pipe
        pipe.reset(x, y);

         // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200; 
               
        // Kill the pipe when it's no longer visible 
        pipe.outOfBoundsKill = true;
		choose=1;
			}else{
				 var pipe = this.pipes1.getFirstDead();

        // Set the new position of the pipe
        pipe.reset(x, y);

         // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200; 
               
        // Kill the pipe when it's no longer visible 
        pipe.outOfBoundsKill = true;
		choose=0;
				}
       
    },

    // Add a row of 6 pipes with a hole somewhere in the middle
    add_row_of_pipes: function() {
        var hole = Math.floor(Math.random()*3);
        
        for (var i = 0; i < 3  ; i++)
            if (i != hole && i != hole +1) //去掉两块管
			{
				this.add_one_pipe((i+1)*800,280 );
				}
                   
    
        this.score += 1;
        this.label_score.content = this.score;  
    },
};

// Add and start the 'main' state to start the game
game.state.add('main', game_state.main);  
game.state.start('main'); 