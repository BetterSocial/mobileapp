import React, { ComponentType } from 'react'
import { Transition, Transitioning } from 'react-native-reanimated'
import { useAfterInteractions } from '../../hooks/useAfterInteractions'

export function withInteractionsManaged(
  Component,
  Placeholder
) {
  return (props) => {
    const { transitionRef, interactionsComplete } = useAfterInteractions()
    return (
      <Transitioning.View
        transition={
          <Transition.Together>
            <Transition.Change interpolation="easeInOut" />
            <Transition.In type="fade" />
          </Transition.Together>
        }
        style={{ flex: 1 }}
        ref={transitionRef}
      >
        {interactionsComplete ? (
          <Component {...props} />
        ) : (
          Placeholder && <Placeholder />
        )}
      </Transitioning.View>
    )
  }
}