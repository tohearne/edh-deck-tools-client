'use strict'
import React, { Component, Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'

import { getDecks } from '../api'
import DeckPreviewImage from '../shared/DeckPreviewImage'

class Decks extends Component {
  constructor (props) {
    super(props)

    this.state = {
      decks: [],
      loaded: false,
      err: null
    }
  }

  async componentDidMount () {
    try {
      const res = await getDecks()
      this.setState({ decks: res.data.decks, loaded: true })
    } catch (err) { this.setState({ err }) }
  }

  render () {
    const { decks, loaded, err } = this.state
    const { match } = this.props
    if (err) {
      return (
        <Fragment>
          <h3>{err.message}</h3>
          <Link to={`/decks/${match.params.id}`}><button>Back</button></Link>
        </Fragment>
      )
    }
    if (!loaded) return <p>Loading Decks...</p>
    const decksList = decks.map(deck => (
      <div key={deck.id} className='deck-prev-i'>
        <DeckPreviewImage deck={deck} />
        <p>By: {deck.owner.name}</p>
      </div>
    ))
    return (
      <div className='decks-list'>
        { decksList.length > 0 ? decksList : <p>No decks to show</p>}
      </div>
    )
  }
}

export default withRouter(Decks)
