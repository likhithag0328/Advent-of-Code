const asteroidIndices = (map) => {
  const indices = [];
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "#") indices.push([i, j]);
    }
  }
  return indices;
};

const asteriodsDetected = (asteroids) => {
  const temp = [...asteroids];
  const visibility = new Map();
  for (const asteroid of asteroids) {
    const [y, x] = temp.shift();
    const angles = temp.map(([i, j]) => calculateAngle(y, x, i, j));
    visibility.set(asteroid, new Set(angles).size);
    temp.push(asteroid);
  }

  return visibility;
};

const main = (map) => {
  const asteroids = asteroidIndices(map);
  const visibility = asteriodsDetected(asteroids);
  return [...visibility.entries()].sort((a, b) => b[1] - a[1])[0];
};

const distance = (y1, x1, y2, x2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

const calculateAngle = (y1, x1, y2, x2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;

  let angle = Math.atan2(dy, dx);
  angle = angle * 180 / Math.PI;

  if (angle < 0) {
    angle += 360;
  }

  return (angle + 90) % 360;
};

const allAngles = (monitor, map) => {
  const [y, x] = monitor;

  // Filter out the monitor's own position
  const filteredArr = map.filter((subArray) =>
    !(subArray[0] === y && subArray[1] === x)
  );

  const visibility = filteredArr.map(([i, j]) => {
    const angle = calculateAngle(y, x, i, j);
    const dist = distance(y, x, i, j);
    return [[i, j], angle, dist];
  });

  const ordered = groupBy(visibility);
  vaporize(ordered, monitor);
};

const groupBy = (arr) => {
  const map = new Map();

  arr.forEach(([coords, angle, dist]) => {
    const value = map.get(angle) || [];
    value.push([coords, dist]);
    map.set(angle, value);
  });

  // Sort each group by distance (ascending)
  map.forEach((value, angle) => {
    value.sort((a, b) => a[1] - b[1]); // Sort by distance
  });

  // Sort the entire map by angle
  const sortedMap = new Map([...map.entries()].sort((a, b) => a[0] - b[0]));
  return sortedMap;
};

const deleteIfEmpty = (arr) => arr.filter((item) => item[1].length === 0);

const vaporize = (map, monitor) => {
  const result = [];
  let arr = [...map.entries()];
  let vaporized = 0;

  while (vaporized < 200) {
    arr.forEach(([angle, coordinates]) => {
      if (coordinates.length > 0) {
        // Vaporize the closest asteroid (first in the sorted list)
        const asteroid = coordinates.shift();
        result.push(asteroid);
        vaporized++;

        // If we've reached the 200th asteroid, output its position
        if (vaporized === 200) {
          const [y, x] = asteroid[0];
          console.log(`200th asteroid: ${x * 100 + y}`); // Output as requested
        }
      }
    });

    // Clean up any empty angle groups
    arr = deleteIfEmpty(arr);
  }

  console.log(result);
};
const map = Deno.readTextFileSync("./day-10/input.txt").split("\n").map((l) =>
  l.split("")
);

const [monitor, value] = main(map);
console.log(monitor, value);
const allAsteroids = allAngles(monitor, asteroidIndices(map));
