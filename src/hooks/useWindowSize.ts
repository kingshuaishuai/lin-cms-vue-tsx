import { onMounted, onUnmounted, ref } from "vue"

export enum WINDOW_SIZE {
  LARGE,
  MIDDLE,
  SMALL
}

function useWindowSize() {
  const windowSize = ref(WINDOW_SIZE.LARGE)
  const windowWidth = ref(document.body.clientWidth)
  const windowHeight = ref(document.body.clientHeight)
  function setWindowSize() {
    const width = document.body.clientWidth
    if (width < 500) {
      windowSize.value = WINDOW_SIZE.SMALL
    } else if (width <= 768) {
      windowSize.value = WINDOW_SIZE.MIDDLE
    } else {
      windowSize.value = WINDOW_SIZE.LARGE
    }
    windowWidth.value = width
    windowHeight.value = document.body.clientHeight
  }
  onMounted(setWindowSize)
  window.addEventListener('resize', setWindowSize)
  onUnmounted(() => {
    window.removeEventListener('resize', setWindowSize)
  })
  return {
    windowSize,
    windowWidth,
    windowHeight
  }
}

export default useWindowSize
