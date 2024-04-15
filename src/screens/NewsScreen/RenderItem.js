import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import Content from './Content';
import Gap from '../../components/Gap';
import Header from './Header';
import {COLORS, SIZES} from '../../utils/theme';
import {Footer} from '../../components';
import {getCountCommentWithChild, getCountVote} from '../../utils/getstream';
import useItemNews from './hooks/useItemNews';
import dimen from '../../utils/dimen';

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
      <View style={{paddingHorizontal: dimen.normalizeDimen(16)}}>
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
          isNews
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: dimen.normalizeDimen(SIZES.base),
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.almostBlack,
    borderColor: COLORS.gray410,
    marginHorizontal: SIZES.base,
    shadowColor: COLORS.black000,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6
  },
  wrapperFooter: {
    borderRadius: SIZES.radius,
    height: dimen.normalizeDimen(52),
    overflow: 'hidden'
  }
});

export default React.memo(RenderItem, (prevProps, nextProps) => prevProps.item === nextProps.item);
