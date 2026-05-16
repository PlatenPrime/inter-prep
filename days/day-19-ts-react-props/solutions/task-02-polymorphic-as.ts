export function polymorphicAs<E extends string>(as: E | undefined, defaultAs: E): E {
  return (as ?? defaultAs) as E;
}