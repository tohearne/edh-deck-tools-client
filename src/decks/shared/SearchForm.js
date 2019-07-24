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
      name="nameExactAny"
      onChange={handleChange}
    >
      <option value={''}>Exact</option>
      <option value={','}>All</option>
      <option value={'|'}>Any</option>
    </select><br />
    <label htmlFor="supertypes">Supertypes</label>
    <input
      name="supertypes"
      value={query.supertypes}
      type="text"
      placeholder="Supertypes"
      onChange={handleChange}
    />
    <select
      name="superAndOr"
      onChange={handleChange}
    >
      <option value={','}>And</option>
      <option value={'|'}>Or</option>
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
      name="typesAndOr"
      onChange={handleChange}
    >
      <option value={','}>And</option>
      <option value={'|'}>Or</option>
    </select><br />
    <label htmlFor="subtypes">Subtypes</label>
    <input
      name="subtypes"
      value={query.subtypes}
      type="text"
      placeholder="Subtypes"
      onChange={handleChange}
    />
    <select
      name="subAndOr"
      onChange={handleChange}
    >
      <option value={','}>And</option>
      <option value={'|'}>Or</option>
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
      name="textExactAny"
      onChange={handleChange}
    >
      <option value={''}>Exact</option>
      <option value={','}>All</option>
      <option value={'|'}>Any</option>
    </select><br />
    <label htmlFor="colors:">Colors</label><br />
    <label htmlFor="white">White</label>
    <input
      name="colors"
      value='W'
      type="checkbox"
      onChange={handleChange}
    />
    <label htmlFor="blue">Blue</label>
    <input
      name="colors"
      value='U'
      type="checkbox"
      onChange={handleChange}
    />
    <label htmlFor="black">Black</label>
    <input
      name="colors"
      value='B'
      type="checkbox"
      onChange={handleChange}
    />
    <label htmlFor="red">Red</label>
    <input
      name="colors"
      value='R'
      type="checkbox"
      onChange={handleChange}
    />
    <label htmlFor="green">Green</label>
    <input
      name="colors"
      value='G'
      type="checkbox"
      onChange={handleChange}
    />
    <select
      name="colorsAllAny"
      onChange={handleChange}
    >
      <option value={','}>All</option>
      <option value={'|'}>Any</option>
    </select><br />
    <button type="submit">Search</button>
  </form>
)

export default withRouter(DisplayCard)
