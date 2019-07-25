'use strict'
import React, { Component, Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'

import { getCard, getDeck, deleteDeck } from '../api'
import DisplayCard from '../shared/DisplayCard'

class Deck extends Component {
  constructor (props) {
    super(props)

    this.state = {
      deck: null,
      commanders: [],
      cards: [],
      price: 0,
      loaded: false,
      err: null
    }
  }

  wait = async (ms) => {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }

  findCards = async myCards => {
    if (myCards.length < 1) return
    const res = await getCard(myCards[0].card_id)
    if (myCards[0].is_commander) await this.setState({ commanders: [...this.state.commanders, res.data], price: parseFloat((this.state.price + (res.data.prices.usd * myCards[0].amount)).toFixed(2)) })
    else await this.setState({ cards: [...this.state.cards, res.data], price: parseFloat((this.state.price + (res.data.prices.usd * myCards[0].amount)).toFixed(2)) })
    const cards = [...myCards]
    await this.wait(100)
    return this.findCards(cards.splice(1))
  }

  async componentDidMount () {
    try {
      const res = await getDeck(this.props.match.params.id)
      await this.findCards(res.data.deck.cards)
      this.setState({ deck: res.data.deck, loaded: true })
    } catch (err) { this.setState({ err }) }
  }

  destroyDeck = async (event) => {
    try {
      await deleteDeck(this.props.match.params.id, this.props.user)
      this.props.alert('Deck Deleted!', 'success')
      this.props.history.push('/')
    } catch (err) { this.setState({ err }) }
  }

  render () {
    const { deck, commanders, cards, price, loaded, err } = this.state
    const { user, match } = this.props
    if (err) {
      return (
        <Fragment>
          <h3>{err.message}</h3>
          <Link to={'/'}><button>Back</button></Link>
        </Fragment>
      )
    }
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
          {user && user.id === deck.owner.id ? <Link to={`${match.url}/choose-commander`}>Choose your commander</Link> : <p>No commander chosen</p>}
        </div>
      )
    const cardsList = cards.map(card => {
      const deckCard = deck.cards.find(c => c.card_id === card.id)
      return (
        <Fragment key={card.id}>
          <DisplayCard card={card} other={deckCard.amount > 1 ? <p>x{deckCard.amount}</p> : null} />
        </Fragment>
      )
    })
    const addCards = user && user.id === deck.owner.id
      ? deck.format === 'commander'
        ? deck.card_count < 100 && commanders.length > 0
          ? (
            <Fragment>
              <Link to={`${match.url}/choose-cards`}><button>Add cards</button></Link>
              <Link to={`${match.url}/choose-lands`}><button>Basic lands</button></Link>
              <p>{100 - deck.card_count} more required!</p>
            </Fragment>
          ) : null
        : (
          <Fragment>
            <Link to={`${match.url}/choose-cards`}><button>Add cards</button></Link>
            <Link to={`${match.url}/choose-lands`}><button>Basic lands</button></Link>
            {deck.card_count < 60 ? <p>{60 - deck.card_count} more required!</p> : null}
          </Fragment>
        )
      : null
    return (
      <Fragment>
        <h1>{deck.title}</h1>
        <p>Total cost: ${price}</p>
        {user && user.id === deck.owner.id ? (
          <Fragment>
            <Link to={`${match.url}/edit`}><button>Edit Deck</button></Link>
            <button onClick={this.destroyDeck}>Delete Deck</button>
          </Fragment>
        )
          : null}
        {deck.format === 'commander' ? commandersList : ''}
        <h4>Cards:</h4>
        <div className='cards-list'>
          { cardsList.length > 0 ? cardsList : <p>No cards to show</p>}
        </div>
        {addCards}
      </Fragment>
    )
  }
}

export default withRouter(Deck)
