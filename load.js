const parseStream = require('csv-parse')

function load(filestream, db) {
  console.log('loading') 
  console.dir(filestream)
}

function parse(filestream) {
  let res = []

  const parser = parseStream({delimiter: '|'})

  parser.on('readable', function(){
    let record
    while (record = parser.read()) {
      output.push(record)
    }
  })
  // Catch any error
  parser.on('error', function(err){
    console.error(err.message)
  })
}

module.exports = {load}


