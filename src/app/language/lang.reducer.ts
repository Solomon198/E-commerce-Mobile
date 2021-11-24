const initialState = {
  language: 'english',
};

function languageReducer(state = initialState, action: any) {
  switch (action.type) {
    case 'CHANGE-LANGUAGE': {
      if (action.payload === 'english') {
        state = {...state, language: action.payload};
      } else if (action.payload === 'hausa') {
        state = {...state, language: action.payload};
      }
      break;
    }
  }

  return state;
}

export default languageReducer;
