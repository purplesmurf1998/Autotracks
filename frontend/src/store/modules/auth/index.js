import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

export default {
  state() {
    return {
      userId: null,
      userRole: null,
      userFirstName: null,
      userLastName: null,
      userPermissions: [
        'View Dealerships'
      ],
      token: null,
      loggedIn: false
    }
  },
  mutations,
  actions,
  getters
}