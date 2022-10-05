const Storage = artifacts.require("Storage");
const EightFit = artifacts.require("EightFit");

module.exports = async(deployer, network, accounts) => {
  await deployer.deploy(Storage, { from: accounts[0] });
  const storage = await Storage.deployed();

  await deployer.deploy(EightFit, { from: accounts[0] });
  const eightFit = await EightFit.deployed();

  // Set the Storage contract's address in EightFit
  await eightFit.setStorageAddress(storage.address);
};