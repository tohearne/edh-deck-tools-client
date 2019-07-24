'use strict'

const mtg = require('mtgsdk')

// mtg.card.where({ id: '1669af17-d287-5094-b005-4b143441442f' '047d5499-a21c-5f5c-9679-1599fcaf9815', pageSize: 2 })
//   .then(cards => console.log(cards.length))

mtg.card.all({ types: '!enchantment' })
  .on('data', function (card) {
    console.log(card.colorIdentity)
  })
