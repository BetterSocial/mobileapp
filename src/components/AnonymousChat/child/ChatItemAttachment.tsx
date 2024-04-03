/* eslint-disable no-unexpected-multiline */
import * as React from 'react';
import {Linking, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/core';

import IconFile from '../../../assets/icon/IconFile';
import IconVideoPlay from '../../../assets/icon/IconVideoPlay';
import {formatBytes} from '../../../utils/string/StringUtils';
import {ChatItemAttachmentStyles} from './ChatItemAttachmentStyles';
import {COLORS} from '../../../utils/theme';

const ChatItemAttachment = ({attachments = []}: any) => {
  const navigation = useNavigation();

  const onOpenMediaPreview = (medias, index) => {
    if (medias.find((media) => media.type === 'video')) {
      navigation.push('VideoViewer', {
        title: 'Video',
        url: medias[index].video_path
      });
    } else {
      navigation.push('ImageViewer', {
        title: 'Photo',
        index,
        images: medias
          .filter((media) => media.type === 'image')
          .map((media) => ({url: media.asset_url}))
      });
    }
  };

  return (
    <View
      style={[
        ChatItemAttachmentStyles.attachmentContainer,
        attachments?.find((item) => item.type === 'file') ? {height: 'auto'} : {}
      ]}>
      {attachments
        .filter((item, index) => index <= 3)
        .map((item, index) =>
          item.type === 'file' ? (
            <TouchableOpacity
              key={item.file_path}
              style={{flex: 1}}
              activeOpacity={1}
              onPress={() => Linking.openURL(item.file_path)}>
              <View style={ChatItemAttachmentStyles.attachmentFileContainer}>
                <View style={ChatItemAttachmentStyles.attachmentFileContent}>
                  <Text style={ChatItemAttachmentStyles.attachmentFileName} numberOfLines={1}>
                    {item.file_name}
                  </Text>
                  <View>
                    <Text style={ChatItemAttachmentStyles.attachmentFileInfo}>
                      {formatBytes(item.file_size)} •{' '}
                      {item.file_name
                        ?.split('.')
                        [item.file_name?.split('.')?.length - 1]?.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={ChatItemAttachmentStyles.attachmentFileIcon}>
                  <IconFile fill={COLORS.white2} />
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              key={item.thumb_url}
              style={{
                width: `${
                  (attachments.length >= 3 && index > 0) || attachments.length >= 4 ? 50 : 100
                }%`,
                height: `${attachments.length >= 3 ? 50 : 100 / attachments.length}%`,
                position: 'relative',
                overflow: 'hidden'
              }}
              activeOpacity={1}
              onPress={
                attachments.length > 0 && item.type !== 'gif'
                  ? () => onOpenMediaPreview(attachments, index)
                  : null
              }>
              {item.type !== 'file' && (
                <FastImage
                  style={ChatItemAttachmentStyles.image}
                  source={{
                    uri: item.thumb_url
                  }}
                />
              )}
              {attachments.length > 4 && index === 3 && (
                <View style={ChatItemAttachmentStyles.moreOverlay}>
                  <Text style={ChatItemAttachmentStyles.moreText}>+{attachments.length - 4}</Text>
                </View>
              )}
              {/* Video Play Icon */}
              {item.video_path && (
                <View style={ChatItemAttachmentStyles.moreOverlay}>
                  <IconVideoPlay />
                </View>
              )}
            </TouchableOpacity>
          )
        )}
    </View>
  );
};

export default React.memo(ChatItemAttachment);
