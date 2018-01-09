/*::
type Activity
  = TokenSetActivity
  | TokenUpdateActivity
  | HashtagCreateActivity
  | LogCreateActivity
  | LinkActivity
  | UnlinkActivity
  | ResourceCreateActivity

// ToDo: activity table
// CREATE TABLE IF NOT EXISTS activity
//   ( id serial PRIMARY KEY
//   , type text
//   , email text
//   , login text
//   , fields text[]
//   )

type BaseActivity = {
  email: string, // the email should be unique, should not send to the client
  login: string  // the login name, can be a hash to hide the identity
}

type TokenSetActivity = BaseActivity & {
  type: 'TOKEN_SET_ACTIVITY',
  token: string
}

type TokenUpdateActivity = BaseActivity & {
  type: 'TOKEN_UPDATE_ACTIVITY',
  token: string
}

type HashtagCreateActivity = BaseActivity & {
  type: 'HASHTAG_CREATE_ACTIVITY',
  tag: string
}

type LogCreateActivity = BaseActivity & {
  type: 'LOG_CREATE_ACTIVITY',
  date: string,
  index: string
}

type LinkActivity = BaseActivity & {
  type: 'LINK_ACTIVITY',
  date: string,  // log
  index: string, // log
  tag: string
}

type UnlinkActivity = BaseActivity & {
  type: 'UNLINK_ACTIVITY',
  date: string,  // log
  index: string, // log
  tag: string
}

type ResourceCreateActivity = BaseActivity & {
  type: 'RESOURCE_CREATE_ACTIVITY',
  uri: string,
  tags: string[]
}
*/
