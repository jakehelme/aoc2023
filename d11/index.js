const example =
    `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

const input = await Bun.file('./d11/input.txt').text();

function sumOfGalaxyDistances(rawMap, expansionFactor) {
    const map = rawMap.split('\n').map(line => line.split(''));

    const emptyRows = map.reduce((arr, row, i) => {
        if (!row.some(x => x !== '.')) arr.push(i);
        return arr;
    }, []);

    const emptyCols = map[0].map((_, colIndex) => map.map(row => row[colIndex])).reduce((arr, col, i) => {
        if (!col.some(x => x !== '.')) arr.push(i);
        return arr;
    }, []);

    const galaxyPositions = [];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            if (map[y][x] === '#') galaxyPositions.push([y, x]);
        }
    }

    const galaxyPairs = pairs(galaxyPositions);
    let tot = 0;
    for (let pair of galaxyPairs) {

        const yMin = Math.min(pair[0][0], pair[1][0]);
        const yMax = Math.max(pair[0][0], pair[1][0]);
        const xMin = Math.min(pair[0][1], pair[1][1]);
        const xMax = Math.max(pair[0][1], pair[1][1]);

        const rowsInserted = emptyRows.filter(index => index > yMin && index < yMax).length;
        const colsInserted = emptyCols.filter(index => index > xMin && index < xMax).length;

        const yDist = yMax - yMin;
        const xDist = xMax - xMin;
        const expandedRowsToInsert = rowsInserted ? rowsInserted * (expansionFactor === 1 ? 1 : expansionFactor - 1) : 0;
        const expandedColsToInsert = colsInserted ? colsInserted * (expansionFactor === 1 ? 1 : expansionFactor - 1) : 0;

        const dist = yDist + xDist + expandedRowsToInsert + expandedColsToInsert;
        tot += dist;
    }
    return tot;
}

const pairs = (arr) => arr.map((v, i) => arr.slice(i + 1).map(w => [v, w])).flat();

console.log(sumOfGalaxyDistances(example, 1));
console.log(sumOfGalaxyDistances(input, 1));

console.log(sumOfGalaxyDistances(example, 10));
console.log(sumOfGalaxyDistances(example, 100));
console.log(sumOfGalaxyDistances(input, 1000000));