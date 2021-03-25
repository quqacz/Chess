class Queen extends Piece{
	constructor(x, y, isWhite, board){
		super(x, y, isWhite, board);
		this.sprite.src = this.white ? 'sprites/w_queen.png' : 'sprites/b_queen.png';
	}

	showMovement(ctx, size, board){
		for(let i = 0; i < Queen.moves.length; i ++){
			this.showMovementRecursive(this.x + Queen.moves[i][0], this.y + Queen.moves[i][1], Queen.moves[i], board, size, ctx);
		}
	}

	showMovementRecursive(baseX, baseY, vector, board, size, ctx){
		if( baseX < 0 || baseX >= board.length || baseY < 0 || baseY >= board.length) return; 

		// jezeli w docelowym miejscu jest figura zaznacz ją i  zakoncz pokazywanie kafelkow w danej lini
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
		
		// wybrani konkretnego wektora poruszania
		if(Math.abs(x-this.x) === Math.abs(y-this.y)){
			//ruchy gońca
			let dirRight = x > this.x ? true : false;
			let dir;

			if(dirRight && this.y > y)
				dir = Queen.moves[2];
			else if(dirRight)
				dir = Queen.moves[7];
			else if(this.y > y)
				dir = Queen.moves[0];
			else
				dir = Queen.moves[5];
			return this.checkMovesRecursive(this.x + dir[0], this.y + dir[1], dir, board, x, y) ? true : false;
		}
		else if(this.x === x || this.y === y){
			//ruchy wieży
			let dirVert = x === this.x ? true : false;
			let dir;

			if(dirVert && this.y > y)
				dir = Queen.moves[1];
			else if(dirVert)
				dir = Queen.moves[6];
			else if(this.x > x)
				dir = Queen.moves[3];
			else
				dir = Queen.moves[4];
			
			return this.checkMovesRecursive(this.x + dir[0], this.y + dir[1], dir, board, x, y) ? true : false;
		}
		
	}

	checkMovesRecursive(baseX, baseY, vector, board, x, y){
		//warunek czy punkt jest na planszy
		if( baseX < 0 || baseX >= board.length || baseY < 0 || baseY >= board.length) return false;

		
		if(board[baseX][baseY] && baseX !== x && baseY !== y) // jest dowolna figura pomiędzy polem docelowym a figurą
			return false;
		else if(board[baseX][baseY] && board[baseX][baseY].white !== this.white && baseX === x && baseY === y) // docelowe pole zawiera figure przeciwnego koloru
			return true;
		else if(!board[baseX][baseY] && baseX === x && baseY === y)	// docelowe pole jest wolne
			return true;
		else if(!board[baseX][baseY] && (baseX !== x || baseY !== y)) // sprawdzany kafelek jest wolnt ale jeszcze nie osiągnięto celu
			return this.checkMovesRecursive(baseX + vector[0], baseY + vector[1], vector, board, x, y);
	}

	getAtackedPositions(board){
		let arr = [];

		for(let i = 0; i < Queen.moves.length; i++){
			arr = this.getAtackedPositionsRecurvive(this.x + Queen.moves[i][0], this.y + Queen.moves[i][1], Queen.moves[i], board, arr)
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
		else if(board[baseX][baseY] && board[baseX][baseY].white !== this.white){
			return arr;
		}
		else if(!board[baseX][baseY]){
			arr.push([[baseX, baseY]])
			return this.getAtackedPositionsRecurvive(baseX + vector[0], baseY + vector[1], vector, board, arr);
		}
	}

	getMovement(board){
		let arr = [];

		for(let i = 0; i < Queen.moves.length; i++){
			arr = this.getMovablePositionsRecurvive(this.x + Queen.moves[i][0], this.y + Queen.moves[i][1], Queen.moves[i], board, arr)
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

Queen.moves = [
[-1, -1], [0, -1], [1, -1],
[-1, 0], [1, 0],
[-1, 1], [0, 1], [1, 1]
];