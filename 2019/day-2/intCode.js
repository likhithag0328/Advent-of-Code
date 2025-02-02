class Interpret {
  #code;
  constructor(data) {
    this.#code = data;
  }

  #parseArgs(index) {
    return [
      this.#code[this.#code[++index]],
      this.#code[this.#code[++index]],
      this.#code[++index],
    ];
  }

  #add(index) {
    const [addend, augend, resultIndex] = this.#parseArgs(index);
    this.#code[resultIndex] = addend + augend;
  }

  #multiply(index) {
    const [multiplicand, multiplier, resultIndex] = this.#parseArgs(index);
    this.#code[resultIndex] = multiplicand * multiplier;
  }

  execute(value1, value2) {
    let index = 0;
    this.#code[1] = value1;
    this.#code[2] = value2;

    while (this.#code[index] !== 99) {
      const opCode = this.#code[index];
      if (opCode === 1) this.#add(index);
      if (opCode === 2) this.#multiply(index);
      index += 4;
    }

    return this.#code[0];
  }

  deCode(result) {
    const actual = [...this.#code];
    let noun = 0;
    let verb = 0;

    while (noun < 100) {
      if (this.execute(noun, verb) === result) return 100 * noun + verb;
      this.#code = [...actual];
      if (verb > 99) {
        noun++;
        verb = 0;
      }
      verb++;
    }
  }
}
const main = (data) => {
  const intCode = new Interpret(data);
  return intCode.execute(12, 2);
  // return intCode.deCode(19690720);
};

const data = Deno.readTextFileSync("./day-2/input.txt").split(",").map(Number);
console.log(main(data));
