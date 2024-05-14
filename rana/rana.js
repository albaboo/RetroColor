window.onload = function() {
    const documentBody = document.querySelector('body');
    const tutorialContainer = document.querySelector('.tutorial-container');
    const enemyContainer = document.querySelector('.enemy-container')
    const btnRestart = document.querySelector('#btn-restart');
    const spanKillCount = document.querySelector('#kill-count');
    
    // Variables
    const maxMovement = 16;
    const enemyList = [];
    const maxEnemyVPosition = 36;
    const charData = {
      element: document.querySelector('#character'),
      position: 0,
      hasShot: false,
      movementInterval: null,
      intervalSpeed: 75
    };
    let isGameRunning = false;
    let score = 0;
    
    // Enemy Class
    function Enemy() {
      this.element = document.createElement('div');
      this.hPosition = maxMovement;
      this.vPosition = 0;
      this.isMovingRight = true;
      this.intervalSpeed = 25;
      this.movementInterval = enemyMovement(this);
      
      this.setMovingRight = (value) => this.isMovingRight = value;
      this.incrementVPosition = () => this.vPosition += 2.5;
      
      // Render to document
      enemyContainer.appendChild(this.element);
      this.element.classList.add("enemy");
      this.element.style.right = this.hPosition + 'rem';
    }
    
    // Initialize New Game
    const initializeGame = () => {        
      tutorialContainer.style.display = 'none';
      
      if(isGameRunning === true){
        stopGame();
        return;
      }
      else{
        resetScore();
        isGameRunning = true;
        btnRestart.textContent = "Stop";
        addEnemy(1500, 300);
      }
    }
    
    const stopGame = () => {
      enemyList.forEach(enemy => {
        removeEnemy(enemy);
      });
      
      isGameRunning = false;
      btnRestart.textContent = "Start";
      tutorialContainer.style.display = 'block';
      displayFinalScore();
    }
    
    // Check if horizontal shot is within bounds
    const checkHorizontalCollision = (shot, element) => {
      const shotBounding = shot.getBoundingClientRect();
      const {x, width} = element.getBoundingClientRect();
      const padding = 1;
      
      return (shotBounding.x < (x - padding) - (width/2)  || shotBounding.x > (x + width / 2) + (width/2)) ? false : true;
    }
    
    // Score Functions
    const addScore = () => {
      score++;
      spanKillCount.textContent = score;
    }
    
    const resetScore = () => {
      score = 0;
      spanKillCount.textContent = score;
    }
    
    const displayFinalScore = () => {
      tutorialContainer.innerHTML = `<h1>Game Over</h1> <p>You caught ${score} flies!<p>`;
    }
  
    // Character Functions
    const moveH = (amount) => {
      if(charData.movementInterval !== null){ return; }
      
      // Max Movement
      if(charData.position > maxMovement){
        charData.position = maxMovement;
        return;
      }
      if(charData.position < -maxMovement){
        charData.position = -maxMovement;
        return;
      }
      
      // Initial Movement
      charData.position += amount; 
      charData.element.style.right = charData.position + 'rem';
  
      // Movement On Interval
      charData.movementInterval = setInterval(() => {
        if(charData.position >= maxMovement || charData.position <= -maxMovement){
          return;
        }
        charData.position += amount; 
        charData.element.style.right = (charData.position) + 'rem';
      }, charData.intervalSpeed);
    }
    
    const stopMovement = () => {
      clearInterval(charData.movementInterval);
      charData.movementInterval = null;
    }
    
    const triggerFire = () => {
      const animationTiming = 240;
      const shot = charData.element.children[0];
      
      if(charData.hasShot === true){ return; }
      
      // Display Shot 
      shot.classList.remove('fire-animated');
      shot.classList.add('fire-animated');
      
      // After animation timeout
      setTimeout(() => {    
        charData.hasShot = true;
        // Hit Register
        for(let i = 0; i < enemyList.length; i++){
          const isHit = checkHorizontalCollision(shot, enemyList[i].element);
  
          // Remove enemy if hit is found
          if(isHit){
            addScore();
            removeEnemy(enemyList[i]);
            break;
          }
        }
      }, (animationTiming / 2));
      
      setTimeout(() => {
        shot.classList.remove('fire-animated');
      }, animationTiming)
    }
    
    // Enemy Functions  
    const enemyMovement = (enemy) => {    
      return setInterval(() => {
        if(enemy.hPosition <= -maxMovement * 2  && enemy.isMovingRight == true){
          turnEnemy(enemy);
          enemy.setMovingRight(false);
        }
        if(enemy.hPosition >= maxMovement * 2 && enemy.isMovingRight === false){
          turnEnemy(enemy);
          enemy.setMovingRight(true);
        }
        
        enemy.hPosition = (enemy.isMovingRight === true) 
          ? enemy.hPosition - 1 
          : enemy.hPosition + 1;
        enemy.element.style.right = enemy.hPosition + 'rem';
      }, enemy.intervalSpeed);
    }
    
    const turnEnemy = (enemy) => {
      enemy.incrementVPosition();    
      enemy.element.style.top = enemy.vPosition + 'rem';
      
      if(enemy.vPosition >= maxEnemyVPosition) { stopGame() }
    }
    
    const addEnemy = (addEnemyInterval, minimumInterval, countAtInterval = 0) => {
      enemyList.push(new Enemy());
      countAtInterval++;
      
      addEnemyInterval = (addEnemyInterval < minimumInterval) 
        ? minimumInterval : addEnemyInterval;
      
      setTimeout(() => {
        if(isGameRunning === false) { return }
        
        if(countAtInterval >= 5){
          console.log('speedup!');
          addEnemy(addEnemyInterval - 100, minimumInterval);
        }
        else{
          console.log('next');
          addEnemy(addEnemyInterval, minimumInterval, countAtInterval);
        }
      }, addEnemyInterval);
    }
    
    const removeEnemy = (enemy) => {
       clearInterval(enemy.movementInterval); 
       enemy.element.remove();
    }
  
    // Key Codes
    const triggerKeyUp = ({keyCode}) => {
      switch(keyCode) {
        // 'Space' Key
        case 38:
           charData.hasShot = false;
           break;
        // 'W' Key
        case 87:
           charData.hasShot = false;
           break;
        // 'Left Arrow' Key
        case 37: 
           stopMovement();
           break;
        // 'Right Arrow' Key
        case 39:
           stopMovement();
           break;
        // 'A' Key
        case 65:
           stopMovement();
           break;
        // 'D' Key
        case 68:
           stopMovement();
           break;
        // 'Space' Key
        case 32:
           initializeGame();
           break;
        default:
          console.log('key not supported');
      } 
    }
    
    const triggerKeyDown = ({keyCode}) => {    
      switch(keyCode) {
        // 'Space' Key
        case 38:
           triggerFire();
           break;
        // 'W' Key
        case 87:
           triggerFire();
           break;
        // 'Left Arrow' Key
        case 37: 
           moveH(1);
           break;
        // 'Right Arrow' Key
        case 39:
           moveH(-1);
           break;
        // 'A' Key
        case 65:
           moveH(1);
           break;
        // 'D' Key
        case 68:
           moveH(-1);
           break;
        // 'Space' Key
        case 32:
           break;
        default:
          console.log('key not supported');
      } 
    }
  
    // Event Listeners
    documentBody.addEventListener('keydown', triggerKeyDown);
    documentBody.addEventListener('keyup', triggerKeyUp);
    btnRestart.addEventListener('click', initializeGame);
  }