function flattenAndSortObject(obj) {
  let flattened = flattenObject(obj);
  return sortObjectKeys(flattened);
}

function flattenObject(obj, prefix = "", res = {}) {
  for (let key in obj) {
    let newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === "object" && obj[key] !== null) {
      flattenObject(obj[key], newKey, res);
    } else {
      res[newKey] = obj[key];
    }
  }

  return res;
}

function sortObjectKeys(obj) {
  return Object.keys(obj)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}

export default flattenAndSortObject;
