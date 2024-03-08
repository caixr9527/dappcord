const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dappcord", function () {
    let dappcord, deployer, user

    const NAME = "Dappcord";
    const SYMBOL = "DC";
    beforeEach(async () => { 
        [deployer, user] = await ethers.getSigners()

        const Dappcord = await ethers.getContractFactory("Dappcord")
        dappcord = await Dappcord.deploy(NAME, SYMBOL)

        const transaction = await dappcord.connect(deployer).createChannel("general", tokens(1))
        await transaction.wait()
    })

    describe("Deployment", async () => {
        it("Sets the name", async() => {
            
            let result = await dappcord.name()
            expect(result).to.be.equal(NAME)
        })

        it("Sets the symbol", async() => {
        
            let result = await dappcord.symbol()
            expect(result).to.be.equal(SYMBOL)
        })

        it("Sets the onwer", async() => {
        
            let result = await dappcord.owner()
            expect(result).to.be.equal(deployer.address)
        })
    })

    describe("Crateing Channels", () => {
        it("Returns total channels", async () => {
            const result = await dappcord.totalChannels()
            expect(result).to.be.equal(1)
        })

        it("Returns channel attributes", async () => {
            const channel = await dappcord.getChannel(1)
            expect(channel.id).to.be.equal(1)
            expect(channel.name).to.be.equal("general")
            expect(channel.cost).to.be.equal(tokens(1))
        })
    })

    describe("Joining Channels", () => {
        const ID = 1;
        const AMOUNT = ethers.utils.parseUnits("1", 'ether')

        this.beforeEach(async () => {
            const transaction = await dappcord.connect(user).mint(ID, { value: AMOUNT })
            await transaction.wait()
        })
        it('Joins the user', async () => {
            const result = await dappcord.hasJoined(ID, user.address)
            expect(result).to.be.equal(true)
        })

        it ('Increases total supply', async () => {
            const result = await dappcord.totalSupply()
            expect(result).to.be.equal(ID)
        })

        it('Updates the contract balance', async () => {
            const result = await ethers.provider.getBalance(dappcord.address)
            expect(result).to.be.equal(AMOUNT)
        })
    
    })
})
