const indirectOrbits = (orbitMap, object) => {
  let count = 0;
  while (object in orbitMap) {
    object = orbitMap[object];
    count++;
  }
  return count;
};

const totalOrbits = (orbits) => {
  const orbitMap = {};

  for (const [center, orbit] of orbits) {
    orbitMap[orbit] = center;
  }

  const indirect = indirectOrbits.bind(null, orbitMap);

  return Object.keys(orbitMap).reduce(
    (total, obj) => total + indirect(obj),
    0,
  );
};

const path = (start, orbits) => {
  let destination = start;
  const paths = [];
  while (destination !== "COM") {
    paths.push(destination);
    destination = orbits[destination];
  }
  return paths;
};

const minimalPath = (myPath, santaPath) => {
  const firstIntersection = (myPath, santaPath) => {
    return myPath.find((point) => santaPath.includes(point));
  };

  const commonParent = firstIntersection(myPath, santaPath);

  const mySteps = myPath.slice(1, myPath.indexOf(commonParent));
  const santaSteps = santaPath.slice(1, santaPath.indexOf(commonParent));
  return mySteps.length + santaSteps.length;
};

const minimumTransfer = (orbits) => {
  const orbitMap = {};

  for (const [center, orbit] of orbits) {
    orbitMap[orbit] = center;
  }

  const myPath = path("YOU", orbitMap);
  const santaPath = path("SAN", orbitMap);
  return minimalPath(myPath, santaPath);
};

const orbits = Deno.readTextFileSync("./day-6/input.txt")
  .trim()
  .split("\n")
  .map((o) => o.split(")"));

console.log(totalOrbits(orbits));
console.log(minimumTransfer(orbits));
