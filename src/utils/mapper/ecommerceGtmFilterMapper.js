export const mapFilterToGTM = ({ variable, operator, value }) => {

  const operatorMap = {
    equals: "EQUALS",
    contains: "CONTAINS",
    matchesRegex: "MATCH_REGEX",
    cssSelector: "CSS_SELECTOR"
  }

  if (!operatorMap[operator]) {
    throw new Error(`Unsupported operator: ${operator}`)
  }

  return {
    type: operatorMap[operator],
    parameter: [
      {
        type: "template",
        key: "arg0",
        value: variable
      },
      {
        type: "template",
        key: "arg1",
        value: value
      }
    ]
  }
}