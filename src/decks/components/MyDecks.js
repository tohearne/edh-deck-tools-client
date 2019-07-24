'use strict'
import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'

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
    const { decks, loaded } = this.state
    if (!loaded) return <p>Loading...</p>
    const decksList = decks.map(deck => (
      <DeckPreviewImage key={deck.id} deck={deck} />
    ))
    return (
      <Fragment>
        { decksList.length > 0 ? decksList : <p>No decks to show</p>}
      </Fragment>
    )
  }
}

export default withRouter(Decks)
