class Pawn extends Piece{

	constructor(x, y, isWhite, dirUp, board){
		super(x, y, isWhite, board);
		this.sprite.src = this.white ? 'sprites/w_pawn.png' : 'sprites/b_pawn.png';
		this.moved = false;
		this.direction = dirUp;
	}

	showMovement(ctx, size, board){
		let nextY = (this.y + (this.direction ? Pawn.moves[0][1] : -Pawn.moves[0][1]));
		let nextNextY = (this.y + (this.direction ? Pawn.moves[1][1] : -Pawn.moves[1][1]));
		// sprawdzenie czy pierwszy kafelek przed pionem jest wolny
		if(!board[this.x][nextY] && this.board.isKingSafe(this, this.x, nextY)){
			this.showMovableSquare(ctx, this.x, nextY, size);
			//sprawdzenie czy drugi kafelek jest wolny jesli pion nie zostal jeszcze poruszony
			if(!this.moved && !board[this.x][nextNextY] && this.board.isKingSafe(this, this.x, nextNextY)){
				this.showMovableSquare(ctx, this.x, nextNextY, size);
			}
		}

		// podświetlenie atakowanych kafelków
		if(this.x - 1 >= 0){
			if(board[this.x-1][nextY] && board[this.x-1][nextY].white == !this.white && this.board.isKingSafe(this, this.x - 1, nextY)){
				this.showAtackedSqueres(ctx, this.x - 1, nextY, size);
				board[this.x-1][nextY].show(ctx, size);
			}
		}
		if(this.x + 1 < board.length){
			if(board[this.x+1][nextY] && board[this.x+1][nextY].white == !this.white && this.board.isKingSafe(this, this.x + 1, nextY)){
				this.showAtackedSqueres(ctx, this.x + 1, nextY, size);
				board[this.x + 1][nextY].show(ctx, size);
			}
		}

	}

	checkMove(x, y, board){
		let next= (this.y + (this.direction ? Pawn.moves[0][1] : -Pawn.moves[0][1]));
		let it = this.moved ? 1 : 2;
		for(let i = 0; i < it; i ++){
			if(this.x ===x && this.y + (this.direction ? Pawn.moves[i][1] : -Pawn.moves[i][1]) === y && !board[this.x][this.y + (this.direction ? Pawn.moves[i][1] : -Pawn.moves[i][1])] ) {
				return true; 
			}
		}
		if((x === this.x - 1 || x === this.x + 1) && y === next && board[x][next] && board[x][next].white !== this.white)
			return true;
		return false;
	}

	checkQuining(board){
		let qRank = this.direction ? 0 : 7;
		if(this.y === qRank)
			board[this.x][this.y] = new Queen(this.x, this.y, this.white);

	}

	getAtackedPositions(board){
		let next= (this.y + (this.direction ? Pawn.moves[0][1] : -Pawn.moves[0][1]));
		let moves = [];
		if(this.x - 1 >= 0) 
			moves.push([[this.x - 1, next]]);
		if(this.x + 1 < board.length) 
			moves.push([[this.x + 1, next]]);

		return moves;
	}

	getMovement(board){
		let next = (this.y + (this.direction ? Pawn.moves[0][1] : -Pawn.moves[0][1]));
		let moves = [];
		
		if( !board[this.x][next] ) 
			moves.push([[this.x, next]])
		if(this.moved || board[this.x][next])
			return moves;
		
		next = (this.y + (this.direction ? Pawn.moves[1][1] : -Pawn.moves[1][1]));
		if( !board[this.x][next] ) 
			moves.push([[this.x, next]])

		return moves;
	}
}

Pawn.moves = [[0, -1], [0, -2]];