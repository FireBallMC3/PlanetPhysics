const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const FPS = 60
const TPS = 10000

var leftText = new TextBlock(10, 20, 20, "white")
var rightText = new TextBlock(200, 20, 20, "white")
var planets = [new Planet(new Vector(canvas.width/2, canvas.height/2), new Vector(0, 0), 50, new PhysicsMaterial(1000), "yellow")]

var fps = 0
var tps = 0
var mouseDown = false
var mouseX = 0
var mouseY = 0
var bSize = 10
var isPaused = false
var displayVectors = false

var G = 0.00001

setInterval(tick, 1000 / TPS)
setInterval(render, 1000 / FPS)

tTime = 0
function tick(){
    deltaTime = performance.now() - tTime
    tTime = performance.now()
    tps = (tps * 9 + 1000 / deltaTime) / 10
    if(isPaused){
        return
    }
    for(let i = 0; i < planets.length; i++){
        planets[i].step(planets)
    }
}
rTime = 0
function render(){
    deltaTime = performance.now() - rTime
    rTime = performance.now()
    fps = (fps * 9 + 1000 / deltaTime) / 10
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    

    rightText.x = canvas.width - 100
    rightText.setText(0, "FPS: " + Math.round(fps.toFixed(2)))
    rightText.setText(1, "TPS: " + Math.round(tps.toFixed(2)))

    leftText.setText(0, "Planets: " + planets.length)
    leftText.setText(1, "G: " + G)
    leftText.setText(2, "paused: " + isPaused)
    leftText.setText(3, "show vectors: " + displayVectors)
    leftText.setText(4, "bSize: " + bSize)

    rightText.draw(ctx)
    leftText.draw(ctx)

    for(let i = 0; i < planets.length; i++){
        // console.log(planets[i])
        planets[i].draw(ctx)
        if(displayVectors){
            planets[i].drawVel(ctx)
        }
    }
}

document.addEventListener("mousedown", onMouseDown)
document.addEventListener("mouseup", onMouseUp)
document.addEventListener("mousemove", onMove)
document.addEventListener("mousewheel", onMouseWheel)
document.addEventListener("keydown", onKeyDown)
document.addEventListener("contextmenu", function(e){e.preventDefault()})

function onMouseDown(e){
    // console.log(e)
    if(e.button == 0){
        mouseDown = true
    }
}

function onMouseUp(e){
    // console.log(e)
    if(e.button == 0 && mouseDown){
        onclick(e)
    }
    if(e.button == 0){
        mouseDown = false
    }
}

function onclick(e){
    // console.log("click", e.clientX, e.clientY)
    // console.log(planets)
    planets.push(new Planet(new Vector(e.clientX, e.clientY), new Vector(5, 0), bSize, new PhysicsMaterial(1)))
}

function onMove(e){
    mouseX = e.clientX
    mouseY = e.clientY
}

function onMouseWheel(e){
    // console.log("wheel", e.deltaY)
    istrue = false
    istrue = leftText.mouseAction(1, textBlockMWheel, e, true)
    if(!istrue){
        bSize -= e.deltaY / 10
    }
}

function onKeyDown(e){
    console.log(e)
    switch(e.key){
        case " ":
            console.log("space")
            isPaused = !isPaused
            break
        case "h":
            displayVectors = !displayVectors
            break
    }
}

function textBlockMWheel(e, index){
    var modifier = 1;
    if (e.shiftKey) {
        modifier = 0.1;
    }
    if (e.altKey) {
        modifier = 0.01;
    }
    switch(index){
        case 1:
            // console.log("G", e.deltaY)
            G -= e.deltaY * modifier / 100
            break
    }
}
