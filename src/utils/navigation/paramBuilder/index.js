export const linkContextScreenParamBuilder = (
  item,
  name,
  image,
  domain_page_id,
) => {
  return {
    item: {
      ...item,
      domain: {
        image,
        name,
      },
      content: {
        ...item.og,
      },
    },
  };
};
