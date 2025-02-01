const parse = (path) => ({
  direction: path[0],
  steps: parseInt(path.slice(1), 10),
});

const findPath = (wire) => {
  let [x, y] = [0, 0];
  const path = [];

  wire.forEach((point) => {
    const { direction, steps } = parse(point);
    for (let step = 0; step < steps; step++) {
      if (direction === "R") x += 1;
      if (direction === "L") x -= 1;
      if (direction === "U") y -= 1;
      if (direction === "D") y += 1;
      path.push([x, y]);
    }
  });

  return path;
};

const index = (array, subArray) =>
  array.findIndex((point) =>
    point[0] === subArray[0] && point[1] === subArray[1]
  );

const findSteps = (wire1Paths, wire2Paths, intersections) =>
  intersections.map((point) =>
    index(wire1Paths, point) + index(wire2Paths, point) + 2
  );

const allIntersections = (wire1Paths, wire2Paths) => {
  const pathWire1Set = new Set(wire1Paths.map((point) => point.join(",")));
  const pathWire2Set = new Set(wire2Paths.map((point) => point.join(",")));
  const intersections = Array.from(pathWire1Set.intersection(pathWire2Set)).map(
    (point) => point.split(",").map(Number),
  );

  return findSteps(
    wire1Paths,
    wire2Paths,
    intersections,
  );
};

function solve() {
  const [input1, input2] = Deno.readTextFileSync("./day-3/input.txt")
    .split("\n");
  const pathWire1 = findPath(input1.split(","));
  const pathWire2 = findPath(input2.split(","));
  return allIntersections(pathWire1, pathWire2).sort((a, b) => a - b)[0];
}

console.time();
console.log(solve());
console.timeEnd();
