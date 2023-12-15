export const renderCircleColor = (karma: number) => {
  switch (true) {
    case karma > 87.5:
      return ['#50BA57', '#C7EECA', '#50BA57'];
    case karma > 75:
      return ['#70BF21', '#B3E57F', '#70BF21'];
    case karma > 62.5:
      return ['#A0C527', '#D1EA82', '#A0C527'];
    case karma > 50:
      return ['#D3D20C', '#F3F370', '#D3D20C'];
    case karma > 37.5:
      return ['#E4B92E', '#FFE591', '#E4B92E'];
    case karma > 25:
      return ['#F4833C', '#F9BE9A', '#F4833C'];
    case karma > 12.5:
    default:
      return ['#DF001F', '#F5B0B9', '#DF001F'];
  }
};
