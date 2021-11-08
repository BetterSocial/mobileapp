// import React from 'react';
// import {FlatList, StyleSheet} from 'react-native';
// import PropTypes from 'prop-types';

// const styles = StyleSheet.create({
//   flatlistContainer: {
//     paddingBottom: 0,
//   },
//   scrollContainer: {
//     paddingHorizontal: 10,
//   },
// });
// const TiktokScroll = (props) => {
//   const {data, children, loading} = props;
//   const flatListRef = React.useRef();

//   const endDrag = ({nativeEvent}) => {
//     const index =
//       nativeEvent.contentOffset.y / nativeEvent.layoutMeasurement.height;
//     const round = Math.round(index);
//     console.log(round, feeds.length, 'kamui');
//     // console.log(index, nativeEvent, 'salip')
//     if (round < feeds.length - 1) {
//       flatListRef.current.scrollToIndex({
//         index: round,
//       });
//     } else {
//       onEndReach();
//     }
//   };
//   return (
//     <FlatList
//       data={data}
//       renderItem={children}
//       keyExtractor={(item, index) => {
//         return item.id;
//       }}
//       showsVerticalScrollIndicator={false}
//       snapToInterval={20}
//       snapToAlignment="center"
//       decelerationRate="fast"
//       contentContainerStyle={styles.flatlistContainer}
//       style={styles.scrollContainer}
//       ref={flatListRef}
//       onMomentumScrollEnd={endDrag}
//       refreshing={loading}
//     />
//   );
// };

// TiktokScroll.propTypes = {
//   data: PropTypes.array.isRequired,
//   children: PropTypes.node.isRequired,
//   loading: PropTypes.bool
// };

// export default TiktokScroll;
