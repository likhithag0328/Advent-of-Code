import { masses } from "./input.js";

const fuelRequired = (mass) => Math.floor(mass / 3) - 2;

const add = (addend, augend) => addend + augend;

const totalFuel = (masses) => masses.map(fuelRequired).reduce(add, 0);

console.log(totalFuel(masses));
