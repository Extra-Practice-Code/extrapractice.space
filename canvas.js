let speed = 10;
let scale = 0.17; // Image scale (I work on 1080p monitor)
let canvas;
let ctx;

var good = 'assets/GTBT_emologo_good.png'
var bad = 'assets/GTBT_emologo_bad.png'

var times = [good, bad]

let face = {
    x: 200,
    y: 300,
    xspeed: 2,
    yspeed: 2,
    width:1000,
    height: 1000,
    img: new Image()
};

(function main(){
    pickFace();
    canvas = document.getElementById("splash-canvas");
    ctx = canvas.getContext("2d");

    //Draw the "screen"

    update();
})();



function resizeCanvas () {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight - 45
}

window.addEventListener('resize', resizeCanvas)

resizeCanvas()



function update() {
    setTimeout(() => {
        //Draw the canvas background
        ctx.fillStyle ='red';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //Draw face Logo and his background
        ctx.fillStyle = 'red';
        ctx.fillRect(face.x, face.y, face.width*scale, face.height*scale);
        ctx.drawImage(face.img, face.x, face.y, face.width*scale, face.height*scale);
        //Move the logo
        face.x+=face.xspeed;
        face.y+=face.yspeed;
        //Check for collision
        checkHitBox();
        update();
    }, speed)
}

//Check for border collision
function checkHitBox(){
    if(face.x+face.width*scale >= canvas.width || face.x <= 0){
        face.xspeed *= -1;
        pickFace();
    }

    if(face.y+face.height*scale >= canvas.height || face.y <= 0){
        face.yspeed *= -1;
        pickFace();
    }
}

function pickFace(){
  x = Math.floor(Math.random() * Math.floor(2))
  face.img.src = times[x]
}
