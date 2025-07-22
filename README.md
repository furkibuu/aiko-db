![Downloads](https://img.shields.io/npm/dt/aikodb?&style=for-the-badge)
![DownloadPerMonth](https://img.shields.io/npm/dm/aikodb?style=for-the-badge)

# AikoDB

**AikoDB** is a lightweight, fast, and easy-to-use database module based on JSON. It's perfect for use in small projects, prototyping, or even Discord bots where a full-scale database system is overkill.

---

## 📦 Installation

Install via npm:

```bash
npm install aikodb
```

---

## 🚀 Basic Usage

Using AikoDB is extremely simple. You can start using it with just a few lines:

```js
const AikoDB = require('aikodb');
const db = new AikoDB('json', 'database.json');

(async () => {
  await db.set('user1', { xp: 50 });
  console.log(db.get('user1'));

  await db.push('logs', 'Login Users.');
  console.log(db.get('logs'));

  console.log(db.has('user1')); // true
  console.log(db.size());       // database entry count

  await db.removeFromArray('logs', 'Login Users.');
  console.log(db.get('logs'));

  await db.clear(); // clears all data
})();
```

---

## 📚 API Reference

### 📥 `add(key, value)`
Adds a key with the given value to the database. Alias of `set()`.

### 📤 `get(key)`
Returns the value of the given key.

### 📝 `set(key, value)`
Creates or updates a key with the specified value.

### ❌ `delete(key)`
Deletes the specified key from the database.

### 📄 `all()`
Returns the entire database object.

### 🔁 `push(key, value, allowDuplicates = true)`
Pushes a value to an array stored under the key.  
Creates the array if it doesn't exist.  
You can prevent duplicates by setting `allowDuplicates` to `false`.

```js
await db.push('logs', 'Login', false); // won't add if already exists
```

### ➖ `removeFromArray(key, value)`
Removes the given value from the array stored under the key.

### 🧹 `clear()`
Clears the entire database.

### 🔎 `has(key)`
Returns true if the key exists in the database.

### 📊 `size()`
Returns the number of entries in the database.

### 🔑 `keys()`
Returns an array of all keys.

### 🎯 `values()`
Returns an array of all values.

### 🧪 `filter(callback)`
Filters entries based on a function.

```js
db.filter(item => item.age > 20);
```

### 🔍 `find(property, value)`
Returns entries where `object[property] === value`.

```js
db.find("username", "furkan");
```

### 📈 `sort(byKey, order)`
Sorts data by key and order (`asc` or `desc`).

```js
db.sort("xp", "desc");
```

### 🔄 `reload()`
Reloads the data from the file.

### 💾 `save()`
Manually saves the current state to the file.

---

## 📌 Latest Update (v1.1.8)

- `push(key, value, allowDuplicates = true)` now supports preventing duplicate entries.
- Stability improvements for array and object handling.

---

## 🤖 Example: With Discord Bot

```js
const AikoDB = require('aikodb');
const db = new AikoDB('json', 'data.json');

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const userId = message.author.id;
  const user = db.get(userId) || { xp: 0 };

  user.xp += 10;
  await db.set(userId, user);
});
```

---

## ✨ Support

Need help? Join our [Discord server](https://discord.gg/KcDsa4fAmS)  
Get help on the [#support](https://discord.com/channels/1370020743638941799/1372973540151918602) channel.  
Or DM me directly via my [Discord profile](https://discord.com/users/453534543194882049).

<p align="center">
  <a href="https://discord.gg/KcDsa4fAmS">
    <img src="https://api.weblutions.com/discord/invite/KcDsa4fAmS/">
  </a>
</p>
