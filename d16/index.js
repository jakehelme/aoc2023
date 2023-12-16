const example = 
`.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`;

const input = await Bun.file('./d16/input.txt').text();

function getEnergizedTiles(rawMap) {
	const map = rawMap.split('\n').map(l => line.split(''));
	const start = '0,0,R';
	const frontier = [start];
	const cameFrom = new Set();
	cameFrom.add(start);

	while(frontier.length) {
		const [y, x, dir] = frontier.shift().split(',');
		const tile = map[y][x];
		switch(tile) {
			case '/':

				break;
			case '\\':

				break;
			case '-':

				break;
			case '|':

				break;
		}


	}
}
