$(document).ready(function() {
    // get canvas attrs
    var canvas = $('#snake-game')[0];
    var ctx = canvas.getContext('2d');
    var h = canvas.height;
    var w = canvas.width;
    var unit = 10; // cell size
    var interval = 60; // game interval
    var game_loop = 0; // game loop
    var initialized = false;

    var snake; // snake array
    var snake_size; // length of snake
    var direction; // the direction of snake move

    var food; // the food

    var score; // the score; starts from 0
    var best = 0; // the best score

    // the initial function
    function init() {
        snake_size = 5;
        score = 0;
        clear_screen();
        create_snake();
        paint_snake();
        create_food();
        paint_food();
        update_score();
        direction = 'right';
        initialized = true;
    }

    // start the game loop
    function start() {
        if (!initialized) init();
        $(".menu").hide();
        if (typeof game_loop != 'undefined') clearInterval(game_loop);
        game_loop = setInterval(turn, interval);
    }

    // stop the game loop
    function stop() {
        clearInterval(game_loop);
        game_loop = 0;
        initialized = false;
    }

    // genereal function to paint a cell
    function paint_cell(cell) {
        ctx.fillStyle = 'black';
        ctx.fillRect(cell.x * unit, cell.y * unit, unit, unit);
    }

    // initially creates a snake with $snake_size cells
    function create_snake() {
        snake = [];
        for (var i = snake_size - 1; i >= 0; i--) {
            snake.push({x: i + 5, y: 5});
        }
    }

    function create_food() {
        food = {
            x: Math.round(Math.random() * (w - unit) / unit),
            y: Math.round(Math.random() * (h - unit) / unit)
        };
    }

    function paint_food() {
        console.log(food);
        paint_cell(food);
    }

    // function for moving the snake
    // the logic is: pop out the tail and place it in front of the head
    // eats the food too
    function move_snake() {
        var head = snake[0]; // the head of snake
        var new_head = {x: head.x, y: head.y};

        // increment head properly
        switch (direction) {
            case 'right':
                new_head.x++;
                break;
            case 'left':
                new_head.x--;
                break;
            case 'up':
                new_head.y--;
                break;
            case 'down':
                new_head.y++;
                break;
            default:
                console.log('no direction');
        }

        // check for food
        if (collision_check(food, new_head) === false) {
            snake.pop();
        } else {
            create_food();
            snake_size++;
            score++;
        }
        snake.unshift(new_head); // place the new head in front of snake body
    }

    // paint all of the snake
    function paint_snake() {
        for (var i = 0; i < snake_size; i++) {
            paint_cell(snake[i]);
        }
    }

    // clears the screen to avoid snake tail
    function clear_screen() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(0, 0, w, h);
    }

    // general collision check function
    function collision_check(first, second) {
        if (first.x == second.x && first.y == second.y) {
            return true;
        }
        return false;
    }

    // check for game over
    function game_over_check() {
        var head = snake[0];

        // check for out of bounds
        if (head.x < 0 || head.x >= w / unit || head.y < 0 || head.y >= h / unit) {
            return true;
        }

        // check for snake head and body collision
        for (var i = snake_size - 1; i > 0; i--) {
            if (collision_check(head, snake[i])) {
                return true;
            }
        }

        return false;
    }

    // updates score in score container
    function update_score() {
        best = Math.max(best, score);
        $(".score-container").text(score);
        $(".best-container").text(best);
    }

    // the function which executes every $interval milliseconds
    function turn() {
        clear_screen();
        paint_snake();
        paint_food();
        update_score();
        if (game_over_check()) {
            // clear_screen();
            stop();
            // init();
            $(".menu").show();
            return;
        }
        move_snake();
    }

    // The main part
    init();

    // keyboad control
    // prevents reverse gear
    $(document).keydown(function(e) {
        var key = e.which;
        if (key == '37' && direction != 'right') direction = 'left';
        if (key == '38' && direction != 'down') direction = 'up';
        if (key == '39' && direction != 'left') direction = 'right';
        if (key == '40' && direction != 'up') direction = 'down';
        if (key == '32' && game_loop == 0) start();
    });

    // onclick event listeners
    $(".start").on("click", function() {
        start();
    });
});
