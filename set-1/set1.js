const fs = require('fs');

(() => {
  const file = fs.readFileSync('./hstpov21.csv', 'utf8');
  let rows = file.split("\n");

  let results = [];
  let result;
  let year = 2020;
  for (let row of rows) {
      if (row.substr(0, 5) === 'STATE') {
        if (result) {
          results.push([
            result.year,
            result.val/result.count
          ])
        }
        result = {
          year: year--
        };
        continue;
      } else if (Number.isNaN(Number(row.substr(0, 4)))) {
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
      const percent = Number(cols[4])/100;

      result.val = (result.val || 0)+percent;
      result.count = (result.count || 0)+1;
    }
  }

  require('fs').writeFileSync('./poverty-data.csv', [ 'Year', 'Average Poverty' ].join(",")+"\n");

  results.reverse();
  for (let result of results) {
    require('fs').appendFileSync('./poverty-data.csv', result.join(",")+"\n");
  }
})()
