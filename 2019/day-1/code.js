import { masses } from "./input.js";

const fuelRequired = (mass) => {
  const fuel = Math.floor(mass / 3) - 2;
  if (fuel <= 0) return 0;
  return fuel + fuelRequired(fuel);
};

const add = (addend, augend) => addend + augend;

const totalFuel = (masses) => masses.map(fuelRequired).reduce(add, 0);

console.log(totalFuel(masses));
