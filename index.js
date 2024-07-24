const fs = require('fs').promises;
const path = require('path');
class AikoDB {
  constructor(type = 'json', dbPath = 'aikodb.json') {
    this.type = type;
    this.dbPath = dbPath;
    this.data = {};
    this._load();
  }

   async init() {

    await this._load();
  
  }

  async _load() {
    try {
      if (this.type === 'json') {
        if (await this._fileExists(this.dbPath)) {
          const data = await fs.readFile(this.dbPath);
          this.data = JSON.parse(data);
        } else {
          await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2));
        }
      }
    } catch (error) {
      console.error('Error loading database:', error);
      console.error(`If you couldn't solve the error, come here https://discord.gg/AYRDhFpRXE`)
    }
  }

  async _fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch (error) {
      return false;
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
      throw new TypeError(`Value at key '${key}' is not an array and cannot be pushed to.`);
    }
    this.data[key].push(value);
    await this._save();
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

  sort(key, order = 'asc') {
    const sorted = Object.entries(this.data).sort((a, b) => {
      if (order === 'asc') {
        return a[1][key] > b[1][key] ? 1 : -1;
      } else {
        return a[1][key] < b[1][key] ? 1 : -1;
      }
    });

    const result = {};
    for (const [k, v] of sorted) {
      result[k] = v;
    }
    return result;
  }


  async _save() {
    try {
      if (this.type === 'json') {
        await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2));
      }
    } catch (error) {
      console.error('Error saving data:', error);
      console.error(`If you couldn't solve the error, come here https://discord.gg/AYRDhFpRXE`)
    }
  }
}

module.exports = AikoDB;
