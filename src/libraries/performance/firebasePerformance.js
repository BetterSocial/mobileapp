import perf from '@react-native-firebase/perf';

export const trackingHttpMetric = async (url, urlMethods, args) => {
  try {
    const metric = await perf().newHttpMetric(url, urlMethods);

    if (args) {
      Object.keys(args).forEach((key) => {
        metric.putAttribute(key, args[key]);
      });
    }

    return metric;
  } catch (e) {
    if (__DEV__) {
      console.log('trackingHttpMetric error : ', e);
    }
    throw Error('trackingHttpMetric error : ', e);
  }
}

export const traceMetricScreen = async (loggingEvent) => {
  // Define & start a trace
  try {
    const trace = await perf().startTrace(loggingEvent);

    // Stop the trace
    return trace;
  } catch (e) {
    if (__DEV__) {
      console.log('metric screen', e);
    }
    throw Error('metric screen error:', e);
  }
}
