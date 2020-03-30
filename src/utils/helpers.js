export const range = (low, high) => {
  let list = [];
  for (var i = parseInt(low); i <= parseInt(high); i++) {
    list.push(i);
  }
  return list;
}

export const spread = (x, in_min, in_max, out_min, out_max) => {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}