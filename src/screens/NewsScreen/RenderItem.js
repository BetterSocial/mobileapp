import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import Content from './Content';
import Gap from '../../components/Gap';
import Header from './Header';
import {COLORS, SIZES} from '../../utils/theme';
import {Footer} from '../../components';
import {getCountCommentWithChild, getCountVote} from '../../utils/getstream';
import useItemNews from './hooks/useItemNews';

const RenderItem = ({
  item,
  onPressShare = () => {},
  onPressComment = () => {},
  onPressBlock = () => {},
  onPressDownVote = () => {},
  onPressUpvote = () => {},
  selfUserId
}) => {
  const {
    onPressDownVoteHandle,
    onPressUpvoteNew,
    voteStatus,
    totalVote,
    setTotalVote,
    validationStatusVote
  } = useItemNews();

  React.useEffect(() => {
    const initialVote = () => {
      const c = getCountVote(item);
      setTotalVote(c);
    };
    initialVote();
  }, [item]);

  React.useEffect(() => {
    validationStatusVote(item, selfUserId);
  }, [item, selfUserId]);

  return (
    <View style={styles.container}>
      <View style={{paddingHorizontal: 18}}>
        <Header
          image={item.domain.image}
          domain={item.domain.name}
          time={item.content.created_at}
          item={item}
        />
        <Content
          item={item}
          title={item.content.title}
          image={item.content.image}
          description={item.content.description}
          url={item.content.url}
        />
      </View>
      <Gap height={8} />
      <View style={styles.wrapperFooter}>
        <Footer
          totalComment={getCountCommentWithChild(item)}
          totalVote={totalVote}
          onPressShare={() => onPressShare(item)}
          onPressComment={() => onPressComment(item)}
          onPressBlock={() => onPressBlock(item)}
          onPressDownVote={() => onPressDownVoteHandle(item, onPressDownVote)}
          onPressUpvote={() => onPressUpvoteNew(item, onPressUpvote)}
          statusVote={voteStatus}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.almostBlack,
    elevation: 0.0,
    borderColor: COLORS.gray400,
    marginHorizontal: SIZES.base
  },
  wrapperFooter: {
    // marginHorizontal: SIZES.base,
    height: 52
  }
});

export default React.memo(RenderItem, (prevProps, nextProps) => prevProps.item === nextProps.item);
