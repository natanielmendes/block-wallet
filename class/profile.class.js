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
  save = decipher.update(encryptedSave,'hex','utf8') + decipher.final('utf8');
  return save;
}

// Return an encrypted save of the profile
Profile.prototype.getEncryptedSave = function (password) {
  var save = JSON.stringify(this);
  var cipher = crypto.createCipher(encryption, password);
  return cipher.update(save,'utf8','hex') + cipher.final('hex');
};

module.exports = Profile;
