class Board{
	constructor(width, context){
		this.tiles = 8;
		this.tileSize = width/this.tiles;
		this.pieceMapWhite = [
			[6,5,4,3,2,4,5,6],
			[1,1,1,1,1,1,1,1],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[11,11,11,11,11,11,11,11],
			[16,15,14,13,12,14,15,16]
		];
		this.pieceMapBlack = [
			[16,15,14,13,12,14,15,16],
			[11,11,11,11,11,11,11,11],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1],
			[6,5,4,3,2,4,5,6]
		]
		this.ctx = context;
		this.board = this.fillPieces();
		this.blackKing = this.board[0][0].white ? this.board[4][7] : this.board[4][0];
		this.whiteKing = this.board[0][0].white ? this.board[4][0] : this.board[4][7]; 
		this.board.whiteAtackMap = this.generateAtackMap(true);
		this.board.blackAtackMap = this.generateAtackMap(false);
		this.lastMove = {
			prevX: -1,
			prevY: -1,
			nextX: -1,
			nextY: -1
		};
	}

	show(){
		this.showBoard();
		this.showPieces();
	}

	showBoard(){
		let color = ['#fafae7','#364135'];
		let white = true;
		
		for(let x = 0; x < this.tiles; x++){
			for(let y = 0; y < this.tiles; y++){
				if(white){
					this.ctx.fillStyle = color[0];
				}else{
					this.ctx.fillStyle = color[1];
				}
				white = !white;
				this.ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
			}
			white = !white;
		}
	}

	showPieces(){
		for(let x = 0; x < this.tiles; x++){
			for(let y = 0; y < this.tiles; y++){
				if(this.board[y][x]) this.board[y][x].show(this.ctx, this.tileSize);
			}
		}
	}

	showLastMove(){
		this.ctx.fillStyle = "rgba(245, 201, 69, .5)";
		this.ctx.fillRect(this.lastMove.prevX * this.tileSize, this.lastMove.prevY * this.tileSize, this.tileSize, this.tileSize);
		this.ctx.fillRect(this.lastMove.nextX * this.tileSize, this.lastMove.nextY * this.tileSize, this.tileSize, this.tileSize);
	}

	showHiglightedSqueres(x, y){
		this.ctx.fillStyle = "rgba(214, 11, 51, .5)";
		this.ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
	}

	fillPieces(){
		let tmp = new Array(this.tiles);
		for(let i = 0; i < tmp.length; i ++){
			tmp[i] = new Array(this.tiles);
			for(let j = 0; j < this.tiles; j ++){
				tmp[i][j] = null;
			}
		}
		
		let color = Math.random() > .5 ? 'w' : 'b';
		let PieceSet = color === 'w' ? this.pieceMapWhite : this.pieceMapBlack;


		let dirUp = color === 'w' ? true : false;
		for(let y = 0; y < tmp.length; y ++){
			for(let x = 0; x < this.tiles; x ++){
				switch(PieceSet[y][x]){
					case 6:
					tmp[x][y] = new Rook(x, y, false, this);
					break;
					case 5:
					tmp[x][y] = new Knight(x, y, false, this);
					break;
					case 4:
					tmp[x][y] = new Bishop(x, y, false, this);
					break;
					case 3:
					tmp[x][y] = new Queen(x, y, false, this);
					break;
					case 2:
					tmp[x][y] = new King(x, y, false, this);
					break;
					case 1:
					tmp[x][y] = new Pawn(x, y, false, color === 'w' ? !dirUp : !dirUp, this);
					break;
					case 16:
					tmp[x][y] = new Rook(x, y, true, this);
					break;
					case 15:
					tmp[x][y] = new Knight(x, y, true, this);
					break;
					case 14:
					tmp[x][y] = new Bishop(x, y, true, this);
					break;
					case 13:
					tmp[x][y] = new Queen(x, y, true, this);
					break;
					case 12:
					tmp[x][y] = new King(x, y, true, this);
					break;
					case 11:
					tmp[x][y] = new Pawn(x, y, true, color === 'w' ? dirUp : dirUp, this);
					break;
					default:
					break;
				}
			}
		}
		return tmp;
	}

	clickPiece(X, Y){
		let x = Math.floor(X/this.tileSize);
		let y = Math.floor(Y/this.tileSize);
		if(this.board[x][y]) 
			return this.board[x][y];
		return null;
	}

	movePiece(piece, X, Y){
		let x = Math.floor(X/this.tileSize);
		let y = Math.floor(Y/this.tileSize);
		if(!this.board[x][y] && piece.checkMove(x, y, this.board) && this.isKingSafe(piece, x, y)){
			this.board[piece.x][piece.y] = null;
			if(piece instanceof Pawn)
				piece.moved = true;
			
			this.lastMove.prevX = piece.x;
			this.lastMove.prevY = piece.y;
			this.lastMove.nextX = x;
			this.lastMove.nextY = y;

			piece.x = x;
			piece.y = y;
			this.board[x][y] = piece;
			

		}
		else if(this.board[x][y] && piece.checkMove(x, y, this.board) && this.isKingSafe(piece, x, y)){
			this.board[x][y] = null;
			this.board[piece.x][piece.y] = null;
			if(piece instanceof Pawn)
				piece.moved = true;

			this.lastMove.prevX = piece.x;
			this.lastMove.prevY = piece.y;
			this.lastMove.nextX = x;
			this.lastMove.nextY = y;

			piece.x = x;
			piece.y = y;
			this.board[x][y] = piece;
		}
		if(piece instanceof Pawn){
			piece.checkQuining(this.board);
		}
		this.board.whiteAtackMap = this.generateAtackMap(true);
		this.board.blackAtackMap = this.generateAtackMap(false);
	}

	setSize(width){
		this.tileSize = width/this.tiles;
	}

	getColor(white){
		let arr = [];
		for(let i = 0; i < this.board.length; i++){
			for(let j = 0; j < this.board.length; j ++){
				if(this.board[i][j] && this.board[i][j].white === white)
					arr.push(this.board[i][j]);
			}
		}
		return arr;
	}

	generateAtackMap(white){
		// stworzenie pustej tablicy z domyslnymi wartosciami 0
		let arr = new Array(this.tiles);
		for(let i = 0; i < arr.length; i++){
			arr[i] = new Array(this.tiles);
			for(let j = 0; j < arr[i].length; j++){
				arr[i][j] = 0;
			}
		}

		// tablica bierek w danym kolorze
		let Pieces = this.getColor(white);
		for(let i = 0; i < Pieces.length; i++){
			let vectors = Pieces[i].getAtackedPositions(this.board);
			for(let j = 0; j < vectors.length; j ++){
				arr[vectors[j][0][0]][vectors[j][0][1]] = 1;
			}
		}

		return arr;
	}

	generateMovementMap(white){
		// stworzenie pustej tablicy z domyslnymi wartosciami 0
		let arr = new Array(this.tiles);
		for(let i = 0; i < arr.length; i++){
			arr[i] = new Array(this.tiles);
			for(let j = 0; j < arr[i].length; j++){
				arr[i][j] = 0;
			}
		}

		// tablica bierek w danym kolorze
		let Pieces = this.getColor(white);
		for(let i = 0; i < Pieces.length; i++){
			let vectors = Pieces[i].getMovement(this.board);
			for(let j = 0; j < vectors.length; j ++){
				arr[vectors[j][0][0]][vectors[j][0][1]] = 1;
			}
		}

		return arr;
	}

	isKingSafe(piece, x, y){
		const pieceCord = {
			x: piece.x,
			y: piece.y
		}

		const last = this.board[x][y];
		this.board[x][y] = null;
		this.board[piece.x][piece.y] = null;

		piece.x = x;
		piece.y = y;
		this.board[x][y] = piece;

		let king = piece.white ? this.whiteKing : this.blackKing;
		let futureState = this.generateAtackMap(!piece.white);

		if(futureState[king.x][king.y] === 1){
			this.board[pieceCord.x][pieceCord.y] = piece;
			this.board[x][y] = last;
			piece.x = pieceCord.x;
			piece.y = pieceCord.y;
			return false;
		}
		this.board[pieceCord.x][pieceCord.y] = piece;
		this.board[x][y] = last;
		piece.x = pieceCord.x;
		piece.y = pieceCord.y;
		return true;
	}
}