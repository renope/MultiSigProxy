/* global describe it before ethers */

const { assert, expect } = require('chai')


describe('Multisig Executor test', async function () {

    let deployer, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10
    let members
    let quorum

    let exe
    let impl
    let proxy

    before(async function () {
        zero_address = "0x0000000000000000000000000000000000000000"
        const accounts = await ethers.getSigners();
        [deployer, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10] = accounts
    }) 

    it('should deploy contract without any Errors', async () => {
        members = [user1.address, user2.address, user3.address, user4.address, user5.address]
        quorum = 3
    
        let Executor = await ethers.getContractFactory("Executor");
        exe = await Executor.deploy(members, quorum);
        console.log("Executor address : ", exe.address)

        impl = await ethers.getContractAt("Implementation", await exe.implementation())
        console.log("Implementation address : ", impl.address)

        proxy = await ethers.getContractAt("Implementation", exe.address)
        console.log("proxy assembled")
    })
    
    it('should accept members vote', async () => {
        assert.equal(
            await exe.userExists(user1.address),
            true
        )
        await proxy.connect(user1).increment()
    })
    
    it('under quorum votes should not call the implementation', async () => {
        assert.equal(
            await impl.counter(),
            0
        )
        await proxy.connect(user2).increment()
        assert.equal(
            await impl.counter(),
            0
        )
    })

    it('over quorum votes should call the implementation', async () => {
        assert.equal(
            await impl.counter(),
            0
        )
        await proxy.connect(user3).increment()
        assert.equal(
            await impl.counter(),
            1
        )
    })

    it('members can vote on same call again, after the call executed', async () => {
        await proxy.connect(user1).increment()
    })

    it('but cannot vote more than one time in one call execution', async () => {
        await expect(
            proxy.connect(user1).increment()
        ).to.be.revertedWith("Executor : You have voted in this call before")
    })
    
    it('should revert non-member addresses', async () => {
        await expect(
            proxy.connect(user6).increment()
        ).to.be.revertedWith("Executor: You cannot vote in this Execution")
    })
})