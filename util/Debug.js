
export function simulateLatency(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}
