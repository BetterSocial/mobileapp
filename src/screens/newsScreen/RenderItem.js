import * as React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

import Header from './Header';
import Content from './Content';
import {Footer} from '../../components';
import {COLORS, SIZES} from '../../utils/theme';
import Gap from '../../components/Gap';
import {getCountComment, getCountVote} from '../../utils/getstream';

const RenderItem = ({
  item,
  onPressShare = () => {},
  onPressComment = () => {},
  onPressBlock = () => {},
  onPressDownVote = () => {},
  onPressUpvote = () => {},
  selfUserId,
}) => {
  const [voteStatus, setVoteStatus] = React.useState('none');
  const [statusUpvote, setStatusUpvote] = React.useState(false);
  const [statusDownvote, setStatusDowvote] = React.useState(false);
  React.useEffect(() => {
    const validationStatusVote = () => {
      if (statusDownvote === false && statusUpvote === false) {
        setVoteStatus('none');
      } else if (statusDownvote === true) {
        setVoteStatus('downvote');
      } else if (statusUpvote === true) {
        setVoteStatus('upvote');
      }
      console.log(voteStatus);
    };

    validationStatusVote();
  }, [item, selfUserId, statusDownvote, statusUpvote, voteStatus]);

  return (
    <View>
      <View style={styles.container}>
        <Header
          image={item.domain.image}
          domain={item.domain.name}
          time={item.content.created_at}
        />
        <Content
          title={item.content.title}
          image={item.content.image}
          description={item.content.description}
          url={item.content.url}
        />
      </View>
      <View style={styles.wrapperFooter}>
        <Footer
          totalComment={getCountComment(item)}
          totalVote={getCountVote(item)}
          onPressShare={() => onPressShare(item)}
          onPressComment={() => onPressComment(item)}
          onPressBlock={() => onPressBlock(item)}
          onPressDownVote={() => {
            // onPressDownVote(item);
            setStatusDowvote((prev) => {
              prev = !prev;
              if (prev) {
                setStatusUpvote(false);
              }
              return prev;
            });
          }}
          onPressUpvote={() => {
            // onPressUpvote(item);
            setStatusUpvote((prev) => {
              prev = !prev;
              if (prev) {
                setStatusDowvote(false);
              }
              return prev;
            });
          }}
          statusVote={voteStatus}
        />
      </View>
      <Gap height={8} />
      <View style={{height: 1, width: '100%', backgroundColor: '#C4C4C4'}} />
      <Gap height={16} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.base,
    borderRadius: SIZES.radius,
    elevation: 1,
    borderColor: COLORS.gray,
    paddingVertical: SIZES.base,
    marginHorizontal: SIZES.base,
  },
  wrapperFooter: {
    marginHorizontal: SIZES.base,
  },
});

export default RenderItem;
