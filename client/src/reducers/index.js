import { combineReducers } from 'redux';

import lists from './lists';
import promises from './promises';
import votes from './votes';
import user from './user';

export default combineReducers({
  lists,
  promises,
  votes,
  user
});
