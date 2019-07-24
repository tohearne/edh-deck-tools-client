'use strict'
import React, { Component, Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'

import { getCards, getDeck } from '../api'
import DisplayCard from '../shared/DisplayCard'

class Deck extends Component {
  constructor (props) {
    super(props)

    this.state = {
      deck: null,
      commanders: [],
      cards: [],
      loaded: false,
      err: null
    }
  }

  async componentDidMount () {
    try {
      const res = await getDeck(this.props.match.params.id)
      const commanders = []
      let cards = []
      if (res.data.deck.cards.length > 0) {
        const cardIds = res.data.deck.cards.reduce((acc, curr, i) => {
          return acc + (i > 0 ? '|' : '') + curr.card_id
        }, '')
        cards = await getCards({ id: cardIds })
        if (res.data.deck.format === 'Commander') {
          const commanderIds = res.data.deck.cards.filter(card => card.is_commander).map(card => card.card_id)
          cards = cards.filter(card => {
            if (commanderIds.includes(card.id)) commanders.push(card)
            else return true
          })
        }
      }
      this.setState({ deck: res.data.deck, commanders, cards, loaded: true })
    } catch (err) { this.setState({ err }) }
  }

  render () {
    const { deck, commanders, cards, loaded } = this.state
    const { user, match } = this.props
    if (!loaded) return <p>Loading deck...</p>
    const commandersList = commanders.length > 0
      ? commanders.length > 1
        ? (
          <div className='commanders'>
            <h4>Commanders:</h4>
            {
              commanders.map(commander => (
                <DisplayCard key={commander.id} card={commander} />
              ))
            }
          </div>
        )
        : (
          <div className='commander'>
            <h4>Commander:</h4>
            <DisplayCard key={commanders[0].id} card={commanders[0]} />
          </div>
        )
      : (
        <div className='commander'>
          {user && user.id === deck.user.id ? <Link to={`${match.url}/choose-commander`}>Choose your commander</Link> : <p>No commander chosen</p>}
        </div>
      )
    const cardsList = cards.map(card => (
      <Fragment key={card.id}>
        <img src={card.imageUrl} alt={card.name}/>
      </Fragment>
    ))
    const addCards = user && user.id === deck.user.id
      ? deck.format === 'Commander'
        ? deck.cards.length < 100 && commanders.length > 0
          ? (
            <Fragment>
              <Link to={`${match.url}/choose-cards`}><button>Add cards</button></Link>
              <p>{100 - deck.cards.length} more required!</p>
            </Fragment>
          ) : null
        : (
          <Fragment>
            <Link to={`${match.url}/choose-cards`}><button>Add cards</button></Link>
            {deck.cards.length < 60 ? <p>{60 - deck.cards.length} more required!</p> : null}
          </Fragment>
        )
      : null
    return (
      <Fragment>
        <h1>{deck.title}</h1>
        {commandersList}
        { cardsList.length > 0 ? cardsList : <p>No cards to show</p>}
        {addCards}
      </Fragment>
    )
  }
}

export default withRouter(Deck)
