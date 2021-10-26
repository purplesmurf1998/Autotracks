export default {
  loginUser(state) {
    state.loggedIn = true;
  },
  logoutUser(state) {
    state.loggedIn = false;
  },
  setUser(state, payload) {
    state.userId = payload.userId;
    state.token = payload.token;
    state.userPermissions = payload.userPermissions;
    state.loggedIn = payload.loggedIn;
  }
}