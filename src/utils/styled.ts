/** A `shouldForwardProp` that keeps the named styling props off the DOM element. */
export function omitProps(...propNames: string[]) {
  return (propName: PropertyKey) => !propNames.includes(String(propName));
}
