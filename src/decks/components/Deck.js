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
      loaded: false,
      err: null
    }
  }

  findCards = async myCards => {
    if (myCards.length < 1) return
    const res = await getCard(myCards[0].card_id)
    if (myCards[0].is_commander) await this.setState({ commanders: [...this.state.commanders, res.data] })
    else await this.setState({ cards: [...this.state.cards, res.data] })
    const cards = [...myCards]
    return setTimeout(() => this.findCards(cards.splice(1)), 100)
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
    const cardsList = cards.map(card => <DisplayCard key={card.id} card={card} />)
    const addCards = user && user.id === deck.user.id
      ? deck.format === 'commander'
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
        {user && user.id === deck.user.id ? <button onClick={this.destroyDeck}>Delete Deck</button> : null}
        {deck.format.toLowerCase() === 'commander' ? commandersList : ''}
        { cardsList.length > 0 ? cardsList : <p>No cards to show</p>}
        {addCards}
      </Fragment>
    )
  }
}

export default withRouter(Deck)
