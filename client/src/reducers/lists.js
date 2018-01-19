const defaultState = {}

const normalize = (arr, key) => {
  return arr.reduce((accum, el) => {
    return {
      ...accum,
      [el[key]]: el,
    }
  }, {});
}

export default (state = defaultState, action) => {
  // console.log('reducer lists: ',state, action);
  switch (action.type) {
    case 'ADD_LISTS':
      return {
        ...state,
        ...normalize(action.lists, '_id')
      };
    default:
      return state;
  }
}