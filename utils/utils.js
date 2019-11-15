export const flatTo2DArr = (arr, chunkSize = 3) => {
  let result = []
  while (arr.length > chunkSize) {
    result.push(arr.splice(0, chunkSize))
  }
  result.push(arr)
  return result
}
