const fs = require('fs').promises;

class JsonDB {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.data = {};
  }


  async add(key, value) {
    this.data[key] = value;
    await this._save();
  }

  async get(key) {
    return this.data[key];
  }

  async fetch(key) {

return this.data[key]

  }

  async set(key, value) {
    this.data[key] = value;
    await this._save();
  }

  async delete(key) {
    delete this.data[key];
    await this._save();
  }

  async all() {
    return this.data;
  }

  async deleteAll() {
    this.data = {};
    await this._save();
  }

  async _save() {
    try {
      await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }
}

module.exports = JsonDB;
