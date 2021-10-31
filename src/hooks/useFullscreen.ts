import { ref } from '@vue/reactivity'
import { onBeforeMount, onBeforeUnmount } from '@vue/runtime-core'

export type FullScreenHandler = (event: Event) => void

export function useScreenFull(target?: HTMLElement) {
  const el = target || document.documentElement
  const fullscreenEnabled = ref(document.fullscreenEnabled)
  const isFullscreen = ref(!!document.fullscreenElement)

  const fullScreenHandlers: Array<FullScreenHandler> = []
  const exitFullScreenHandlers: Array<FullScreenHandler> = []
  const fullScreenErrorHandlers: Array<FullScreenHandler> = []

  const toggleFullScreen = (open?: boolean) => {
    if (!fullscreenEnabled.value || !el) return
    if (typeof open === 'boolean') {
      open ? el.requestFullscreen() : document.exitFullscreen()
    } else {
      isFullscreen.value ? document.exitFullscreen() : el.requestFullscreen()
    }
  }

  const fullscreenHandler = (event: Event) => {
    isFullscreen.value = !!document.fullscreenElement
    if (!!document.fullscreenElement) {
      fullScreenHandlers.forEach((handler) => handler(event))
    } else {
      exitFullScreenHandlers.forEach((handler) => handler(event))
    }
  }
  const onFullScreen = (handler: FullScreenHandler) => {
    fullScreenHandlers.push(handler)
  }
  const onExitFullScreen = (handler: FullScreenHandler) => {
    exitFullScreenHandlers.push(handler)
  }
  const onFullscreenError = (handler: FullScreenHandler) => {
    fullScreenErrorHandlers.push(handler)
  }
  const fullscreenErrorHandler = (event: Event) => {
    fullScreenErrorHandlers.forEach((handler) => handler(event))
  }
  onBeforeMount(() => {
    document.addEventListener('fullscreenchange', fullscreenHandler)
    document.addEventListener('fullscreenerror', fullscreenErrorHandler)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', fullscreenHandler)
    document.removeEventListener('fullscreenerror', fullscreenErrorHandler)
  })

  return {
    fullscreenEnabled,
    isFullscreen,
    toggleFullScreen,
    onFullScreen,
    onExitFullScreen,
    onFullscreenError,
  }
}
