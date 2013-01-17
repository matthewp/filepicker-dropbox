var Dropbox = require('dropbox'),
    each = require('each'),
    Emitter = require('emitter'),
    FilePicker = require('filepicker'),
    inherit = require('inherit'),
    text = require('text');

/*
** Reference for slice.
*/
var slice = Array.prototype.slice;

/*
** Clear a DOM element
 */
function clear(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

/*
** Reference to createElement
 */
function cEl(type) {
  return document.createElement(type);
}

function DropboxPicker(apiKey) {
  FilePicker.call(this);

  this.client = new Dropbox.Client({ key: apiKey });
  this.client.authDriver(new Dropbox.Drivers.Redirect({ rememberUser: true }));
}

inherit(DropboxPicker, FilePicker);
Emitter(DropboxPicker.prototype);

DropboxPicker.prototype.show = function () {
  FilePicker.prototype.show.call(this);

  var self = this;
  this.client.authenticate(this.reportErrors(function () {
    self.load('');
  }));
};

DropboxPicker.prototype.load = function (dir) {
  clear(this.list);
  this.setCrumbs(dir);

  var self = this;
  this.client.readdir(dir, this.reportErrors(function (entries, dirStat, entryStats) {
    each(entryStats, function (entry) {
      var li = cEl('li'),
          anchor = cEl('a');

      anchor.href = '#';
      anchor.onclick = function (e) { e.preventDefault(); self.itemSelected(entry); };
      text(anchor, entry.name);

      li.appendChild(anchor);
      self.list.appendChild(li);
    });
  }));
};

DropboxPicker.prototype.itemSelected = function (entry) {
  if (entry.isFolder) {
    this.load(entry.path); return;
  }

  this.emit('fileselected', entry);
};

DropboxPicker.prototype.reportErrors = function (callback) {
  return function (err) {
    if (err) {
      // TODO show these errors.
      return;
    }

    callback.apply(null, slice.call(arguments, 1));
  };
};

module.exports = DropboxPicker;