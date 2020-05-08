const Memes = artifacts.require("Meme");

module.exports = function(deployer) {
  deployer.deploy(Memes);
};
