const example =
	`0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

const input = await Bun.file('./d9/input.txt').text();

// After learning about this, I just got ChatGPT to write me an algo to do it because I've spent too long on this now, tweaked slightly, but meh
function lagrangeInterpolateAt(calc, xValues, yValues) {
	function L(k, x) {
		let result = 1;
		for (let i = 0; i < xValues.length; i++) {
			if (i !== k) {
				result *= (x - xValues[i]) / (xValues[k] - xValues[i]);
			}
		}
		return result;
	}

	function P(x) {
		let result = 0;
		for (let k = 0; k < xValues.length; k++) {
			result += yValues[k] * L(k, x);
		}
		return result;
	}

	return Math.round(P(calc));
}

function sumOfNextOasisValues(rawReadings) {
	const readings = rawReadings.split('\n').map(l => l.split(' ').map(n => Number(n)));
	let tot = 0;
	for (let loc of readings) {
		tot += lagrangeInterpolateAt(loc.length, Object.keys(loc), loc);;
	}
	return tot;
}

console.log(sumOfNextOasisValues(example));
console.log(sumOfNextOasisValues(input));

function sumOfPreviousOasisValues(rawReadings) {
	const readings = rawReadings.split('\n').map(l => l.split(' ').map(n => Number(n)));
	let tot = 0;
	for (let loc of readings) {
		tot += lagrangeInterpolateAt(-1, Object.keys(loc), loc);;
	}
	return tot;
}

console.log(sumOfPreviousOasisValues(example));
console.log(sumOfPreviousOasisValues(input));