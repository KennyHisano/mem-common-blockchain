module.exports = function (opts) {
  var transactionHexToJSON = require('bitcoin-tx-hex-to-json')

  var __txs = {}

  var __blocks = [{
    blockId: 'genesis',
    transactions: [],
    nextblockhash: false,
    blockHeight: 0
  }]

  var __unminedTxs = []

  var Get = function (txids, cb) {
    var txs = []
    txids.forEach(function (txid) {
      var tx = __txs[txid]
      txs.push(tx)
    })
    cb(false, txs)
  }

  var Unspents = function (addresses, cb) {
    var unspents_addresses = []
    addresses.forEach(function () {
      var unspents = [{
        txid: '03af5bf0b3fe25db04b684ab41bea8cdd127e57822602b8545beaf06685967c8',
        vout: 0,
        value: 1000000
      }]
      unspents_addresses.push(unspents)
    })
    cb(false, unspents_addresses)
  }

  var Propagate = function (txHex, cb) {
    var jsonTx = transactionHexToJSON(txHex)
    __unminedTxs.push(jsonTx)
    __txs[jsonTx.txid] = jsonTx
    cb(false, {
      txid: jsonTx.txid,
      txId: jsonTx.txid
    })
  }

  var mineBlock = function () {
    var blockId = parseInt(Math.random() * 2e16, 10).toString(16)
    var block = {
      transactions: __unminedTxs.slice(0),
      blockId: blockId,
      blockHeight: __blocks.length + 1
    }
    var prevBlock = __blocks[__blocks.length - 1]
    prevBlock.nextblockhash = blockId
    __blocks.push(block)
    __unminedTxs = []
  }

  var GetBlock = function (blockIds, callback) {
    var blocks = []
    __blocks.forEach(function (block) {
      if (blockIds.indexOf(block.blockId) > -1) {
        blocks.push(block)
      }
    })
    callback(false, blocks)
  }

  var GetBlockHash = function (blockHeight, callback) {
    var block = __blocks[blockHeight]
    callback(false, block.blockId)
  }

  var Transactions = {
    Get: Get,
    Propagate: Propagate
  }

  var Addresses = {
    Unspents: Unspents
  }

  var Blocks = {
    Get: GetBlock,
    GetBlockHash: GetBlockHash,
    mine: mineBlock
  }

  return {
    Transactions: Transactions,
    Addresses: Addresses,
    Blocks: Blocks
  }
}
