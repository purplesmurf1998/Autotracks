import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

export default {
  state() {
    return {
      userId: null,
      userPermissions: [],
      token: null,
      role: null,
      dealership: null,
      promptPasswordChange: false,
      createDealershipCompleted: false,
      createUserCompleted: false
    }
  },
  mutations,
  actions,
  getters
}