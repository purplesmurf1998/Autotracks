export default {
  setUser(state, payload) {
    state.userId = payload.userId;
    state.token = payload.token;
    state.userPermissions = payload.userPermissions;
    state.firstName = payload.firstName;
    state.lastName = payload.lastName;
    state.role = payload.role;
    state.dealership = payload.dealership;
    state.promptPasswordChange = payload.promptPasswordChange;
    state.createDealershipCompleted = payload.createDealershipCompleted;
    state.createUserCompleted = payload.createUserCompleted;
  },
  setProperty(state, [variable, value]) {
    state[variable] = value
  },
}