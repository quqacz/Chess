class Knight extends Piece{
	constructor(x, y, isWhite, board){
		super(x, y, isWhite, board);
		this.sprite.src = this.white ? 'sprites/w_knight.png' : 'sprites/b_knight.png';
	}

	showMovement(ctx, size, board){
		for(let i = 0; i < Knight.moves.length; i++){
			let nextX = this.x + Knight.moves[i][0];
			let nextY = this.y + Knight.moves[i][1];
			if(nextX >= 0  && nextX < board.length && nextY >= 0  && nextY < board.length ){
				if(board[nextX][nextY] && board[nextX][nextY].white !== this.white  && this.board.isKingSafe(this, nextX, nextY)){
					this.showAtackedSqueres(ctx, nextX, nextY, size);
					board[nextX][nextY].show(ctx, size);
				}else if(!board[nextX][nextY] && this.board.isKingSafe(this, nextX, nextY)){
					this.showMovableSquare(ctx, nextX, nextY, size);
				}
			}
		}
	}

	checkMove(x, y, board){
		for(let i = 0; i < board.length; i++){
			let nextX = this.x + Knight.moves[i][0];
			let nextY = this.y + Knight.moves[i][1];
			if(nextX === x && nextY === y){
				if(board[nextX][nextY] && board[nextX][nextY].white !== this.white)
					return true;
				else if(!board[nextX][nextY])
					return true;
			}
		}
		return false;
	}

	getAtackedPositions(board){
		let arr = [];
		for(let i = 0; i < board.length; i++){
			let nextX = this.x + Knight.moves[i][0];
			let nextY = this.y + Knight.moves[i][1];
			if(nextX >=0 && nextX < board.length && nextY >= 0 && nextY < board.length){
				arr.push([[nextX, nextY]]);
			}
		}
		return arr;
	}
}

Knight.moves = [
[-2, -1], [-1, -2], [1, -2], [2,-1], [2, 1], [1, 2], [-1, 2], [-2, 1]
];