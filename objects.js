class Planet{
    constructor(pos, vel, radius, physMat, color = "blue"){
        this.pos = pos
        this.vel = vel
        this.radius = radius
        this.physMat = physMat
        this.color = color
        this.V = 4/3 * Math.PI * Math.pow(this.radius, 3)
        this.M = this.V * this.physMat.density
        this.trail = new Trail()
    }
    draw(ctx){
        // console.log("draw")
        // console.log(this)
        
        // this.trail.draw(ctx)
        drawCircle(ctx, this.pos.x, this.pos.y, this.radius, this.color)
    }
    step(planets = null){
        if (planets == null)
            return
        for (let i = 0; i < planets.length; i++){
            if(planets[i] != this){
                    // console.log(this)
                    this.r = this.pos.distance(planets[i].pos)
                    this.F = G *(this.M * planets[i].M) / Math.pow(this.r, 2)
                    this.dir = this.pos.sub(planets[i].pos).normalize()
                    this.vel = this.vel.add(this.dir.mult(this.F / this.M))
                    // console.log(this.F)
            }
        }
        this.pos = this.pos.sub(this.vel)
        this.trail.addPoint(this.pos.x, this.pos.y)
    }
    drawVel(ctx){
        this.display = new VectorDisplay(this.pos.x, this.pos.y, this.vel.x * -20, this.vel.y * -20)
        this.display.draw(ctx)
    }
    mouseAction(index, func, event, passIndex = false){
        // console.log("mouseAction", index, func, event, passIndex)
        //check if mouse pos is inside the planet
        if(mouseX > this.pos.x - this.radius && mouseX < this.pos.x + this.radius && mouseY > this.pos.y - this.radius && mouseY < this.pos.y + this.radius){
            if (passIndex){
                // console.log("passing index")
                func(event, index)
            }
            else{
                func(event)
            }
            return true
        }
        return false
    }
    copy(){
        return new Planet(this.pos, this.vel, this.radius, this.physMat, this.color)
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

class Trail{
    constructor(color = "white"){
        this.color = color
        this.trail = []
    }
    draw(ctx){
        if(this.trail.length < 2)
            return
        ctx.beginPath()
        ctx.strokeStyle = this.color
        ctx.lineWidth = 1
        ctx.moveTo(this.trail[0].x, this.trail[0].y)
        for (let i = 0; i < this.trail.length; i++){
            ctx.lineTo(this.trail[i].x, this.trail[i].y)
        }
        ctx.stroke()
        ctx.closePath()
    }
    addPoint(x, y){
        this.trail.push(new Vector(x, y))
    }
    clear(){
        this.trail = []
    }
}

class Text {
    constructor(x, y, text, color = black, size = 20, font = "arial") {
        this.x = x
        this.y = y
        this.text = text
        this.color = color
        this.size = size
        this.font = font
    }
    draw(ctx) {
        ctx.fillStyle = this.color
        ctx.font = `${this.size / camZoom}px ${this.font}`
        ctx.fillText(this.text, this.x - camPos.x / camZoom, this.y - camPos.y / camZoom)
    }
}

class Vector{
    constructor(x, y){
        this.x = x
        this.y = y
    }
    add(v){
        return new Vector(this.x + v.x, this.y + v.y)
    }
    sub(v){
        return new Vector(this.x - v.x, this.y - v.y)
    }
    mult(s){
        return new Vector(this.x * s, this.y * s)
    }
    div(s){
        return new Vector(this.x / s, this.y / s)
    }
    mag(){
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    distance(v){
        return this.sub(v).mag()
    }
    normalize(){
        return this.div(this.mag())
    }
    /**
     * @returns (0, 0)
     */
    static zero(){
        return new Vector(0, 0)
    }
    /**
     * @returns (0, -1)
     */
    static up(){
        return new Vector(0, -1)
    }
    /**
     * @returns (0, 1)
     */
    static down(){
        return new Vector(0, 1)
    }
    /**
     * @returns (-1, 0)
     */
    static left(){
        return new Vector(-1, 0)
    }
    /**
     * @returns (1, 0)
     */
    static right(){
        return new Vector(1, 0)
    }
    /**
     * @returns (-1, -1)
     */
    static upLeft(){
        return new Vector(-1, -1)
    }
    /**
     * @returns (1, -1)
     */
    static upRight(){
        return new Vector(1, -1)
    }
    /**
     * @returns (-1, 1)
     */
    static downLeft(){
        return new Vector(-1, 1)
    }
    /**
     * @returns (1, 1)
     */
    static downRight(){
        return new Vector(1, 1)
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
            this.text[i].x = this.x
            this.text[i].y = this.y + i * this.gap / camZoom
            this.text[i].color = this.color
            this.text[i].draw(ctx)
        }
    }
    setText(index, str, color = this.color) {
        while (this.text.length < index+1){
            this.text.push(new Text(this.x, this.y + this.text.length * this.gap / camZoom, "Hello World!", this.color))
        }
        this.text[index].text = str
    }
    mouseAction(index, func, event, passIndex = false){
        // console.log("mouseAction", index, func, event, passIndex)
        if(mouseY > this.y + this.gap / camZoom * (index-1) && mouseY < this.y + this.gap * index){
            if (passIndex){
                // console.log("passing index")
                func(event, index)
            }
            else{
                func(event)
            }
            return true
        }
        return false
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

function drawCircle(ctx, x, y, radius, color = "red"){
    // console.log(x, y, radius, color)
    radius = Math.abs(radius)
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2*Math.PI)
    ctx.fillStyle = color
    ctx.fill()
    ctx.closePath()
}
