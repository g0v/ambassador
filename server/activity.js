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
//   , time bigint
//   , fields text[]
//   )

type BaseActivity = {
  type: 'UNKNOWN_ACTIVITY',
  email: string, // the email should be unique, should not send to the client
  login: string, // the login name, can be a hash to hide the identity
  time: number
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
  index: number
}

type LinkActivity = BaseActivity & {
  type: 'LINK_ACTIVITY',
  date: string,  // log
  index: number, // log
  tag: string
}

type UnlinkActivity = BaseActivity & {
  type: 'UNLINK_ACTIVITY',
  date: string,  // log
  index: number, // log
  tag: string
}

type ResourceCreateActivity = BaseActivity & {
  type: 'RESOURCE_CREATE_ACTIVITY',
  uri: string,
  tags: string[]
}

// the activity in the database
type ActivityEntry = {
  id: number,
  type: string,
  email: string,
  login: string,
  time: number,
  fields: string[]
}
*/

const UNKNOWN_ACTIVITY = 'UNKNOWN_ACTIVITY'
const TOKEN_SET_ACTIVITY = 'TOKEN_SET_ACTIVITY'
const TOKEN_UPDATE_ACTIVITY = 'TOKEN_UPDATE_ACTIVITY'
const LOG_CREATE_ACTIVITY = 'LOG_CREATE_ACTIVITY'
const HASHTAG_CREATE_ACTIVITY = 'HASHTAG_CREATE_ACTIVITY'
const LINK_ACTIVITY = 'LINK_ACTIVITY'
const UNLINK_ACTIVITY = 'UNLINK_ACTIVITY'
const RESOURCE_CREATE_ACTIVITY = 'RESOURCE_CREATE_ACTIVITY'

const fromEntry = (entry /*: ActivityEntry */): /* Activity */ {
  switch (entry.type) {
    case TOKEN_SET_ACTIVITY: {
      return {
        type: TOKEN_SET_ACTIVITY,
        email: entry.email,
        login: entry.login,
        time: entry.time,
        token: entry.fields[0]
      }
    }
    case TOKEN_UPDATE_ACTIVITY: {
      return {
        type: TOKEN_UPDATE_ACTIVITY,
        email: entry.email,
        login: entry.login,
        time: entry.time,
        token: entry.fields[0]
      }
    }
    case HASHTAG_CREATE_ACTIVITY: {
      return {
        type: HASHTAG_CREATE_ACTIVITY,
        email: entry.email,
        login: entry.login,
        time: entry.time,
        tag: entry.fields[0]
      }
    }
    case LOG_CREATE_ACTIVITY: {
      return {
        type: LOG_CREATE_ACTIVITY,
        email: entry.email,
        login: entry.login,
        time: entry.time,
        date: entry.fields[0],
        index: +entry.fields[1]
      }
    }
    case LINK_ACTIVITY: {
      return {
        type: LINK_ACTIVITY,
        email: entry.email,
        login: entry.login,
        time: entry.time,
        date: entry.fields[0],
        index: +entry.fields[1],
        tag: entry.fields[2]
      }
    }
    case UNLINK_ACTIVITY: {
      return {
        type: UNLINK_ACTIVITY,
        email: entry.email,
        login: entry.login,
        time: entry.time,
        date: entry.fields[0],
        index: +entry.fields[1],
        tag: entry.fields[2]
      }
    }
    case RESOURCE_CREATE_ACTIVITY: {
      return {
        type: RESOURCE_CREATE_ACTIVITY,
        email: entry.email,
        login: entry.login,
        time: entry.time,
        uri: entry.fields[0],
        tags: entry.fields.slice(1)
      }
    }
    default: {
      // BaseActivity
      return {
        type: UNKNOWN_ACTIVITY,
        email: entry.email,
        login: entry.login,
        time: entry.time
      }
    }
  }
}

const toEntry = (activity /*: Activity */): /* ActivityEntry */ {
  switch (activity.type) {
    case TOKEN_SET_ACTIVITY: {
      return {
        type: TOKEN_SET_ACTIVITY,
        email: activity.email,
        login: activity.login,
        time: activity.time,
        fields: [activity.token]
      }
    }
    case TOKEN_UPDATE_ACTIVITY: {
      return {
        type: TOKEN_UPDATE_ACTIVITY,
        email: activity.email,
        login: activity.login,
        time: activity.time,
        fields: [activity.token]
      }
    }
    case HASHTAG_CREATE_ACTIVITY: {
      return {
        type: HASHTAG_CREATE_ACTIVITY,
        email: activity.email,
        login: activity.login,
        time: activity.time,
        fields: [activity.tag]
      }
    }
    case LOG_CREATE_ACTIVITY: {
      return {
        type: LOG_CREATE_ACTIVITY,
        email: activity.email,
        login: activity.login,
        time: activity.time,
        fields: [activity.date, activity.index]
      }
    }
    case LINK_ACTIVITY: {
      return {
        type: LINK_ACTIVITY,
        email: activity.email,
        login: activity.login,
        time: activity.time,
        fields: [activity.date, activity.index, activity.tag]
      }
    }
    case UNLINK_ACTIVITY: {
      return {
        type: UNLINK_ACTIVITY,
        email: activity.email,
        login: activity.login,
        time: activity.time,
        fields: [activity.date, activity.index, activity.tag]
      }
    }
    case RESOURCE_CREATE_ACTIVITY: {
      return {
        type: RESOURCE_CREATE_ACTIVITY,
        email: activity.email,
        login: activity.login,
        time: activity.time,
        fields: [activity.uri].concat(activity.tags)
      }
    }
    default: {
      // BaseActivity
      return {
        type: UNKNOWN_ACTIVITY,
        email: activity.email,
        login: activity.login,
        time: activity.time,
        fields: []
      }
    }
  }
}
