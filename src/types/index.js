/* @flow */

export const getUrl = (protocol: ?string, host: ?string, port: ?string): string => {
  protocol = protocol || 'http'
  host = host || 'localhost'
  port = port || '80'
  let url = protocol + '://' + host
  if ((protocol === 'http' && port !== '80') || (protocol === 'https' && port !== '443')) {
    url += ':' + port
  }
  return url
}
