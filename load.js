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

const load = async (filestream, collection) => {
  console.log('loading') 
  const res = await parse(filestream)  

  const keys = R.head(res)

  let list = R.map (R.zipObj(keys)) (R.tail(res))

  await collection.insertMany(list)

  console.log(list)

  await collection.deleteMany({})
}
module.exports = {load, parse}


