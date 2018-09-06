let fs = require('fs')
let path = require('path')
let async = require('async')
let Web3 = require('aion-web3')
let should = require('should')
let client = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
let distPath = path.join(__dirname, '..', 'dist')
const crypto = require('crypto')

let typesBinPath = path.join(distPath, 'Types.bin')
let typesAbiPath = path.join(distPath, 'Types.abi')

// account to use for deploying and calling contract
let testAddress = '0xa0450c4333e72ed26552d7462c0b3669924eec816a219b3960d5b3f0b33f7444';
let testPassword = 'put-real-password-here';

/*

load from ../dist/contract.bin?

*/

function deployCt(ct, ctData, args, cb) { 
    return ct.deploy( {data: ctData, arguments: args} )
        .send()
        .on('error', err => { cb(err,null) })
        .on('transactionHash', transactionHash => { console.log('transactionHash', transactionHash) })
        .on('receipt', receipt => { 
            console.log('txHash =', receipt.transactionHash);
            console.log('contract instance address =', receipt.contractAddress);
            cb(null,receipt);
        });
        //.on('confirmation', (confirmationNumber, receipt) => { console.log(confirmationNumber, receipt) });
}


describe('contracts', () => {
  let opts = { 
      from: testAddress,
      gas: 4000000,
      gasPrice: 10000000000,
  };

  let typesBin
  let typesAbi
  let ct;
  let ctInstAddress;

  before(done => {
    let steps = {
      typesBin: async.apply(fs.readFile, typesBinPath),
      typesAbi: async.apply(fs.readFile, typesAbiPath),
      unlock: async.apply(client.eth.personal.unlockAccount, testAddress, testPassword),
      /*contract: ['typesAbi',async.apply(function (results,cb) {
          let ct = new client.eth.Contract(JSON.parse(results.typesAbi), opts);
          cb(null, ct);
      })],*/
      /*deploy: ['unlock', 'typesBin', async.apply(function (res,cb) {
          let deployedTo;
          deployCt(res.contract, res.typesBin.toString('utf8'), [], cb)
              .catch(err => {
                  console.error("error", err);
                  return done(err);
              });
      })]*/
    }
    async.auto(steps, (err, res) => {
      if (err !== null && err !== undefined) {
        console.error('error reading bin & abi', err)
        return done(err)
      }

      if(! res.unlock ) { 
        return done(new Error("can't unlock"));
      }

      typesBin = res.typesBin.toString('utf8')
      typesAbi = JSON.parse(res.typesAbi)
      //ct = res.ct;
      //ctInstAddress = res.deploy;

      ctInstAddress = '0xA0Ce602629f0c53249D169460455a88Fc511E3ddfB361b821a859019a374ad6c';
      ct = new client.eth.Contract(typesAbi, ctInstAddress);

      done()
    })
  })

  it('types contract binary', () => {
    typesBin.should.be.a.String
  })

  it('types abi json', () => {
    typesAbi.should.be.an.Object
  })

  
  const mixString = 'mixString'
  const mixFixedUint128Array = [
      '0x' + crypto.randomBytes(16).toString('hex'),
      '0x' + crypto.randomBytes(16).toString('hex'),
      '0x' + crypto.randomBytes(16).toString('hex')
  ]
  const mixBool = false
  const mixDynamicBytes32Array  = []
  for(let i = 0, m = parseInt(Math.random() * (10 - 1) + 1); i < m; i++){    
      mixDynamicBytes32Array.push('0x' + crypto.randomBytes(32).toString('hex'))
  }

  let cases = [
    {method: 'testMix', args: [mixString, mixFixedUint128Array, mixBool, mixDynamicBytes32Array]},
    {method: 'testBool', args: [true]},
    /*{method: 'testInt8', args: []},
    {method: 'testInt16', args: []},
    {method: 'testInt24', args: []},
    {method: 'testInt32', args: []},
    {method: 'testInt40', args: []},
    {method: 'testInt48', args: []},
    {method: 'testInt56', args: []},
    {method: 'testInt64', args: []},
    {method: 'testInt72', args: []},
    {method: 'testInt80', args: []},
    {method: 'testInt88', args: []},
    {method: 'testInt96', args: []},
    {method: 'testInt104', args: []},
    {method: 'testInt112', args: []},
    {method: 'testInt120', args: []},
    {method: 'testInt128', args: []},
    {method: 'testInt', args: []},
    {method: 'testUint8', args: []},
    {method: 'testUint16', args: []},
    {method: 'testUint24', args: []},
    {method: 'testUint32', args: []},
    {method: 'testUint40', args: []},
    {method: 'testUint48', args: []},
    {method: 'testUint56', args: []},
    {method: 'testUint64', args: []},
    {method: 'testUint72', args: []},
    {method: 'testUint80', args: []},
    {method: 'testUint88', args: []},
    {method: 'testUint96', args: []},
    {method: 'testUint104', args: []},
    {method: 'testUint112', args: []},
    {method: 'testUint120', args: []},
    {method: 'testUint128', args: []},
    {method: 'testUint', args: []},
    {method: 'testAddress', args: []},
    {method: 'testByte', args: []},
    {method: 'testFixedBytes1', args: []},
    {method: 'testFixedBytes2', args: []},
    {method: 'testFixedBytes3', args: []},
    {method: 'testFixedBytes4', args: []},
    {method: 'testFixedBytes5', args: []},
    {method: 'testFixedBytes6', args: []},
    {method: 'testFixedBytes7', args: []},
    {method: 'testFixedBytes8', args: []},
    {method: 'testFixedBytes9', args: []},
    {method: 'testFixedBytes10', args: []},
    {method: 'testFixedBytes11', args: []},
    {method: 'testFixedBytes12', args: []},
    {method: 'testFixedBytes13', args: []},
    {method: 'testFixedBytes14', args: []},
    {method: 'testFixedBytes15', args: []},
    {method: 'testFixedBytes16', args: []},
    {method: 'testFixedBytes17', args: []},
    {method: 'testFixedBytes18', args: []},
    {method: 'testFixedBytes19', args: []},
    {method: 'testFixedBytes20', args: []},
    {method: 'testFixedBytes21', args: []},
    {method: 'testFixedBytes22', args: []},
    {method: 'testFixedBytes23', args: []},
    {method: 'testFixedBytes24', args: []},
    {method: 'testFixedBytes25', args: []},
    {method: 'testFixedBytes26', args: []},
    {method: 'testFixedBytes27', args: []},
    {method: 'testFixedBytes28', args: []},
    {method: 'testFixedBytes29', args: []},
    {method: 'testFixedBytes30', args: []},
    {method: 'testFixedBytes31', args: []},
    {method: 'testFixedBytes32', args: []},
    {method: 'testFixedUint16Array', args: []},
    {method: 'testFixedUint32Array', args: []},
    {method: 'testFixedUint64Array', args: []},
    {method: 'testFixedUint96Array', args: []},
    {method: 'testFixedUint128Array', args: []},
    {method: 'testFixedByteArray', args: []},
    {method: 'testFixedBytes1Array', args: []},
    {method: 'testFixedBytes15Array', args: []},
    {method: 'testFixedBytes16Array', args: []},
    {method: 'testFixedBytes32Array', args: []},
    {method: 'testString', args: []},
    {method: 'testBytes', args: []},
    {method: 'testDynamicUint8Array', args: []},
    {method: 'testDynamicUint128Array', args: []},
    {method: 'testDynamicByteArray', args: []},
    {method: 'testDynamicBytes1Array', args: []},
    {method: 'testDynamicBytes15Array', args: []},
    {method: 'testDynamicBytes16Array', args: []},
    {method: 'testDynamicBytes32Array', args: []},*/
  ]
  
  cases.forEach(({method, args}) => {
    it(method, done => {
      ct.methods[method](...args)
        .call()
        .then(res => {
          console.log(method, "->", args, "->", res);
          [res].should.eql(args)
          done()
        })
        .catch(err => {
          console.error('error calling', method, err)
          done(err)
      })
    })
  })

})
