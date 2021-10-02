const playwright = require('playwright');
const wiki = require('wikipedia');
const companies = require('./top-web-companies');
const fetch  = require('node-fetch');
const moment = require('moment');
// RUn on wikipedia page to get list of companies
// https://en.wikipedia.org/wiki/List_of_largest_Internet_companies
const getCompanioesFromTable = (() => {
  const rows = Array.from($$('.wikitable tr'));

  let results = [];
  for (const row  of rows) {
    if ($('.flagicon [title="United States"]', row).length) {
      results.push({

        name: $('td:nth-child(2)', row).text().trim(),
        link: $('td:nth-child(2) a', row).attr('href')

      })
    }
  }
  return results;
})

async function  getFoundationDate(company) {
  const page = await wiki.page(company.replace('/wiki/', '').replace(/-/ig, ' '))

  const html = await (await fetch(`https://en.wikipedia.org${company}`)).text();

  const infobox = await page.infobox();

  let fq = (f) =>  (infobox[f] && (infobox[f].date || (Array.isArray(infobox[f]) && (infobox[f].filter((f) => f.date))[0])));
  let date = infobox.launchDate || fq('founded') || fq('foundation');

  if (date?.date)
    date = date.date;

  if (!date) {
    const $ = require('cheerio').load(html);
    const txt = $('tr:contains("Founded") > *:nth-child(2)').text()

    date = txt ? txt.split(';').shift() : void(0);
    date = (new Date(date)) || date;
  }
  if (!date) debugger

  return date;
}

let browser;
let page;
async function getIPO(company) {
  browser = browser || await playwright['chromium'].launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext();
  page = await context.newPage();

  await page.goto(`https://sec.report/`);

  await page.type('#company', company);
  await page.click('#submitcompany');


  let companies = Array.from(await page.$$('.table tr'));
  let possibleResult;
  for (let i = 0; i < companies.length; i++) {
    companies = Array.from(await page.$$('.table tr'));
    let companyEle = companies[i+1];
    if (!companyEle)
      break;

    let te = await companyEle.textContent();
    if (['BLK', "CNY"].filter(k => (te).indexOf(k) !== -1).length)
      continue;
    const a = Array.from(await page.$$('.table a'))[i];
    let sim = require('similarity')(await a.textContent(), company);
    if (sim > 0.3) {
      (await a.click());
      let aa = Array.from(await page.$$('.panel-body > a')).reverse();
      let aaLength = aa.length;

      if (!aaLength) {
        await page.goBack();
        continue;
      }

      for (let i = 0; i < aaLength; i++) {
        aa = Array.from(await page.$$('.panel-body > a')).reverse();
        let a = aa[i];
        if (a) {
          if (Number(await a.textContent()))
            await a.click();
        }
        let child = (await Promise.all(Array.from(await page.$$('.table tr')).map(async (e) => {
          let te = await e.textContent();
          let x = (te.indexOf('S-1') !== -1 && te.indexOf('S-1/') === -1) || (te.indexOf('10-K') !== -1 && te.indexOf('10-K4') === -1);

          return [x, e,  te.indexOf('10-K') !== -1];
        }))).filter(([x, e, b]) => x).map(([x, z, b]) => { return { element: z, before: b } })[0];
        if (child) {

          const tds = Array.from(await child.element.$$('td'));
          const td = tds.slice(-1)[0];
          let date = (await td.textContent());

          date = date ? date.split("\n")[1] : null;

          possibleResult = [ (new Date(date)) ? (new Date(date)) : date, child.before  ];

          break;
        }
      }
    }
    if (possibleResult && !possibleResult[2]) {
      break;
    }
  }
  return possibleResult;
}

(async () => {
  let existing = require('fs').existsSync('./set9.csv') ? (require('fs').readFileSync('./set9.csv', 'utf8')).split("\n") : [];
  for (let { name, link } of companies) {
    try {
      if (existing.filter(f => f.split(',')[0] === `"${name}"`).length)
        continue;
      const foundation = await getFoundationDate(link);
      const ipoDate = await getIPO(name);
      if (!foundation)
        continue;
      let line = [
        `"${name}"`,
        foundation ? foundation.toISOString() : '',
        ipoDate ? ipoDate[0].toISOString() : '',
        ipoDate && ipoDate[1] ? ( 'Yes' )  : 'No'
      ].join(',');
      require('fs').appendFileSync('./set9.csv', line + "\n");
    } catch (err) {
      console.error(err);
    } finally {
      page && await page.close();
    }
    // break;
  }
})().catch((e) => console.error(e))
