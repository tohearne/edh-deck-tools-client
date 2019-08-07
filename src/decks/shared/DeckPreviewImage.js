'use strict'
import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import cardBack from '../../images/card-back.jpg'

const DeckPreviewImage = ({ deck, other }) => (
  <Link to={`/decks/${deck.id}`} className='deck-prev-i'>
    <img src={deck.image ? deck.image : cardBack} alt='Deck Image'/>
    <h4 className='deck-title'>{deck.title}</h4>
    {other}
  </Link>
)

export default withRouter(DeckPreviewImage)
