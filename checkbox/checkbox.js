(function() {

    var G = {
        YOU: 'you',
        ROWS: 25,
        COLS: 15,

        DIFFICULTY: {
            1: 'Crawling time',
            2: 'Getting faster..',
            3: 'Um.. Tricky!',
            4: 'Ouch!',
            5: '@&)!*.'
        }
    };

    var root, world, menu, status, durationInfo, levelInfo, startDate, timeSpan, gap, s, margin, render,
        you = {
            node: null,
            row: 0,
            col: 0
        },
        inputs = [],
        enemies = [],
        level = 1,
        duration = 0,
        SPEED = 100;

    function Enemy(c) {
        this.node = null;
        this.row = -1;
        this.col = c;
    }

    function initEnemies(left, gap) {
        for (var i = 0; i < left; i++) {
            enemies.push(new Enemy(i));
        }
        for (var i = left + gap; i < G.COLS; i++) {
            enemies.push(new Enemy(i));
        }
    }

    // generate main divs
    function createWrapper() {
        document.body.style.overflow = 'hidden';
        var head = document.getElementsByTagName('head')[0];

        var font = document.createElement('link');
        font.setAttribute('rel', 'stylesheet');
        font.setAttribute('type', 'text/css');
        font.setAttribute('href', 'https://fonts.googleapis.com/css?family=Press+Start+2P');

        var browserInfo = document.createElement('div');
        browserInfo.setAttribute('style',
            'position: fixed; top: 1em; right: 1em');
        browserInfo.innerHTML = '<span style="font-family: \'Press Start 2P\'; font-size: .5em">Chrome + kbd only </span><br><span style="position: relative; display:block; text-align: center"> ¯\\_(ツ)_/¯ </span>';
        document.body.appendChild(browserInfo);

        root = document.createElement('div');
        root.setAttribute('style',
            'position: relative; width: 100vw; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; animation: fadeIn .5s ease-in-out forwards;');
        document.body.appendChild(root);

        status = document.createElement('div');
        status.setAttribute('style',
            'font-family: "Press Start 2P"; font-size: 1.25em; margin: 1em 0; text-align: center; opacity: .75');

        var gameTitle = document.createElement('h1');
        gameTitle.setAttribute('style',
            'font-size: 1em; margin-bottom: 1em;');
        gameTitle.innerHTML = 'JS checkbox raid';

        levelInfo = document.createElement('div');
        levelInfo.setAttribute('style',
            'font-size: .75em; margin: 1em 0;');
        levelInfo.innerHTML = '<br>';

        durationInfo = document.createElement('div');
        durationInfo.innerHTML = '<br>';

        status.appendChild(gameTitle);
        status.appendChild(levelInfo);
        status.appendChild(durationInfo);
        root.appendChild(status);

        world = document.createElement('div');
        world.setAttribute('style',
            'position: relative; background-color: transparent; margin-bottom: 10vh;');
        createMenu();
        root.appendChild(world);

        var style = document.createElement('style');
        style.innerHTML = '#you { opacity: 1!important } ';
        head.appendChild(style);

        style = document.createElement('style');
        style.innerHTML = '#startBtn:hover { transition: .2s ease-in-out all; color: white!important; background-color: black!important } #startBtn:focus { transition: .2s ease-in-out all; color: white!important; background-color: black!important }';
        head.appendChild(style);
        head.appendChild(font);

        var fadeIn = document.createElement('style');
        fadeIn.innerHTML = '\
        @keyframes fadeIn {\
            0% {\
                opacity: 0;\
            }\
            100% {\
                opacity: 1;\
            }}';
        head.appendChild(fadeIn);

        var fadeOut = document.createElement('style');
        fadeOut.innerHTML = '\
        @keyframes fadeOut {\
            0% {\
                opacity: 1;\
            }\
            100% {\
                opacity: 0;\
            }}';
        head.appendChild(fadeOut);

        var pulse = document.createElement('style');
        pulse.innerHTML = '\
        @keyframes pulse {\
            0% {\
                transform: scale(1, 1);\
            }\
            50% {\
                transform: scale(1.5, 1.5);\
            }\
            100% {\
                transform: scale(1.2, 1.2);\
            }}';
        head.appendChild(pulse);
    }

    // generate menu div
    function createMenu() {
        menu = document.createElement('div');
        menu.setAttribute('style',
            'position: relative; top: 0; left: 0; width: 100%; height: 100%; white; font-family: "Press Start 2P"; font-size: .5em; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: white;');
        menu.id = "menu";

        var startGameBtn = document.createElement('input');
        startGameBtn.id = 'startBtn';
        startGameBtn.setAttribute('style',
            'font-family: "Press Start 2P"; font-size: 1.5em; background-color: transparent; border: 1px solid black; color: black; padding: 10px 15px; text-align: center; text-decoration: none; cursor: pointer;');
        startGameBtn.setAttribute('type',
            'button');
        startGameBtn.setAttribute('value',
            'Start game!');
        startGameBtn.addEventListener('click', startGame, false);

        menu.appendChild(startGameBtn);
        world.appendChild(menu);
    }

    // generate game grid
    function createWorld() {
        levelInfo.innerHTML = "Generating..";
        durationInfo.innerHTML = "<br>";
        var time = 0;
        for (var i = 0; i < G.ROWS; i++) {
            inputs[i] = new Array(G.COLS);
            var row = document.createElement('div');
            row.setAttribute('style',
                'position: relative; height: 16px');
            for (var j = 0; j < G.COLS; j++) {
                (function(i, j, row) {
                    window.setTimeout(function() {
                        var input = document.createElement('input');
                        input.type = Math.random() > .5 ? 'radio' : 'checkbox';
                        input.className = 'input-box';
                        input.setAttribute('style',
                            'width: 16px; opacity: .5; margin: 0; animation: pulse .25s ease-in-out forwards;');
                        inputs[i][j] = input;
                        row.appendChild(input);
                        if (i === G.ROWS - 1 && j === Math.floor(G.COLS / 2)) { // starting point
                            setPosition(i, j);
                        }
                    }, time);
                })(i, j, row);
            }
            world.appendChild(row);
            time += 30;
        }

        document.addEventListener('keydown', keyDownHandler);
    }

    function keyDownHandler(e) {
        switch (e.keyCode) {
            case 37:
                move('left');
                break;
            case 38:
                move('up');
                break;
            case 39:
                move('right');
                break;
            case 40:
                move('down');
                break;
        }
    }

    function move(direction) {
        switch (direction) {
            case 'left':
                if (you.col > 0) {
                    setPosition(you.row, you.col - 1);
                }
                break;
            case 'right':
                if (you.col < G.COLS - 1) {
                    setPosition(you.row, you.col + 1);
                }
                break;
            case 'up':
                if (you.row > 0) {
                    setPosition(you.row - 1, you.col);
                }
                break;
            case 'down':
                if (you.row < G.ROWS - 1) {
                    setPosition(you.row + 1, you.col);
                }
                break;
        }
    }

    function go() {
        startDate = Date.now();
        timeSpan = 0; // pseudo time unit
        gap = (Object.keys(G.DIFFICULTY).length - level) + 2; // based on level
        s = 0; // gap sway direction
        margin = Math.floor(G.COLS / 2) - Math.floor(gap / 2); // left margin (where the gap will starts)

        render = window.setInterval(generateFrame, SPEED - level * SPEED / 20);
    }

    function generateFrame() {
        if (timeSpan > 3) {
            s = Math.random() > .5 ?
                (Math.random() > .5 ? -1 : 1) : 0;
            timeSpan = 0;
        }
        margin = margin + s;
        if (margin < 0)
            margin = 0;
        if (margin > (G.COLS - gap))
            margin = G.COLS - gap;
        initEnemies(margin, gap);
        for (var i = 0; i < G.ROWS; i++) {
            for (var j = 0; j < G.COLS; j++) {
                if (inputs[i][j].id !== G.YOU)
                    inputs[i][j].checked = false;
            }
        }
        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            enemy.row++;
            if (enemy.row < G.ROWS) {
                enemy.node = inputs[enemy.row][enemy.col];
                enemy.node.type = Math.random() > .5 ? 'radio' : 'checkbox';
                enemy.node.checked = true;
                if (enemy.row === you.row && enemy.col === you.col) { // rekt
                    return endGame();
                }
            } else {
                enemies.splice(i, 1);
            }
        }
        duration = (Date.now() - startDate) / 1000;
        timeSpan++;
        updateLevel();
        updateStatusbar();
    }

    function updateLevel() {
        clearInterval(render);
        switch (true) {
            case (duration > 40):
                level = 5;
                break;
            case (duration > 30):
                level = 4;
                break;
            case (duration > 20):
                level = 3;
                break;
            case (duration > 10):
                level = 2;
                break;
        }
        gap = (Object.keys(G.DIFFICULTY).length - level) + 2;
        render = window.setInterval(generateFrame, SPEED - level * SPEED / 20);
    }

    function updateStatusbar() {
        levelInfo.innerHTML = "'" + G.DIFFICULTY[level] + "'";
        durationInfo.innerHTML = duration.toFixed(1);
    }

    function setPosition(r, c) {
        if (inputs[r][c].checked) { // rekt
            return endGame();
        }
        if (you.node) {
            you.node.checked = false;
            you.node.removeAttribute('id');
        }
        you.row = r;
        you.col = c;
        you.node = inputs[r][c];
        you.node.id = G.YOU;
        you.node.type = 'radio';
        you.node.checked = true;
    }

    function startGame(e) {
        createWorld();
        menu.style.display = 'none';
        setTimeout(function() {
            go();
        }, 30 * G.ROWS);
    }

    function endGame() {
        clearInterval(render);
        zeroize();
        createMenu();
        levelInfo.innerHTML = '* REKT *';
    }

    function zeroize() {
        inputs = [];
        enemies = [];
        level = 1;
        duration = 0;
        world.innerHTML = "";
        document.removeEventListener('keydown', keyDownHandler);
    }

    createWrapper();

})();
