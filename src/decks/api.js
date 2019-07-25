'use strict'
import apiUrl, { mtgUrl } from '../apiConfig'
import axios from 'axios'

export const getCards = (params) => {
  return axios({
    method: 'GET',
    url: mtgUrl + '/cards/search?' + params
  })
}

export const getCard = (id) => {
  return axios({
    method: 'GET',
    url: mtgUrl + '/cards/' + id
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

export const getMyDecks = (user) => {
  return axios({
    method: 'GET',
    url: apiUrl + '/my-decks',
    headers: {
      'Authorization': `Token token=${user.token}`
    }
  })
}

export const getDeck = (id) => {
  return axios({
    method: 'GET',
    url: apiUrl + '/decks/' + id
  })
}

export const patchDeck = (deck, user) => {
  return axios({
    method: 'PATCH',
    url: apiUrl + '/decks/' + deck.id,
    headers: {
      'Authorization': `Token token=${user.token}`
    },
    data: {
      deck: {
        title: deck.title,
        image: deck.image,
        public: deck.public
      }
    }
  })
}

export const deleteDeck = (id, user) => {
  return axios({
    method: 'DELETE',
    url: apiUrl + '/decks/' + id,
    headers: {
      'Authorization': `Token token=${user.token}`
    }
  })
}

export const createCard = (deckId, cardId, isCommander, amount, user) => {
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
        amount: amount,
        is_commander: isCommander
      }
    }
  })
}

export const deleteCard = (id, user) => {
  return axios({
    method: 'DELETE',
    url: apiUrl + '/cards/' + id,
    headers: {
      'Authorization': `Token token=${user.token}`
    }
  })
}

export const patchCard = (id, amount, user) => {
  return axios({
    method: 'PATCH',
    url: apiUrl + '/cards/' + id,
    headers: {
      'Authorization': `Token token=${user.token}`
    },
    data: {
      card: {
        amount: amount
      }
    }
  })
}
