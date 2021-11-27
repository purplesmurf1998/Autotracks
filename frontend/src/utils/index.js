import Store from '../store/index.js'

// Utility function for verifying if a user has certain permissions
export function containsPermissions(...permissions) {
  let value = true;

  const userPermissions = Store.state.auth.userPermissions;
  console.log(userPermissions);
  //console.log(userPermissions);
  // define a nested function to check each individual permission
  // function containsPermission(permission) {
  //   userPermissions.forEach(element => {
  //     if (String(element).toUpperCase == String(permission).toUpperCase) {
  //       return true;
  //     }
  //   });
  //   return false;
  // }

  // use the defined nested function to check each permission passed in the arguments
  permissions.forEach(permission => {
    console.log(permission[0]);
    // QUESTION: 'permission' is returning as an array instead of a string, why?
    if (!userPermissions.includes(permission[0])) {
      value = false;
    }
  })
  console.log(value);
  return value;
}