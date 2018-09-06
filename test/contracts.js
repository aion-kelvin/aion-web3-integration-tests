let fs = require('fs')
let path = require('path')
let async = require('async')
let Web3 = require('aion-web3')
let should = require('should')
let client = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
let distPath = path.join(__dirname, '..', 'dist')
let typesBinPath = path.join(distPath, 'contracts_types_sol_Types.bin')
let typesAbiPath = path.join(distPath, 'contracts_types_sol_Types.abi')

/*

load from ../dist/contract.bin?

*/

describe('contracts', () => {
  let typesBin
  let typesAbi

  before(done => {
    let steps = {
      typesBin: async.apply(fs.readFile, typesBinPath),
      typesAbi: async.apply(fs.readFile, typesAbiPath)
    }
    async.auto(steps, (err, res) => {
      if (err !== null && err !== undefined) {
        console.error('error reading bin & abi', err)
        return done(err)
      }

      typesBin = res.typesBin.toString('utf8')
      typesAbi = JSON.parse(res.typesAbi)
      done()
    })
  })

  it('types contract binary', () => {
    typesBin.should.be.a.String
  })

  it('types abi json', () => {
    typesAbi.should.be.an.Object
  })
})
