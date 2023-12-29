const example =
	`jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr`;

const input = await Bun.file('./d25/input.txt').text();

const parseInput = raw => raw.split('\n').reduce((m, line) => {
	const modules = line.match(/\w+/g);
	m.set(modules[0], new Set(modules.slice(1)));
	return m;
}, new Map());

function getUniqueGroups(nodes) {
	const groups = [];
	for (const node of nodes.keys()) {
		const start = node;
		const visited = new Set([start]);
		const frontier = [start];
		while(frontier.length) {
			const current = frontier.shift();
			for (const next of nodes.get(current)) {
				if (!visited.has(next)) {
					frontier.push(next);
					visited.add(next);
				}
			}
		}
		if (visited.size === nodes.size) {
			groups.push(visited);
			return groups;
		} else {
			if (groups.length) {
				let isUnique = true;
				for (const group of groups) {
					if (visited.difference(group).size === 0) {
						isUnique = false;
						break;
					}
				}
				if (isUnique) groups.push(visited);
			} else {
				groups.push(visited);
			}
		}
	}
	return groups;
}

async function blurple(nodes) {
	// const wires = new Set();
	const wires = [];
	for (const [node, otherNodes] of nodes) {
		for (const otherNode of otherNodes) {
			const wire = [node, otherNode];
			wire.sort();
			// wires.add(wire.join('-'));
			wires.push(wire.join('-'));
		}
	}

	// create viz
	// const Links = [["Source", "Target"]]
	// for (const [node, others] of nodes) {
	// 	for (const other of others) {
	// 		Links.push([node, other]);
	// 	}
	// }

	// await Bun.write('./nodes.json', JSON.stringify(Links));

	for (const [node, otherNodes] of nodes) {
		for (const otherNode of otherNodes) {
			if (nodes.has(otherNode)) nodes.get(otherNode).add(node);
			else nodes.set(otherNode, new Set([node]));
		}
	}

	// for (let i = 0; i < wires.length - 2; i++) {
	// 	console.log(`${i + 1}/${wires.length - 2}`);
	// 	for (let j = i + 1; j < wires.length - 1; j++) {
	// 		for (let k = j + 1; k < wires.length; k++) {
	// 			const [a, b] = wires[i].split('-');
	// 			const [c, d] = wires[j].split('-');
	// 			const [e, f] = wires[k].split('-');
	// 			const tempNodes = structuredClone(nodes);
	// 			tempNodes.get(a).delete(b);
	// 			tempNodes.get(b).delete(a);
	// 			tempNodes.get(c).delete(d);
	// 			tempNodes.get(d).delete(c);
	// 			tempNodes.get(e).delete(f);
	// 			tempNodes.get(f).delete(e);
	// 			const uniqueGroups = getUniqueGroups(tempNodes);
	// 			if (uniqueGroups.length === 2) {
	// 				return uniqueGroups[0].size * uniqueGroups[1].size;
	// 			};
	// 		}
	// 	}
	// }
	const tempNodes = structuredClone(nodes);
	tempNodes.get('jkn').delete('cfn');
	tempNodes.get('cfn').delete('jkn');
	tempNodes.get('sfd').delete('ljm');
	tempNodes.get('ljm').delete('sfd');
	tempNodes.get('rph').delete('gst');
	tempNodes.get('gst').delete('rph');
	const uniqueGroups = getUniqueGroups(tempNodes);
	return uniqueGroups[0].size * uniqueGroups[1].size;
	// return null;
}

// console.log(blurple(parseInput(example)));
const ans = await blurple(parseInput(input));
console.log(ans);