import { PriorityQueue, MaxPriorityQueue } from "@datastructures-js/priority-queue";

const example =
	`2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;

function findRouteWithLowestHeatLoss(rawMap) {
	const map = rawMap.split('\n').map(l => l.split(''));

	const frontier = new MaxPriorityQueue();
	frontier.push(5);
	frontier.push(2);
	frontier.push(10);
	frontier.push(1);

	console.log(frontier.pop());
	console.log(frontier.pop());
	console.log(frontier.pop());
	console.log(frontier.pop());

	console.log();
}

findRouteWithLowestHeatLoss(example);