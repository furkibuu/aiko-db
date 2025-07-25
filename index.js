const fs = require('fs').promises;
const path = require('path');


class AikoDB {
  constructor(type = 'json', dbPath = 'aikodb.json') {
    if (!['json'].includes(type)) {
      throw new Error('[AikoDB] Geçersiz veri tabanı türü. Sadece "json" destekleniyor.');
    }
    if (typeof dbPath !== 'string' || !dbPath.endsWith('.json')) {
      throw new Error('[AikoDB] Geçersiz veri tabanı yolu. JSON dosyası olmalıdır.');
    }

    this.type = type;
    this.dbPath = path.resolve(dbPath);
    this.backupPath = this.dbPath.replace('.json', '.backup.json');
    this.data = {};
    this.ready = this._load();
    console.log(`[AikoDB] ${this.type} veri tabanı "${this.dbPath}" olarak ayarlandı.`);
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
        const content = await fs.readFile(this.dbPath, 'utf-8');
        this.data = JSON.parse(content);
      } else {
        await this._save();
      }
    } catch (err) {
      console.error('[AikoDB] Yükleme hatası:', err);
    }
  }

  async _save() {
    try {
      await this._createBackup();
      await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2));
    } catch (err) {
      console.error('[AikoDB] Kaydetme hatası:', err);
    }
  }

  async _createBackup() {
    try {
      await fs.writeFile(this.backupPath, JSON.stringify(this.data, null, 2));
    } catch (err) {
      console.warn('[AikoDB] Yedek oluşturulamadı:', err.message);
    }
  }

  // Public API

  get(key) {
    return this.data[key];
  }

  has(key) {
    return Object.prototype.hasOwnProperty.call(this.data, key);
  }

  async set(key, value) {
    if (typeof key !== 'string') throw new Error('[AikoDB] Anahtar bir string olmalıdır.');
    if (value === undefined || typeof value === 'function') {
      throw new Error('[AikoDB] Geçersiz değer türü.');
    }

    this.data[key] = value;
    await this._save();
  }

  async add(key, value) {
    return this.set(key, value);
  }

  async delete(key) {
    delete this.data[key];
    await this._save();
  }

  async clear() {
    this.data = {};
    await this._save();
  }

  all() {
    return { ...this.data };
  }

  async push(key, value) {
    if (!Array.isArray(this.data[key])) {
      this.data[key] = [];
    }
    this.data[key].push(value);
    await this._save();
  }

  async removeFromArray(key, value) {
    if (!Array.isArray(this.data[key])) return;
    this.data[key] = this.data[key].filter((item) => item !== value);
    await this._save();
  }

  keys() {
    return Object.keys(this.data);
  }

  values() {
    return Object.values(this.data);
  }

  size() {
    return Object.keys(this.data).length;
  }

  filter(callback) {
    return Object.fromEntries(
      Object.entries(this.data).filter(([k, v]) => callback(v, k))
    );
  }

  find(key, value) {
    return Object.fromEntries(
      Object.entries(this.data).filter(([_, obj]) => obj?.[key] === value)
    );
  }

  sort(byKey, order = 'asc') {
    const sorted = Object.entries(this.data).sort(([, a], [, b]) => {
      if (order === 'asc') return a[byKey] > b[byKey] ? 1 : -1;
      return a[byKey] < b[byKey] ? 1 : -1;
    });

    return Object.fromEntries(sorted);
  }

  async reload() {
    await this._load();
  }

  async save() {
    await this._save();
  }
    async push(key, value, allowDuplicates = true) {
    if (typeof key !== 'string') throw new Error('[AikoDB] Anahtar bir string olmalıdır.');

    if (!Array.isArray(this.data[key])) {
      this.data[key] = [];
    }

    if (!allowDuplicates && this.data[key].includes(value)) {
      return; 
    }

    this.data[key].push(value);
    await this._save();
  }

}



module.exports = AikoDB;
