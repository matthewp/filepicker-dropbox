var DirectoryEntry = require('./directory_entry'),
    Dropbox = require('dropbox'),
    Emitter = require('emitter'),
    map = require('map');

function DropboxEngine(apiKey) {
  this.client = new Dropbox.Client({ key: apiKey });
  this.client.authDriver(new Dropbox.Drivers.Redirect({ rememberUser: true }));
}

Emitter(DropboxEngine.prototype);

DropboxEngine.prototype.auth = function(callback) {
  this.client.authenticate(this.reportErrors(callback));
};

DropboxEngine.prototype.fetchDir = function (path, callback) {
  var self = this;
  this.client.readdir(dir, this.reportErrors(function (entries, dirStat, entryStats) {
    var results = map(entryStats, function(entry) {
      return new DirectoryEntry(entry);
    });
    callback(results);
  }));
};

DropboxEngine.prototype.reportErrors = function (callback) {
  return function (err) {
    if (err) {
      this.emit('error', err);
      return;
    }

    callback.apply(null, slice.call(arguments, 1));
  };
};

module.exports = DropboxEngine;
