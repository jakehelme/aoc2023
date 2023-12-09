const example =
	`LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

const example2 =
	`LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

const input = await Bun.file('./d8/input.txt').text();

function parseMap(rawMap) {
	const [dirs, nodesRaw] = rawMap.split('\n\n');

	const nodes = nodesRaw.split('\n').reduce((obj, curr) => {
		const matches = curr.match(/\w+/g);
		obj[matches[0]] = [matches[1], matches[2]];
		return obj;
	}, {});
	return [dirs, nodes];
}

function traverseMap(rawMap) {
	const [dirs, nodes] = parseMap(rawMap);
	let i = 0;
	let steps = 0;
	let pos = 'AAA';
	while (true) {
		const dir = dirs[i];
		if (i === dirs.length - 1) i = 0;
		else i++;
		if (dir === 'L') pos = nodes[pos][0];
		else pos = nodes[pos][1];
		steps++;
		if (pos === 'ZZZ') break;

	}
	return steps;
}

// console.log(traverseMap(example));
// console.log(traverseMap(input));

function gcd(a, b) {
	return b ? gcd(b, a % b) : a;
}

function lowestCommonMultiple(nums) {
	let lcm = nums[0];
	for (let num of nums) {
		lcm = num * lcm / gcd(num, lcm);
	}
	return lcm;
}

function traverseMapAsGhost(rawMap) {
	const [dirs, nodes] = parseMap(rawMap);

	const positions = Object.keys(nodes).filter(x => x[2] === 'A');
	const stepsToEnd = [];
	for (let j = 0; j < positions.length; j++) {
		let i = 0;
		let steps = 0;

		while (true) {
			const dir = dirs[i];
			if (i === dirs.length - 1) i = 0;
			else i++;
			let next;
			if (dir === 'L') next = 0;
			else next = 1;
			positions[j] = nodes[positions[j]][next];

			steps++;
			if (positions[j][2] === 'Z') {
				stepsToEnd.push(steps);
				break;
			}
		}
	}
	return lowestCommonMultiple(stepsToEnd);
}

console.log(traverseMapAsGhost(example2));
console.log(traverseMapAsGhost(input));

