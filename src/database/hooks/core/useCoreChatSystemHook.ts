import * as React from "react";
import Config from 'react-native-config';
import useWebSocket from 'react-native-use-websocket';
import { StreamFeed, UR } from "getstream";

import ChannelList from "../../schema/ChannelListSchema";
import clientStream from "../../../utils/getstream/streamer";
import useLocalDatabaseHook from "../useLocalDatabaseHook";
import { DEFAULT_PROFILE_PIC_PATH } from "../../../utils/constants";
import { getAccessToken, getAnonymousToken, getToken } from "../../../utils/token";
import { getAnonymousUserId, getUserId } from "../../../utils/users";

const useCoreChatSystemHook = () => {
	const { localDb } = useLocalDatabaseHook()
	const [messages, setMessages] = React.useState([]);

	const feedSubscriptionRef = React.useRef<StreamFeed<UR, UR, UR, UR, UR, UR> | undefined>(undefined);

	const getSocketUrl = React.useCallback(() => {
		return new Promise(async resolve => {
			const url = await initAuthorization();
			return resolve(url);
		});
	}, []);

	const { lastJsonMessage } = useWebSocket(getSocketUrl, {
		onOpen: () => console.log('opened'),
		shouldReconnect: (closeEvent) => true
	})

	const generateUserDataUrlEncoded: (userId: string, token: string) => string = (userId: string, token: string) => {
		const userData = {
			"user_id": userId,
			"user_details": {
				"id": userId,
				"name": "AnonymousUser",
				"image": DEFAULT_PROFILE_PIC_PATH,
				"invisible": true
			},
			"user_token": token,
			"server_determines_connection_id": true
		}

		return encodeURIComponent(JSON.stringify(userData));
	}

	const generateWebsocketUrl: (urlEncodedData: string, token: string) => string = (urlEncodedData, token) => {
		return 'wss://chat-us-east-1.stream-io-api.com/connect?json=' + urlEncodedData +
			'&api_key=' + Config.STREAM_API_KEY +
			'&authorization=' + token +
			'&stream-auth-type=jwt' +
			'&X-Stream-Client=stream-chat-javascript-client-browser-4.2.0';
	}

	const initAuthorization = async () => {
		const token: any = await getAnonymousToken();
		const userId: string = await getAnonymousUserId();

		const urlEncodedData = generateUserDataUrlEncoded(userId, token);
		const websocketUrl = generateWebsocketUrl(urlEncodedData, token);
		return websocketUrl
	}

	const initFeedSubscription = async () => {
		const token: any = await getAnonymousToken();
		const userId: string = await getAnonymousUserId();
		// console.log('userId')
		// console.log(userId)
		const client = clientStream(token);
		const notifFeed = client?.feed('notification', userId, token);
		// const client = clientStream(
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjg3MWM5ZmQtYWI3OS00MWFmLTk3ZGYtZDhmN2ZmZjQ0ZDBkIiwiZXhwIjoxNjg3NzkxMDk1fQ.EOuemYn_JJclLN31QLYwjSSAMm3s_tBjaOr21YQ4Go0'
    // );
    // const notifFeed = client?.feed(
    //   'notification',
    //   'f871c9fd-ab79-41af-97df-d8f7fff44d0d',
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjg3MWM5ZmQtYWI3OS00MWFmLTk3ZGYtZDhmN2ZmZjQ0ZDBkIiwiZXhwIjoxNjg3NzkxMDk1fQ.EOuemYn_JJclLN31QLYwjSSAMm3s_tBjaOr21YQ4Go0'
    // );
		notifFeed?.subscribe((data) => {
			console.log('data');
			console.log(data);
			const postNotifChannel = ChannelList.fromPostNotifObject(data);
			postNotifChannel.save(localDb);
		});

		feedSubscriptionRef.current = notifFeed;
	}

	const initChannelListData = async () => {
		if (!localDb) return;
		const data = await ChannelList.getAll(localDb);
		setMessages(data);
	};

	const saveChannelListData = async () => {
		if (!localDb) return;
		const channelList = ChannelList.fromWebsocketObject(lastJsonMessage);
		channelList.save(localDb);
		initChannelListData();
	};

	React.useEffect(() => {
		if (!lastJsonMessage && !localDb) return;

		const { type } = lastJsonMessage;

		// console.log(lastJsonMessage?.channel?.members);
		if (type === 'health.check') return;

		if (type === 'notification.message_new') {
			saveChannelListData();
		}
	}, [lastJsonMessage, localDb])

	React.useEffect(() => {
		if (localDb) initChannelListData();

		initFeedSubscription();
		// const client = clientStream(
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjg3MWM5ZmQtYWI3OS00MWFmLTk3ZGYtZDhmN2ZmZjQ0ZDBkIiwiZXhwIjoxNjg3NzkxMDk1fQ.EOuemYn_JJclLN31QLYwjSSAMm3s_tBjaOr21YQ4Go0'
    // );

    // const notifFeed = client?.feed(
    //   'notification',
    //   'f871c9fd-ab79-41af-97df-d8f7fff44d0d',
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjg3MWM5ZmQtYWI3OS00MWFmLTk3ZGYtZDhmN2ZmZjQ0ZDBkIiwiZXhwIjoxNjg3NzkxMDk1fQ.EOuemYn_JJclLN31QLYwjSSAMm3s_tBjaOr21YQ4Go0'
    // );

		// console.log('notifFeed')
		// console.log(notifFeed)
		// notifFeed?.subscribe((data) => {
		// 	console.log('data');
		// 	console.log(data);
		// });
		// return () => {
		// 	// feedSubscriptionRef?.current?.unsubscribe();
		// 	notifFeed?.unsubscribe();
		// };

	}, [localDb])



	return {
		lastJsonMessage,
		channelList: messages
	}
}

export default useCoreChatSystemHook