var DirectoryEntry = require('./directory_entry'),
    Dropbox = require('dropbox'),
    Emitter = require('emitter'),
    map = require('map');

var slice = Array.prototype.slice;

function DropboxEngine(apiKey) {
  this.name = 'Dropbox';
  this.client = new Dropbox.Client({ key: apiKey });
  this.client.authDriver(new Dropbox.Drivers.Redirect({ rememberUser: true }));
}

Emitter(DropboxEngine.prototype);

DropboxEngine.prototype.auth = function(callback) {
  this.client.authenticate(this.reportErrors(callback));
};

DropboxEngine.prototype.fetchDir = function (path, callback) {
  var self = this;
  this.auth(function() {
    self.client.readdir(path, self.reportErrors(function (entries, dirStat, entryStats) {
      var results = map(entryStats, function(entry) {
        return new DirectoryEntry(entry, self);
      });
      callback(results);
    }));
  });
};

DropboxEngine.prototype.fetchFile = function(path, callback) {
  var self = this;
  this.auth(function() {
    self.client.onXhr.addListener(function(dbXhr) {
      dbXhr.xhr.onprogress = function(e) {
        var loaded = e.loaded, total = e.total;
        self.emit('progress', {
          loaded: loaded, total: total
        });
      };
    });

    self.client.readFile(path, {arrayBuffer: true},  self.reportErrors(function(data) {
     callback(data);
    }));
  });
}

DropboxEngine.prototype.reportErrors = function (callback) {
  var self = this;
  return function (err) {
    if (err) {
      self.emit('error', err);
      return;
    }

    callback.apply(null, slice.call(arguments, 1));
  };
};

module.exports = DropboxEngine;
