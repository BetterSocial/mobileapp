// import * as Sentry from '@sentry/react-native';

// const SentryMonitoring = () => {
//   return {
//     setUser({id}) {
//       Sentry.setUser({
//         id
//       });
//     },
//     logActions(message, data) {
//       Sentry.addBreadcrumb({
//         type: 'Info',
//         level: 'info',
//         message,
//         data: data ?? {}
//       });
//     },
//     logError(message, data) {
//       Sentry.addBreadcrumb({
//         type: 'Error',
//         level: 'error',
//         message,
//         data
//       });
//     },
//     logNavigation(from, to) {
//       if (from && to) {
//         Sentry.addBreadcrumb({
//           type: 'navigation',
//           data: {
//             from,
//             to
//           }
//         });
//       }
//     },
//     clearUser() {
//       Sentry.configureScope((scope) => scope.setUser(null));
//     }
//   };
// };

// export const Monitoring = SentryMonitoring();

const SentryMonitoring = () => {
  return {
    setUser({id}) {},
    logActions(message, data) {},
    logError(message, data) {},
    logNavigation(from, to) {},
    clearUser() {}
  };
};

export const Monitoring = SentryMonitoring();
