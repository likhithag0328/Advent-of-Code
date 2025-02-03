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

const findLayer = (layers) => {
  const zeroes = layers.map(count(0));
  const fewestZeroes = indexOfMin(zeroes);
  const layer = layers[fewestZeroes];
  return count(1)(layer) * count(2)(layer);
};

const decode = (layers) => {
  const final = layers.at(-1);
  for (let i = layers.length - 2; i >= 0; i--) {
    const layer = layers[i];
    for (let i = 0; i <= 150; i++) {
      if (layer[i] !== 2) final[i] = layer[i];
    }
  }
  return final;
};
const format = (arr, width, height) => {
  let rectangleString = "";

  for (let i = 0; i < height; i++) {
    const row = arr.slice(i * width, (i + 1) * width).join("");
    rectangleString += row + (i === height - 1 ? "" : "\n");
  }

  return rectangleString;
};

const main = () => {
  const width = 25;
  const height = 6;
  const data = Deno.readTextFileSync("./day-8/input.txt").trim().split("").map(
    Number,
  );
  const layerLength = width * height;
  const layers = Array.from({ length: 100 }, (_, index) => index).map(
    allLayers(data, layerLength),
  );
  console.log(findLayer(layers));
  console.log(
    format(decode(layers), width, height).replaceAll(1, "|").replaceAll(0, " "),
  );
};
main();
