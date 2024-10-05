class Cell {
    type = "empty" // empty, wall, money, force, slow
    element = document.createElement("div")
    constructor(x, y) {
        this.position = [x,y ] // (x, y)
        // this.type = ""
        // this.element = document.createElement("div")
        this.element.classList.add("cell")
        this.element.classList.add(this.type)
        
    }
    walk() {

    }
}


class Wall extends Cell {
    type = "wall"
    constructor() {
        super()
        this.element.classList.add(this.type)
    }
}

class Money extends Cell {
    type = "money"
    constructor() {
        super()
        this.element.classList.add(this.type)
    }
}

class Force extends Cell {
    type = "force"
    constructor() {
        super()
        this.element.classList.add(this.type)
    }
}
class Slow extends Cell {
    type = "slow"
    constructor() {
        super()
        this.element.classList.add(this.type)
    }
}

class Robot {
    position = [5, 5]
    element = document.createElement("div")
    constructor() {
        this.element.classList.add("robot")
    }

    // Проверка что робот не упирается в стену
    
    walk(direction) { // top, left, right, bottom
        switch(direction) {
            case "top":
                if (this.position[1] > 0) {
                    this.position = [
                        this.position[0],
                        this.position[1] - 1
                    ]
                }
                break;
            case "left":
                if (this.position[0] > 0) {
                    this.position = [
                        this.position[0] - 1,
                        this.position[1]
                    ]
                }
                break;
            case "right":
                if (this.position[0] < 9) {
                    this.position = [
                        this.position[0] + 1,
                        this.position[1]
                    ]
                }
                break;
            case "bottom":
                if (this.position[1] < 9) {
                    this.position = [
                        this.position[0],
                        this.position[1] + 1
                    ]
                }
                break;
        }

    }
}

class Game {
    field = []
    robot = new Robot()
    score = 0
    constructor(root) {
        this.root = root // document.getElementById("app")
        this.fieldElement = document.createElement("div")
        this.fieldElement.classList.add("field")
        this.root.appendChild(this.fieldElement)
        this.listener()
    }

    createField() {
        // Генерация ячеек поля
        for (let i = 0; i < 10; i++) {
            const row = []
            for (let j = 0; j < 10; j++) {
                // const cell = new Cell(i, j)

                const random = Math.round(Math.random() * 9 + 1)
                let cell 
                switch(true) {
                    case random % 10 > 0 && random % 10 < 2:
                        cell = new Wall(i, j); break;
                    case random % 10 > 2 && random % 10 < 5 :
                        cell = new Money(i, j); break;
                    case random % 10 === 6:
                        cell = new Force(i, j); break;
                    case random % 10 === 7:
                        cell = new Slow(i, j); break;
                    default:
                        cell = new Cell(i, j)
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
            for(const cell of row) {
                rowElement.appendChild(cell.element)
            }
            this.fieldElement.appendChild(rowElement)
        }
    }
    renderRobot() {
        this.field[this.robot.position[1]][this.robot.position[0]].element.appendChild(this.robot.element)
    }
    listener() {
        document.body.addEventListener("keydown", (e) => {
            fireSound.play()
            switch(e.code) {
                case "KeyA":
                case "ArrowLeft":
                    this.robot.walk("left")
                    break;
                case "KeyD":
                case "ArrowRight":
                    this.robot.walk("right")
                    break;
                case "KeyW":
                case "ArrowUp":
                    this.robot.walk("top")
                    break;
                case "KeyS":
                case "ArrowDown":
                    this.robot.walk("bottom")
                    break;
            }
            this.render()
        })
    }
    render() {
        this.fieldElement.innerHTML = ""
        this.renderField()
        this.renderRobot()
    }
}


const game = new Game(document.getElementById("app"))
game.createField()
game.renderField()
game.renderRobot()

const fireSound = document.getElementById("fire_sound")