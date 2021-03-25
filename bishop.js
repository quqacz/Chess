class Bishop extends Piece{
	constructor(x, y, isWhite, board){
		super(x, y, isWhite, board);
		this.sprite.src = this.white ? 'sprites/w_bishop.png' : 'sprites/b_bishop.png';
	}

	showMovement(ctx, size, board){	
		
		for(let i = 0; i < Bishop.moves.length; i++)
			this.showMovementRecursive(this.x + Bishop.moves[i][0], this.y + Bishop.moves[i][1], Bishop.moves[i], board, size, ctx);		
	}

	showMovementRecursive(baseX, baseY, vector, board, size, ctx){
		if( baseX < 0 || baseX >= board.length || baseY < 0 || baseY >= board.length) return; 
		
		// sprawdzenie czy obecny kafelek jest zajety przez figure niebedaca figura poruszana
		if(board[baseX][baseY] && board[baseX][baseY].white !== this.white && !(baseX == this.x && baseY == this.y) && this.board.isKingSafe(this, baseX, baseY)){
			this.showAtackedSqueres(ctx, baseX, baseY, size);
			board[baseX][baseY].show(ctx, size);
			return;
		}else if(!board[baseX][baseY] && this.board.isKingSafe(this, baseX, baseY)){
		//jezeli obecny kafelek jest pusty pomaluj go i wtwołaj sie z pozycja zmieniona o vektor
			this.showMovableSquare(ctx, baseX, baseY, size);
			this.showMovementRecursive(baseX + vector[0], baseY + vector[1], vector, board, size, ctx);
		}
	}

	checkMove(x, y, board){
		//jeszeli ruch w to samo miejsce return false
		if(x === this.x && y === this.y) return false;
		
		let dirRight = x > this.x ? true : false;
		let dir;

		if(dirRight && this.y > y)
			dir = Bishop.moves[1];
		else if(dirRight)
			dir = Bishop.moves[3];
		else if(this.y > y)
			dir = Bishop.moves[0];
		else
			dir = Bishop.moves[2];
		return this.checkMovesRecursive(this.x + dir[0], this.y + dir[1], dir, board, x, y) ? true : false;
	}

	checkMovesRecursive(baseX, baseY, vector, board, x, y){
		//warunek czy punkt jest na planszy
		if( baseX < 0 || baseX >= board.length || baseY < 0 || baseY >= board.length) return false;

		
		if(board[baseX][baseY] && baseX !== x && baseY !== y) // jeżeli jest dowolna figura pomiędzy polem docelowym a figurą
			return false;
		else if(board[baseX][baseY] && board[baseX][baseY].white !== this.white && baseX === x && baseY === y)
			return true;
		else if(!board[baseX][baseY] && baseX === x && baseY === y)
			return true;
		else if(!board[baseX][baseY] && (baseX !== x || baseY !== y))
			return this.checkMovesRecursive(baseX + vector[0], baseY + vector[1], vector, board, x, y);
	}

	getAtackedPositions(board){
		let arr = [];

		for(let i = 0; i < Bishop.moves.length; i++){
			arr = this.getAtackedPositionsRecurvive(this.x + Bishop.moves[i][0], this.y + Bishop.moves[i][1], Bishop.moves[i], board, arr)
		}

		return arr;
	}

	getAtackedPositionsRecurvive(baseX, baseY, vector, board, arr){
		if( baseX < 0 || baseX >= board.length || baseY < 0 || baseY >= board.length) return arr;

		// jezeli chroni pole z figura tego samego koloru dodaj do listy i zwroc liste
		if(board[baseX][baseY] && board[baseX][baseY].white === this.white){ 
			arr.push([[baseX, baseY]])
			return arr;
		}
		else if(board[baseX][baseY] && board[baseX][baseY].white !== this.white && (board[baseX][baseY] instanceof King)){
			arr.push([[baseX, baseY]])
			return this.getAtackedPositionsRecurvive(baseX + vector[0], baseY + vector[1], vector, board, arr);
		}
		else if(!board[baseX][baseY]){
			arr.push([[baseX, baseY]])
			return this.getAtackedPositionsRecurvive(baseX + vector[0], baseY + vector[1], vector, board, arr);
		}
		else 
			return arr;
	}

	getMovement(board){
		let arr = [];

		for(let i = 0; i < Bishop.moves.length; i++){
			arr = this.getMovablePositionsRecurvive(this.x + Bishop.moves[i][0], this.y + Bishop.moves[i][1], Bishop.moves[i], board, arr)
		}

		return arr;
	}

	getMovablePositionsRecurvive(baseX, baseY, vector, board, arr){
		if( baseX < 0 || baseX >= board.length || baseY < 0 || baseY >= board.length) return arr;

		// jezeli na polu jest figura tego samego koloru nie mozna przejsc => zwroc liste w obecnym stanie
		if(board[baseX][baseY] && board[baseX][baseY].white === this.white){ 
			return arr;
		}
		// jeszeli na polu jest przeciwny krol oznacz pole i zwroc tablice
		else if(board[baseX][baseY] && board[baseX][baseY].white !== this.white){
			arr.push([[baseX, baseY]])
			return arr;
		}
		else if(!board[baseX][baseY]){
			arr.push([[baseX, baseY]])
			return this.getMovablePositionsRecurvive(baseX + vector[0], baseY + vector[1], vector, board, arr);
		}
	}
}

Bishop.moves = [
[-1, -1], [1, -1],
[-1, 1], [1, 1]
];