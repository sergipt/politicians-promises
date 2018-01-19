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
  switch (action.type) {
    case 'ADD_MY_VOTES':
      return action.votes;
    default:
      return state;
  }
}