var bitcoinjs = require('bitcoinjs-lib');
var crypto = require('crypto');

var encryption = 'aes-256-ctr';

// The profile instance variables
function Profile() {
  this.username = null;
  this.wif = null;
  this.address = null;
}

// Create a new profile
Profile.prototype.newProfile = function(username) {
  this.username = username;
  var keyPair = bitcoinjs.ECPair.makeRandom();
  this.wif = keyPair.toWIF();
  this.address = keyPair.getAddress();
}

// Create a profile from an encrypted save
Profile.prototype.profileFromSave = function(encryptedSave, password) {
  var decipher = crypto.createDecipher(encryption, password);
  var save = JSON.parse(decipher.update(encryptedSave,'hex','utf8') + decipher.final('utf8'));
  this.profileFromProperties(save['username'], save['wif']);
}

// Create a profile from properties
Profile.prototype.profileFromProperties = function(username, wif) {
  this.username = username;
  this.wif = wif;
  var keypair = bitcoinjs.ECPair.fromWIF(wif);
  this.address = keypair.getAddress();
}

// Return an encrypted save of the profile
Profile.prototype.getEncryptedSave = function (password) {
  var save = JSON.stringify(this);
  var cipher = crypto.createCipher(encryption, password);
  return cipher.update(save,'utf8','hex') + cipher.final('hex');
};

module.exports = Profile;
