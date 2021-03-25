class King extends Piece{
	constructor(x, y, isWhite, board){
		super(x, y, isWhite, board);
		this.sprite.src = this.white ? 'sprites/w_king.png' : 'sprites/b_king.png';
		this.moved = false;
	}

	showMovement(ctx, size, board){
		let heatMap = this.white ? board.blackAtackMap : board.whiteAtackMap;

		for(let i = 0; i < King.moves.length; i++){
			let nextX = this.x + King.moves[i][0];
			let nextY = this.y + King.moves[i][1];
			//sprawdzenei czy rozpartywany kafelek jest na planszy
			if(nextX >= 0  && nextX < board.length && nextY >= 0  && nextY < board.length ){
				//zaznaczenie pola ktore król atakuje
				if(board[nextX][nextY] && board[nextX][nextY].white !== this.white && !heatMap[nextX][nextY]){
					this.showAtackedSqueres(ctx, nextX, nextY, size);
					board[nextX][nextY].show(ctx, size);
				}else if(!board[nextX][nextY] && !heatMap[nextX][nextY]){
					//zaznaczenie pola osiagalnego
					this.showMovableSquare(ctx, nextX, nextY, size);
				}
			}
		}
		if(this.moved) return;

		// pokazanie ruchu przy mozliwej roszadzie
		if(!board[2][this.y] && !board[1][this.y] && !board[3][this.y] && board[0][this.y] && board[0][this.y] instanceof Rook && !board[0][this.y].moved) 
			this.showMovableSquare(ctx, this.x - 2, this.y, size);
		if(!board[5][this.y] && !board[6][this.y]  && board[7][this.y] && board[0][this.y] instanceof Rook && !board[7][this.y].moved) 
			this.showMovableSquare(ctx, this.x + 2, this.y, size);
	}

	checkMove(x, y, board){
		let heatMap = this.white ? board.blackAtackMap : board.whiteAtackMap;
		for(let i = 0; i < board.length; i++){
			let nextX = this.x + King.moves[i][0];
			let nextY = this.y + King.moves[i][1];
			if(nextX === x && nextY === y){
				// jezeli ruch jest dozwolony zmienia flage moved n true i zwraca true
				if(board[nextX][nextY] && board[nextX][nextY].white !== this.white && !heatMap[nextX][nextY]){
					this.moved = true;
					return true;
				}
				else if(!board[nextX][nextY] && !heatMap[nextX][nextY]){
					this.moved = true;
					return true;
				}
			}
		}

		if(this.moved) return false;

		if(!board[2][this.y] && !board[1][this.y] && !board[3][this.y] && board[0][this.y] && board[0][this.y] instanceof Rook && !board[0][this.y].moved && x === 2 && y === this.y){
			board[0][this.y].castle(3, board);
			return true;
		}
		if(!board[5][this.y] && !board[6][this.y]  && board[7][this.y] && board[0][this.y] instanceof Rook && !board[7][this.y].moved && x === 6 && y === this.y){ 
			board[7][this.y].castle(5, board);
			return true;
		}
		return false;
	}

	getAtackedPositions(board){
		let arr = []
		for(let i = 0; i < King.moves.length; i++){
			let nextX = this.x + King.moves[i][0];
			let nextY = this.y + King.moves[i][1];
			if(nextX >=0 && nextX < board.length && nextY >= 0 && nextY < board.length){
				arr.push([[nextX, nextY]]);
			}
		}
		return arr;
	}
}

King.moves = [
[-1, -1], [0, -1], [1, -1],
[-1, 0], [1, 0],
[-1, 1], [0, 1], [1, 1]
];