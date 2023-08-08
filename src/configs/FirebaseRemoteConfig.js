// according to the documentation we can make a request only 5 times per hour => every 12 minutes
// https://firebase.google.com/docs/remote-config/ios
export const FETCH_INTERVAL_IN_MINUTES = 1;

// Feature names constants, use them to reference to a feature
export const ENABLE_CHAT = 'enable_chat';

const config = {};
config[ENABLE_CHAT] = true;

export default config;
