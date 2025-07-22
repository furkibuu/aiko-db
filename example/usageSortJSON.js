const AikoDB = require('aikodb');
const db = new AikoDB('json', 'aikodb.json');

async function main() {
// Wait for the database to initialize
setTimeout(async () => {
  // Add some test data
  await db.set('user1', { name: 'Furki', age: 19 });
  await db.set('user2', { name: 'Ufuk', age: 20 });
  await db.set('user3', { name: 'Nazmi', age: 22 });

  // Filter data: Get users older than 20
  const olderThan20 = db.filter((value) => value.age > 20);
  console.log('Users older than 20:', olderThan20);

  // Search data: Get user with the name 'Furki'
  const furkis = db.search('name', 'Furki');
  console.log('User named Alice:', furkis);

  // Sort data: Sort users by age in ascending order
  const sortedByAgeAsc = db.sort('age', 'asc');
  console.log('Users sorted by age (asc):', sortedByAgeAsc);

  // Sort data: Sort users by age in descending order
  const sortedByAgeDesc = db.sort('age', 'desc');
  console.log('Users sorted by age (desc):', sortedByAgeDesc);
}, 1000);

}

main();
