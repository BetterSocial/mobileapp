/**
 *
 * @param {Object} item
 * @param {String} domainName
 * @param {String} image
 * @param {String} domain_page_id
 * @returns
 */
const linkContextScreenParamBuilder = (
  item,
  domainName,
  image,
  domain_page_id = '',
) => ({
  item: {
    ...item,
    domain: {
      image,
      name: domainName,
    },
    content: {
      ...item.og,
    },
  },
});

/**
 *
 * @param {String} title
 * @param {String} image
 * @param {String} description
 * @param {String} url
 * @param {String} domainImage
 * @param {String} domainName
 * @param {String} created_at
 * @returns
 */
const newsDiscoveryContentParamBuilder = (
  title, image, description, url, domainImage, domainName, createdAt, newsLinkId,
) => ({
  domain: {
    image: domainImage,
    name: domainName,
  },
  content: {
    title,
    image,
    description,
    url,
    created_at: createdAt,
    news_link_id: newsLinkId,
  },
});

export default {
  newsDiscoveryContentParamBuilder,
  linkContextScreenParamBuilder,
};
