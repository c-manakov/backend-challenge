const parseStream = require('csv-parse')
const R = require('ramda')
const moment = require('moment')

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

  await collection.deleteMany({})

  await collection.insertMany(list)

}

const createEmails = async(db) => {
  const patientCollection = db.collection('patients')
  const emailCollection = db.collection('emails')

  await emailCollection.deleteMany()

  const patients = await patientCollection.find({CONSENT: 'Y', 'Email Address': {$ne: ''}}).toArray()

  const body = 'Lorem ipsum dolor'


  const emails = R.pipe(
    R.xprod(R.range(1, 5)),
    R.map(([day, patient]) => ({
        email: patient['Email Address'],
        body: body, 
        patient_id: patient._id,
        date: moment.utc().set({hour: 0, minute: 0, second: 0, millisecond: 0}).add(day, 'days').toDate()
    }))
  )(patients)


  await emailCollection.insertMany(emails)
  
  console.log(emails)
}
module.exports = {load, parse, createEmails}


