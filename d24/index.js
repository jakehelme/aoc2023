const example =
	`19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`;

const input = await Bun.file('./d24/input.txt').text();

const parseInput = raw => raw.split('\n').map(l => l.split(' @ ').map(v => v.split(', ').map(Number)));

function getLineParams(stone) {
	const [pos, vel] = stone;
	const now = pos.slice(0, 2);
	const next = now.map((n, i) => n + vel[i]);
	const m = (next[1] - now[1]) / (next[0] - now[0]);
	const c = now[1] - (m * now[0]);
	return [m, c];
}

function countIntersectingHailstoneTrajectories(hailstones, min, max) {
	let inRange = 0;
	for (let i = 0; i < hailstones.length - 1; i++) {
		for (let j = i + 1; j < hailstones.length; j++) {
			const [m1, c1] = getLineParams(hailstones[i]);
			const [m2, c2] = getLineParams(hailstones[j]);
			const x = m2 - m1 === 0n ? undefined : (c2 - c1) / (m1 - m2);
			if (x === undefined) continue;
			const y = m1 * x + c1;
			const [mx1, cx1] = getLineParams([[0, hailstones[i][0][0]], [1, hailstones[i][1][0]]]);
			const [my1, cy1] = getLineParams([[0, hailstones[i][0][1]], [1, hailstones[i][1][1]]]);
			const [mx2, cx2] = getLineParams([[0, hailstones[j][0][0]], [1, hailstones[j][1][0]]]);
			const [my2, cy2] = getLineParams([[0, hailstones[j][0][1]], [1, hailstones[j][1][1]]]);
			const tx1 = (x - cx1) / mx1;
			const ty1 = (y - cy1) / my1;
			const tx2 = (x - cx2) / mx2;
			const ty2 = (y - cy2) / my2;
			if (
				x >= min &&
				x <= max &&
				y >= min &&
				y <= max &&
				tx1 >= 0 &&
				ty1 >= 0 &&
				tx2 >= 0 &&
				ty2 >= 0
			) inRange++;
		}
	}
	return inRange;
}

// stolen from https://onecompiler.com/javascript/3zs6bubue
function gaussianElimination(A, B) {
	const M = A.length; // Number of equations
	const N = A[0].length; // Number of variables

	// Combine the coefficient matrix A and the constants vector B into an augmented matrix
	const augmentedMatrix = new Array(M);
	for (let i = 0; i < M; i++) {
		augmentedMatrix[i] = [...A[i], B[i]];
	}

	// Perform Gaussian Elimination
	for (let j = 0; j < N; j++) {
		// Find the pivot row with the largest absolute value in the current column
		let maxRow = j;
		for (let i = j + 1; i < M; i++) {
			if (Math.abs(augmentedMatrix[i][j]) > Math.abs(augmentedMatrix[maxRow][j])) {
				maxRow = i;
			}
		}

		// Swap rows if needed
		if (maxRow !== j) {
			[augmentedMatrix[j], augmentedMatrix[maxRow]] = [augmentedMatrix[maxRow], augmentedMatrix[j]];
		}

		// Eliminate other rows
		for (let i = 0; i < M; i++) {
			if (i !== j) {
				const factor = augmentedMatrix[i][j] / augmentedMatrix[j][j];
				for (let k = j; k <= N; k++) {
					augmentedMatrix[i][k] -= factor * augmentedMatrix[j][k];
				}
			}
		}
	}

	// Back substitution to find the solutions
	const solutions = new Array(N);
	for (let j = 0; j < N; j++) {
		solutions[j] = augmentedMatrix[j][N] / augmentedMatrix[j][j];
	}

	return solutions;
}

// heavily influenced and guided by https://www.reddit.com/r/adventofcode/comments/18q40he/2023_day_24_part_2_a_straightforward_nonsolver/
function calculateRockVector(hailstones) {
	const coeffs = [[], []];
	const constants = [[], []];
	for (let i = 1; i < 5; i++) {
		const [x, y, z] = hailstones[0][0];
		const [dx, dy, dz] = hailstones[0][1];
		const [xx, yy, zz] = hailstones[i][0];
		const [dxx, dyy, dzz] = hailstones[i][1];
		coeffs[0].push([dyy - dy, dx - dxx, y - yy, xx - x]);
		constants[0].push((xx * dyy) - (yy * dxx) - (x * dy) + (y * dx));
		coeffs[1].push([dzz - dz, dx - dxx, z - zz, xx - x]);
		constants[1].push((xx * dzz) - (zz * dxx) - (x * dz) + (z * dx));
	}
	const solsXY = gaussianElimination(coeffs[0], constants[0]).map(Math.round);
	const solsXZ = gaussianElimination(coeffs[1], constants[1]).map(Math.round);
	return solsXY[0] + solsXY[1] + solsXZ[1];
}

console.log(countIntersectingHailstoneTrajectories(parseInput(example), 7, 27));
console.log(countIntersectingHailstoneTrajectories(parseInput(input), 200000000000000, 400000000000000));

console.log(calculateRockVector(parseInput(example)));
console.log(calculateRockVector(parseInput(input)));