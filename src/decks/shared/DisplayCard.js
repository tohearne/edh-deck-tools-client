'use strict'
import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import cardBack from '../../images/card-back.jpg'

const DisplayCard = ({ card, imageSize = 'normal', other }) => {
  const cardImages = card.card_faces
    ? (
      <Fragment>
        <img src={card.card_faces[0].image_uris ? card.card_faces[0].image_uris[imageSize] : card.image_uris ? card.image_uris[imageSize] : cardBack} alt={card.name + '\'s card'}/>
        {
        // {card.image_uris ? null : <img src={card.card_faces[1].image_uris ? card.card_faces[1].image_uris[imageSize] : cardBack} alt={card.name + '\'s card'}/>}
        }
      </Fragment>
    )
    : <img src={card.image_uris ? card.image_uris[imageSize] : cardBack} alt={card.name + '\'s card'}/>
  const cardText = card.card_faces
    ? (
      <Fragment>
        <div>
          <h5>{card.card_faces[0].name}</h5>
          <p>{card.card_faces[0].type_line}</p>
          {
          // {card.card_faces[0].oracle_text ? card.card_faces[0].oracle_text.split('\n').map((n, i) => (<p key={i}>{n}</p>)) : []}
          // <p>{card.card_faces[0].power ? `${card.card_faces[0].power}/${card.card_faces[0].toughness}` : null}</p>
          // <p>{card.card_faces[0].loyalty ? card.card_faces[0].loyalty : null}</p>
          }
        </div>
        {// <div>
        //   <h5>{card.card_faces[1].name}</h5><span>{card.card_faces[1].mana_cost}</span>
        //   <p>{card.card_faces[1].type_line}</p>
        //   {card.card_faces[1].oracle_text ? card.card_faces[1].oracle_text.split('\n').map((n, i) => (<p key={i}>{n}</p>)) : []}
        //   <p>{card.card_faces[1].power ? `${card.card_faces[1].power}/${card.card_faces[1].toughness}` : null}</p>
        //   <p>{card.card_faces[1].loyalty ? card.card_faces[1].loyalty : null}</p>
        // </div>
        }
      </Fragment>
    )
    : (
      <div>
        <h5>{card.name}</h5>
        <p>{card.type_line}</p>
        {
        // {card.oracle_text ? card.oracle_text.split('\n').map((n, i) => (<p key={i}>{n}</p>)) : []}
        // <p>{card.power ? `${card.power}/${card.toughness}` : null}</p>
        // <p>{card.loyalty ? card.loyalty : null}</p>
        }
      </div>
    )

  return (
    <div className='card-display-i'>
      {cardImages}
      {other}
      {cardText}
      <p>price: ${card.prices.usd ? card.prices.usd : '----'} ea.</p>
    </div>
  )
}

export default withRouter(DisplayCard)
