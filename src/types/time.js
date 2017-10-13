export const delay = t => v =>
  new Promise(resolve => setTimeout(resolve, t, v))
