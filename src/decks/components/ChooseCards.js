'use strict'
import React, { Component, Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'

import { getCard, getCards, getDeck, createCard, deleteCard } from '../api'
import SearchForm from '../shared/SearchForm'
import DisplayCard from '../shared/DisplayCard'

class ChooseCards extends Component {
  constructor (props) {
    super(props)

    this.state = {
      deck: null,
      colors: '',
      cards: [],
      totalCards: null,
      page: 1,
      pageSize: 175,
      query: {
        name: '',
        nameInclude: true,
        types: '',
        typesInclude: true,
        text: '',
        textInclude: true,
        colors: [],
        colorsAllAny: 'id%3C%3D',
        orderType: 'order=cmc',
        orderDir: '&dir=asc'
      },
      loaded: false,
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
      const cardsRes = await getCards(`order=cmc&q=f%3A${res.data.deck.format}+game%3Apaper${res.data.deck.format.toLowerCase() === 'commander' ? `+id%3C%3D${colors || 'c'}` : ''}`)
      this.setState({ deck: res.data.deck, cards: cardsRes.data.data, totalCards: cardsRes.data.total_cards, colors, loaded: true })
    } catch (err) { this.setState({ err }) }
  }

  handleChange = event => {
    if (event.target.type && event.target.type === 'checkbox') {
      if (event.target.checked) this.state.query[event.target.name].push(event.target.value)
      else this.setState({ query: { ...this.state.query, [event.target.name]: this.state.query[event.target.name].filter(n => n !== event.target.value) } })
    } else this.setState({ query: { ...this.state.query, [event.target.name]: event.target.value } })
  }

  handleSubmit = async event => {
    event.preventDefault()
    const { deck, colors, query } = this.state
    let q = `&q=f%3A${deck.format}+game%3Apaper${deck.format.toLowerCase() === 'commander' ? `+id%3C%3D${colors || 'c'}` : ''}`
    q += query.name ? `+${query.nameInclude ? '' : '!'}${encodeURIComponent(`"${query.name}"`).replace(/%20/g, '+')}` : ''
    q += query.types ? query.types.split(' ').reduce((acc, t) => acc + `+${query.typesInclude ? '' : '-'}t%3A${encodeURIComponent(t)}`, '') : ''
    q += query.text ? `+${query.textInclude ? '' : '-'}o%3A${encodeURIComponent(`"${query.text}"`).replace(/%20/g, '+')}` : ''
    q += query.colors.length > 0 ? `+${query.colorsAllAny}${query.colors.join('')}` : ''
    try {
      const cardsRes = await getCards(query.orderType + query.orderDir + q)
      this.setState({ cards: cardsRes.data.data, page: 1, totalCards: cardsRes.data.total_cards })
    } catch (err) { this.setState({ err }) }
  }

  addCard = async (event) => {
    this.setState({ loaded: false })
    const cardId = event.target.id
    try {
      await createCard(this.state.deck.id, cardId, false, this.props.user)
      this.props.alert('Card added!', 'success')
      const res = await getDeck(this.props.match.params.id)
      this.setState({ deck: res.data.deck, loaded: true })
    } catch (err) { this.setState({ err }) }
  }

  removeCard = async (event) => {
    this.setState({ loaded: false })
    const cardId = event.target.id
    try {
      await deleteCard(cardId, this.props.user)
      this.props.alert('Card removed!', 'success')
      const res = await getDeck(this.props.match.params.id)
      this.setState({ deck: res.data.deck, loaded: true })
    } catch (err) { this.setState({ err }) }
  }

  render () {
    const { deck, page, pageSize, totalCards, cards, query, loaded, err } = this.state
    const { match } = this.props
    if (err) {
      return (
        <Fragment>
          <h3>{err}</h3>
          <Link to={`/decks/${match.params.id}`}><button>Back</button></Link>
        </Fragment>
      )
    }
    const cardsList = (
      <Fragment>
        <div>{`Page ${page}: showing (${(page - 1) * pageSize + 1}----${(page - 1) * pageSize + cards.length}) of ${totalCards} cards`}</div>
        {cards.map(card => {
          const deckCard = deck.cards.find(c => c.card_id === card.id)
          return (
            <div key={card.id}>
              {
                deckCard
                  ? <DisplayCard card={card} buttonText={deckCard.is_commander ? '' : 'Remove from deck'} handleClick={this.removeCard} altId={deck.cards.find(c => c.card_id === card.id).id}/>
                  : <DisplayCard card={card} buttonText={deck.cards.length < 100 ? 'Add to deck' : ''} handleClick={this.addCard} />
              }
            </div>
          )
        })}
      </Fragment>
    )
    return (
      <Fragment>
        <Link to={`/decks/${match.params.id}`}><button>Back</button></Link>
        <SearchForm query={query} handleChange={this.handleChange} handleSubmit={this.handleSubmit} />
        { cards.length > 0 ? cardsList : loaded ? <p>No cards to show</p> : <p>Loading cards...</p>}
      </Fragment>
    )
  }
}

export default withRouter(ChooseCards)
