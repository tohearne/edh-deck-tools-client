'use strict'
import React from 'react'
import { withRouter } from 'react-router-dom'

const CardAddForm = ({ value, id, max, handleChange, handleSubmit }) => (
  <form className='search-form' id={id} onSubmit={handleSubmit}>
    <label htmlFor="name">Amount</label>
    <input
      name={id}
      value={value}
      type="number"
      max={max}
      min='0'
      placeholder="Card Name"
      onChange={handleChange}
    />
    <button type="submit">Save</button>
  </form>
)

export default withRouter(CardAddForm)
