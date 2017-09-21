export const NOP = 'NOP'
export const Nop = () => ({ type: NOP })

export const getUrl = (protocol, host, port) => {
  let url = protocol + '://' + host
  if ((protocol === 'http' && port !== '80') || (protocol === 'https' && port !== '443')) {
    url += ':' + port
  }
  return url
}
