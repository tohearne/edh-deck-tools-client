'use strict'
import React from 'react'
import { withRouter } from 'react-router-dom'
import cardBack from '../../images/card-back.jpg'

const DisplayCard = ({ card, buttonText, handleClick, altId }) => {
  const rulesText = card.text ? card.text.split('\n').map((n, i) => (<p key={i}>{n}</p>)) : []
  return (
    <div className='card-display-i'>
      <img src={card.imageUrl ? card.imageUrl : cardBack} alt={card.name + '\'s card'}/>
      { buttonText ? <button id={altId || card.id} onClick={handleClick}>{buttonText}</button> : null}
      <h5>{card.name}</h5><span>{card.manaCost}</span>
      <p>{card.type}</p>
      <div>{rulesText}</div>
      <p>{card.power ? `${card.power}/${card.toughness}` : ''}</p>
      <p>{card.loyalty}</p>
    </div>
  )
}

export default withRouter(DisplayCard)
