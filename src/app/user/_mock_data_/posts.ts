const localImageSource = require('../../../../assets/images/food1.jpg'); // eslint-disable-line
const localImageSource2 = require('../../../../assets/images/food2.jpg'); // eslint-disable-line

const posts = [
  {
    coverImage: localImageSource,
    title: 'Amazing Desert',
    status: 'Published',
    timestamp: '31 August 2016',
    description:
      'Reference this table when designing your app’s interface, and make sure',
    likes: 345,
    price: 1000,
    discount: 500,
  },
  {
    coverImage: localImageSource2,
    title: 'Wonderful Desert',
    status: 'Published',
    timestamp: '31 August 2016',
    description: 'This is an awsome thing to think of please dont wait',
    likes: 345,
    price: 1500,
    discount: 500,
  },
];

export default posts;
