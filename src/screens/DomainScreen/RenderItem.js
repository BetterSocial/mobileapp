import * as React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

import Gap from '../../components/Gap';
import Memoic_globe from '../../assets/icons/ic_globe';
import MemoPeopleFollow from '../../assets/icons/Ic_people_follow';
import MemoIc_rectangle_gradient from '../../assets/Ic_rectangle_gradient';
import theme, {COLORS, FONTS, SIZES} from '../../utils/theme';
import {colors} from '../../utils/colors';
import {Footer, PreviewComment} from '../../components';
import {fonts} from '../../utils/fonts';

const RenderItem = ({domain, image}) => {
  const [previewComment, setPreviewComment] = React.useState({});
  const [isReaction, setReaction] = React.useState(false);
  const getname = (d) => {
    try {
      return d.domain.name;
    } catch (error) {
      return 'undenfined';
    }
  };

  const getTime = (d) => {
    try {
      return d.time;
    } catch (error) {
      return new Date().toUTCString();
    }
  };

  const {content} = domain;
  const name = getname(domain);
  const time = getTime(domain);

  React.useEffect(() => {
    const initial = () => {
      let reactionCount = domain.reaction_counts;
      if (JSON.stringify(reactionCount) !== '{}') {
        let comment = reactionCount.comment;
        if (comment !== undefined) {
          if (comment > 0) {
            setReaction(true);
            setPreviewComment(domain.latest_reactions.comment[0]);
          }
        }
      }
    };
    initial();
  }, [domain]);

  return (
    <View style={styles.wrapperItem}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          alignItems: 'center',
        }}>
        <View style={styles.wrapperImage}>
          <Image
            source={{
              uri: image
                ? image
                : 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
            }}
            style={[styles.image, StyleSheet.absoluteFillObject]}
          />
        </View>
        <Gap width={SIZES.base} />
        <View style={{flex: 1}}>
          <Text style={{...FONTS.h3, color: '#000000'}}>{name}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{...FONTS.body3, color: '#828282'}}>
              {new Date(time).toLocaleDateString()}
            </Text>
            <View style={styles.point} />
            <Memoic_globe height={16} width={16} />
            <View style={styles.point} />

            <MemoPeopleFollow height={16} width={16} />
            <Gap style={{width: 4}} />
            <Text
              style={{
                color: '#828282',
                fontFamily: fonts.inter[700],
                fontWeight: 'bold',
              }}>
              12k
            </Text>
          </View>
          <MemoIc_rectangle_gradient width={SIZES.width * 0.43} height={20} />
        </View>
        <View style={{justifyContent: 'center'}}>
          <TouchableOpacity>
            <View style={styles.wrapperText}>
              <Text style={{fontSize: 36, color: COLORS.holyTosca}}>+</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{paddingHorizontal: 16}}>
        <Text style={{...FONTS.h3}}>{content.title}</Text>
      </View>
      <Gap height={SIZES.base} />
      <Image
        source={{uri: content.image}}
        style={{height: SIZES.height * 0.3}}
      />
      <Gap />
      <Gap height={SIZES.base} />
      <View style={{paddingHorizontal: 16}}>
        <Text>{content.description}</Text>
      </View>
      <Gap height={16} />
      <View style={styles.wrapperFooter}>
        <Footer
          totalComment={0}
          totalVote={0}
          onPressShare={() => alert('share')}
          onPressComment={() => alert('comment')}
          onPressDownVote={() => alert('down vote')}
          onPressUpvote={() => alert('upvote')}
        />
        {isReaction && (
          <View>
            <PreviewComment
              username={previewComment.user.data.username}
              comment={previewComment.data.text}
              image={previewComment.user.data.profile_pic_url}
              time={previewComment.created_at}
              totalComment={item.latest_reactions.comment.length - 1}
              onPress={() => alert('comment')}
            />
            <Gap height={16} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperItem: {backgroundColor: 'white', marginBottom: 16},
  wrapperImage: {
    borderRadius: 45,
    borderWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.5)',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 45,
  },
  wrapperText: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: '#00ADB5',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  point: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.gray,
    marginLeft: 8,
    marginRight: 8,
  },
  wrapperFooter: {
    marginHorizontal: 16,
  },
});

export default RenderItem;
