const example =
	`1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`;

const input = await Bun.file('./d22/input.txt').text();

const sortLowestToHighest = (a, b) => Math.min(a[0][2], a[1][2]) - Math.min(b[0][2], b[1][2]);

const parseInput = raw => raw.split('\n')
	.map(l => l.split('~')
		.map(p => p.split(',')
			.map(Number)));

const minMax = (p1, p2) => {
	return [
		[Math.min(p1[0], p2[0]), Math.max(p1[0], p2[0])],
		[Math.min(p1[1], p2[1]), Math.max(p1[1], p2[1])],
		[Math.min(p1[2], p2[2]), Math.max(p1[2], p2[2])]
	];
};

const asc = (a, b) => a - b;

function letBrickDrop(grid, bricks, brickIndex) {
	let canDrop = true;
	let dropped = false;
	while (canDrop) {
		const [p1, p2] = bricks[brickIndex];
		const zMin = Math.min(p1[2], p2[2]);
		if (zMin === 1) return dropped;
		const ranges = minMax(p1, p2);

		outer: for (let x = ranges[0][0]; x <= ranges[0][1]; x++) {
			for (let y = ranges[1][0]; y <= ranges[1][1]; y++) {
				if (grid[x][y][zMin - 1] !== '.') {
					canDrop = false;
					break outer;
				}
			}
		}
		if (canDrop) {
			for (let x = ranges[0][0]; x <= ranges[0][1]; x++) {
				for (let y = ranges[1][0]; y <= ranges[1][1]; y++) {
					for (let z = ranges[2][0]; z <= ranges[2][1]; z++) {
						grid[x][y][z] = '.';
						grid[x][y][z - 1] = `${brickIndex}`;
					}
				}
			}
			bricks[brickIndex][0][2] -= 1;
			bricks[brickIndex][1][2] -= 1;
			dropped = true;
		}
	}
	return dropped;
}

function getSingularlyDisintegratableBricks(bricks) {
	const grid = letBricksSettle(bricks);
	let unsuitable = 0;
	brickloop: for (let i = 0; i < bricks.length; i++) {
		const tempGrid = structuredClone(grid);
		const tempBricks = structuredClone(bricks);
		const [p1, p2] = tempBricks[i];
		const ranges = minMax(p1, p2);
		for (let x = ranges[0][0]; x <= ranges[0][1]; x++) {
			for (let y = ranges[1][0]; y <= ranges[1][1]; y++) {
				for (let z = ranges[2][0]; z <= ranges[2][1]; z++) {
					tempGrid[x][y][z] = '.';
				}
			}
		}
		const bricksInRowAbove = tempBricks.filter(b => Math.min(b[0][2], b[1][2]) === ranges[2][1] + 1);
		for (let j = 0; j < bricksInRowAbove.length; j++) {
			if (j !== i && letBrickDrop(tempGrid, bricksInRowAbove, j)) {
				unsuitable++;
				continue brickloop;
			}
		}
	}
	return bricks.length - unsuitable;
}

function countTotalFallingBricksForEachDisintegration(bricks) {
	const grid = letBricksSettle(bricks);
	bricks.sort(sortLowestToHighest);
	let tot = 0;
	for (let i = 0; i < bricks.length; i++) {
		const tempGrid = structuredClone(grid);
		const tempBricks = structuredClone(bricks);
		const [p1, p2] = tempBricks[i];
		const ranges = minMax(p1, p2);
		for (let x = ranges[0][0]; x <= ranges[0][1]; x++) {
			for (let y = ranges[1][0]; y <= ranges[1][1]; y++) {
				for (let z = ranges[2][0]; z <= ranges[2][1]; z++) {
					tempGrid[x][y][z] = '.';
				}
			}
		}
		let droppedBricks = 0;
		for (let j = 0; j < tempBricks.length; j++) {
			if (j !== i && letBrickDrop(tempGrid, tempBricks, j)) {
				droppedBricks++;
			}
		}
		tot += droppedBricks;
	}
	return tot;
}

function letBricksSettle(bricks) {
	bricks.sort(sortLowestToHighest);
	const maxes = [0, 0, 0];
	for (const p of bricks.flat()) {
		maxes[0] = Math.max(p[0], maxes[0]);
		maxes[1] = Math.max(p[1], maxes[1]);
		maxes[2] = Math.max(p[2], maxes[2]);
	}
	const grid = Array(maxes[0] + 1).fill().map(() => Array(maxes[1] + 1).fill().map(() => Array(maxes[2] + 1).fill('.').map((c, i) => i === 0 ? '-' : c)));
	for (const [i, brick] of Object.entries(bricks)) {
		const xs = [brick[0][0], brick[1][0]].sort(asc);
		const ys = [brick[0][1], brick[1][1]].sort(asc);
		const zs = [brick[0][2], brick[1][2]].sort(asc);

		for (let x = xs[0]; x <= xs[1]; x++) {
			for (let y = ys[0]; y <= ys[1]; y++) {
				for (let z = zs[0]; z <= zs[1]; z++) {
					grid[x][y][z] = `${i}`;
				}
			}
		}
	}
	// print(grid, 'x');
	// console.log('\n');
	// print(grid, 'y');
	// console.log('\n');
	for (let i = 0; i < bricks.length; i++) {
		letBrickDrop(grid, bricks, i);
	}
	// print(grid, 'x');
	// console.log('\n');
	// print(grid, 'y');
	// console.log('\n');
	// console.log();
	return grid;
}

function print(grid, plane) {
	if (plane === 'x') {
		for (let z = grid[0][0].length - 1; z >= 0; z--) {
			if (!z) {
				console.log('-'.repeat(grid.length));
				continue;
			}
			let line = [];
			for (let x = 0; x < grid.length; x++) {
				let p = '.';
				let lastBrick;
				for (let y = 0; y < grid[0].length; y++) {
					const c = grid[x][y][z];
					if (c !== '.') {
						if (p === '.') {
							p = '#';
							lastBrick = c;
						}
						else if (lastBrick !== c) p = '?';
					}
				}
				line.push(p);
			}
			console.log(line.join(''));
		}
	} else {
		for (let z = grid[0][0].length - 1; z >= 0; z--) {
			if (!z) {
				console.log('-'.repeat(grid.length));
				continue;
			}
			let line = [];
			for (let y = 0; y < grid[0].length; y++) {
				let p = '.';
				let lastBrick;
				for (let x = 0; x < grid.length; x++) {
					const c = grid[x][y][z];
					if (c !== '.') {
						if (p === '.') {
							p = '#';
							lastBrick = c;
						}
						else if (lastBrick !== c) p = '?';
					}
				}
				line.push(p);
			}
			console.log(line.join(''));
		}
	}
}

console.log(getSingularlyDisintegratableBricks(parseInput(example)));
console.log(getSingularlyDisintegratableBricks(parseInput(input)));

console.log(countTotalFallingBricksForEachDisintegration(parseInput(example)));
console.log(countTotalFallingBricksForEachDisintegration(parseInput(input)));