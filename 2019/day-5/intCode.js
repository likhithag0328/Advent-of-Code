class Interpret {
  #code;
  constructor(data) {
    this.#code = [...data]; // Copy data to avoid modifying original input
  }

  #parseArgs(index, count) {
    const modes = Math.floor(this.#code[index] / 100);
    const args = [];

    for (let i = 0; i < count; i++) {
      args.push(
        Math.floor(modes / Math.pow(10, i)) % 10 === 1
          ? this.#code[++index]
          : this.#code[this.#code[++index]],
      );
    }

    return args;
  }

  #add(index) {
    const [addend, augend] = this.#parseArgs(index, 2);
    const resultIndex = this.#code[index + 3];
    this.#code[resultIndex] = addend + augend;
  }

  #multiply(index) {
    const [multiplicand, multiplier] = this.#parseArgs(index, 2);
    const resultIndex = this.#code[index + 3];
    this.#code[resultIndex] = multiplicand * multiplier;
  }

  #set(index, ID) {
    const resultIndex = this.#code[index + 1];
    this.#code[resultIndex] = ID;
  }

  #get(index) {
    const [value] = this.#parseArgs(index, 1);
    console.log(value);
  }

  #jumpIfTrue(index) {
    const [operand, nextIndex] = this.#parseArgs(index, 2);
    return operand !== 0 ? nextIndex : index + 3;
  }

  #jumpIfFalse(index) {
    const [operand, nextIndex] = this.#parseArgs(index, 2);
    return operand === 0 ? nextIndex : index + 3;
  }

  #isLessThan(index) {
    const [operand1, operand2] = this.#parseArgs(index, 2);
    const resultIndex = this.#code[index + 3];
    this.#code[resultIndex] = operand1 < operand2 ? 1 : 0;
  }

  #isEquals(index) {
    const [operand1, operand2] = this.#parseArgs(index, 2);
    const resultIndex = this.#code[index + 3];
    this.#code[resultIndex] = operand1 === operand2 ? 1 : 0;
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
          break;
        case 5:
          index = this.#jumpIfTrue(index);
          break;
        case 6:
          index = this.#jumpIfFalse(index);
          break;
        case 7:
          this.#isLessThan(index);
          index += 4;
          break;
        case 8:
          this.#isEquals(index);
          index += 4;
          break;
        default:
          throw new Error(`Unknown opcode: ${opCode} at position ${index}`);
      }
    }
  }
}

const main = (data) => {
  const intCode = new Interpret(data);
  return intCode.TEST(5);
};

const data = Deno.readTextFileSync("./day-5/input.txt")
  .trim()
  .split(",")
  .map(Number);

console.time();
main(data);
console.timeEnd();
