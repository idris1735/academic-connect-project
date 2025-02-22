const { db } = require('../config/database')

async function exploreFirestore() {
  try {
    const collections = await db.listCollections()
    const structure = {}

    console.log(
      'Found collections:',
      collections.map((col) => col.id)
    )

    for (const collection of collections) {
      const collectionName = collection.id
      structure[collectionName] = {}

      console.log(`\nExploring collection: ${collectionName}`)
      const snapshot = await db.collection(collectionName).get()

      snapshot.forEach((doc) => {
        console.log(`\nDocument ${doc.id}:`)
        console.log(JSON.stringify(doc.data(), null, 2))
        structure[collectionName][doc.id] = doc.data()
      })
    }

    return structure
  } catch (error) {
    console.error('Error exploring Firestore:', error)
    return null
  }
}

module.exports = { exploreFirestore }
