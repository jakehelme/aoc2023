const example =
	`px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`;

const input = await Bun.file('./d19/input.txt').text();

const paramPos = { x: 0, m: 1, a: 2, s: 3 };

function parseInput(raw) {
	const [ruleBlock, partsBlock] = raw.split('\n\n');

	const rules = ruleBlock.split('\n').reduce((o, l) => {
		const name = l.match(/^\w+/)[0];
		const ruleArr = l.replace(/^\w+{/, '').replace(/}$/, '').split(',').map(r => {
			const matches = r.match(/((\w+)([<>])(\d+):)?(\w+)/);
			if (matches[1]) return {
				param: matches[2],
				isGT: matches[3] === '>',
				compare: Number(matches[4]),
				then: matches[5]
			};
			return { then: matches[0] };
		});
		o[name] = ruleArr;
		return o;
	}, {});

	const parts = partsBlock.split('\n').map(l => l.match(/\d+/g).map(Number));

	return [rules, parts];
}

function processPart(workflows, part) {
	let wf = 'in';
	while (wf !== 'A' && wf !== 'R') {
		for (const rule of workflows[wf]) {
			if (rule.compare) {
				if (rule.isGT) {
					if (part[paramPos[rule.param]] > rule.compare) {
						wf = rule.then;
						break;
					}
				} else {
					if (part[paramPos[rule.param]] < rule.compare) {
						wf = rule.then;
						break;
					}
				}
			} else {
				wf = rule.then;
				break;
			}
		}

	}
	return wf === 'A';
}

function runPartsThroughWorkflows(workflows, parts) {
	let tot = 0;
	for (const part of parts) {
		if (processPart(workflows, part)) tot += (part.reduce((t, c) => t + c));
	}
	return tot;
}

// console.log(runPartsThroughWorkflows(...parseInput(example)));
// console.log(runPartsThroughWorkflows(...parseInput(input)));

function getDistinctRatingCombos(workflows) {
	const validRanges = [];
	for (const key of Object.keys(workflows)) {
		const ranges = [[1, 4000], [1, 4000], [1, 4000], [1, 4000]];
		let next = key;
		let search = 'A';
		while (true) {
			let negate = false;
			for (let i = workflows[next].length - 1; i >= 0; i--) {
				const rule = workflows[next][i];
				if (negate || rule.then === search) {
					if (rule.compare) {
						if (!negate) {
							if (rule.isGT) {
								ranges[paramPos[rule.param]][0] = Math.max(rule.compare + 1, ranges[paramPos[rule.param]][0]);
							} else {
								ranges[paramPos[rule.param]][1] = Math.min(rule.compare - 1, ranges[paramPos[rule.param]][1]);
							}
						} else {
							if (rule.isGT) {
								ranges[paramPos[rule.param]][1] = Math.min(rule.compare, ranges[paramPos[rule.param]][1]);
							} else {
								ranges[paramPos[rule.param]][0] = Math.max(rule.compare, ranges[paramPos[rule.param]][0]);
							}
						}

					} else {
						if (i >= 1 && rule.then === workflows[next][i - 1].then){
							i--;
						}
					}
					negate = true;
				}
			}
			if (negate) {
				if (next === 'in'){
					validRanges.push(ranges);
					break;
				}
				search: for (const searchKey in workflows) {
					for (const searchRule of workflows[searchKey]) {
						if (searchRule.then === next) {
							search = next;
							next = searchKey;
							break search;
						}
					}
				}
			} else {
				break;
			}
		}
	}
	// console.log();
	return validRanges.reduce((total, range) => total + range.reduce((t, r) => t * (r[1] - r[0] + 1), 1), 0);
}


console.log(getDistinctRatingCombos(parseInput(example)[0]));
console.log(getDistinctRatingCombos(parseInput(input)[0]));