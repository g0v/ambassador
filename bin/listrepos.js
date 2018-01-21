import readline from 'readline'
import P from 'parsimmon'
import GitHub from 'github-api'
import { Pool } from 'pg'
import db from '../server/database'
import { compose, map, forEach } from 'ramda'

// parser
const SLASH = '/'
const ANY = '*'

const RepoList = P.createLanguage({
  Symbol: r => P.regexp(/[a-zA-Z0-9-._]+/),
  Slash: r => P.string(SLASH),
  Any: r => P.string(ANY),
  Line: r =>
    P.seq(
      r.Symbol,
      r.Slash,
      P.alt(
        r.Symbol,
        r.Any
      )
    ).map(([user, _, repo]) => ({ user, repo })),
  List: r =>
    r.Line
      .trim(P.optWhitespace)
      .many()
})

// database
const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })

// main: generate the repo list from STDIN
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})

let lines = []
rl.on('line', line => lines.push(line))
rl.on('close', async () => {
  const input = lines.join(' ')
  const ast = RepoList.List.tryParse(input)

  const { value: token } =
    await db.test(pool).then(_ => db.config.get(pool, 'access token'))
  const gh = new GitHub({ token })

  let repos = []
  for (const it of ast) {
    if (it.repo !== ANY) {
      repos.push(it)
      continue
    }

    let res
    try {
      res = await gh.getOrganization(it.user).getRepos()
    } catch (err) {
      res = await gh.getUser(it.user).listRepos()
    }

    forEach(
      (r => repos.push({ user: it.user, repo: r.name })),
      res.data
    )
  }

  console.log(JSON.stringify(repos, null, 2))
})
