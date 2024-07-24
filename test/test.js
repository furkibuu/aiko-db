const AikoDB = require('../index');


const jsonDb = new AikoDB({ type: 'json', dbPath: 'aikodb.json' });

async function testJSONDB() {
  try {
    await jsonDb.run('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)');
    console.log('Table created successfully (JSON).');
    await jsonDb.run('INSERT INTO users (name) VALUES (?)', ['Aiko Development']);
    console.log('Data inserted successfully (JSON).');
    const users = await jsonDb.all('SELECT * FROM users');
    console.log('Data retrieved successfully (JSON):', users);
  } catch (error) {
    console.error('An error occurred (JSON):', error);
  }
}

testJSONDB();
