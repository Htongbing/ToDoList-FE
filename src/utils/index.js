export function formatSearch(str) {
  const obj = {}
  const reg = /([^?#=&]+)=([^?#=&]+)/g
  str.slice(1).replace(reg, (_, key, value) => {
    obj[key] = value
  })
  return obj
}