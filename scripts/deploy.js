const { ethers } = require("hardhat");
const { verify } = require("./utils/verifier.js")

  async function deployExecutor() {
  const delay = ms => new Promise(res => setTimeout(res, ms));

  const members = ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"]
  const quorum = 2

    // deploy
    const Executor = await ethers.getContractFactory("Executor");
    const executor = await Executor.deploy(members, quorum);
    await executor.deployed();
    console.log("Executor Contract Address:", executor.address); 

    const implAddr = await executor.implementation()
    console.log("Implementation Address:", implAddr)

    // verify executor
    await delay(5000)
    await verify(executor.address, [members, quorum])

    // verify implementation
    await delay(5000)
    await verify(implAddr, [executor.address])
  }
    
  deployExecutor();