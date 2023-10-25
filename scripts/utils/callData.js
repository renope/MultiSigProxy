async function callData(contract, functionName, ...arguments) {
  const functionFragment = contract.interface.getFunction(functionName);
  const callData = contract.interface.encodeFunctionData(
    functionFragment,
    arguments
  );

  console.log(
    "function call data: ",
    functionName,
    "(",
    ...arguments,
    "): ",
    callData
  );

  return callData;
}

module.exports = {
  callData,
};
