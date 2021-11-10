export default {
  setUser(state, payload) {
    state.userId = payload.userId;
    state.token = payload.token;
    state.userPermissions = payload.userPermissions;
    state.promptPasswordChange = payload.promptPasswordChange;
    state.createDealershipCompleted = payload.createDealershipCompleted,
    state.createUserCompleted = payload.createUserCompleted
  },
  setProperty(state, property, value) {
    state[property] = value;
  }
}