import {persistStore, persistReducer, PersistConfig} from 'redux-persist';

import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './root.reducer';
import rootSaga from './root.saga';
import MMKVStorage from 'react-native-mmkv-storage';

const storage = new MMKVStorage.Loader().initialize();

const sagaMiddleware = createSagaMiddleware();
const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig as any, rootReducer);

export default () => {
  let store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));

  let persistor = persistStore(store);
  // persistor.purge().then((val) => {
  //   console.log('purged success');
  // });
  sagaMiddleware.run(rootSaga);

  return {store, persistor};
};
