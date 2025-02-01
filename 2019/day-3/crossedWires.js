const parse = (path) => {
  return { direction: path[0], steps: parseInt(path.slice(1), 10) };
};

const findPath = (wire) => {
  const centralPort = [0, 0];
  let [i, j] = centralPort;
  const path = [];

  wire.forEach((point) => {
    const { direction, steps } = parse(point);

    for (let step = 0; step < steps; step++) {
      if (direction === "R") j += 1;
      if (direction === "L") j -= 1;
      if (direction === "U") i -= 1;
      if (direction === "D") i += 1;
      path.push([i, j]);
    }
  });

  return path;
};

const exists = (set, subArray) => set.has(subArray.join(","));

const intersection = (pathWire1, wire2) => {
  const centralPort = [0, 0];
  let [i, j] = centralPort;
  const intersectingPoints = [];

  // Convert pathWire1 into a Set for O(1) lookups
  const pathWire1Set = new Set(pathWire1.map((point) => point.join(",")));

  wire2.forEach((point) => {
    const { direction, steps } = parse(point);

    for (let step = 0; step < steps; step++) {
      if (direction === "R") j += 1;
      if (direction === "L") j -= 1;
      if (direction === "U") i -= 1;
      if (direction === "D") i += 1;

      if (exists(pathWire1Set, [i, j])) {
        intersectingPoints.push([i, j]);
      }
    }
  });

  return intersectingPoints;
};

function solve() {
  const [input1, input2] = Deno.readTextFileSync("./day-3/input.txt")
    .split("\n");
  const wire1 = input1.split(",");
  const wire2 = input2.split(",");
  const pathWire1 = findPath(wire1);
  const intersectingPoints = intersection(pathWire1, wire2);
  const distances = intersectingPoints.map((arr) =>
    Math.abs(arr[0]) + Math.abs(arr[1])
  );
  console.log(distances.sort((a, b) => a - b)[0]);
}

console.time();
solve();
console.timeEnd();
