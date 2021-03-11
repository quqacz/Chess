class Piece{
	constructor(x, y, isWhite){
		this.x = x; 
		this.y = y;
		this.white = isWhite;
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

class King extends Piece{
	constructor(x, y, isWhite){
		super(x, y, isWhite);
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


class Queen extends Piece{
	constructor(x, y, isWhite){
		super(x, y, isWhite);
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
		if(board[baseX][baseY] && board[baseX][baseY].white !== this.white && !(baseX == this.x && baseY == this.y)){
			this.showAtackedSqueres(ctx, baseX, baseY, size);
			board[baseX][baseY].show(ctx, size);
			return;
		}else if(!board[baseX][baseY]){
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


class Knight extends Piece{
	constructor(x, y, isWhite){
		super(x, y, isWhite);
		this.sprite.src = this.white ? 'sprites/w_knight.png' : 'sprites/b_knight.png';
	}

	showMovement(ctx, size, board){
		for(let i = 0; i < Knight.moves.length; i++){
			let nextX = this.x + Knight.moves[i][0];
			let nextY = this.y + Knight.moves[i][1];
			if(nextX >= 0  && nextX < board.length && nextY >= 0  && nextY < board.length ){
				if(board[nextX][nextY] && board[nextX][nextY].white !== this.white){
					this.showAtackedSqueres(ctx, nextX, nextY, size);
					board[nextX][nextY].show(ctx, size);
				}else if(!board[nextX][nextY]){
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

class Bishop extends Piece{
	constructor(x, y, isWhite){
		super(x, y, isWhite);
		this.sprite.src = this.white ? 'sprites/w_bishop.png' : 'sprites/b_bishop.png';
	}

	showMovement(ctx, size, board){	
		
		for(let i = 0; i < Bishop.moves.length; i++)
			this.showMovementRecursive(this.x + Bishop.moves[i][0], this.y + Bishop.moves[i][1], Bishop.moves[i], board, size, ctx);		
	}

	showMovementRecursive(baseX, baseY, vector, board, size, ctx){
		if( baseX < 0 || baseX >= board.length || baseY < 0 || baseY >= board.length) return; 
		
		// sprawdzenie czy obecny kafelek jest zajety przez figure niebedaca figura poruszana
		if(board[baseX][baseY] && board[baseX][baseY].white !== this.white && !(baseX == this.x && baseY == this.y)){
			this.showAtackedSqueres(ctx, baseX, baseY, size);
			board[baseX][baseY].show(ctx, size);
			return;
		}else if(!board[baseX][baseY]){
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

class Rook extends Piece{
	constructor(x, y, isWhite){
		super(x, y, isWhite);
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
		if(board[baseX][baseY] && board[baseX][baseY].white !== this.white && !(baseX == this.x && baseY == this.y)){
			this.showAtackedSqueres(ctx, baseX, baseY, size);
			board[baseX][baseY].show(ctx, size);
			return;
		}else if(!board[baseX][baseY]){
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

class Pawn extends Piece{

	constructor(x, y, isWhite, dirUp){
		super(x, y, isWhite);
		this.sprite.src = this.white ? 'sprites/w_pawn.png' : 'sprites/b_pawn.png';
		this.moved = false;
		this.direction = dirUp;
	}

	showMovement(ctx, size, board){
		let nextY = (this.y + (this.direction ? Pawn.moves[0][1] : -Pawn.moves[0][1]));
		let nextNextY = (this.y + (this.direction ? Pawn.moves[1][1] : -Pawn.moves[1][1]));
		// sprawdzenie czy pierwszy kafelek przed pionem jest wolny
		if(!board[this.x][nextY]){
			this.showMovableSquare(ctx, this.x, nextY, size);
			//sprawdzenie czy drugi kafelek jest wolny jesli pion nie zostal jeszcze poruszony
			if(!this.moved && !board[this.x][nextNextY]){
				this.showMovableSquare(ctx, this.x, nextNextY, size);
			}
		}

		// podświetlenie atakowanych kafelków
		if(this.x - 1 >= 0){
			if(board[this.x-1][nextY] && board[this.x-1][nextY].white == !this.white){
				this.showAtackedSqueres(ctx, this.x - 1, nextY, size);
				board[this.x-1][nextY].show(ctx, size);
			}
		}
		if(this.x + 1 < board.length){
			if(board[this.x+1][nextY] && board[this.x+1][nextY].white == !this.white){
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
