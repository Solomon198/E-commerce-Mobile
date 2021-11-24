import {put, takeEvery} from 'redux-saga/effects';

function* ChangeLanguage() {
  yield takeEvery('DO-CHANGE-LANGUAGE', function* (action: any) {
    yield put({type: 'CHANGE-LANGUAGE', payload: action.payload});
  });
}

export default {
  ChangeLanguage,
};
