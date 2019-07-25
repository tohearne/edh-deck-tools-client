import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import './Header.scss'

const authenticatedOptions = (
  <Fragment>
    <Link to="/change-password">Change Password</Link>
    <Link to="/sign-out">Sign Out</Link>
  </Fragment>
)

const unauthenticatedOptions = (
  <Fragment>
    <Link to="/sign-up">Sign Up</Link>
    <Link to="/sign-in">Sign In</Link>
  </Fragment>
)

const alwaysOptions = (
  <Fragment>
    <Link to="/"><button>Home</button></Link>
  </Fragment>
)

const userOptions = (
  <Fragment>
    <Link to="/create-deck"><button>New Deck</button></Link>
    <Link to="/my-decks"><button>My Decks</button></Link>
  </Fragment>
)

const Header = ({ user }) => (
  <Fragment>
    <header className="main-header">
      <h1>EDH Deck Tools</h1>
      <nav>
        {user && <span>Welcome, {user.name}</span>}
        {user ? authenticatedOptions : unauthenticatedOptions}
      </nav>
    </header>
    {alwaysOptions}
    {user ? userOptions : null}
  </Fragment>
)

export default Header
