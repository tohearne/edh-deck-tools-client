'use strict'
import React, { Component, Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'

import { getMyDecks } from '../api'
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
      const res = await getMyDecks(this.props.user)
      this.setState({ decks: res.data.decks, loaded: true })
    } catch (err) { this.setState({ err }) }
  }

  render () {
    const { decks, loaded, err } = this.state
    if (err) {
      return (
        <Fragment>
          <h3>{err.message}</h3>
          <Link to={'/'}><button>Back</button></Link>
        </Fragment>
      )
    }
    if (!loaded) return <p>Loading Decks...</p>
    const decksList = decks.map(deck => (<DeckPreviewImage key={deck.id} deck={deck} />))
    return (
      <div className='decks-list'>
        { decksList.length > 0 ? decksList : <p>No decks to show</p>}
      </div>
    )
  }
}

export default withRouter(Decks)
