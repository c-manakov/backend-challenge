const {MongoClient} = require('mongodb');
const R = require('ramda')
const {MONGO_URI, DB_NAME} = require('./config.js')

describe('records', () => {
  let connection
  let db
  let patientCollection
  let emailCollection

  beforeAll(async () => {
    connection = await MongoClient.connect(MONGO_URI)
    db = connection.db(DB_NAME)
    patientCollection = db.collection('patients')
    emailCollection = db.collection('emails')
  })

  afterAll(async () => {
    await connection.close()
    await db.close()
  })

  it('number of patients in a collection', async () => {
    const count = await patientCollection.count() 

    expect(count).toEqual(15)
  })


  it('number of patients where first name is missing', async () => {
    const count = await patientCollection.count({'First Name': ''})

    expect(count).toEqual(2)
  })

  it('email is missing but consent is Y', async () => {
    const count = await patientCollection.count({'Email Address': '', 'CONSENT': 'Y'})

    expect(count).toEqual(1)
  })

  it('number of emails corresponds to number of users with email and consent', async() => {
    const patientCount = await patientCollection.count({'Email Address': {$ne: ''}, 'CONSENT': 'Y'})
    const emailCount = await emailCollection.count()

    expect(emailCount).toEqual(patientCount * 4)
  })

  it('verify schedule', async() => {
    const emailsByDay = await emailCollection.aggregate([{
      $group: {
        _id: "$date", patients: {$push: "$patient_id"}
      }
    }
    ]).toArray()

    expect(emailsByDay.length).toEqual(4)

    //check if all patients for each day are the same
    expect(R.map(it => it.patients, emailsByDay)).toEqual(expect.arrayContaining([emailsByDay[0].patients]))
  })
})
