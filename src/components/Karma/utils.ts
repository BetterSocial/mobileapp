export const renderCircleColor = (karma: number) => {
  switch (true) {
    case karma > 87.5:
      return ['#4DCC57', '#BEECC1'];
    case karma > 75:
      return ['#75D219', '#D1F0B2'];
    case karma > 62.5:
      return ['#ACD91A', '#E4F2B5'];
    case karma > 50:
      return ['#EBEA03', '#F9F8B1'];
    case karma > 37.5:
      return ['#FFCE2B', '#FFEEBA'];
    case karma > 25:
      return ['#F4833C', '#FBD5BD'];
    case karma > 12.5:
    default:
      return ['#DF001F', '#F5B0B9'];
  }
};
