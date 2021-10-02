const fs = require('fs');

// (() => {
//   const file = fs.readFileSync('./freedom.csv', 'utf8');
//   let rows = file.split("\n");
//
//   let results = {};
//   let result;
//   for (let row of rows.slice(1)) {
//     let q = false;
//     let cols = [];
//     let line = '';
//     for (let char of row.split('')) {
//       if (char === ',' && !q) {
//         cols.push(line);
//         line = '';
//       }
//       else if (char === '"' && !q) {
//         q = true;
//       }
//       else if (char === '"' && q) {
//         q = false;
//       } else {
//         line += char;
//       }
//     }
//     cols.push(line.trim());
//
//     results[cols[0]] = results[cols[0]] || {};
//     results[cols[0]][Number(cols[1])] = Number(cols[10]);
//   }
//
//   let lines = [ ['State', ...Object.keys(results['Alabama'])].join(',') ];
//   require('fs').writeFileSync('./freedom-processed.csv', lines[0]+"\n");
//   for (let state in results) {
//     let cols = [state];
//     for (let year in results[state]) {
//       cols.push(results[state][year]);
//     }
//     require('fs').appendFileSync('./freedom-processed.csv', cols.join(",")+"\n");
//   }
//   // debugger
//   //
//   // require('fs').writeFileSync('./poverty-data.csv', [ 'Year', 'Average Poverty' ].join(",")+"\n");
//   //
//   // results.reverse();
//   // for (let result of results) {
//   //   require('fs').appendFileSync('./poverty-data.csv', result.join(",")+"\n");
//   // }
// })()
//
//

(() => {
  const file = fs.readFileSync('./freedom-processed.csv', 'utf8');
  let rows = file.split("\n");

  let results = {};
  let result;
  for (let row of rows.slice(1)) {
    let cols = row.split(',');
    cols.push(line.trim());

    results[cols[0]] = results[cols[0]] || {};
    for (let col of cols.slice(1)) {
      results[cols[0]] = {  }
    }
  }

  let lines = [ ['State', ...Object.keys(results['Alabama'])].join(',') ];
  require('fs').writeFileSync('./freedom-processed.csv', lines[0]+"\n");
  for (let state in results) {
    let cols = [state];
    for (let year in results[state]) {
      cols.push(results[state][year]);
    }
    require('fs').appendFileSync('./freedom-processed.csv', cols.join(",")+"\n");
  }
})()
