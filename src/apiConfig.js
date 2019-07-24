let apiUrl
const apiUrls = {
  production: 'https://lit-gorge-98463.herokuapp.com',
  development: 'http://localhost:4741'
}

if (window.location.hostname === 'localhost') {
  apiUrl = apiUrls.development
} else {
  apiUrl = apiUrls.production
}

// export const mtgUrl = 'https://api.magicthegathering.io/v1'
export const mtgUrl = 'https://api.scryfall.com'

export default apiUrl
