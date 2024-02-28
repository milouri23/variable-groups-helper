import flattenObjectProperties from "./object-flattener.js";

function convertObjectToVariableGroupQuery(obj) {
  let flattenObject = flattenObjectProperties(obj);

  let variables = Object.fromEntries(
    Object.entries(flattenObject).map(([key, value]) => [
      key,
      { value: String(value) },
    ])
  );

  return variables;
}

export default convertObjectToVariableGroupQuery;
