/* @flow */

export const getUrl = (protocol: string, host: string, port: string): string => {
  let url = protocol + '://' + host
  if ((protocol === 'http' && port !== '80') || (protocol === 'https' && port !== '443')) {
    url += ':' + port
  }
  return url
}
