'use strict'
import React from 'react'
import { withRouter } from 'react-router-dom'

const DisplayCard = ({ query, handleChange, handleSubmit }) => (
  <form className='search-form' onSubmit={handleSubmit}>
    <h3>Advanced Search</h3>
    <label htmlFor="name">Card Name</label>
    <input
      name="name"
      value={query.name}
      type="text"
      placeholder="Card Name"
      onChange={handleChange}
    />
    <select
      name="nameInclude"
      onChange={handleChange}
    >
      <option value={true}>Include</option>
      <option value={false}>Exact</option>
    </select><br />
    <label htmlFor="types">Types</label>
    <input
      name="types"
      value={query.types}
      type="text"
      placeholder="Types"
      onChange={handleChange}
    />
    <select
      name="typesInclude"
      onChange={handleChange}
    >
      <option value={true}>Include</option>
      <option value={false}>Exclude</option>
    </select><br />
    <label htmlFor="text">Card Text</label>
    <input
      name="text"
      value={query.text}
      type="text"
      placeholder="Card Text"
      onChange={handleChange}
    />
    <select
      name="textInclude"
      onChange={handleChange}
    >
      <option value={true}>Include</option>
      <option value={false}>Exclude</option>
    </select><br />
    <label htmlFor="colors:">Colors</label><br />
    <label htmlFor="white">White</label>
    <input
      name="colors"
      value='w'
      type="checkbox"
      onChange={handleChange}
    />
    <label htmlFor="blue">Blue</label>
    <input
      name="colors"
      value='u'
      type="checkbox"
      onChange={handleChange}
    />
    <label htmlFor="black">Black</label>
    <input
      name="colors"
      value='b'
      type="checkbox"
      onChange={handleChange}
    />
    <label htmlFor="red">Red</label>
    <input
      name="colors"
      value='r'
      type="checkbox"
      onChange={handleChange}
    />
    <label htmlFor="green">Green</label>
    <input
      name="colors"
      value='g'
      type="checkbox"
      onChange={handleChange}
    />
    <label htmlFor="colorless">Colorless</label>
    <input
      name="colors"
      value='c'
      type="checkbox"
      onChange={handleChange}
    />
    <select
      name="colorsAllAny"
      onChange={handleChange}
    >
      <option value={'id%3C%3D'}>Include</option>
      <option value={'id!%3D'}>Exclude</option>
      <option value={'id%3D'}>Exact</option>
    </select><br />
    <label htmlFor="order">Order</label>
    <select
      name="orderType"
      onChange={handleChange}
    >
      <option value={'order=cmc'}>Cost</option>
      <option value={'order=name'}>Name</option>
      <option value={'order=usd'}>Price</option>
    </select>
    <select
      name="orderDir"
      onChange={handleChange}
    >
      <option value={'&dir=asc'}>Ascending</option>
      <option value={'&dir=desc'}>Descending</option>
    </select><br />
    <button type="submit">Search</button>
  </form>
)

export default withRouter(DisplayCard)
