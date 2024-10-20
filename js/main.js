class Point { // (x, y)
    x = 0
    y = 0

    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class Cell {
    type = "empty" // empty, wall, money, force, slow
    element = document.createElement("div")

    constructor(x, y) { // x, y
        this.position = new Point(x, y) // (x,y) // new Point(x, y)
        this.element.classList.add("cell")
        this.element.classList.add(this.type)
    }

    canMove() {
        return true
    }
}

class Wall extends Cell {
    type = "wall"
    health = 3
    constructor(x, y) {
        super(x, y)
        this.element.classList.add(this.type)
    }

    canMove() {
        return false
    }
}

class MegaWall extends Cell {
    type = "megawall"
    constructor(x, y) {
        super(x, y)
        this.element.classList.add(this.type)
    }

    canMove() {
        return false
    }
}

class AngryWall extends Cell {
    type = "angrywall"
    damage = 1
    constructor(x, y) {
        super(x, y)
        this.element.classList.add(this.type)
    }

    canMove() {
        return false
    }
}

class Money extends Cell {
    type = "money"
    constructor(x, y) {
        super(x, y)
        this.element.classList.add(this.type)
    }
}
class Force extends Cell {
    type = "force"
    constructor(x, y) {
        super(x, y)
        this.element.classList.add(this.type)
    }
}
class Slow extends Cell {
    type = "slow"
    constructor(x, y) {
        super(x, y)
        this.element.classList.add(this.type)
    }
}

class Robot {
    position = new Point(5, 5) // [x, y] // new Point(5, 5)
    health = 3
    element = document.createElement("div")
    constructor(type) { // point // x, y
        this.element.classList.add("robot")
    }

    walk(direction, type) { // top, left, right, bottom

        switch (direction) {
            case "top":
                if (this.position.y > 0) {
                    this.position.y--
                }
                break;
            case "left":
                if (this.position.x > 0) {
                    this.position.x--
                }
                break;
            case "right":
                if (this.position.x < 9) {
                    this.position.x++
                }
                break;
            case "bottom":
                if (this.position.y < 9) {
                    this.position.y++
                }
                break;
        }
    }
}

class EnemyRobot extends Robot {
    damage = 3
    constructor(x, y) { // point // x, y
        super ()
        this.position = new Point(x, y)    
        this.element.classList.add("enemy")
        
    }
}


class Game {
    field = []
    robot = new Robot()
    enemies = []
    score = 0
    coinsCount = 0
    isSlow = false
    level = 1
    popup = new Popup()

    coinSound = new Audio('audio/coin.wav')
    coinDropSound = new Audio('audio/coinDrop.mp3')
    hitSound = new Audio('audio/hit.mp3')
    levelUpSound = new Audio('audio/victory.mp3')
    boostSound = new Audio('audio/boost.mp3')
    webSound = new Audio('audio/web.mp3')
    victorySound = new Audio('audio/victory.mp3')
    tavernSound = new Audio('audio/tavern.mp3')
    eneymDeathSound = new Audio('audio/enemy-death.wav')

    constructor(root) {
        this.root = root // document.getElementById("app")
        this.fieldElement = document.createElement("div")
        this.fieldElement.classList.add("field")
        this.fieldElement.classList.add("background-1")
        this.root.appendChild(this.fieldElement)
        this.listener()
        this.firstMove = true
    }

    createField() {
        // Генерация ячеек поля
        for (let y = 0; y < 10; y++) {
            const row = []
            for (let x = 0; x < 10; x++) {
                const random = Math.round(Math.random() * 9 + 1)
                let cell
                switch (true) {
                    case random % 10 > 0 && random % 10 <= 2:
                        cell = new Wall(x, y);
                        break;
                    case random % 10 > 2 && random % 10 < 4:
                        cell = new Money(x, y);
                        this.coinsCount++
                        break;

                    case random % 10 === 6:
                        cell = new Force(x, y);
                        break;
                    case random % 10 === 7:
                        cell = new Slow(x, y);
                        break;
                    case random % 10 === 8:
                        cell = new MegaWall(x, y);
                        break;
                    case random % 10 === 9:
                        cell = new AngryWall(x, y);
                        break;

                    // case random % 10 === 5:
                    //     cell = new EnemyRobot(x, y);
                    //     break;
                    default:
                        cell = new Cell(x, y)
                }

                row.push(cell)
            }
            this.field.push(row)

        }
    }

    renderField() {
        // Отрисовка поля
        for (const row of this.field) {
            const rowElement = document.createElement("div")
            rowElement.classList.add("row")
            for (const cell of row) {
                rowElement.appendChild(cell.element)
            }
            this.fieldElement.appendChild(rowElement)
        }
    }

    renderRobot() {
        const healthBar = document.createElement('p')
        healthBar.innerHTML = 'Здоровье: ' + this.robot.health
        healthBar.classList.add('health-bar')
        this.fieldElement.append(healthBar)
        this.field[this.robot.position.y][this.robot.position.x]
            .element
            .appendChild(this.robot.element)

    }
    

    changeDirection(robot, direction) {
        robot.classList.remove('robot-top', 'robot-left', 'robot-right', 'robot-bottom', 'robot-undefined')
        robot.classList.add(`robot-${direction}`)
    }
    hitAnimation(robot, direction) {
        robot.classList.add(`robot-${direction}-hit`)
        setTimeout(() => {
            robot.classList.remove(`robot-${direction}-hit`)
        }, 300);
    }

    startNewGame() {
        this.field = []
        this.createField()
        this.renderField()
        this.robot.position = new Point(5, 5)
        this.render()
        this.level++
        this.score = 0
        this.fieldElement.classList.add(`background-${this.level}`)
        this.popup.hide()
    }


    restartGame() {
        this.field = []
        this.createField()
        this.renderField()
        this.robot.position = new Point(5, 5)
        this.render()
        this.score = 0
        this.robot.health = 3
        this.popup.hide()
    }

    checkNextCell(field, robot, direction) {
        let nextCell
        switch (direction) {
            case "top":
                if (robot.position.y > 0) {
                    nextCell = field[robot.position.y - 1][robot.position.x]
                }
                break;
            case "bottom":
                if (robot.position.y < 9) {
                    nextCell = field[robot.position.y + 1][robot.position.x]
                }
                break;
            case "left":
                if (robot.position.x > 0) {
                    nextCell = field[robot.position.y][robot.position.x - 1]
                }
                break;
            case "right":
                if (robot.position.x < 9) {
                    nextCell = field[robot.position.y][robot.position.x + 1]
                }
                break;
        }
        return nextCell
    }

    startGame() {
        if (this.firstMove) {
            this.tavernSound.play()
            this.firstMove = false;
        }
    }

    listener() {
        document.body.addEventListener("keyup", (event) => {
            const popupBlock = document.getElementById('popup')
            if (!popupBlock.checkVisibility()) {
                const currentCell = this.field[this.robot.position.y][this.robot.position.x]
                if (currentCell.type === 'slow') {
                    this.isSlow = !this.isSlow
                }
                this.startGame();

                let direction
                switch (event.code) {
                    case "ArrowUp":
                    case "KeyW":
                        direction = "top";
                        break;
                    case "ArrowLeft":
                    case "KeyA":
                        direction = "left";
                        break;
                    case "ArrowDown":
                    case "KeyS":
                        direction = "bottom";
                        break;
                    case "ArrowRight":
                    case "KeyD":
                        direction = "right";
                        break;
                }        

                this.changeDirection(this.robot.element, direction)
                if (direction) { // direction !== undefined
                    let nextCell = this.checkNextCell(this.field, this.robot, direction)
                    

                    this.hitSound.pause()
                    if (nextCell !== undefined) {
                        if (!nextCell.canMove() &&  nextCell.health > 1) {
                            nextCell.health--
                            nextCell.element.classList.add('wall-' + nextCell.health)
                            this.hitSound.play()
                            this.hitAnimation(this.robot.element, direction)
                        } else if (!nextCell.canMove() && nextCell.type === 'angrywall') {
                            // nextCell.health--
                            this.robot.health--
                            if (this.robot.health === 0) {
                                this.popup.text = `Вы проиграли =(`
                                        // this.popup.action = () => startNewGame()
                                this.popup.action = () => this.restartGame() 
                                this.popup.button = 'Попробовать еще раз'
                                this.popup.show()
                            }
                            // nextCell.element.classList.add('wall-' + nextCell.health)
                            // this.hitSound.play()
                            // this.hitAnimation(this.robot.element, direction)
                        } else if (!nextCell.canMove() && nextCell.health == 1) {
                            this.field[nextCell.position.y][nextCell.position.x] = new Money()
                            this.coinsCount++
                            this.coinDropSound.play()

                        } else if (!this.isSlow && nextCell && nextCell.canMove()) { // type !== wall
                            this.robot.walk(direction)
                            const currentCell = this.field[this.robot.position.y][this.robot.position.x]
                            switch (currentCell.type) {
                                case "money":
                                    this.score++
                                    this.field[this.robot.position.y][this.robot.position.x] = new Cell()
                                    this.coinsCount--
                                    this.coinSound.play()
                                    // прошли игру
                                    if (this.coinsCount === 0) {
                                        this.popup.text = `Вы прошли уровень ${this.level} и набрали ${this.score}`
                                        this.popup.action = () => this.startNewGame() 
                                        this.popup.button = 'Следующий уровень'
                                        this.popup.show()
                                        const popupElement = this.popup.contentElement
                                    }
                                    break;
                                case "force":
                                    let nextCell = this.checkNextCell(this.field, this.robot, direction)
                                    if (nextCell) {
                                        if (nextCell.type !== 'wall' && nextCell.type !== 'megawall' && nextCell.type !== 'angrywall' && nextCell) {
                                            this.robot.walk(direction)
                                            this.boostSound.play()
                                            if (this.field[this.robot.position.y][this.robot.position.x].type == "money") {
                                                this.score++
                                                this.field[this.robot.position.y][this.robot.position.x] = new Cell()
                                                this.coinsCount--
                                            }
                                            if (this.field[this.robot.position.y][this.robot.position.x].type != 'wood') {
                                                for (let i = 0; i < 10; i++) {
                                                    if (this.field[this.robot.position.y][this.robot.position.x].type == "force") {
                                                        let nextCell = this.checkNextCell(this.field, this.robot, direction)
                                                        if (nextCell) {
                                                            if (nextCell.type !== 'wall' && nextCell.type !== 'megawall' && nextCell.type !== 'angrywall') {
                                                                this.robot.walk(direction)
                                                                if (this.field[this.robot.position.y][this.robot.position.x].type == "money") {
                                                                    this.score++
                                                                    this.field[this.robot.position.y][this.robot.position.x] = new Cell()
                                                                    this.coinsCount--
                                                                }
                                                                if (this.field[this.robot.position.y][this.robot.position.x].type == 'wood') {
                                                                }
                                                            }
                                                        }
                                                    }


                                                }
                                            }
                                        }
                                    }


                            }
                        }
                    }


                    // if (this.field[this.robot.position.y][this.robot.position.x] === this.field[this.enemies.position.y][this.enemies.position.x]) {
                    //     this.robot.health = 0
                    //     if (this.robot.health === 0) {
                    //         this.popup.text = `Вас убили!`
                    //                 // this.popup.action = () => startNewGame()
                    //         this.popup.action = () => this.restartGame() 
                    //         this.popup.button = 'Попробовать еще раз'
                    //         this.popup.show()
                    //     }
                    // }

                    this.render()
                    
                }
            }
        })
    }





    render() {
        this.fieldElement.innerText = ""
        this.renderField()
        this.renderRobot()
        this.renderEnemiesRobot()
    }

    enemiesStep() {
        let directions = ['top', 'left', 'bottom', 'right']
            for (const enemy of this.enemies) {
                let randomDirection = directions[Math.floor(Math.random() * 4)]
                const index = this.enemies.indexOf(enemy)
                let nextEnemyCell = this.checkNextCell(this.field, enemy, randomDirection)
                // управляем врагом
                if (nextEnemyCell !== undefined) {
                    if (!nextEnemyCell.canMove() &&  nextEnemyCell.health > 1) {
                        nextEnemyCell.health--
                        nextEnemyCell.element.classList.add('wall-' + nextEnemyCell.health)
                    } else if (!nextEnemyCell.canMove() && nextEnemyCell.type === 'angrywall') {
                        enemy.health--
                        if (enemy.health === 0) {
                            this.enemies.splice(index, 1)
                            this.eneymDeathSound.play()
                            enemy.element.remove()
                        }
                    } else if (!nextEnemyCell.canMove() && nextEnemyCell.health == 1) {
                        this.field[nextEnemyCell.position.y][nextEnemyCell.position.x] = new Money()
                        this.coinsCount++
                        this.coinDropSound.play()
    
                    } else if ( nextEnemyCell && nextEnemyCell.canMove()) { // type !== wall
                        enemy.walk(randomDirection)
                    }
                    if (this.field[this.robot.position.y][this.robot.position.x] === this.field[enemy.position.y][enemy.position.x]) {
                        this.robot.health = 0
                        if (this.robot.health === 0) {
                            this.popup.text = `Вас убили!`
                                    // this.popup.action = () => startNewGame()
                            this.popup.action = () => this.restartGame() 
                            this.popup.button = 'Попробовать еще раз'
                            this.popup.show()
                        }
                    }
                }
            }
            this.render()
    }

    createEnemies() {
        this.enemies.push(
            new EnemyRobot(1, 1),
            new EnemyRobot(4, 9),
            new EnemyRobot(6, 7),
        )
    }
    
    renderEnemiesRobot() {
        for(const enemy of this.enemies) {
            this.field[enemy.position.y][enemy.position.x]
                .element
                .appendChild(enemy.element)
        }
    }

    

}

class Popup {
    content = document.getElementById('popup-content')
    popup = document.getElementById('popup')
    buttonElement = document.getElementById('popup-button')


    // get contentElement() {
    //     this.content.innerText += 'some Text'
    //     return this.content
    // }
    set text(value) {
        this.content.innerHTML = value
    }
    set action(value) {
        this.buttonElement.onclick = value
    }
    set button(value) {
        this.buttonElement.innerText = value;
    }
    // constructor(text, score, level, newGame, action) {
    //     this.content.insertAdjacentHTML('afterbegin',
    //         `<h2>${text} уровень ${level}</h2>
    //         <p>Количество собранных монеток: ${score}
    //         <button id="next-level-button">Следующий уровень</button>
    //         `)
    //     this.show()
    // }
    constructor() {
        // this.content.innerHTML = text
        // this.button.oncancel = action
        this.hide()
    }

    hide() {
        this.popup.style.display = 'none'
    }
    show() {
        this.popup.style.display = 'flex'
    }
}

const game = new Game(document.getElementById("app"))
game.createField()
game.renderField()
game.renderRobot()
game.createEnemies()
game.renderEnemiesRobot()

const enemiesStart = setInterval(() => {
    game.enemiesStep()
    if (game.enemies == []) {
        alert(123)
        clearInterval(enemiesStart)
    }
}, 400);