class Piece{
	constructor(x, y, isWhite, board){
		this.x = x; 
		this.y = y;
		this.white = isWhite;
		this.board = board;
		this.sprite = new Image();
	}
}

Piece.prototype.show = function(context, tileSize){
	context.drawImage(this.sprite, this.x * tileSize, this.y * tileSize, tileSize, tileSize);
}

Piece.prototype.showDrag = function(context, tileSize, x, y){
	context.drawImage(this.sprite, x - tileSize/2, y - tileSize/2, tileSize, tileSize);
}

Piece.prototype.showMovableSquare = function(ctx, x, y, tileSize){
	ctx.fillStyle = "rgba(21, 172, 169, .5)";
	ctx.beginPath();
	ctx.arc(x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize/3, 0, Math.PI * 2, false);
	ctx.fill();
}

Piece.prototype.showAtackedSqueres = function(ctx, x, y, tileSize){
	ctx.fillStyle = "rgba(233, 5, 5, .5)";
	ctx.beginPath();
	ctx.arc(x * tileSize + tileSize/2, y * tileSize + tileSize/2, 3 * tileSize/8, 0, Math.PI * 2, false);
	ctx.fill();
}