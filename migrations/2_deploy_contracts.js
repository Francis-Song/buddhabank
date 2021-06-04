const BuddhaToken = artifacts.require("BuddhaToken");
const BuddhaBank = artifacts.require("BuddhaBank");

module.exports = async function (deployer) {
  await deployer.deploy(BuddhaToken);
  const buddhaToken = await BuddhaToken.deployed();
  
  await deployer.deploy(BuddhaBank, buddhaToken.address);
  const buddhaBank = await BuddhaBank.deployed();

  await buddhaToken.changeMinter(buddhaBank.address);
};
