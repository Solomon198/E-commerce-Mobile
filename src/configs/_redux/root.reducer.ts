import AuthReducer from '../../app/auth/auth.reducer';
import LanguageReducer from '../../app/language/lang.reducer';
import UserReducer from '../../app/user/reducer.user';

import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  Auth: AuthReducer,
  Lang: LanguageReducer,
  User: UserReducer,
});

export default rootReducer;
