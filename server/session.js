// @flow

const GitHub = require('github-api')
const moment = require('moment')

/*::
type Token = string
type Timestamp = number

type Session = {
  token: Token,
  login: string,
  email: ?string,
  created: Timestamp
}

type SessionMap = { [key: Token]: Session }

type EMail = {
  email: string,
  primary: boolean,
  verified: boolean,
  visibility: ?string
}
*/

let sessionMap /*: SessionMap */ = {}

function create(token /*: Token */) /*: Promise<Session> */ {
  const gh = new GitHub({ token })
  const user = gh.getUser()

  return user.getProfile()
    .then(({ data: profile }) => {
      // profile.email is empty
      return user.getEmails()
        .then(({ data: emails }) => {
          const session = {
            token,
            login: profile.login,
            email: findFirstValidMail(emails),
            created: +moment()
          }
          // XXX: should keep the promise
          sessionMap[token] = session

          return session
        })
    })
}

function findFirstValidMail(emails /*: EMail[] */) /*: ?string */ {
  for (let i = 0; i < emails.length; i++) {
    const m = emails[i]
    if (m.email && m.primary && m.verified && m.visibility === 'public') {
      return m.email
    }
  }
}

function query(token /*: Token */) /*: Promise<Session> */ {
  let s = sessionMap[token]
  console.log(token)

  if (s) {
    return Promise.resolve(s)
  } else {
    return create(token)
  }
}

function remove(token /*: Token */) /*: Promise<Session> */ {
  const result = sessionMap[token]

  delete sessionMap[token]

  return Promise.resolve(result)
}

module.exports = {
  create,
  query,
  remove
}
