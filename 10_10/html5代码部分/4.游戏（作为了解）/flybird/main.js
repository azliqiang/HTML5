// 初始相位，并创建一个400x490px游戏
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');
//canvas,webGL渲染
var game_state = {};

// 创建一个新的“main”状态，将包含游戏
game_state.main = function() { };  
game_state.main.prototype = {

    // 首先调用的函数：加载所有资源
    preload: function() { 
        // 改变游戏的背景色
        this.game.stage.backgroundColor = '#71c5cf';

        // 载入鸟
        this.game.load.image('bird', 'assets/bird.png');  

        // 加载管子
        this.game.load.image('pipe', 'assets/pipe.png');      
    },

    // preload后调用的函数：设置游戏
    create: function() { 
        // 在屏幕上显示鸟
        this.bird = this.game.add.sprite(100, 245, 'bird');
        
        // 给鸟添加重力，使其能够下降
        this.bird.body.gravity.y = 1000; 

        // 点击空格时调用jump函数
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this); 

        // 创建一个包含20个管道的组
        this.pipes = game.add.group();
        this.pipes.createMultiple(20, 'pipe');  

        // 定时器每1.5秒调用一次add_row_of_pipes方法
        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);           

        // 在屏幕左侧添加一个计分文本框
        this.score = 0;
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.label_score = this.game.add.text(20, 20, "0", style);  
    },

    // 这个函数每秒会被调用60次：执行碰撞检测
    update: function() {
        // If the bird is out of the world (too high or too low), call the 'restart_game' function
        if (this.bird.inWorld == false)
            this.restart_game(); 

        // If the bird overlap any pipes, call 'restart_game'
        this.game.physics.overlap(this.bird, this.pipes, this.restart_game, null, this);      
    },

    // Make the bird jump 
    jump: function() {
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;
    },

    // Restart the game
    restart_game: function() {
        // Remove the timer
        this.game.time.events.remove(this.timer);

        // Start the 'main' state, which restarts the game
        this.game.state.start('main');
    },

    // Add a pipe on the screen
    add_one_pipe: function(x, y) {
        // Get the first dead pipe of our group
        var pipe = this.pipes.getFirstDead();

        // Set the new position of the pipe
        pipe.reset(x, y);

         // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200; 
               
        // Kill the pipe when it's no longer visible 
        pipe.outOfBoundsKill = true;
    },

    // Add a row of 6 pipes with a hole somewhere in the middle
    add_row_of_pipes: function() {
        var hole = Math.floor(Math.random()*5)+1;
        
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1) //去掉两块管
                this.add_one_pipe(400, i*60+10);   
    
        this.score += 1;
        this.label_score.content = this.score;  
    },
};

// Add and start the 'main' state to start the game
game.state.add('main', game_state.main);  
game.state.start('main'); 