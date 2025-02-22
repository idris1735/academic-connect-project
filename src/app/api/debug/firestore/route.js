import { db } from '@/lib/firebase/config'

export async function GET() {
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

    return new Response(JSON.stringify(structure, null, 2), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error exploring Firestore:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
