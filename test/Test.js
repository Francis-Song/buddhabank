const { assert } = require("chai");

const BuddhaToken = artifacts.require("BuddhaToken");
const BuddhaBank = artifacts.require("BuddhaBank");

contract("BuddhaBank", ([deployer, user]) => {
    let buddhaBank, buddhaToken;

    beforeEach(async() => {
        buddhaToken = await BuddhaToken.new();
        buddhaBank = await BuddhaBank.new(buddhaToken.address);
        await buddhaToken.changeMinter(buddhaBank.address, {from: deployer});
    })

    describe("Token deployed correctly", () => {
        it("name should be correct", async() => {
            assert.strictEqual(await buddhaToken.name(), "BuddhaToken");
        })
        it("symbol should be correct", async() => {
            assert.strictEqual(await buddhaToken.symbol(), "BUD");
        })
        it("Minter changed to correct adddress", async() => {
            assert.strictEqual(await buddhaToken.minter(), buddhaBank.address);
        })
    })

    describe("Bank deposit", () => {
        beforeEach(async() => {
            await buddhaBank.deposit({value: 10**18, from: user})
        })
        it("ether balance should increase", async() => {
            assert.strictEqual(Number(await buddhaBank.etherBalanceOf(user)), 10**18)
        })
        it("deposit time greater than 0", async() => {
            expect(Number(await buddhaBank.depositStart(user))).to.be.above(0)
        })
        it("deposited is true", async() => {
            assert.strictEqual(await buddhaBank.isDeposited(user), true)
        })
    })

    describe("Bank withdraw", () => {
        beforeEach(async() => {
            await buddhaBank.deposit({value: 10**18, from: user})

            await setTimeout(() => {
                2000
            })

            balance = await web3.eth.getBalance(user)
            await buddhaBank.withdraw({from: user})
        })
        it("user ether balance decrease", async() => {
            assert.strictEqual(Number(await buddhaBank.etherBalanceOf(user)), 0);
        })
        it("ether transfer back to user", async() => {
            expect(Number(await web3.eth.getBalance(user))).to.be.above(Number(balance))
        })
        it("user received interest", async() => {
            expect(Number(await buddhaToken.balanceOf(user))).to.be.above(0)
        })

    })
})