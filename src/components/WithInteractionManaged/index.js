/* eslint-disable react/display-name */
import React from 'react';
import {StatusBar} from 'react-native';
import {Transition, Transitioning} from 'react-native-reanimated';

import {useAfterInteractions} from '../../hooks/useAfterInteractions';

export function withInteractionsManaged(Component, Placeholder) {
  return (props) => {
    const {transitionRef, interactionsComplete} = useAfterInteractions();
    return (
      <Transitioning.View
        transition={
          <Transition.Together>
            <Transition.Change interpolation="easeInOut" />
            <Transition.In type="fade" />
          </Transition.Together>
        }
        style={{flex: 1}}
        ref={transitionRef}>
        {interactionsComplete ? <Component {...props} /> : Placeholder && <Placeholder />}
      </Transitioning.View>
    );
  };
}

export function withInteractionsManagedNoStatusBar(Component, Placeholder) {
  return (props) => {
    const {transitionRef, interactionsComplete} = useAfterInteractions();
    return (
      <Transitioning.View
        transition={
          <Transition.Together>
            <Transition.Change interpolation="easeInOut" />
            <Transition.In type="fade" />
          </Transition.Together>
        }
        style={{flex: 1}}
        ref={transitionRef}>
        <StatusBar translucent={false} barStyle={'light-content'} />
        {interactionsComplete ? <Component {...props} /> : Placeholder && <Placeholder />}
      </Transitioning.View>
    );
  };
}
