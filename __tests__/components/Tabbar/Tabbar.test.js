import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import Tabbar from '../../../src/components/Tabbar';

describe('Tabbar should run correctly', () => {
  const state = {
    routes: [{key: 'user'}, {key: 'communities'}],
    index: 1
  };
  const descriptors = {
    user: {
      options: {
        tabBarLabel: 'User'
      }
    },
    communities: {
      options: {
        tabBarLabel: 'Communities'
      }
    }
  };
  it('tabbar should match with snapshot', () => {
    const navigation = {
      emit: jest.fn()
    };
    const {toJSON} = render(
      <Tabbar state={state} navigation={navigation} descriptors={descriptors} />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('tabbar onPress should run correctly', async () => {
    const navigation = {
      emit: jest.fn().mockImplementation(() => ({
        defaultPrevented: false
      })),
      navigate: jest.fn()
    };
    const {getByTestId} = render(
      <Tabbar state={state} navigation={navigation} descriptors={descriptors} />
    );
    await fireEvent.press(getByTestId('btn1'));
    expect(navigation.emit).toHaveBeenCalled();
    await fireEvent.press(getByTestId('btn0'));
    expect(navigation.navigate).toHaveBeenCalled();
  });
});

// import React from 'react';
// import {View, TouchableOpacity, StyleSheet} from 'react-native';
// import Animated from 'react-native-reanimated';
// import {colors} from '../../utils/colors';
// import {fonts} from '../../utils/fonts';

// const S = StyleSheet.create({
//   container: {
//     paddingHorizontal: 22,
//     paddingVertical: 20,
//     display: 'flex',
//     flexDirection: 'column'
//   },

//   containertitle: {
//     fontSize: 16
//   },

//   toptabcontainer: {
//     flexDirection: 'row',
//     backgroundColor: colors.white,
//     borderBottomColor: '#00000050',
//     borderBottomWidth: 1,
//     paddingHorizontal: 4
//   },

//   singletab: {
//     flex: 1,
//     paddingLeft: 16
//   },

//   singletabtext: {
//     fontFamily: fonts.inter[500],
//     textAlign: 'left',
//     fontSize: 14,
//     paddingVertical: 10
//   },

//   viewborderbottom: {
//     borderBottomColor: colors.holytosca,
//     borderBottomWidth: 1
//   }
// });

// const Tabbar = ({state, descriptors, navigation, position}) => {
//   return (
//     <View style={S.toptabcontainer}>
//       {state.routes.map((route, index) => {
//         const {options} = descriptors[route.key];
//         const label =
//           options.tabBarLabel !== undefined
//             ? options.tabBarLabel
//             : options.title !== undefined
//             ? options.title
//             : route.name;

//         const isFocused = state.index === index;

//         const onPress = () => {
//           const event = navigation.emit({
//             type: 'tabPress',
//             target: route.key,
//             canPreventDefault: true
//           });

//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name);
//           }
//         };

//         const inputRange = state.routes.map((_, i) => i);
//         const opacity = Animated.interpolateNode(position, {
//           inputRange,
//           outputRange: inputRange.map((i) => (i === index ? 1 : 0.3))
//         });

//         return (
//           <TouchableOpacity
//             key={index}
//             accessibilityRole="button"
//             accessibilityState={isFocused ? {selected: true} : {}}
//             accessibilityLabel={options.tabBarAccessibilityLabel}
//             testID={options.tabBarTestID}
//             onPress={onPress}
//             style={S.singletab}>
//             <Animated.Text style={{opacity, ...S.singletabtext}}>{label}</Animated.Text>
//             <View style={isFocused ? S.viewborderbottom : {}} />
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// };

// export default Tabbar;
