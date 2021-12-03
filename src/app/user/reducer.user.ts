import {Alert} from 'react-native';
import {
  GetCategories,
  GetFeeds,
  GetUserPosts,
  Post,
  AddCart,
  PaymentSuccess,
} from '../../configs/global.enum';
import {ToastAndroid} from 'react-native';

const initialState = {
  feeds: [] as any[],
  carts: [] as any[],
  feedStatus: GetFeeds.GET_FEEDS_DEFAULT,
  feedsError: '',

  posts: [] as any[],
  postStatus: Post.POST_DEFAULT,
  postError: '',

  categories: [] as any[],
  categoryStatus: GetCategories.GET_CATEGORIES_DEFAULT,
  categoriesError: '',

  userPosts: [] as any[],
  userPostStatus: GetUserPosts.GET_USER_POSTS_DEFAULT,
  userPostError: '',
  hasNextPage: true,

  page: 1,
};

function UserReducer(state = initialState, action: any) {
  switch (action.type) {
    case PaymentSuccess.PAYMENT_SUCCESS: {
      state = {...state, carts: []};
      ToastAndroid.show('Order Placed successfully', 1000);
      return state;
    }
    case AddCart.ADD_TO_CART: {
      const carts = Object.assign([] as any[], state.carts) as any[];
      let itemExist = false;
      carts.forEach((item, index) => {
        if (item.postId === action.payload.postId) {
          if (action.isAdding) {
            item.count += 1;
            itemExist = true;
            ToastAndroid.show('Item Added to cart', 1000);
          } else {
            if (item.count > 1) {
              item.count -= 1;
            } else {
              carts.splice(index, 1);
            }
            itemExist = true;
            ToastAndroid.show('Item Removed from cart', 1000);
          }
        }
      });
      if (!itemExist && action.isAdding) {
        ToastAndroid.show('Item Added to cart', 1000);

        let payload = action.payload;
        payload.count = 1;
        carts.push(payload);
      }

      state = {
        ...state,
        carts,
      };
      return state;
    }
    case GetUserPosts.GET_USER_POSTS_STARTED: {
      state = {
        ...state,
        userPostStatus: GetUserPosts.GET_USER_POSTS_STARTED,
        userPostError: '',
      };
      return state;
    }

    case GetUserPosts.GET_USER_POSTS_FAILED: {
      state = {
        ...state,
        userPostStatus: GetUserPosts.GET_USER_POSTS_FAILED,
        userPostError: action.payload,
      };
      return state;
    }

    case GetUserPosts.GET_USER_POSTS_SUCCESS: {
      state = {
        ...state,
        userPostStatus: GetUserPosts.GET_USER_POSTS_SUCCESS,
        userPostError: '',
        userPosts: action.payload,
      };
      return state;
    }

    case Post.POST_STARTED: {
      state = {...state, postStatus: Post.POST_STARTED, postError: ''};
      return state;
    }
    case Post.POST_FAILED: {
      state = {
        ...state,
        postStatus: Post.POST_FAILED,
        postError: action.payload,
      };
      return state;
    }

    case Post.POST_SUCCESS: {
      if (action.isUpdate) {
        const feeds = state.feeds.map((feed) => {
          if (feed.postId === action.payload.postId) {
            return action.payload;
          } else {
            return feed;
          }
        });

        state = {
          ...state,
          postStatus: Post.POST_SUCCESS,
          postError: '',
          feeds: [...feeds],
        };
      } else {
        state = {
          ...state,
          postStatus: Post.POST_SUCCESS,
          postError: '',
          posts: [action.payload, ...state.posts],
          feeds: [action.payload, ...state.feeds],
        };
      }
      return state;
    }

    case GetCategories.GET_CATEGORIES_STARTED: {
      state = {
        ...state,
        categoryStatus: GetCategories.GET_CATEGORIES_STARTED,
        categoriesError: '',
      };
      return state;
    }

    case GetCategories.GET_CATEGORIES_FAILED: {
      state = {
        ...state,
        categoryStatus: GetCategories.GET_CATEGORIES_FAILED,
        categoriesError: action.payload,
      };
      return state;
    }

    case GetCategories.GET_CATEGORIES_SUCCESS: {
      state = {
        ...state,
        categoryStatus: GetCategories.GET_CATEGORIES_SUCCESS,
        categoriesError: '',
        categories: action.payload,
      };
      return state;
    }

    case GetFeeds.GET_FEEDS_STARTED: {
      state = {
        ...state,
        feedStatus: GetFeeds.GET_FEEDS_STARTED,
        feedsError: '',
      };
      return state;
    }

    case GetFeeds.GET_FEEDS_FAILED: {
      state = {
        ...state,
        feedStatus: GetFeeds.GET_FEEDS_FAILED,
        feedsError: action.payload,
      };
      return state;
    }

    case GetFeeds.GET_FEEDS_SUCCESS: {
      state = {
        ...state,
        feedStatus: GetFeeds.GET_FEEDS_SUCCESS,
        feedsError: '',
      };
      if (action.isRefresh) {
        state = {...state, feeds: action.payload, page: 2};
      } else {
        state = {
          ...state,
          feeds: [...state.feeds, ...action.payload],
          page: state.page + 1,
          hasNextPage: action.hasNextPage,
        };
      }
      return state;
    }
  }

  return state;
}

export default UserReducer;
