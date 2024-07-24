![Downloads](https://img.shields.io/npm/dt/aikodb?&style=for-the-badge)
![DownloadPerMonth](https://img.shields.io/npm/dm/aikodb?style=for-the-badge)
# AikoDB

AikoDB is a simple and easy-to-use database module that supports both JSON-based databases. It is especially ideal for Discord bots.

## Installation

You can install AikoDB using npm:
```bash
npm install aikodb
```
Usage
Using AikoDB is very simple. You can create a JSON database and perform various database operations.

Usage with Discord Bot

Using AikoDB with a Discord bot is also very straightforward. Here is a simple example:


```js

const { Client, GatewayIntentBits, Partials} = require("discord.js");
const client = new Client({
  intents: Object.values(GatewayIntentBits), 
  partials: Object.values(Partials),
  shards: "auto"
});
const AikoDB = require('aikodb'); // Added AikoDB module

// Create a database with AikoDB
const db = new AikoDB('json', 'data.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});



client.on('messageCreate', async message => {
  if (message.content.startsWith('!set')) {
    const args = message.content.slice('!set'.length).trim().split(' ');
    const key = args[0];
    const value = args.slice(1).join(' ');

    await db.set(key, value);
    message.channel.send(`Data set successfully: ${key} -> ${value}`);
  } else if (message.content.startsWith('!get')) {
    const key = message.content.slice('!get'.length).trim();

    const value = db.get(key);
    if (value) {
      message.channel.send(`Data found: ${key} -> ${value}`);
    } else {
      message.channel.send(`Data not found: ${key}`);
    }
  }
});

client.login('TOKEN');

```


```shell
API
add(key, value)
Adds the specified key and value to the database.

get(key)
Retrieves the value for the specified key.

set(key, value)
Updates or adds the value for the specified key.

delete(key)
Deletes the data for the specified key.

all()
Returns the entire contents of the database.

deleteAll()
Deletes all the contents of the database.

push(key, value)
Adds a value to the array for the specified key. If the key does not exist, it creates a new array.

sort((a, b) => a.age - b.age)
Searches according to the order of the data in the code

filtre(item => item.age > 20)
Filters saved data within data
```


# ✨ Support
You can come to our [Discord server](https://discord.gg/AYRDhFpRXE) and get help and support on [#support](https://discord.com/channels/1017117541526667355/1253790108272820307) channel. Or if you send a friend to my [discord account](https://discord.com/users/453534543194882049), I will return as soon as possible.

<p align="center"><a href="https://discord.gg/AYRDhFpRXE"><img src="https://api.weblutions.com/discord/invite/AYRDhFpRXE/"></a></p>

