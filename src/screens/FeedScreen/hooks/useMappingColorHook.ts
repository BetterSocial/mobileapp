import FeedStorage from '../../../utils/storage/custom/feedStorage';
import {checkIsHasColor, hexToRgb} from '../../../utils/theme';
import {getRandomInt} from '../../../utils/Utils';
import {listFeedColor} from '../../../configs/FeedColor';

const useMappingPostColorHook = () => {
  const handleBgContentFeed = (feed) => {
    if (feed.anon_user_info_color_code) {
      const rgb = hexToRgb(feed?.anon_user_info_color_code, 0.25);
      const color = {
        bg: `${rgb}`,
        color: 'rgba(0,0,0)'
      };
      return color;
    }

    const randomIndex = getRandomInt(0, listFeedColor.length);
    let newColor = listFeedColor[randomIndex];
    newColor = {
      ...newColor,
      bg: hexToRgb(newColor.bg, 0.25) || '',
      color: 'rgba(0,0,0)'
    };
    return newColor;
  };

  const mappingColorFeed = (dataFeed) => {
    const mapNewData = dataFeed?.map((feed) => {
      const feedCache = FeedStorage.get(feed?.id);
      let newFeed = {...feed};

      if (feedCache?.bg) {
        const isHexColor = checkIsHasColor(feedCache.bg);
        newFeed = {...feed};
        if (isHexColor) {
          newFeed.bg = hexToRgb(feedCache.bg, 0.25);
        } else {
          newFeed.bg = feedCache.bg;
        }
      } else {
        newFeed = {...feed, ...handleBgContentFeed(feed)};
      }

      FeedStorage.set(feed?.id, newFeed);
      return newFeed;
    });

    return mapNewData;
  };

  return {
    mappingColorFeed
  };
};

export default useMappingPostColorHook;
