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

const parseInput = raw => raw.split('\n').reduce((m, line) => {
	const modules = line.match(/\w+/g);
	m.set(modules[0], new Set(modules.slice(1)));
	return m;
}, new Map());

function blurple(nodes) {
	const wires = new Set();
	for (const [node, otherNodes] of nodes) {
		for (const otherNode of otherNodes) {
			const wire = [node, otherNode];
			wire.sort();
			wires.add(wire.join('-'));
		}
	}

	for (const [node, otherNodes] of nodes) {
		for (const otherNode of otherNodes) {
			if (nodes.has(otherNode)) nodes.get(otherNode).add(node);
			else nodes.set(otherNode, new Set([node]));
		}
	}

	console.log();
}

console.log(blurple(parseInput(example)));