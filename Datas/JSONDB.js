
const fs = require('fs').promises;
const path = require('path');

class JsonDB {
  constructor(dbPath = 'jsondb.json') {
    this.dbPath = dbPath;
    this.data = {};
    this._load();
  }

  async _load() {
    try {
      if (await this._fileExists(this.dbPath)) {
        const data = await fs.readFile(this.dbPath);
        this.data = JSON.parse(data);
      } else {
        await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2));
      }
    } catch (error) {
      console.error('Error loading database:', error);
    }
  }

  async _fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async _save() {
    try {
      await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  async add(key, value) {
    this.data[key] = value;
    await this._save();
  }

  get(key) {
    return this.data[key];
  }

  fetch(key) {
    return this.data[key];
  }

  async set(key, value) {
    this.data[key] = value;
    await this._save();
  }

  async delete(key) {
    delete this.data[key];
    await this._save();
  }

  all() {
    return this.data;
  }

  async deleteAll() {
    this.data = {};
    await this._save();
  }

  async push(key, value) {
    if (!this.data[key]) {
      this.data[key] = [];
    }
    if (!Array.isArray(this.data[key])) {
      throw new TypeError(`Value at key '${key}' is not an array.`);
    }
    this.data[key].push(value);
    await this._save();
  }

  has(key) {
    return Object.prototype.hasOwnProperty.call(this.data, key);
  }

  size() {
    return Object.keys(this.data).length;
  }

  filter(callback) {
    const result = {};
    for (const key in this.data) {
      if (callback(this.data[key], key)) {
        result[key] = this.data[key];
      }
    }
    return result;
  }

  search(key, value) {
    const result = {};
    for (const k in this.data) {
      if (this.data[k][key] === value) {
        result[k] = this.data[k];
      }
    }
    return result;
  }

  sort(sortKey, order = 'asc') {
    const sorted = Object.entries(this.data).sort((a, b) => {
      if (order === 'asc') {
        return a[1][sortKey] > b[1][sortKey] ? 1 : -1;
      } else {
        return a[1][sortKey] < b[1][sortKey] ? 1 : -1;
      }
    });
    return Object.fromEntries(sorted);
  }

  async removeFromArray(key, value) {
    if (!Array.isArray(this.data[key])) return;
    this.data[key] = this.data[key].filter(v => v !== value);
    await this._save();
  }

  async clear() {
    this.data = {};
    await this._save();
  }
}

module.exports = JsonDB;
