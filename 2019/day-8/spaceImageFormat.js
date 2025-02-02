const allLayers = (data, layerLength) => (layerNo) => {
  const end = (layerNo + 1) * layerLength;
  const start = end - layerLength;
  return data.slice(start, end);
};

const count = (num) => (arr) => {
  return arr.filter((item) => item === num).length;
};

const indexOfMin = (arr) => {
  const minValue = Math.min(...arr);
  return arr.indexOf(minValue);
};

const findLayer = (data, layerLength) => {
  const layers = Array.from({ length: 100 }, (_, index) => index).map(
    allLayers(data, layerLength),
  );
  const zeroes = layers.map(count(0));
  const fewestZeroes = indexOfMin(zeroes);
  const layer = layers[fewestZeroes];
  return count(1)(layer) * count(2)(layer);
};

const main = () => {
  const width = 25;
  const height = 6;
  const data = Deno.readTextFileSync("./day-8/input.txt").trim().split("").map(
    Number,
  );
  const layerLength = width * height;
  console.log(findLayer(data, layerLength));
};
main();
