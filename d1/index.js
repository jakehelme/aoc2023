const example1 =
	`1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

const input = await Bun.file('./d1/input.txt').text();

function getCalibrationValues(calibrationDocument) {
	return calibrationDocument.split('\n').reduce((tot, line) => {
		const numbers = line.replace(/[^0-9]+/g, '');
		return tot + parseInt(`${numbers[0]}${numbers[numbers.length - 1]}`);
	}, 0);
}

console.log(getCalibrationValues(example1));
console.log(getCalibrationValues(input));

const example2 =
	`two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

function getCalibrationValuesIncludeSpelledOut(calibrationDocument) {
	const mappings = {
		'one': 1,
		'two': 2,
		'three': 3,
		'four': 4,
		'five': 5,
		'six': 6,
		'seven': 7,
		'eight': 8,
		'nine': 9
	};

	return calibrationDocument.split('\n').reduce((tot, line) => {
		const regex = /(?=([0-9]|one|two|three|four|five|six|seven|eight|nine))/gm;
		let m;
		let numberStrings = [];
		// positive lookaheads are weird in JS, this comes from regex101.com code gen
		while ((m = regex.exec(line)) !== null) {
			if (m.index === regex.lastIndex) {
					regex.lastIndex++;
			}
			m.forEach((match, groupIndex) => {
					if(groupIndex == 1) numberStrings.push(match);
			});
	}


		const numbers = numberStrings.map(num => {
			if (mappings[num]) return mappings[num];
			return parseInt(num);
		});

		return tot + parseInt(`${numbers[0]}${numbers[numbers.length - 1]}`);
	}, 0);
}

console.log(getCalibrationValuesIncludeSpelledOut(example2));
console.log(getCalibrationValuesIncludeSpelledOut(input));