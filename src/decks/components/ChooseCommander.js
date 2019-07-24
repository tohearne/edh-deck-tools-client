'use strict'
import React, { Component, Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'

import { getCards, getDeck, createCard } from '../api'
import SearchForm from '../shared/SearchForm'
import DisplayCard from '../shared/DisplayCard'

class ChooseCommander extends Component {
  constructor (props) {
    super(props)

    this.state = {
      deck: null,
      cards: [],
      count: null,
      pages: null,
      query: {
        name: '',
        nameExactAny: '',
        supertypes: '',
        superAndOr: ',',
        types: '',
        typesAndOr: ',',
        subtypes: '',
        subAndOr: ',',
        text: '',
        colors: [],
        colorsAllAny: ',',
        textExactAny: ''
      },
      loaded: false,
      err: null
    }
  }

  async componentDidMount () {
    try {
      const res = await getDeck(this.props.match.params.id)
      const cards = await getCards({ supertypes: 'legendary', types: 'creature', legalities: { format: 'Commander', legality: 'Legal|Restricted' } })
      this.setState({ deck: res.data.deck, cards, loaded: true })
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
    const { query } = this.state
    const name = query.nameExactAny ? query.name.replace(/[\s,]+/g, query.nameExactAny).replace(/(^|[,|]+)($|[,|]+)/mg, '') : query.name
    let supertypes = query.supertypes.replace(/legendary/ig, '').replace(/[\s,]+/g, query.superAndOr).replace(/(^|[,|]+)($|[,|]+)/mg, '').toLowerCase()
    supertypes += supertypes ? ',legendary' : 'legendary'
    let types = query.types.replace(/creature/ig, '').replace(/[\s,]+/g, query.typesAndOr).replace(/(^|[,|]+)($|[,|]+)/mg, '').toLowerCase()
    types += types ? ',creature' : 'creature'
    const subtypes = query.subtypes.replace(/[\s,]+/g, query.subAndOr).replace(/(^|[,|]+)($|[,|]+)/mg, '').toLowerCase()
    const text = query.textExactAny ? query.text.replace(/[\s,]+/g, query.textExactAny).replace(/(^|[,|]+)($|[,|]+)/mg, '') : query.text
    const colorIdentity = query.colors.join(query.colorsAllAny)
    try {
      const resCards = await getCards({ name, supertypes, types, subtypes, text, colorIdentity, legalities: { format: 'Commander', legality: 'Legal|Restricted' } })
      this.setState({ cards: resCards })
    } catch (err) { this.setState({ err }) }
  }

  addCard = async (event) => {
    const cardId = event.target.id
    try {
      await createCard(this.state.deck.id, cardId, true, this.props.user)
      this.props.alert('Commander added!', 'success')
      this.props.history.push(`/decks/${this.props.match.params.id}`)
    } catch (err) { this.setState({ err }) }
  }

  render () {
    const { deck, cards, query, loaded } = this.state
    const { match } = this.props
    const cardsList = cards.map(card => loaded
      ? (
        <div key={card.id}>
          <DisplayCard card={card} buttonText='Add to deck' handleClick={this.addCard} />
        </div>
      )
      : <p>Loading cards...</p>
    )
    return (
      <Fragment>
        <h1>{deck.name}</h1>
        <Link to={`/decks/${match.params.id}`}><button>Back</button></Link>
        <SearchForm query={query} handleChange={this.handleChange} handleSubmit={this.handleSubmit} />
        { cardsList.length > 0 ? cardsList : <p>No cards to show</p>}
      </Fragment>
    )
  }
}

export default withRouter(ChooseCommander)
