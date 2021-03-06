let Web3 = require('aion-web3')
let client = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))

describe('transactions', () => {
  let coinbase

  xit('eth_sign (needs test account)', done => {
    client.eth
      .sign(coinbase, 'aion test')
      .then(res => {
        console.log('res', res)
        done()
      })
      .catch(done)
  })

  xit('eth_sendTransaction (needs test account)', done => {
    client.eth
      .sendTransaction({
        from: '',
        to: '',
        value: '',
        gas: '',
        gasPrice: '',
        data: '',
        nonce: ''
      })
      .then(res => {
        console.log('res', res)
        done()
      })
      .catch(done)
  })

  xit('eth_sendRawTransaction (needs test account)', done => {
    client.eth
      .sendSignedTransaction('')
      .then(res => {
        console.log('res', res)
        done()
      })
      .catch(done)
  })
})
