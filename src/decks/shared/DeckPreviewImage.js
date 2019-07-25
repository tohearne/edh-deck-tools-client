'use strict'
import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import cardBack from '../../images/card-back.jpg'

const DeckPreviewImage = ({ deck }) => (
  <Link to={`/decks/${deck.id}`}>
    <img src={deck.image ? deck.image : cardBack} alt='Deck Image'/>
    <p>{deck.title}</p>
  </Link>
)

export default withRouter(DeckPreviewImage)
