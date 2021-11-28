import { createPinia, PiniaPlugin } from 'pinia'

export const pinia = createPinia()

const storagePlugin: PiniaPlugin = (context) => {
  const key = `pinia_${context.store.$id}`
  const stateStr = localStorage.getItem(key)
  if (stateStr) {
    try {
      const state = JSON.parse(stateStr)
      context.store.$patch(state)
    } catch (err) {}
  }
  context.store.$subscribe((mutation, state) => {
    localStorage.setItem(key, JSON.stringify(state))
  })
}

pinia.use(storagePlugin)
