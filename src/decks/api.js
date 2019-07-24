'use strict'
import apiUrl, { mtgUrl } from '../apiConfig'
import axios from 'axios'
const mtg = require('mtgsdk')

export const getCards = (params) => {
  return mtg.card.where(params)
}

export const getFormats = () => {
  return axios({
    method: 'GET',
    url: mtgUrl + '/formats'
  })
}

export const createDeck = (deck, user) => {
  return axios({
    method: 'POST',
    url: apiUrl + '/decks',
    headers: {
      'Authorization': `Token token=${user.token}`
    },
    data: {
      deck: {
        title: deck.title,
        format: deck.format,
        image: deck.image,
        public: deck.public
      }
    }
  })
}

export const getDecks = () => {
  return axios({
    method: 'GET',
    url: apiUrl + '/decks'
  })
}

export const getDeck = (id) => {
  return axios({
    method: 'GET',
    url: apiUrl + '/decks/' + id
  })
}

export const createCard = (deckId, cardId, isCommander, user) => {
  return axios({
    method: 'POST',
    url: apiUrl + '/cards',
    headers: {
      'Authorization': `Token token=${user.token}`
    },
    data: {
      card: {
        deck_id: deckId,
        card_id: cardId,
        is_commander: isCommander
      }
    }
  })
}

export const deleteCard = (cardId, user) => {
  return axios({
    method: 'DELETE',
    url: apiUrl + '/cards/' + cardId,
    headers: {
      'Authorization': `Token token=${user.token}`
    }
  })
}
