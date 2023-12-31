const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const FPS = 60
const TPS = 100000

var leftText = new TextBlock(10, 20, 20, "white")
var rightText = new TextBlock(200, 20, 20, "white")
var planets = [new Planet(new Vector(canvas.width/2, canvas.height/2), new Vector(0, 0), 100, new PhysicsMaterial(100000), "yellow")]

var fps = 0
var tps = 0
var mouseDown = false
var rMouseDown = false
var grabIndex = -1
var mouseX = 0
var mouseY = 0
var movementX = 0
var movementY = 0
var bSize = 10
var previewSteps = 10000
var isPaused = false
var displayVectors = false

var camPos = new Vector(0, 0)
var camZoom = 1

var G = 0.00000001

setInterval(tick, 1000 / TPS)
setInterval(update, 1000 / FPS)

tTime = 0
function tick(){
    deltaTime = performance.now() - tTime
    tTime = performance.now()
    tps = (tps * 9 + 1000 / deltaTime) / 10

    if(rMouseDown && grabIndex != -1){
        planets[grabIndex].vel.x = (planets[grabIndex].pos.x - mouseX) / 10
        planets[grabIndex].vel.y = (planets[grabIndex].pos.y - mouseY) / 10
    }

    if(isPaused){
        return
    }
    for(let i = 0; i < planets.length; i++){
        planets[i].step(planets)
    }
    // console.log(rMouseDown, grabIndex)
}

function update(){
    requestAnimationFrame(render)
}
frame = 0
rTime = 0
function render(){
    frame++
    deltaTime = performance.now() - rTime
    rTime = performance.now()
    fps = (fps * 9 + 1000 / deltaTime) / 10
    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "black"
    // ctx.fillRect(0, 0, canvas.width, canvas.height)
    // fill the screen with a black rectangle accounting for camera position and zoom
    ctx.fillRect(-camPos.x / camZoom - 100, -camPos.y / camZoom - 100, canvas.width / camZoom + 1000, canvas.height / camZoom + 1000)

    // console.log(camPos, camZoom)
    // ctx.setTransform(camZoom, 0, 0, camZoom, camPos, camPos)
    // console.log(ctx.getTransform())
    ctx.setTransform(camZoom, 0, 0, camZoom, camPos.x, camPos.y)

    if (isPaused) {
    // create a true copy of the planets array
        const preview = planets.map(p => p.copy());
        // console.log(preview[0].vel);
        let i = previewSteps;
        while (i--) {
            let j = preview.length;
            while (j--) {
            preview[j].step(preview);
            //   console.log(preview[j].pos);
            }
        }
        preview.forEach(p => p.trail.draw(ctx));
    }
    
    
    for(let i = 0; i < planets.length; i++){
        planets[i].trail.draw(ctx)
    }

    for(let i = 0; i < planets.length; i++){
        // console.log(planets[i])
        planets[i].draw(ctx)
        if(displayVectors || isPaused){
            planets[i].drawVel(ctx)
        }
    }

    
    rightText.x = (canvas.width - 100) / camZoom
    rightText.setText(0, "FPS: " + Math.round(fps.toFixed(2)))
    rightText.setText(1, "TPS: " + Math.round(tps.toFixed(2)))

    leftText.setText(0, "Planets: " + planets.length)
    leftText.setText(1, "G: " + G)
    leftText.setText(2, "paused: " + isPaused)
    leftText.setText(3, "show vectors: " + displayVectors)
    leftText.setText(4, "bSize: " + bSize)
    leftText.setText(5, "preview steps: " + previewSteps)

    rightText.draw(ctx)
    leftText.draw(ctx)
}

document.addEventListener("mousedown", onMouseDown)
document.addEventListener("mouseup", onMouseUp)
document.addEventListener("mousemove", onMove)
document.addEventListener("wheel", onMouseWheel, {passive: false})
document.addEventListener("keydown", onKeyDown)
document.addEventListener("contextmenu", function(e){e.preventDefault()})
document.addEventListener("click", onClick)

function onMouseDown(e){
    // console.log(e)
    if(e.button == 0){
        mouseDown = true
    }
    if(e.button == 2){
        rMouseDown = true
        for(let i = 0; i < planets.length; i++){
            if(planets[i].mouseAction(i, planetMouseDown, e, true)){
                return
            }else{
                grabIndex = -1
            }
        }
    }
    if(e.button == 1){
        e.preventDefault()
    }
}

function planetMouseDown(e, index){
    // console.log("planetMouseDown", e, index)
    grabIndex = index
}

function onMouseUp(e){
    // console.log(e)
    if(e.button == 0){
        mouseDown = false
    }
    if(e.button == 2){
        rMouseDown = false
    }
}

function onClick(e){
    // console.log("click", e.clientX, e.clientY)
    // console.log(planets)
    // console.log(e)
    planets.push(new Planet(new Vector(mouseX, mouseY), new Vector(0, 0), bSize, new PhysicsMaterial(bSize)))
}

function onMove(e){
    // console.log(e)
    mouseX = e.clientX
    mouseY = e.clientY
    movementX = e.movementX
    movementY = e.movementY
    //adjust mouse pos for camera
    mouseX = (mouseX - camPos.x) / camZoom
    mouseY = (mouseY - camPos.y) / camZoom
    //adjust movement for camera
    // movementX /= camZoom
    // movementY /= camZoom
    if(e.buttons == 4){
        camPos.x += movementX
        camPos.y += movementY
        // console.log("pan", camPos)
    }
}

function onMouseWheel(e){
    if(e.ctrlKey){
        e.preventDefault()
        //zoom into the middle of the screen
        camZoom -= e.deltaY / 1000
        camPos.x += e.clientX * e.deltaY / 1000
        camPos.y += e.clientY * e.deltaY / 1000
        console
        return
    }
    console.log("wheel", e.deltaY)
    if(
        leftText.mouseAction(1, textBlockMWheel, e, true) ||
        leftText.mouseAction(5, textBlockMWheel, e, true)
    )
        return
    bSize -= e.deltaY / 10
}

function onKeyDown(e){
    // console.log(e)
    switch(e.key){
        case " ":
            // console.log("space")
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
        case 5:
            previewSteps -= e.deltaY * modifier / 10
            break
    }
}

function clearTrails(){
    for(let i = 0; i < planets.length; i++){
        planets[i].trail.clear()
    }
}

// document.addEventListener(
//     "wheel",
//     function (e) {
//       if (e.ctrlKey) {
//         e.preventDefault();
//       }
//     },{passive: false});
