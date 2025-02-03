class IntcodeComputer {
  #relativeBase;
  #pointer;
  #inputs;
  constructor(program) {
    this.memory = [...program];
    this.#relativeBase = 0;
    this.#pointer = 0;
    this.#inputs = [];
    this.outputs = [];
  }

  run(input = null) {
    if (input !== null) this.#inputs.push(input);

    while (true) {
      const opcode = this.memory[this.#pointer] % 100;
      const modes = this.#getModes(this.memory[this.#pointer]);

      switch (opcode) {
        case 1:
          this.add(modes);
          break;
        case 2:
          this.multiply(modes);
          break;
        case 3:
          this.input(modes);
          break;
        case 4:
          if (!this.output(modes)) return;
          break;
        case 5:
          this.jumpIfTrue(modes);
          break;
        case 6:
          this.jumpIfFalse(modes);
          break;
        case 7:
          this.lessThan(modes);
          break;
        case 8:
          this.equals(modes);
          break;
        case 9:
          this.adjustRelativeBase(modes);
          break;
        case 99:
          return;
        default:
          throw new Error(`Unknown opcode: ${opcode}`);
      }
    }
  }

  #getModes(instruction) {
    const modes = [];
    instruction = Math.floor(instruction / 100);
    while (instruction > 0) {
      modes.push(instruction % 10);
      instruction = Math.floor(instruction / 10);
    }
    return modes;
  }

  #getValue(position, mode) {
    switch (mode) {
      case 0:
        return this.memory[this.memory[position]] || 0;
      case 1:
        return this.memory[position] || 0;
      case 2:
        return this.memory[this.memory[position] + this.#relativeBase] || 0;
      default:
        throw new Error(`Unknown parameter mode: ${mode}`);
    }
  }

  setValue(position, mode, value) {
    switch (mode) {
      case 0:
        this.memory[this.memory[position]] = value;
        break;
      case 2:
        this.memory[this.memory[position] + this.#relativeBase] = value;
        break;
      default:
        throw new Error(`Invalid mode for writing: ${mode}`);
    }
  }

  parseArgs(numParams, modes) {
    const args = [];
    for (let i = 0; i < numParams; i++) {
      const mode = modes[i] || 0;
      args.push(this.#getValue(this.#pointer + i + 1, mode));
    }
    return args;
  }

  add(modes) {
    const [param1, param2] = this.parseArgs(2, modes);
    this.setValue(this.#pointer + 3, modes[2] || 0, param1 + param2);
    this.#pointer += 4;
  }

  multiply(modes) {
    const [param1, param2] = this.parseArgs(2, modes);
    this.setValue(this.#pointer + 3, modes[2] || 0, param1 * param2);
    this.#pointer += 4;
  }

  input(modes) {
    if (this.#inputs.length === 0) {
      throw new Error("Input required, but none provided");
    }
    const inputValue = this.#inputs.shift();
    this.setValue(this.#pointer + 1, modes[0] || 0, inputValue);
    this.#pointer += 2;
  }

  output(modes) {
    const [outputValue] = this.parseArgs(1, modes);
    this.outputs.push(outputValue);
    this.#pointer += 2;

    return this.outputs.length === 1;
  }

  jumpIfTrue(modes) {
    const [param1, param2] = this.parseArgs(2, modes);
    if (param1 !== 0) {
      this.#pointer = param2;
    } else {
      this.#pointer += 3;
    }
  }

  jumpIfFalse(modes) {
    const [param1, param2] = this.parseArgs(2, modes);
    if (param1 === 0) {
      this.#pointer = param2;
    } else {
      this.#pointer += 3;
    }
  }

  lessThan(modes) {
    const [param1, param2] = this.parseArgs(2, modes);
    this.setValue(this.#pointer + 3, modes[2] || 0, param1 < param2 ? 1 : 0);
    this.#pointer += 4;
  }

  equals(modes) {
    const [param1, param2] = this.parseArgs(2, modes);
    this.setValue(this.#pointer + 3, modes[2] || 0, param1 === param2 ? 1 : 0);
    this.#pointer += 4;
  }

  adjustRelativeBase(modes) {
    const [param1] = this.parseArgs(1, modes);
    this.#relativeBase += param1;
    this.#pointer += 2;
  }
}

const main = (data) => {
  const intCode = new IntcodeComputer(data);
  intCode.run(2);
  return intCode.outputs;
};

const data = Deno.readTextFileSync("./day-9/input.txt")
  .trim()
  .split(",")
  .map(Number);

console.time();
console.log(main(data));
console.timeEnd();
