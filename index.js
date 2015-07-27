var transactionHexToJSON = require('bitcoin-tx-hex-to-json');

var __txs = {};

var Get = function(txids, cb) {
  var txs = [];
  txids.forEach(function(txid) {
    var tx = __txs[txid];
    txs.push(tx);
  });
  cb(false, txs);
};

var Unspents = function(addresses, cb) {
  var unspents_addresses = [];
  addresses.forEach(function() {
    var unspents = [{
      txid: '03af5bf0b3fe25db04b684ab41bea8cdd127e57822602b8545beaf06685967c8',
      vout: 0,
      value: 1000000
    }];
    unspents_addresses.push(unspents);
  });
  cb(false, unspents_addresses);
};

var setSpentTxid = function(jsonTx) {
  jsonTx.vin.forEach(function(input) {
    var spendingTx = __txs[input.txid];
    if (!spendingTx) {
      return;
    }
    var spendingTxOutput = spendingTx.vout[input.vout];
    spendingTxOutput.spentTxid = jsonTx.txid;
  });
}

var Propagate = function(txHex, cb) {
  var jsonTx = transactionHexToJSON(txHex);
  setSpentTxid(jsonTx);
  __txs[jsonTx.txid] = jsonTx;
  cb(false, {
    txid: jsonTx.txid,
    txId: jsonTx.txid
  });
};

var Transactions = {
  Get: Get,
  Propagate: Propagate
}

var Addresses = {
  Unspents: Unspents
}

module.exports = function(opts) {
  return {
    Transactions: Transactions,
    Addresses: Addresses
  }

}