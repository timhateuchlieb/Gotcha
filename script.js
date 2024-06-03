//canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//html tag and body
const html = document.getElementById("html")
const body = document.getElementById("body")

//drawing a new frame
function draw(){
    ctx.beginPath()
    ctx.closePath()
}

//resize canvas to tab space
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);

resize();