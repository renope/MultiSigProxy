/* global describe it before ethers */

const { assert, expect } = require('chai')
let { callData } = require('../scripts/utils/callData.js')


describe('Multisig MultiSigWallet test', async function () {

    let deployer, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10
    let members
    let quorum

    let multiSig
    let impl
    let txData

    before(async function () {
        zero_address = "0x0000000000000000000000000000000000000000"
        const accounts = await ethers.getSigners();
        [deployer, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10] = accounts
    }) 

    it('should deploy contract without any Errors', async () => {
        members = [user1.address, user2.address, user3.address, user4.address, user5.address]
        quorum = 3
    
        let MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
        multiSig = await MultiSigWallet.deploy(members, quorum);
        console.log("MultiSigWallet address : ", multiSig.address)

        let Implementation = await ethers.getContractFactory("Implementation");
        impl = await Implementation.deploy(multiSig.address)
        console.log("Implementation address : ", impl.address)
    })
    
    it('get owners', async () => {
        console.log("owners : ", await multiSig.getOwners())
    })

    it('get tx data', async () => {
        txData = callData(impl, "increment")
        console.log("tx data : ", txData)
    })
    
    it('should submit transaction', async () => {
        
        await multiSig.connect(user1).submitTransaction(impl.address, 0, txData)
        // await multiSig.connect(user2).submitTransaction(impl.address, 0, txData)
        // await multiSig.connect(user3).submitTransaction(impl.address, 0, txData)
        console.log("transactions count : ", await multiSig.getTransactionCount(true, false));
    })

    it('should accept members vote', async () => {
        await multiSig.connect(user2).confirmTransaction(0)
        // console.log("tx 0 confirmitions: ", await multiSig.getConfirmationCount(0))

        console.log("implementation counter : ", await impl.counter())
        await multiSig.connect(user3).confirmTransaction(0)
        console.log("implementation counter : ", await impl.counter())


        await multiSig.connect(user4).confirmTransaction(0)
        // console.log("tx 0 confirmitions: ", await multiSig.getConfirmationCount(0))
        // console.log("transactions count : ", await multiSig.getTransactionCount(false, true));
    })
    
    it('should execute transaction', async () => {
        // console.log("tx 0 confirmitions: ", await multiSig.getConfirmationCount(0))
        // console.log("tx 0 isConfirmed: ", await multiSig.isConfirmed(0))
        // console.log("implementation counter : ", await impl.counter())
        // await multiSig.connect(user3).executeTransaction(0)
    //     await multiSig.connect(user9).executeTransaction(0)
    //     // await multiSig.connect(user9).executeTransaction(0)
    //     // await multiSig.connect(user9).executeTransaction(0)
        // console.log("implementation counter : ", await impl.counter())
        // console.log("transactions count : ", await multiSig.getTransactionCount(false, true));
    })
    
    // it('under quorum votes should not call the implementation', async () => {
    //     assert.equal(
    //         await impl.counter(),
    //         0
    //     )
    //     await proxy.connect(user2).increment()
    //     assert.equal(
    //         await impl.counter(),
    //         0
    //     )
    // })

    // it('over quorum votes should call the implementation', async () => {
    //     assert.equal(
    //         await impl.counter(),
    //         0
    //     )
    //     await proxy.connect(user3).increment()
    //     assert.equal(
    //         await impl.counter(),
    //         1
    //     )
    // })

    // it('members can vote on same call again, after the call executed', async () => {
    //     await proxy.connect(user1).increment()
    // })

    // it('but cannot vote more than one time in one call execution', async () => {
    //     await expect(
    //         proxy.connect(user1).increment()
    //     ).to.be.revertedWith("MultiSigWallet : You have voted in this call before")
    // })
    
    // it('should revert non-member addresses', async () => {
    //     await expect(
    //         proxy.connect(user6).increment()
    //     ).to.be.revertedWith("MultiSigWallet: You cannot vote in this Execution")
    // })
})