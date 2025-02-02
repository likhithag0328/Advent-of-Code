class Interpret {
  #code;
  constructor(data) {
    this.#code = [...data];
  }

  #parseArgs(index, count) {
    const modes = Math.floor(this.#code[index] / 100);
    const args = [];

    for (let i = 0; i < count; i++) {
      const mode = Math.floor(modes / Math.pow(10, i)) % 10;
      const value = mode === 1
        ? this.#code[++index]
        : this.#code[this.#code[++index]];
      args.push(value);
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

  #set(index, input) {
    const resultIndex = this.#code[index + 1];
    this.#code[resultIndex] = input;
  }

  #get(index) {
    const [value] = this.#parseArgs(index, 1);
    return value;
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

  TEST(phaseSetting, ID) {
    let index = 0;
    let input = phaseSetting;
    let output = 0;

    while (this.#code[index] !== 99 && index < this.#code.length) {
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
          this.#set(index, input);
          index += 2;
          input = ID;
          break;
        case 4:
          output = this.#get(index);
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
          return output;
      }
    }
    return output;
  }

  static generateAllPermutations(n) {
    const arr = [...Array(n).keys()];
    // const arr = Array.from({ length: n }, (_, i) => i + 5);

    const permute = (arr) => {
      const result = [];

      if (arr.length === 1) {
        return [arr];
      }

      for (let i = 0; i < arr.length; i++) {
        const currentNum = arr[i];
        const remainingNums = arr.slice(0, i).concat(arr.slice(i + 1));

        const remainingPermutations = permute(remainingNums);

        for (const perm of remainingPermutations) {
          result.push([currentNum, ...perm]);
        }
      }

      return result;
    };

    return permute(arr);
  }

  allAmplifiers() {
    const allPhases = Interpret.generateAllPermutations(5);
    const allThrusters = [];

    allPhases.forEach((phaseSetting) => {
      const newInstance = new Interpret([...this.#code]);
      let input = 0;
      for (const phase of phaseSetting) {
        input = newInstance.TEST(phase, input);
      }
      allThrusters.push(input);
    });

    console.log(allThrusters.sort((a, b) => a - b).at(-1));
  }
}

const main = (data) => {
  const intCode = new Interpret(data);
  return intCode.allAmplifiers();
};

const data = Deno.readTextFileSync("./day-7/input.txt")
  .trim()
  .split(",")
  .map(Number);

console.time();
main(data);
console.timeEnd();

//`9,8,7,6,5`
//3,26,1001,26,-4,26,3,27,1002,27,2 ,27,1 ,27,26,27,4,27,1001,28,-1,28,1005,28,6 ,4 ,14,-2 ,5
//0,1 ,2   ,3 ,4 ,5 ,6,7 ,8   , 9,10,11,13,14,15,16,17,18,19 ,20,21,22,23  ,24,25,26,27,28,29
//5
