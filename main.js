const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const FPS = 60
const TPS = 120

var leftText = new TextBlock(10, 20, 20)
var rightText = new TextBlock(200, 20, 20, "white")

var fps = 0
var tps = 0

setInterval(tick, 1000 / TPS)
setInterval(render, 1000 / FPS)

tTime = 0
function tick(){
    deltaTime = performance.now() - tTime
    tTime = performance.now()
    tps = (tps * 9 + 1000 / deltaTime) / 10

}
rTime = 0
function render(){
    deltaTime = performance.now() - rTime
    rTime = performance.now()
    fps = (fps * 9 + 1000 / deltaTime) / 10
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "black"
    

    rightText.x = canvas.width - 100
    rightText.setText(0, "FPS: " + Math.round(fps.toFixed(2)))
    rightText.setText(1, "TPS: " + Math.round(tps.toFixed(2)))

    rightText.draw(ctx)
    leftText.draw(ctx)
}
