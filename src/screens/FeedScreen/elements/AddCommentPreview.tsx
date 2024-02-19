import React from 'react';
import {TouchableOpacity, StatusBar} from 'react-native';
import WriteComment from '../../../components/Comments/WriteComment';
import {COLORS} from '../../../utils/theme';
import {normalize} from '../../../utils/fonts';

type AddCommentPreviewProps = {
  username: string;
  isBlurred: boolean;
  heightReaction: number;
  onPressComment: () => void;
};

const tabBarHeight = StatusBar.currentHeight;

function AddCommentPreview({
  username,
  isBlurred,
  heightReaction,
  onPressComment
}: AddCommentPreviewProps) {
  return (
    !isBlurred && (
      <TouchableOpacity
        testID="writeComment"
        onPress={onPressComment}
        style={{
          maxHeight: heightReaction,
          marginBottom: heightReaction <= 0 ? tabBarHeight + normalize(10) : 0,
          borderTopWidth: 1,
          borderTopColor: COLORS.light_silver
        }}>
        <WriteComment
          postId={''}
          username={username}
          value={null}
          loadingPost={false}
          isViewOnly={true}
          withAnonymityLabel={false}
          onChangeText={() => {
            return null;
          }}
          onPress={() => {
            return null;
          }}
        />
      </TouchableOpacity>
    )
  );
}

export default AddCommentPreview;
