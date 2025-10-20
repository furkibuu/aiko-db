const fs = require('fs').promises;
const path = require('path');

class JsonDB {
  /**
   * @param {string} dbPath 
   * @param {object} options 
   * @param {boolean} options.backup 
   */
  constructor(dbPath = 'aikodb.json', options = {}) {
    if (typeof dbPath !== 'string' || !dbPath.endsWith('.json')) {
      throw new Error('[JsonDB] Geçersiz veri tabanı yolu. ".json" uzantılı olmalı.');
    }

    this.dbPath = path.resolve(dbPath);
    this.data = {};
    this.lastSaved = null;

    this.options = {
      backup: options.backup ?? true 
    };

    this.backupPath = this.options.backup
      ? this.dbPath.replace('.json', '.backup.json')
      : null;

    this.ready = this._load();
    this._log(`Veritabanı "${this.dbPath}" olarak ayarlandı.`, 'info');
  }

  _log(msg, type = 'info') {
    const colors = {
      info: '\x1b[36m%s\x1b[0m',  // mavi
      warn: '\x1b[33m%s\x1b[0m',  // sarı
      error: '\x1b[31m%s\x1b[0m'  // kırmızı
    };
    console.log(colors[type] || '%s', `[JsonDB] ${msg}`);
  }

  async _fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  _validateKey(key) {
    if (typeof key !== 'string') {
      throw new TypeError('[JsonDB] Anahtar (key) bir string olmalıdır.');
    }
  }

  async _load() {
    try {
      if (await this._fileExists(this.dbPath)) {
        const raw = await fs.readFile(this.dbPath, 'utf-8');
        this.data = JSON.parse(raw);
        this._log('Veri başarıyla yüklendi.', 'info');
      } else {
        this._log('Veritabanı bulunamadı, yeni oluşturuluyor...', 'warn');
        await this._save();
      }
    } catch (error) {
      this._log(`Veri yükleme hatası: ${error.message}`, 'error');

     
      if (this.options.backup && await this._fileExists(this.backupPath)) {
        try {
          const backupRaw = await fs.readFile(this.backupPath, 'utf-8');
          this.data = JSON.parse(backupRaw);
          this._log('Bozuk JSON algılandı, yedekten geri yüklendi ✅', 'warn');
          await this._save();
        } catch (backupErr) {
          this._log(`Yedek dosya da bozuk! Yeni veritabanı oluşturuluyor... (${backupErr.message})`, 'error');
          this.data = {};
          await this._save();
        }
      } else {
        this._log('Yedek bulunamadı, yeni veritabanı oluşturuluyor...', 'warn');
        this.data = {};
        await this._save();
      }
    }
  }

  async _save() {
    try {
      if (this.options.backup && this.backupPath) {
        await this._createBackup();
      }

      await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2));
      this.lastSaved = new Date();
      this._log('Veri kaydedildi.', 'info');
    } catch (error) {
      this._log(`Kaydetme hatası: ${error.message}`, 'error');
    }
  }

  async _createBackup() {
    try {
      await fs.writeFile(this.backupPath, JSON.stringify(this.data, null, 2));
      this._log('Yedek oluşturuldu.', 'info');
    } catch (err) {
      this._log(`Yedek oluşturulamadı: ${err.message}`, 'warn');
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

  async push(key, value, allowDuplicates = true) {
    this._validateKey(key);
    if (!Array.isArray(this.data[key])) {
      this.data[key] = [];
    }

    if (!allowDuplicates && this.data[key].includes(value)) return;

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
    return Object.fromEntries(
      Object.entries(this.data).filter(([key, val]) => callback(val, key))
    );
  }

  search(key, value) {
    return Object.fromEntries(
      Object.entries(this.data).filter(
        ([, entry]) => entry && typeof entry === 'object' && entry[key] === value
      )
    );
  }

  sort(sortKey, order = 'asc') {
    const entries = Object.entries(this.data).filter(
      ([, val]) => typeof val === 'object' && val !== null && sortKey in val
    );

    const sorted = entries.sort((a, b) => {
      const valA = a[1][sortKey];
      const valB = a[1][sortKey];
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
