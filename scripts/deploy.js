const { ethers } = require("hardhat");
const { verify } = require("./utils/verifier.js")

  async function deployExecutor() {
  const delay = ms => new Promise(res => setTimeout(res, ms));

  const members = ["0x253820F7dEb8c9489735BF35232752e9EBE5c855", "0xda55BF0B8Ba3Da33c26A50ACB48A299F0C0a6DFF", "0xc92a7Cf349dD3897c23BbB2BF8150A30d9EbaD58"]
  const quorum = 2

  // let MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
  // multiSig = await MultiSigWallet.deploy(members, quorum);
  // console.log("MultiSigWallet address : ", multiSig.address)

  //   // verify executor
  //   await delay(5000)
    await verify("0x1E9D6d37797e667E35401c80Bbc6b0F954A8BeCB", [members, quorum])
  }
    
  deployExecutor();