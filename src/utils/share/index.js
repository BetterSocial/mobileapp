import analytics from '@react-native-firebase/analytics';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { Share } from 'react-native';

const shareDomain = (item) => {
    console.log('Share in domain')
}

const shareNews = (item) => {
    console.log('Share in news')
}

const sharePostInTopic = async (item, analyticsLogEvent, analyticsId) => {
    analytics().logEvent(analyticsLogEvent, {
        id: analyticsId,
    });
    await buildShare(item)
}

const sharePostInProfile = async (item, analyticsLogEvent, analyticsId) => {
    analytics().logEvent(analyticsLogEvent, {
        id: analyticsId,
    });
    await buildShare(item)
}

const shareFeeds = async (item, analyticsLogEvent, analyticsId) => {
    analytics().logEvent(analyticsLogEvent, {
        id: analyticsId,
    });
    await buildShare(item)
}

const buildShare = async(item) => {
    try {
        const result = await Share.share({
            message: await buildLink(item),
        });
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
            // shared with activity type of result.activityType
            } else {
            // shared
            }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
    } catch (error) {
        alert(error.message);
    }
}

const buildLink = async(item) => {
    const link = await dynamicLinks().buildLink({
        link: `https://dev.bettersocial.org/${item}`,
        domainUriPrefix: 'https://bettersocialapp.page.link',
        analytics: {
            campaign: 'banner',
        },
        navigation: {
            forcedRedirectEnabled: false,
        },
        // ios: {
        //   bundleId: '',
        //   // customScheme: 'giftit',
        //   appStoreId: '',
        // },
        android: {
            packageName: 'org.bettersocial.dev',
        },
    },
    'SHORT',
    );
    return link;
}

export default {
    shareDomain,
    shareFeeds,
    shareNews,
    sharePostInProfile,
    sharePostInTopic
}