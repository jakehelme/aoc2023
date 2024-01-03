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

function getDisconnectedGroups(nodes) {
	const groups = [];
	for (const node of nodes.keys()) {
		const start = node;
		const visited = new Set([start]);
		const frontier = [start];
		while (frontier.length) {
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

function backFillNodes(nodes) {
	for (const [node, otherNodes] of nodes) {
		for (const otherNode of otherNodes) {
			if (nodes.has(otherNode)) nodes.get(otherNode).add(node);
			else nodes.set(otherNode, new Set([node]));
		}
	}
}

function getEdges(nodes) {
	const edges = new Map();
	for (const [node, otherNodes] of nodes) {
		for (const otherNode of otherNodes) {
			const edge = [node, otherNode];
			edge.sort();
			edges.set(edge.join('-'), 0);
		}
	}
	return edges;
}

function traverseShortestPath(graph, start, end, connections) {
	const frontier = [start];
	const cameFrom = new Map([[start, null]]);
	while (frontier.length) {
		const current = frontier.shift();
		if (current === end) {
			const path = [];
			let pos = end;
			while (pos !== start) {
				path.push(pos);
				const next = cameFrom.get(pos);
				const connection = [pos, next].sort().join('-');
				connections.set(connection, connections.get(connection) + 1);
				pos = next;
			}
			break;
		}
		const neighbours = graph.get(current);
		for (const next of neighbours) {
			if (!cameFrom.has(next)) {
				frontier.push(next);
				cameFrom.set(next, current);
			}
		}
	}
}

function shuffle(array) {
	let currentIndex = array.length, randomIndex;
	while (currentIndex > 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
	return array;
}

function findWiresToDC(raw, randomTraversals) {
	const modules = parseInput(raw);
	const wires = getEdges(modules);
	const modList = Array.from(modules.keys());
	backFillNodes(modules);
	for (let i = 0; i < randomTraversals; i++) {
		shuffle(modList);
		const node1 = modList[0];
		const node2 = modList[1];
		traverseShortestPath(modules, node1, node2, wires);
	}

	const topThreeUsed = Array.from(wires, ([key, used]) => ({ wire: key, used })).sort((a, b) => b.used - a.used).slice(0, 3);
	for (let i = 0; i < 3; i++) {
		const [m1, m2] = topThreeUsed[i].wire.split('-');
		modules.get(m1).delete(m2);
		modules.get(m2).delete(m1);
	}

	const groups = getDisconnectedGroups(modules);
	if (groups.length === 2) return groups[0].size * groups[1].size;
	else throw new Error('F');
}

console.log(findWiresToDC(example, 1000));
console.log(findWiresToDC(input, 1000));