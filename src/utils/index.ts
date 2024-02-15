export const verifDate = (date: any) => {
  if (date < Date.now()) {
    return false;
  }
  return true;
};
export const otpGenerator = () => {
  var digits = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var otpLength = 100;
  var otp = '';
  for (let i = 1; i <= otpLength; i++) {
    var index = Math.floor(Math.random() * digits.length);
    otp = otp + digits[index];
  }
  return otp;
};
export const generateNowPlusTime = (issCreated: any, min: any) => {
  const date = new Date(issCreated);
  const jodie = date.getTime() + min * 60000;
  return jodie;
};
export const updateR = (id: any, cols: string, tb: string, where: string, now: any) => {
  // Setup static beginning of query
  var query = [`UPDATE ${tb}`];
  query.push('SET');

  // Create another array storing each set command
  // and assigning a number value for parameterized query
  var set = [];
  Object.keys(cols).forEach(function (key, i) {
    set.push(key + ' = ($' + (i + 1) + ')');
  });
  if (now) {
    set.push(now + ' = now()');
  }
  query.push(set.join(', '));

  // Add the WHERE statement to look up by id
  if (Array.isArray(id) && Array.isArray(where)) {
    let whereSet = [];
    for (let ix = 0; ix < where.length; ix++) {
      whereSet.push(where[ix] + " = '" + id[ix] + "'");
    }
    query.push('WHERE ');
    query.push(whereSet.join(' AND '));
  } else {
    query.push(`WHERE ${where} = '${id}'`);
  }

  // Return a complete query string
  // console.log(query.join(" "));
  return query.join(' ');
};
export const insertR = (cols: string, tb: string, returnIdx: any) => {
  // Setup static beginning of query
  var query = [`INSERT INTO ${tb}(`];
  var inVal: any[] = [];
  Object.keys(cols).forEach(function (key, i) {
    inVal.push(key.toString());
  });
  query.push(inVal.join(', '));
  // Create another array storing each set command
  // and assigning a number value for parameterized query
  query.push(') VALUES(');
  var set: any[] = [];
  Object.keys(cols).forEach(function (key, i) {
    set.push('$' + (i + 1));
  });
  query.push(set.join(', '));

  // Add the WHERE statement to look up by id
  query.push(`)`);
  if (returnIdx) {
    query.push(' RETURNING ' + returnIdx);
  }

  // Return a complete query string
  return query.join(' ');
};
export const deleteR = (id: string, tb: string, where: string) => {
  // Setup static beginning of query
  var query = [`DELETE FROM ${tb} `];

  // Add the WHERE statement to look up by id
  if (Array.isArray(id) && Array.isArray(where)) {
    let whereSet = [];
    for (let ix = 0; ix < where.length; ix++) {
      whereSet.push(where[ix] + " = '" + id[ix] + "'");
    }
    query.push('WHERE ');
    query.push(whereSet.join(' AND '));
  } else {
    query.push(`WHERE ${where} = '${id}'`);
  }

  // Return a complete query string
  return query.join(' ');
};
export const formatStringToDate = (date: string) => {
  const d = new Date(date);
  if (d instanceof Date && !isNaN(d.getTime())) {
    return (
      d.toLocaleString('default', { year: 'numeric' }) +
      '-' +
      d.toLocaleString('default', { month: '2-digit' }) +
      '-' +
      d.toLocaleString('default', { day: '2-digit' })
    );
  } else {
    return false;
  }
};
