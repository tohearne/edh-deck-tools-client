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
      nextPage: '',
      query: {
        name: '',
        nameInclude: '+',
        types: '',
        typesInclude: '+',
        text: '',
        textInclude: '+',
        colors: [],
        colorsAllAny: 'id%3C%3D',
        orderType: 'order=cmc',
        orderDir: '&dir=asc'
      },
      loaded: false,
      gettingNext: false,
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
      const cardsRes = await getCards(`order=cmc&q=f%3A${res.data.deck.format}+game%3Apaper${res.data.deck.format.toLowerCase() === 'commander' ? `+id%3C%3D${colors || 'c'}` : ''}`)
      this.setState({ deck: res.data.deck, cards: cardsRes.data.data, totalCards: cardsRes.data.total_cards, nextPage: cardsRes.data.next_page, colors, loaded: true })
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
    try {
      await this.setState({ loaded: false })
      let q = `&q=f%3A${deck.format}+game%3Apaper${deck.format.toLowerCase() === 'commander' ? `+id%3C%3D${colors || 'c'}` : ''}`
      q += query.name ? `${query.nameInclude}${encodeURIComponent(`"${query.name}"`).replace(/%20/g, '+')}` : ''
      q += query.types ? query.types.split(' ').reduce((acc, t, i) => acc + `${i > 0 ? query.typesInclude : '%28'}${t[0] === '!' ? `-t%3A${encodeURIComponent(t.slice(1))}` : `t%3A${encodeURIComponent(t)}`}`, '') + '%29' : ''
      q += query.text ? `${query.textInclude}o%3A${encodeURIComponent(`"${query.text}"`).replace(/%20/g, '+')}` : ''
      q += query.colors.length > 0 ? `+${query.colorsAllAny}${query.colors.join('')}` : ''
      const cardsRes = await getCards(query.orderType + query.orderDir + q)
      this.setState({ loaded: true, cards: cardsRes.data.data, page: 1, totalCards: cardsRes.data.total_cards, nextPage: cardsRes.data.next_page })
    } catch (err) {
      if (err.message.includes('404')) this.setState({ loaded: true, cards: [], page: 1, totalCards: null, nextPage: '' })
      else this.setState({ err })
    }
  }

  addCard = async (event) => {
    this.setState({ cardRequests: [...this.state.cardRequests, event.target.id] })
    const cardId = event.target.id
    try {
      await createCard(this.state.deck.id, cardId, false, 1, this.props.user)
      this.props.alert('Card added!', 'success')
      const res = await getDeck(this.props.match.params.id)
      this.setState({ deck: res.data.deck, cardRequests: [...this.state.cardRequests].filter(id => id !== cardId) })
    } catch (err) { this.setState({ err }) }
  }

  removeCard = async (event) => {
    this.setState({ cardRequests: [...this.state.cardRequests, event.target.id] })
    const cardId = event.target.id
    try {
      await deleteCard(cardId, this.props.user)
      this.props.alert('Card removed!', 'success')
      const res = await getDeck(this.props.match.params.id)
      this.setState({ deck: res.data.deck, cardRequests: [...this.state.cardRequests].filter(id => id !== cardId) })
    } catch (err) { this.setState({ err }) }
  }

  getPage = async (event) => {
    let target = ''
    let page = this.state.page
    if (event.target.id === 'next') {
      target = this.state.nextPage.replace(/https:\/\/api\.scryfall\.com\/cards\/search\?/, '')
      page++
    } else {
      target = this.state.prevPage.replace(/https:\/\/api\.scryfall\.com\/cards\/search\?/, '')
      page--
    }
    if (target) {
      try {
        await this.setState({ gettingNext: true })
        const cardsRes = await getCards(target)
        this.setState({ cards: cardsRes.data.data, page, nextPage: cardsRes.data.next_page, totalCards: cardsRes.data.total_cards, gettingNext: false })
      } catch (err) { this.setState({ err }) }
    }
  }

  render () {
    const { deck, page, pageSize, totalCards, nextPage, cards, query, loaded, gettingNext, cardRequests, err } = this.state
    const { match } = this.props
    if (err) {
      return (
        <Fragment>
          <h3>{err.message}</h3>
          <Link to={`/decks/${match.params.id}`}><button>Back</button></Link>
        </Fragment>
      )
    }
    const nextCards = <div>{`page ${page}/${Math.ceil(totalCards / pageSize)}: showing cards (${(page - 1) * pageSize + 1} to ${(page - 1) * pageSize + cards.length}) of ${totalCards} cards`} {nextPage ? gettingNext ? <span>| Loading...</span> : <button id='next' onClick={this.getPage}>Next</button> : null}</div>
    const cardsList = (
      <Fragment>
        {nextCards}
        <div className='cards-list'>
          {cards.map(card => {
            const deckCard = deck.cards.find(c => c.card_id === card.id)
            return (
              <Fragment key={card.id}>
                {
                  deckCard
                    ? <DisplayCard card={card} other={cardRequests.includes(`${deckCard.id}`) || deckCard.is_commander ? '' : <button id={deckCard.id} onClick={this.removeCard}>Remove from deck</button>} />
                    : <DisplayCard card={card} other={deck.card_count < 100 && !cardRequests.includes(card.id) ? <button id={card.id} onClick={this.addCard}>Add to deck</button> : ''} handleClick={this.addCard} />
                }
              </Fragment>
            )
          })}
        </div>
        {nextCards}
      </Fragment>
    )
    return (
      <Fragment>
        <Link to={`/decks/${match.params.id}`}><button>Back</button></Link>
        <SearchForm query={query} handleChange={this.handleChange} handleSubmit={this.handleSubmit} />
        {loaded ? cards.length > 0 ? cardsList : <p>No cards to show</p> : <p>Loading cards...</p>}
      </Fragment>
    )
  }
}

export default withRouter(ChooseCards)
