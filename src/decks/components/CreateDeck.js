'use strict'
import React, { Component, Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'

// import { getFormats, createDeck } from '../api'
import { createDeck } from '../api'

class CreateDeck extends Component {
  constructor (props) {
    super(props)

    this.state = {
      title: '',
      format: 'commander',
      image: '',
      public: false,
      allFormats: [],
      loaded: false,
      err: null
    }
  }

  // async componentDidMount () {
  //   try {
  //     const res = await getFormats()
  //     this.setState({ format: res.data.formats[0], allFormats: res.data.formats, loaded: true })
  //   } catch (err) { this.setState({ err }) }
  // }

  handleChange = event => this.setState({
    [event.target.name]: event.target.value
  })

  onCreateDeck = event => {
    event.preventDefault()
    const { alert, history, user } = this.props
    createDeck(this.state, user)
      .then(() => history.push('/'))
      .catch(err => {
        this.setState({ title: '', format: '', public: false, err })
        alert('Failed to create Deck', 'danger')
      })
  }

  render () {
    // const { title, allFormats, loaded } = this.state
    const { title, err } = this.state
    if (err) {
      return (
        <Fragment>
          <h3>{err.message}</h3>
          <Link to={'/'}><button>Back</button></Link>
        </Fragment>
      )
    }
    return (
      <form className='deck-form' onSubmit={this.onCreateDeck}>
        <h3>Create New Deck</h3>
        <label htmlFor="title">Title</label>
        <input
          required
          name="title"
          value={title}
          type="text"
          placeholder="Title"
          onChange={this.handleChange}
        />
        {
        // <label htmlFor="format">Format</label>
        // <select
        //   name="format"
        //   onChange={this.handleChange}
        // >
        //   {formatOptions}
        // </select>
        }
        <label htmlFor="public">Type</label>
        <select
          name="public"
          onChange={this.handleChange}
        >
          <option value={false}>Private</option>
          <option value={true}>Public</option>
        </select>
        <button type="submit">Create Deck</button>
      </form>
    )
  }
}

export default withRouter(CreateDeck)
