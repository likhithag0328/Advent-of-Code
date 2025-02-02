class Interpret {
  #code;
  #temp;
  constructor(data) {
    this.#code = data;
  }

  #parseArgs(index) {
    const modes = parseInt(this.#code[index] / 100);
    const operand1 = modes % 10 === 1
      ? this.#code[++index]
      : this.#code[this.#code[++index]];
    const operand2 = parseInt(modes / 10) === 1
      ? this.#code[++index]
      : this.#code[this.#code[++index]];
    return [operand1, operand2, this.#code[++index]];
  }
  // #parseArgs(index) {
  //   return [
  //     this.#code[this.#code[++index]],
  //     this.#code[this.#code[++index]],
  //     this.#code[++index],
  //   ];
  // }

  #add(index) {
    const [addend, augend, resultIndex] = this.#parseArgs(index);
    this.#code[resultIndex] = addend + augend;
  }

  #multiply(index) {
    const [multiplicand, multiplier, resultIndex] = this.#parseArgs(index);
    this.#code[resultIndex] = multiplicand * multiplier;
  }

  #set(index, ID) {
    this.#code[this.#code[++index]] = ID;
  }

  #get(index) {
    console.log(this.#code[this.#code[++index]]);
  }

  TEST(ID) {
    let index = 0;

    while (this.#code[index] !== 99) {
      const opCode = this.#code[index] % 100;
      switch (opCode) {
        case 1:
          this.#add(index);
          index += 4;
          break;
        case 2:
          this.#multiply(index);
          index += 4;
          break;
        case 3:
          this.#set(index, ID);
          index += 2;
          break;
        case 4:
          this.#get(index);
          index += 2;
      }
    }
  }
}
const main = (data) => {
  const intCode = new Interpret(data);
  return intCode.TEST(1);
};

const data = Deno.readTextFileSync("./day-5/input.txt").split(",").map(Number);
main(data);
