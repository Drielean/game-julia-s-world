const myGameArea = {
    canvas: document.createElement("canvas"),
    frames: 0,
    start() {
        this.canvas.width = 600;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        this.canvas.style.backgroundImage = 'url("/images/fundo.jpg")';
    },

    // limpa o canvas
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    // fim de jogo - limpa o intervalo
    stop() {
        clearInterval(this.interval);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.style.background = 'url("/images/Game Over.png")';
        
    },

    score() {
        const points = Math.floor(this.frames / 20);
        this.context.font = '18px serif';
        this.context.fillStyle = 'black';
        this.context.fillText(`Score: ${points}`, 450, 62);
    },


};

// classe do jogador/player
class Component {
    constructor(width, height, x, y) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.playerImg = new Image()
        this.playerImg.src = '/images/png/Idle (9).png';
        this.jumpStatus = true
    }


    jump() {
        let count = 15
        if (this.jumpStatus == true) {
           this.jumpStatus = false
            for (var u = 0; u <= count; u++) {
                this.playerImg.src = '/images/png/Jump (7).png'
                this.y -= 2

                setTimeout(() => {
                    this.y += 2
                    this.playerImg.src = '/images/png/Idle (9).png';
                    this.jumpStatus = true
                   
                }, 900);
            }
        }
    }



    // atualiza propriedades x e y do objeto
    newPos() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    // desenha o jogador/player
    update() {
        myGameArea.context.drawImage(this.playerImg, this.x, this.y, this.width, this.height);
    }

    left() {
        return this.x;
    }

    right() {
        return this.x + this.width;
    }

    top() {
        return this.y;
    }

    bottom() {
        return this.y + this.height;
    }

    isCrashedWith(obstacle) {
        return !(
            this.bottom() < obstacle.top() ||
            this.top() > obstacle.bottom() ||
            this.right() < obstacle.left() ||
            this.left() > obstacle.right()
        );
    }


}


class Obstacle {
    constructor(x, y, width, height, obstacles) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.raposaImg = new Image()
        this.raposaImg.src = '/images/raposa.png';
    }

    move() {
        this.speedX = -3;
        this.x += this.speedX;
    }

    draw() {
        myGameArea.context.drawImage(this.raposaImg, this.x, this.y, this.width, this.height)

    }

    update() {

    }

    left() {
        return this.x;
    }

    right() {
        return this.x + this.width;
    }

    top() {
        return this.y;
    }

    bottom() {
        return this.y + this.height;
    }

}


let myObstacles = [];



function createObstacles() {
    myGameArea.frames += 1;


    let random = Math.floor(Math.random() * 3) + 1;
    if (myGameArea.frames % 80 === 0) {
        const enemy = new Obstacle(600, 319, 45, 37);
        myObstacles.push(enemy)
        console.log(myObstacles)
    }
}



function moveObstacles() {
    if (myObstacles.length > 0) {
        for (let i = 0; i < myObstacles.length; i++) {
            myObstacles[i].draw();
            myObstacles[i].move();
        }
    }
}

function checkGameOver() {
    const crashed = myObstacles.some(obstacle => player.isCrashedWith(obstacle));

    if (crashed) {
        myGameArea.stop();
        setTimeout(function() {
            location.reload();
          }, 4000)
        
        
    }

}


// cria o jogador / player
const player = new Component(50, 40, 0, 305);



// Botao de Start
const startButton = document.getElementById("start-button");

//console.log(startButton);

startButton.addEventListener("click", () => {
    myGameArea.start();
});

// Controle de movimento
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp": // Arrow Up
            player.jump()
            break;
       
    }
});

document.addEventListener("keyup", (e) => {
    player.speedX = 0;
    player.speedY = 0;
});

// motor do jogo
function updateGameArea() {
    myGameArea.clear();
    player.newPos();
    player.update();
    createObstacles();
    moveObstacles()
    checkGameOver();
    myGameArea.score();
    
}