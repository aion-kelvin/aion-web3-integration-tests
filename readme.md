
# aion-web3-integration-tests

1. Fork

```sh
git clone git@github.com:USERNAME/aion-web3-integration-tests.git
npm install

npm run dev # watch and re-run tests

# or run development tasks individually
npm run dev-eslint
npm run dev-mocha
npm run dev-solc

npm run clean # clean up, delete caches, compiled contracts

npm run prd # before commit clean up the code

# individually run an test one file
nodemon -L -d 1 -w test --exec 'mocha --opts mocha.opts test/contracts.js'
# nodemon is installed globally
# -L OSX-compatible watch files
# -d 1 delay 1 second
# -w test watch test
```

