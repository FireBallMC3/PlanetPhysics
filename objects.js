class Planet{
    constructor(x, y, radius, physMat, color = "blue", gravity = 100){
        this.x = x
        this.y = y
        this.radius = radius
        this.physMat = physMat
        this.color = color
        this.gravity = gravity
    }
    draw(){
        drawCircle(this.x, this.y, this.radius, this.color)
    }
    step(planets = null){
        if (planets == null)
            return
    }
}

class PhysicsMaterial{
    constructor(density){
        this.density = density
    }
}

class VectorDisplay{
    constructor(x, y, xDir, yDir, color = "red"){
        this.x = x
        this.y = y
        this.xDir = xDir
        this.yDir = yDir
        // this.width = width
        this.color = color
    }
    draw(){
        ctx.strokeStyle = this.color
        ctx.lineWidth = 1
        ctx.beginPath()
        canvas_arrow(ctx, this.x, this.y, this.x + this.xDir, this.y + this.yDir)
        ctx.stroke()
        ctx.closePath()
    }
}

class Text {
    constructor(x, y, text, color = black) {
        this.x = x
        this.y = y
        this.text = text
        this.color = color
    }
    draw(ctx) {
        ctx.fillStyle = this.color
        ctx.font = "20px arial"
        ctx.fillText(this.text, this.x, this.y)
    }
}

class TextBlock {
    text = []
    constructor(x, y, gap, color = "black") {
        this.x = x
        this.y = y
        this.gap = gap
        this.color = color
    }
    draw(ctx) {
        //draw every text element at the correct position
        for (let i = 0; i < this.text.length; i++) {
            this.text[i].draw(ctx)
        }
    }
    setText(index, str, color = this.color) {
        while (this.text.length < index+1){
            this.text.push(new Text(this.x, this.y + this.text.length * this.gap, "Hello World!", this.color))
        }
        this.text[index].text = str
    }
    mouseAction(index, func, event, passIndex = false){
        if(mouseY > this.y + this.gap * (index-1) && mouseY < this.y + this.gap * index){
            if (passIndex){
                func(event, index)
            }
            else{
                func(event)
            }
        }
    }
}

function canvas_arrow(context, fromx, fromy, tox, toy) {
    var headlen = 10 // length of head in pixels
    var dx = tox - fromx
    var dy = toy - fromy
    var angle = Math.atan2(dy, dx)
    context.moveTo(fromx, fromy)
    context.lineTo(tox, toy)
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6))
    context.moveTo(tox, toy)
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6))
  }

function drawCircle(x, y, radius, color = "red"){
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2*Math.PI)
    ctx.fillStyle = color
    ctx.fill()
    ctx.closePath()
}
