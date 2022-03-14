import Store from '../store/index.js'

// Utility function for verifying if a user has certain permissions
//Check this function later
export function containsRoles(...roles) {
  let allowed = false;
  const userRole = Store.state.auth.role;
  // use the defined nested function to check each role passed in the arguments
  roles[0].forEach(role => {
    if (userRole == role) {
      allowed = true;
    }
  })
  return allowed;
}

export function getFormattedProperties(properties, values) {
  let formattedProperties = {};
  properties.forEach(property => {
    if (!values[property.key]) {
      formattedProperties[property.key] = null;
    } else {
      if (property.inputType == "List") {
        const itemString = values[property.key];
        const items = itemString.split(";");
        formattedProperties[property.key] = items;
      } else if (property.inputType == "Date") {
        formattedProperties[property.key] = values[property.key]
      } else if (property.inputType == "Number") {
        formattedProperties[property.key] = values[property.key]
      } else if (property.inputType == "Currency") {
        formattedProperties[property.key] = values[property.key]
      } else {
        formattedProperties[property.key] = values[property.key]
      }
    }
  });
  return formattedProperties;
}