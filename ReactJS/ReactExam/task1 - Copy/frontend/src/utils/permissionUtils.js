// checks if user can perform action.

export const hasPermission = (permissions, module, action) => {
  return permissions?.[module]?.includes(action);
};