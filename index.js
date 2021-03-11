let canvas = document.querySelector("#canvas");

let dimensions = .4 * window.innerWidth;
canvas.width = dimensions;
canvas.height = dimensions;

const ctx = canvas.getContext("2d");
var mousePos={
	x:0, y:0
}

var clicked = null;

let markedSqueres = [];

var board = new Board(.4 * window.innerWidth, ctx);

animate();

window.addEventListener('resize', ()=>{
	canvas.width = .4 * window.innerWidth;
	canvas.height = .4 * window.innerWidth;
	board.setSize(.4 * window.innerWidth);
})

window.addEventListener('contextmenu', function (e) { 
	e.preventDefault(); 
  }, false);

canvas.addEventListener('click', () => {
	if(clicked){
		board.movePiece(clicked, mousePos.x, mousePos.y)
		clicked = null;
		markedSqueres.length = 0;
		return;
	}
	clicked = board.clickPiece(mousePos.x, mousePos.y);
	markedSqueres.length = 0;
}, false);

canvas.addEventListener("mouseup", (event)=>{
	if(event.button === 2){
		let tile = [Math.floor(mousePos.x / board.tileSize), Math.floor(mousePos.y / board.tileSize)]
		for(let i = 0; i < markedSqueres.length; i ++){
			if(markedSqueres[i][0] === tile[0] && markedSqueres[i][1] === tile[1]){
				markedSqueres.splice(i, 1);
				return;
			}
		}
		markedSqueres.push(tile);
	}
})

canvas.addEventListener('mousemove', function(evt) {
	let mouse = getMousePos(canvas, evt);
	mousePos.x = mouse.x;
	mousePos.y = mouse.y;	
}, false);

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function animate(){
    requestAnimationFrame(animate);
    board.showBoard(ctx);
	for(let i = 0; i < markedSqueres.length; i++)
		board.showHiglightedSqueres(markedSqueres[i][0], markedSqueres[i][1]);
    board.showPieces(ctx);
	if(clicked)
    	clicked.showMovement(ctx, board.tileSize, board.board);	
}