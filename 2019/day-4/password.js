const isValid = (password) => {
  const pswd = ("" + password).split("");
  let hasAdjacentSame = false;
  let isIncreasing = true;
  for (let index = 0; index < 6; index++) {
    if (
      pswd[index - 1] !== pswd[index] &&
      pswd[index] === pswd[index + 1] &&
      pswd[index] !== pswd[index + 2]
    ) {
      hasAdjacentSame = true;
    }
    if (pswd[index] > pswd[index + 1]) isIncreasing = false;
  }
  return hasAdjacentSame && isIncreasing;
};

const password = () => {
  const start = 347312;
  const last = 805915;
  const passwords = [];
  for (let pswdCandidate = start; pswdCandidate <= last; pswdCandidate++) {
    if (isValid(pswdCandidate)) {
      passwords.push(pswdCandidate);
    }
  }
  return passwords.length;
};

console.log(password());
