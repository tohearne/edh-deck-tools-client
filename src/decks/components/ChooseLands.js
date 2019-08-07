'use strict'
import React, { Component, Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'

import { getCard, getCards, getDeck, createCard, patchCard, deleteCard } from '../api'
import CardAddForm from '../shared/CardAddForm'
import DisplayCard from '../shared/DisplayCard'

class ChooseLands extends Component {
  constructor (props) {
    super(props)

    this.state = {
      deck: null,
      colors: '',
      cards: [],
      values: {},
      loaded: false,
      cardRequests: [],
      err: null
    }
  }

  async componentDidMount () {
    try {
      const res = await getDeck(this.props.match.params.id)
      const commanders = []
      for (let i = 0; i < res.data.deck.cards.length; i++) {
        if (res.data.deck.cards[i].is_commander) {
          const c = await getCard(res.data.deck.cards[i].card_id)
          commanders.push(c.data)
        }
      }
      const colors = commanders.reduce((acc, c) => acc + c.color_identity.join('').toLowerCase(), '')
      const cardsRes = await getCards(`order=color&q=f%3A${res.data.deck.format}+game%3Apaper${res.data.deck.format.toLowerCase() === 'commander' ? `+id%3C%3D${colors || 'c'}` : ''}+t%3Abasic+t%3Aland`)
      const values = {}
      for (let i = 0; i < cardsRes.data.data.length; i++) {
        const deckCard = res.data.deck.cards.find(c => c.card_id === cardsRes.data.data[i].id)
        if (deckCard) values[cardsRes.data.data[i].id] = deckCard.amount
        else values[cardsRes.data.data[i].id] = 0
      }
      this.setState({ deck: res.data.deck, cards: cardsRes.data.data, values, colors, loaded: true })
    } catch (err) { this.setState({ err }) }
  }

  handleChange = event => {
    this.setState({ values: { ...this.state.values, [event.target.name]: event.target.value } })
  }

  handleSubmit = async event => {
    event.preventDefault()
    this.setState({ cardRequests: [...this.state.cardRequests, event.target.id] })
    const cardId = event.target.id
    const value = parseInt(this.state.values[cardId])
    const deckCard = this.state.deck.cards.find(card => `${card.card_id}` === `${cardId}`)
    if (deckCard) {
      if (value > 0) await patchCard(deckCard.id, value, this.props.user)
      else await deleteCard(deckCard.id, this.props.user)
    } else await createCard(this.state.deck.id, cardId, false, value, this.props.user)
    const res = await getDeck(this.props.match.params.id)
    this.setState({ deck: res.data.deck, cardRequests: [...this.state.cardRequests].filter(id => id !== cardId) })
  }

  render () {
    const { deck, cards, values, loaded, cardRequests, err } = this.state
    const { match } = this.props
    if (err) {
      return (
        <Fragment>
          <h3>{err.message}</h3>
          <Link to={`/decks/${match.params.id}`}><button>Back</button></Link>
        </Fragment>
      )
    }
    const cardsList = (
      <Fragment>
        <div className='cards-list'>
          {cards.map(card => {
            const deckCard = deck.cards.find(c => c.card_id === card.id)
            return (
              <Fragment key={card.id}>
                <DisplayCard
                  card={card}
                  other={
                    cardRequests.includes(`${card.id}`)
                      ? ''
                      : <CardAddForm
                        value={values[card.id]}
                        max={deck.format === 'commander' ? 100 - deck.card_count + (deckCard ? deckCard.amount : 0) : undefined}
                        min={0}
                        id={card.id}
                        handleChange={this.handleChange}
                        handleSubmit={this.handleSubmit}
                      />
                  } />
              </Fragment>
            )
          })}
        </div>
      </Fragment>
    )
    return (
      <Fragment>
        <Link to={`/decks/${match.params.id}`}><button>Back</button></Link>
        {loaded ? cards.length > 0 ? cardsList : <p>No cards to show</p> : <p>Loading cards...</p>}
      </Fragment>
    )
  }
}

export default withRouter(ChooseLands)
