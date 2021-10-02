const fs = require('fs');

//
// (() => {
// for (let name of [ 'doge' ]) {
//   file = fs.readFileSync('./'+name+'.csv', 'utf8');
//   let results = {};
//   let files = file.split("\n").slice(1);
//   files.reverse();
//   for (let row of files) {
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
//     let [  date, volume, open ] = cols;
//     date = new Date(date);
//     let dateStr = date.getUTCFullYear()+'-'+(date.getUTCMonth()+1)+'-1';
//     results[dateStr] = (results[dateStr] || []);
//
//     if (!volume) continue;
//
//     (results[dateStr]).push([ Number(volume.replace(/[^0-9.]/g, '')),Number(open.replace(/[^0-9.]/g, ''))]);
//   }
//
//   require('fs').writeFileSync(`./${name}-processed.csv`, file.split("\n")[0]);
//   for (let date in results) {
//     if (date.indexOf('2021') !== -1)
//       continue;
//     let innerResults = results[date];
//     let i = [0,0];
//     for (let innerResult of innerResults) {
//       i[0] += innerResult[0];
//       i[1] += innerResult[1];
//     }
//
//     i[0] = i[0]/innerResults.length;
//     i[1] = i[1]/innerResults.length;
//     require('fs').appendFileSync(`./${name}-processed.csv`, [
//       date,
//       ...i
//     ].join(',')+"\n")
//   }
// }
// })()


(() => {
  let name = 'trends';
  let file = fs.readFileSync('./trends.csv', 'utf8');
  let results = {};
  for (let row of file.split("\n").slice(1)) {
    let q = false;
    let cols = [];
    let line = '';
    for (let char of row.split('')) {
      if (char === ',' && !q) {
        cols.push(line);
        line = '';
      }
      else if (char === '"' && !q) {
        q = true;
      }
      else if (char === '"' && q) {
        q = false;
      } else {
        line += char;
      }
    }
    cols.push(line.trim());
    let [  date, btc, eth, doge ] = cols.map((x) => x.replace('<1', 0));
    date = new Date(date);
    let dateStr = date.getFullYear()+'-'+(date.getMonth()+1)+'-1';
    results[dateStr] = (results[dateStr] || []);

    (results[dateStr]).push([
      Number(btc),
      Number(eth),
      Number(doge)
    ]);
  }

  require('fs').writeFileSync(`./${name}-processed.csv`, file.split("\n")[0]);
  for (let date in results) {
        if (date.indexOf('2016') !== -1)
      continue;
    let innerResults = results[date];
    let i = [0,0,0];
    for (let innerResult of innerResults) {
      i[0] += innerResult[0];
      i[1] += innerResult[1];
      i[2] += innerResult[2];
    }

    i[0] = i[0]/innerResults.length/100;
    i[1] = i[1]/innerResults.length/100;
    i[2] = i[2]/innerResults.length/100;
    require('fs').appendFileSync(`./${name}-processed.csv`, [
      date,
      ...i
    ].join(',')+"\n")
  }
})()
