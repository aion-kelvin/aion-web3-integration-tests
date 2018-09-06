let fs = require('fs')
let path = require('path')
let async = require('async')
let Web3 = require('aion-web3')
let should = require('should')
let client = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
let distPath = path.join(__dirname, '..', 'dist')

let typesBinPath = path.join(distPath, 'Types.bin')
let typesAbiPath = path.join(distPath, 'Types.abi')

// account to use for deploying and calling contract
let testAddress = '0xa0450c4333e72ed26552d7462c0b3669924eec816a219b3960d5b3f0b33f7444';
//let testPassword = 'password';
let testPassword = 'password';

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
      contract: ['typesAbi',async.apply(function (results,cb) {
          let ct = new client.eth.Contract(JSON.parse(results.typesAbi), opts);
          cb(null, ct);
      })],
      deploy: ['unlock', 'typesBin', 'contract', async.apply(function (res,cb) {
          let deployedTo;
          deployCt(res.contract, res.typesBin.toString('utf8'), [], cb)
              /*.then(inst => { 
                  deployedTo = inst.options.address
                  console.log("deployed contract to", inst.options.address) 
              })*/
              .catch(err => {
                  console.error("error", err);
                  return done(err);
              });
      })]
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
      ct = res.ct;
      ctInstAddress = res.deploy;

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

  it('mixed types', () => {
    ct.methods.testMix
  });


})
