const DefaultState = {}

const normalize = (arr, key) => {
  return arr.reduce((accum, el) => {
    return {
      ...accum,
      [el[key]]: el,
    }
  }, {});
}

export default (state = DefaultState, action) => {
  // console.log('reducer promises: ',state, action);
  switch (action.type) {
    case 'ADD_PROMISES':
      return {
        ...state,
        ...normalize(action.promises, '_id')
      };
    default:
      return state;
  }
}