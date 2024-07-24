const AikoDB = require('../index');


const db = new AikoDB('json', 'aikodb.json');

async function main() {
 
  await db.add('name', 'Furki');
  await db.add('age', 18);

  
  console.log(db.get('name')); // Furki
  console.log(db.get('age')); // 18

 
  await db.set('age', 18);

 
  console.log(db.get('age')); // 18

  
  await db.delete('age');

  
  console.log(db.get('age')); 

  
  console.log(db.all()); 

  
  await db.deleteAll();


  console.log(db.all()); // {}

 
  await db.push('hobbies', 'Reading');
  await db.push('hobbies', 'Writing');


  console.log(db.get('hobbies')); 
}

main();
