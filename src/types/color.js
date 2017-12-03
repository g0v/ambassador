/* @flow */

import md5 from 'md5'

type HSL = {
  h: number,
  s: number,
  l: number
}

// port from: https://github.com/g0v/Logbot/blob/master/public/applications.js
const _colorCache: { [key: string]: HSL } = {}
export const nickname = (nickname: string): HSL => {
  if (_colorCache[nickname]) return _colorCache[nickname]

  const frag = parseInt(md5(nickname).substring(0, 6), 16)
  const h = Math.floor(((frag & 0xff0000) >> 16) / 255 * 360)
  const s = Math.floor(((frag & 0xff00) >> 8) / 255 * 60 + 20)
  const l = Math.floor((frag & 0xff) / 255 * 20 + 50)

  return { h, s, l }
}

export const styleFromHSL = (hsl: HSL): string =>
  console.log(hsl) || `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
