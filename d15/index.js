const example =
	`rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;

const input = await Bun.file('./d15/input.txt').text();

function hash(str) {
	let current = 0;
	for (let c of str) {
		current += c.charCodeAt(0);
		current *= 17;
		current = current % 256;
	}
	return current;
}

function totalHashes(rawSteps) {
	const steps = rawSteps.split(',');
	let tot = 0;
	for (let step of steps) {
		tot += hash(step);
	}
	return tot;
}

function totalFocusingPower(rawSteps) {
	const boxes = Array(256).fill().map(() => []);
	const steps = rawSteps.split(',').map(step => {
		const matches = step.match(/(^\w+)([-=])(\d)?$/);
		const parsed = { label: matches[1], boxId: hash(matches[1]), op: matches[2] };
		if (matches[3]) parsed.focalStrength = Number(matches[3]);
		return parsed;
	});
	for (let step of steps) {
		const pattern = new RegExp(`^${step.label}\\s\\d$`);
		const lensIndex = boxes[step.boxId].findIndex(lens => pattern.test(lens));
		if(step.op === '=') {
			if(lensIndex >= 0) {
				boxes[step.boxId][lensIndex] = `${step.label} ${step.focalStrength}`
			} else {
				boxes[step.boxId].push(`${step.label} ${step.focalStrength}`);
			}
		} else {
			if (lensIndex >= 0) {
				boxes[step.boxId] = [...boxes[step.boxId].slice(0,lensIndex), ...boxes[step.boxId].slice(lensIndex + 1)];
			}
		}
	}

	const total = boxes.reduce((tot, currArr, boxNumber) => {
		const subTot = currArr.reduce((sub, lens, lensNumber) => {
			const focal = Number(lens.split(' ')[1]);
			return sub + ((boxNumber + 1) * (lensNumber + 1) * focal);
		}, 0);
		return tot + subTot;
	}, 0)
	
	return total;
}

console.log(totalHashes(example));
console.log(totalHashes(input));

console.log(totalFocusingPower(example));
console.log(totalFocusingPower(input));
