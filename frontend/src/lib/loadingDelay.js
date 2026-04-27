const DEFAULT_MINIMUM_LOADING_DELAY = 180

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export async function withMinimumLoadingDelay(callback, minimumDelay = DEFAULT_MINIMUM_LOADING_DELAY) {
  const startedAt = Date.now()

  try {
    return await callback()
  } finally {
    const remainingDelay = minimumDelay - (Date.now() - startedAt)

    if (remainingDelay > 0) {
      await wait(remainingDelay)
    }
  }
}
