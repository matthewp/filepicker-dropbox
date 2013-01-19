function DirectoryEntry(entry, engine) {
  this.name = entry.name;
  this.path = entry.path;
  this.engine = engine;
  this.type = entry.isFolder ? 'folder' : 'file';
}

DirectoryEntry.prototype.read = function(callback) {
  this.engine.fetchFile(this.path, callback);
};

module.exports = DirectoryEntry;
