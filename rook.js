class Rook extends Piece{
	constructor(x, y, isWhite, board){
		super(x, y, isWhite, board);
		this.sprite.src = this.white ? 'sprites/w_rook.png' : 'sprites/b_rook.png';
		this.moved = false;
	}

	showMovement(ctx, size, board){
		
		for(let i = 0; i < Rook.moves.length; i++)
			this.showMovementRecursive(this.x + Rook.moves[i][0], this.y + Rook.moves[i][1], Rook.moves[i], board, size, ctx);	
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
		//jeszeli ruch nie w plaszczyznie lub ruch w to samo miejsce return false
		if((x !== this.x && y !== this.y) || (x === this.x && y === this.y) ) return false;
		
		let dirVert = x === this.x ? true : false;
		let dir;

		if(dirVert && this.y > y)
			dir = Rook.moves[0];
		else if(dirVert)
			dir = Rook.moves[3];
		else if(this.x > x)
			dir = Rook.moves[1];
		else
			dir = Rook.moves[2];
		
		return this.checkMovesRecursive(this.x + dir[0], this.y + dir[1], dir, board, x, y) ? true : false;
	}

	checkMovesRecursive(baseX, baseY, vector, board, x, y){
		//warunek czy punkt jest na planszy
		if( baseX < 0 || baseX >= board.length || baseY < 0 || baseY >= board.length) return false;

		
		if(board[baseX][baseY] && baseX !== x && baseY !== y) // jeżeli jest dowolna figura pomiędzy polem docelowym a figurą
			return false;
		else if(board[baseX][baseY] && board[baseX][baseY].white !== this.white && baseX === x && baseY === y){
			this.moved = true;
			return true;
		}
		else if(!board[baseX][baseY] && baseX === x && baseY === y){
			this.moved = true;
			return true;
		}
		else if(!board[baseX][baseY] && (baseX !== x || baseY !== y))
			return this.checkMovesRecursive(baseX + vector[0], baseY + vector[1], vector, board, x, y);
	}

	castle(x, board){
		board[x][this.y] = board[this.x][this.y];
		board[this.x][this.y] = null;
		this.x = x;
	}

	getAtackedPositions(board){
		let arr = [];

		for(let i = 0; i < Rook.moves.length; i++){
			arr = this.getAtackedPositionsRecurvive(this.x + Rook.moves[i][0], this.y + Rook.moves[i][1], Rook.moves[i], board, arr)
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

		for(let i = 0; i < Rook.moves.length; i++){
			arr = this.getMovablePositionsRecurvive(this.x + Rook.moves[i][0], this.y + Rook.moves[i][1], Rook.moves[i], board, arr)
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

Rook.moves = [
[0, -1],
[-1, 0], [1, 0],
[0, 1]
];