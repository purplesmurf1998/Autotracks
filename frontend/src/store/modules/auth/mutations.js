export default {
  loginUser(state) {
    state.loggedIn = true;
  },
  logoutUser(state) {
    state.loggedIn = false;
  }
}