const example =
	`467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

const input = await Bun.file('./d3/input.txt').text();

const generateGrid = schematic => schematic.split('\n').map(line => line.split(''));

function sumPartNumbers(schematic) {
	const grid = generateGrid(schematic);
	const partNumbers = [];

	for (let y = 0; y < grid.length; y++) {
		row: for (let x = 0; x < grid[y].length; x++) {
			if (grid[y][x] === '.') continue;
			else if (/\d/.test(grid[y][x])) {
				let length = 1;
				while (x + length < grid[y].length && /\d/.test(grid[y][x + length])) length++;
				const partNumber = parseInt(grid[y].slice(x, x + length).join(''));
				for (let i = Math.max(y - 1, 0); i <= y + 1; i++) {
					for (let j = Math.max(x - 1, 0); j <= x + length; j++) {
						if (i < 0 || j < 0 || i >= grid.length || j >= grid[y].length) continue;
						if (i === y && j >= x && j < x + length) continue;
						if (grid[i][j] !== '.' && !/\d/.test(grid[i][j])) {
							partNumbers.push(partNumber);
							x += length - 1;
							continue row;
						}
					}
				}
				x += length - 1;
			}
		}
	}
	return partNumbers.reduce((tot, cur) => tot + cur);
}

console.log(sumPartNumbers(example));
console.log(sumPartNumbers(input));

function sumGearRatios(schematic) {
	const grid = generateGrid(schematic);
	const gearRatios = [];

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			if (grid[y][x] === '*') {
				const parts = [];
				for (let j = Math.max(0, y - 1); j <= y + 1; j++) {
					for (let i = Math.max(0, x - 1); i <= x + 1; i++) {
						if (j === y && i === x) continue;
						if (/\d/.test(grid[j][i])) {
							let matches = grid[j].join('').matchAll(/\d+/g);
							for (let match of matches) {
								if (i >= match.index && i < match.index + match[0].length) {
									parts.push(parseInt(match[0]));
									i = match.index + match[0].length - 1;
									break;
								}
							}
						}
					}
				}
				if (parts.length === 2) {
					let gearRatio = 1;
					for (let part of parts) {
						gearRatio *= part;
					}
					gearRatios.push(gearRatio);
				} else if (parts.length > 2) {
					console.log('more than');
				}
			}
		}
	}
	return gearRatios.reduce((tot, curr) => tot + curr);
}

console.log(sumGearRatios(example));
console.log(sumGearRatios(input));