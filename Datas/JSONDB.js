const fs = require('fs').promises;
const path = require('path');

class JsonDB {
  constructor(dbPath = 'jsondb.json') {
    if (typeof dbPath !== 'string' || !dbPath.endsWith('.json')) {
      throw new Error('[JsonDB] Geçersiz veri tabanı yolu. ".json" uzantılı olmalı.');
    }

    this.dbPath = path.resolve(dbPath);
    this.backupPath = this.dbPath.replace('.json', '.backup.json');
    this.data = {};
    this.lastSaved = null;
    this.ready = this._load();
  }

  async _fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async _load() {
    try {
      if (await this._fileExists(this.dbPath)) {
        const raw = await fs.readFile(this.dbPath, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        await this._save(); 
      }
    } catch (error) {
      console.error('[JsonDB] Yükleme hatası:', error);
    }
  }

  async _save() {
    try {
      await this._createBackup();
      await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2));
      this.lastSaved = new Date();
    } catch (error) {
      console.error('[JsonDB] Kaydetme hatası:', error);
    }
  }

    async push(key, value, allowDuplicates = true) {
    this._validateKey(key);

    if (!Array.isArray(this.data[key])) {
      this.data[key] = [];
    }

    if (!allowDuplicates && this.data[key].includes(value)) {
      return; 
    }

    this.data[key].push(value);
    await this._save();
  }

  async _createBackup() {
    try {
      await fs.writeFile(this.backupPath, JSON.stringify(this.data, null, 2));
    } catch (err) {
      console.warn('[JsonDB] Yedek oluşturulamadı:', err.message);
    }
  }

  _validateKey(key) {
    if (typeof key !== 'string') {
      throw new TypeError('[JsonDB] Anahtar (key) bir string olmalıdır.');
    }
  }

  async set(key, value) {
    this._validateKey(key);
    this.data[key] = value;
    await this._save();
  }

  async add(key, value) {
    return this.set(key, value);
  }

  get(key) {
    this._validateKey(key);
    return this.data[key];
  }

  fetch(key) {
    return this.get(key);
  }

  async delete(key) {
    this._validateKey(key);
    delete this.data[key];
    await this._save();
  }

  has(key) {
    return Object.prototype.hasOwnProperty.call(this.data, key);
  }

  all() {
    return { ...this.data }; 
  }

  keys() {
    return Object.keys(this.data);
  }

  values() {
    return Object.values(this.data);
  }

  size() {
    return this.keys().length;
  }

  async clear() {
    this.data = {};
    await this._save();
  }

  async deleteAll() {
    return this.clear();
  }

  async push(key, value) {
    this._validateKey(key);
    if (!Array.isArray(this.data[key])) {
      this.data[key] = [];
    }
    this.data[key].push(value);
    await this._save();
  }

  async removeFromArray(key, value) {
    this._validateKey(key);
    if (!Array.isArray(this.data[key])) return;
    this.data[key] = this.data[key].filter(v => v !== value);
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
      const entry = this.data[k];
      if (entry && typeof entry === 'object' && entry[key] === value) {
        result[k] = entry;
      }
    }
    return result;
  }

  sort(sortKey, order = 'asc') {
    const entries = Object.entries(this.data).filter(
      ([, val]) => typeof val === 'object' && val !== null && sortKey in val
    );

    const sorted = entries.sort((a, b) => {
      const valA = a[1][sortKey];
      const valB = b[1][sortKey];
      return order === 'asc'
        ? valA > valB ? 1 : -1
        : valA < valB ? 1 : -1;
    });

    return Object.fromEntries(sorted);
  }

  async save() {
    await this._save();
  }

  async reload() {
    await this._load();
  }

  getLastSavedTime() {
    return this.lastSaved;
  }
}




module.exports = JsonDB;
