const parseStream = require('csv-parse')
const R = require('rambda')

const parse = (filestream) => new Promise((resolve, reject) => {
  let res = []

  const parser = parseStream({delimiter: '|'})

  filestream.pipe(parser)

  parser.on('readable', () => {
    let record
    while (record = parser.read()) {
      res.push(record)
    }
  })
  // Catch any error
  parser.on('error', (err) => {
    reject(err)
  })

  parser.on('end', () => {
    resolve(res)
  })
})

const load = async (filestream, db) => {
  const collection = db.collection('patients')
  const res = await parse(filestream)  

  const keys = R.head(res)

  let list = R.map (R.zipObj(keys)) (R.tail(res))

  await collection.insertMany(list)

  // await collection.deleteMany({})
}

const createEmails = async(db) => {
  const patientCollection = db.collection('patients')
  const emailCollection = db.collection('emails')

  const patients = await patientCollection.find({CONSENT: 'Y'}).toArray()

  const names = ['Day 1', 'Day 2', 'Day 3', 'Day 4']

  const emails = R.pipe(
    R.map(patient => 
      R.map(name => ({name, patient_id: patient._id}), names)
    ),
    R.flatten
  )(patients)
  

  await emailCollection.insertMany(emails)
  
  console.log(emails)
}
module.exports = {load, parse, createEmails}


