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

console.log(runPartsThroughWorkflows(...parseInput(example)));
console.log(runPartsThroughWorkflows(...parseInput(input)));

function getDistinctRatingCombos(workflows) {
	const start = { wf: 'in', xMin: 1, xMax: 4000, mMin: 1, mMax: 4000, aMin: 1, aMax: 4000, sMin: 1, sMax: 4000 };
	const frontier = [start];
	let tot = 0;

	while (frontier.length) {
		const current = frontier.shift();
		if (current.wf === 'A') {
			tot += (
				(current.xMax - current.xMin + 1) *
				(current.mMax - current.mMin + 1) *
				(current.aMax - current.aMin + 1) *
				(current.sMax - current.sMin + 1));
			continue;
		} else if (current.wf === 'R') continue;
		for (const rule of workflows[current.wf]) {
			const next = { ...current, wf: rule.then };
			if (rule.compare) {
				if (rule.isGT) {
					next[`${rule.param}Min`] = Math.max(rule.compare + 1, next[`${rule.param}Min`]);
					frontier.push(next);
					current[`${rule.param}Max`] = Math.min(rule.compare, current[`${rule.param}Max`]);
				} else {
					next[`${rule.param}Max`] = Math.min(rule.compare - 1, next[`${rule.param}Max`]);
					frontier.push(next);
					current[`${rule.param}Min`] = Math.max(rule.compare, current[`${rule.param}Min`]);
				}
			} else {
				frontier.push(next);
			}
		}
	}
	return tot;
}

console.log(getDistinctRatingCombos(parseInput(example)[0]));
console.log(getDistinctRatingCombos(parseInput(input)[0]));