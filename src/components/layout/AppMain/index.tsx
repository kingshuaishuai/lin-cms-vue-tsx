import { defineComponent, Component, Transition } from 'vue'
import { RouterView } from 'vue-router'

export default defineComponent({
  name: 'AppMain',
  setup() {
    return () => {
      return (
        <RouterView>
          {({ Component }: { Component: Component }) => {
            return (
              <Transition name="fade-transform" appear mode="out-in">
                {Component}
              </Transition>
            )
          }}
        </RouterView>
      )
    }
  },
})
