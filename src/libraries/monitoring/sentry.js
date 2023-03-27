import * as Sentry from '@sentry/react-native';

const SentryMonitoring = () => {
  return {
    setUser({id}) {
      Sentry.setUser({
        id
      });
    },
    logActions(message, data) {
      Sentry.addBreadcrumb({
        type: 'info',
        level: Sentry.Severity.Info,
        message,
        data: data ?? {}
      });
    },
    logError(message, data) {
      Sentry.addBreadcrumb({
        type: 'error',
        level: Sentry.Severity.Error,
        message,
        data
      });
    },
    logNavigation(from, to) {
      if (from && to) {
        Sentry.addBreadcrumb({
          type: 'navigation',
          data: {
            from,
            to
          }
        });
      }
    },
    clearUser() {
      Sentry.configureScope((scope) => scope.setUser(null));
    }
  };
};

export const Monitoring = SentryMonitoring();
