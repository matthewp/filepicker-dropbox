function DirectoryEntry(entry, engine) {
  this.name = entry.name;
  this.path = entry.path;
  this.engine = engine;
  this.type = entry.isFolder ? 'folder' : 'file';
}

DirectoryEntry.prototype.read = function(callback) {

};

module.exports = DirectoryEntry;
