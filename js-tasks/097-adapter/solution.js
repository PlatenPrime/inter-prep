/**
 * Кратко: Оборачиваем legacy callback API в Promise/fetchUser.
 */
export function adaptLegacyApi(legacy) {
  return {
    async fetchUser(id) {
      return new Promise((resolve, reject) => {
        legacy.getUser(id, (err, user) => (err ? reject(err) : resolve(user)));
      });
    },
  };
}
