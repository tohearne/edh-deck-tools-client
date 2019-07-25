# **EDH Deck Tools** - client

EDH Deck Tools is a web application that allows users to log in, create/update/delete decks, add cards to their decks,
and view decks shared by other users.

**Technologies Used**
===

Back-End
---
- Ruby
- Rails
- Active Record
- PostgreSQL

Front-End
---
- Javascript
- React

Styling
---
- HTML
- CSS
- Sass


Links
---
* Front-End Repo: https://github.com/tohearne/edh-deck-tools-client
* Back-End Repo: https://github.com/tohearne/edh-deck-tools-server
* Deployed Front-End: https://tohearne.github.io/edh-deck-tools-client/#/
* Deployed Back-End: https://lit-gorge-98463.herokuapp.com

User Stories
------

### Authorization
* As a new user, I can sign up for the application using a username, email and password.
* As a newly signed up user, I want to automatically be signed in as well.
* As a signed in user, I can change my password.
* As a signed in user, I can sign out.

### Deck Create/Edit
* Without needing to be signed in, I can get get all public decks.
* As a signed in user, I can create a new deck.
* As a signed in user, I can change the title, and if it is public or private.
* As a signed in user, I can delete decks I have created.

### Add Cards
* As a signed in user, I can see all surveys.
* As a signed in user, I can submit a response to any survey.
* As a signed in user, I can view the results of any survey.

Wireframe / Entity Relationship Diagram
------
![Wireframe/ERD](https://i.imgur.com/ijgSJC7.jpg)

### Schema Definitions

| Table:   Users
|----------|------------------------
| name     | `string :unique, null: false`
| email    | `string :unique, null: false`
| password | `string null: false`
| token    | `string :unique, null: false`

| Table:   Decks :belongs_to :user
|----------|------------------------
| title    | `text null: false`
| format   | `text null: false`
| image    | `text`
| public   | `boolean null: false`
| user_id  | `reference null: false`

| Table:        Cards :belongs_to :deck
|--------------|------------------------
| card_id      | `text null: false`
| is_commander | `boolean null: false`
| amount       | `integer null: false`
| deck_id      | `reference null: false`

API Paths & Methods
------
### Authentication

| Method | URL
|--------|------------------------
| POST   | `/sign-up`
| POST   | `/sign-in`
| PATCH  | `/change-password/`
| DELETE | `/sign-out/`

### Surveys

| Method | URL
|--------|------------------------
| POST   | `/decks`
| GET    | `/decks`
| GET    | `/my-decks`
| GET    | `/decks/:id`
| PATCH  | `/decks/:id`
| DELETE | `/decks/:id`

### Options

| Method | URL
|--------|------------------------
| POST   | `/card`
| PATCH  | `/card/:id`
| DELETE | `/card/:id`

Work
------

### Day 0
**GOAL:** Research APIs
* Looked at a few 3rd party MTG APIs
* Found 2 that might work
* Picked the one that seemed simpler
* Read through documentation thuroghly

### Day 1
**GOAL:** Create backend API / Start frontend
* Scaffolded backend
* Modifed backend files to require authentication for actions
* Modified deck index route to return only public decks
* Added a unique path for getting all of a user's decks
* Created base for frontend
* Got auth crud working
* Created a path/form for creating decks
* Tested 3rd party API requests

### Day 2
**GOAL:** Finish decks Get cards from 3rd party Add cards to decks
* Created two index and a view componenet / paths for decks
* Created template for displaying decks
* Worked extensively getting the 3rd party API working
* Created template for displaying cards
* Added requests for adding/removing a card to a deck
* Created form for adding a query to the 3rd party API request to get specific cards
* Realized the limitations of the current 3rd party API

### Day 3
**GOAL:** Rework with other 3rd party API
* Reworked form to create correct URI Encoded requests to new API
* Adjusted card template to match the new data
* Added delete request for decks
* Created edit form for decks
* Added card_count to the return data of decks in the backend
* Added amount column to cards table in the backend

### Day 4
**GOAL:** Add next page functionality Add option to add mltiple cards at once Polish Deploy
* Added a count of how many cards exist in a query
* Added button to get next page of results
* Added button to add basic lands to deck
* Reworked card template to accept an other parameter to add various things to a card
* Created a form that lets the user add multiple cards to their deck,
  update the amount of that card card are in that deck or delete that card if none are left
* Fixed issues remaining with card/deck systems
* Deployed front and backends
* Fixed issues with deployed backend
* Removed or fixed query options that were not functioning as intended
* Reworded some site/message text to make things more clear

Process
------
* Methodically worked on code feature-by-feature
* Tested code thoroughly after each new feature was added (TDD)
* Planned for the future and was constantly looking out for things that might cause trouble later on

Problem-Solving Strategy
------

* Utilized online resources such as StackOverflow to investigate ways to resolve issues
* Pinpointed issues by using console.log
* Discussed and resolved code issues with the help of others

Plans for Future Improvements
------
* Improve styling for a nicer looking site
* Add more query options for more accurate serches
* Add a previous button for navigating result pages
* Add support for multiple commanders (partner)
* Add the option to pick your deck's format
* Add deck statistics (mana-cost graph / color split / type split)
* Add aws intigration to let users submit images for their decks (or the option to use a commander as the image)
* Add support for edge-case cards (i.e. 'you can have any number of X card in your deck')
