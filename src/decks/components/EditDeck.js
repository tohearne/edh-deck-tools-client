'use strict'
import React, { Component, Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'

// import { getFormats, createDeck } from '../api'
import { getDeck, patchDeck } from '../api'

class EditDeck extends Component {
  constructor (props) {
    super(props)

    this.state = {
      deck: null,
      err: null
    }
  }

  async componentDidMount () {
    try {
      const res = await getDeck(this.props.match.params.id)
      this.setState({ deck: res.data.deck, loaded: true })
    } catch (err) { this.setState({ err }) }
  }

  handleChange = event => this.setState({
    deck: { ...this.state.deck, [event.target.name]: event.target.value }
  })

  onEditDeck = async event => {
    event.preventDefault()
    const { alert, history, user } = this.props
    try {
      await patchDeck(this.state.deck, user)
      history.push('/decks/' + this.state.deck.id)
    } catch (err) {
      alert('Failed to update Deck', 'danger')
      this.setState({ err })
    }
  }

  render () {
    const { deck, err } = this.state
    const { match } = this.props
    if (err) {
      return (
        <Fragment>
          <h3>{err.message}</h3>
          <Link to={`/decks/${match.params.id}`}><button>Back</button></Link>
        </Fragment>
      )
    }
    if (!deck) return <p>Loading Deck...</p>
    return (
      <form className='deck-form' onSubmit={this.onEditDeck}>
        <h3>Edit Deck</h3>
        <label htmlFor="title">Title</label>
        <input
          required
          name="title"
          value={deck.title}
          type="text"
          placeholder="Title"
          onChange={this.handleChange}
        />
        <label htmlFor="public">Visibility</label>
        <select
          name="public"
          onChange={this.handleChange}
          defaultValue={deck.public}
        >
          <option value={false}>Private</option>
          <option value={true}>Public</option>
        </select>
        <button type="submit">Edit Deck</button>
        <Link to={`/decks/${match.params.id}`}><button>Back</button></Link>
      </form>
    )
  }
}

export default withRouter(EditDeck)
