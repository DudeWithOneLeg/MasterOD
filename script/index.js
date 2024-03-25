const fs = require("fs");
const jsdom = require("jsdom");
const puppeteer = require("puppeteer");
const pdfParse = require('pdf-parse')

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const govcloud = "https://ndiastorage.blob.core.usgovcloudapi.net/";
const mimeType = "&filter=mimetype:text/html";
const url = "*.1.1/*";

const { Readable } = require("stream");
const { finished } = require("stream/promises");

const getSnapshots = async (url) => {
  await fetch(`http://archive.org/wayback/available?url=${url}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json(); // Parse response as JSON
  })
  .then(async (data) => {
    console.log(data.archived_snapshots);
    await fetch(data.archived_snapshots.closest.url)
    .then((res) => {
      if (res.status == 200) {
        return res.text();
      }

    })
    .then((data) => {
          const doc = new jsdom.JSDOM(data, { runScripts: "dangerously" });
          const scripts = doc.window.document.querySelectorAll("script");
          //scripts.forEach(script => doc.window.eval(script.textContent))
          // for (let script of scripts) {
          //   doc.defaultView.eval(script.textContent)
          // }
          // console.log(doc.toString())
          fs.writeFileSync("index.html", doc.serialize());
        });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

const getData = async (url) => {
  await fetch(`http://web.archive.org/cdx/search/cdx?url=${url}&output=json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parse response as JSON
    })
    .then(async (data) => {
      const pdfs = data.filter(list => list.includes('application/pdf'))
      const powerpoints = data.filter(list => list.icludes('application/powerpoint'))
      const docs = data.filter(list => list.includes('application/msword'))

      console.log(data)
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  // const data = await res.json()
  // console.log(data.body)
};

const crawl = async (url, obj, arr, total) => {
  // console.log(total, 'yo total')
  // console.log('URL',url)
  await fetch(url)
    .then((res) => {
      if (!res.status == 200) {
        return;
      }
      return res.text();
    })
    .then((data) => {
      // console.log(data)
      // const parser = new DOMParser
      const doc = new jsdom.JSDOM(data);
      // const doc = parser.parseFromString(data, 'text/html')

      const linksArr = doc.window.document.querySelectorAll("a");
      const links = Array.from(linksArr).slice(1);
      const tmp = Array.from(linksArr).map((el) => el.href);
      // console.log('ORIGINAL', tmp)
      let metaData = doc.window.document.querySelectorAll("pre")[0];

      if (metaData) {
        // return
        // console.log(metaData.textContent);
        metaData = metaData.textContent
          .split("\n")
          .slice(1, -1)
          .map((data) => {
            const size = data.split("  ").slice(-2, -1)[0];
            // console.log("SIZE", size);
            if (size) {
              if (size.slice(size.length - 1).toLowerCase() == "m") {
                return (
                  Number(size.slice(0, size.length - 1) / 1024) / 1024 / 1024
                );
              } else if (size.slice(size.length - 1).toLowerCase() == "g") {
                return Number(size.slice(0, size.length - 1)) * 1024;
              } else if (size.slice(size.length - 1).toLowerCase() == "t") {
                return (Number(size.slice(0, size.length - 1)) * 1024) * 1024;
              }
            } else return (Number(data.split(' ').slice(-1)) / 1024) / 1024;
          });
        // console.log('yo',metaData);

        for (let i = 0; i < links.length; i++) {
          // console.log(links[i].href)
          const extension = links[i].href
            .split(".")
            [links[i].href.split(".").length - 1].toLowerCase();
            // if (extension == 'mp4') console.log(links[i].href)

          if (
            !decodeURIComponent(links[i].href).includes("/") &&
            !links[i].href.includes("=")
          ) {
            //  console.log('HIT', metaData[i])
            if (!obj[extension]) {
              obj[extension] = { num: 1, size: metaData[i] }
              // console.log(links[i].href)
            }
            else {
              obj[extension].num++;
              if (metaData[i] != NaN) obj[extension].size += metaData[i];

            }
          } else if (
            !links[i].href.includes("../") &&
            links[i].href != "/" &&
            !links[i].href.includes("=") &&
            url + links[i].href != url
          ) {
            arr.push(url + links[i].href);
          }
          // console.log(url + link.href)
        }
      } else {
        // console.log('yo')

        const tables = doc.window.document.querySelectorAll('tbody')

        for (let table of tables) {
          if (table.querySelectorAll('tr')[0].textContent.toLowerCase().includes('size')) {
            // console.log(table.querySelectorAll('tr')[0].textContent.toLowerCase())
            let rows = Array.from(table.children)
            .map((row) => Array.from(row.querySelectorAll("td"))
            .map((td) => td.textContent))
            ;
            // console.log(rows)
            rows = rows.filter(arr => arr.length > 0 && !arr.includes('Parent Directory') && !arr.includes('../') && (decodeURIComponent(arr).includes('/') || decodeURIComponent(arr).includes('.')))

            const headers = Array.from(doc.window.document.querySelectorAll("th")).map(el => el.textContent.toLowerCase());
              // console.log('headers')
            const sizeHeader = headers.indexOf('size')
            const nameHeader = headers.indexOf('name')
            // console.log(rows.slice(-1))
            // return
            // rows = rows.slice(3, -1);
            // console.log('new row', rows)
            // console.log(Array.from(doc.window.document.querySelectorAll("tr")).length)
            // const currDir = decodeURIComponent(url.split('/').slice(-2)[0])
            let links = Array.from(doc.window.document.querySelectorAll("a"))
            .map((link) => link.href)
            .filter(link => (link.includes('/') || link.includes('.')) && (!link.includes('../') && link != '/') && !link.includes('@') && !link.includes('http'))
            if (decodeURIComponent(url).includes(decodeURIComponent(links[0]))) links.shift()


              //.filter(href => ))



              // if (links.length != rows.length) console.log(links, rows)
              // return
            // links = links.slice(3, -1).map((link) => link.href);
            //.filter(href => !href.includes('=') && href != '/');
            // console.log('New links',links)
            //  console.log(links)
            if (rows.length != links.length) {
              console.log('CURRENT: ',url)
              console.log(rows.length, links.length)
            }


            for (let row in rows) {
              // console.log(extension)
              if (row.length) {
                console.log(links[row])
                const extension = links[row];
                // console.log(rows[row][sizeHeader].slice(0, -1))
                const size = rows[row][sizeHeader];
                // console.log(rows[row]);
                if (size) {
                  // console.log(size, 'size')
                  let mb =
                    size.slice(-1).toLowerCase() == "m"
                      ? Number(size.slice(0, -1))
                      : size.slice(-1).toLowerCase() == "g"
                      ? Number(size.slice(0, -1) * 1024)
                      : size.slice(-1).toLowerCase() == "k"
                      ? Number(size.slice(0, -1) / 1024)
                      : size.slice(0, -1).toLowerCase() == "t"
                      ? Number(size.slice(0, -1)) * 1024 * 1024
                      : Number(size.slice(0, -1)) / 1024 / 1024;
                      if (!isNaN(Number(mb)) && Number(mb) > 0 && mb != undefined) {

                        total += Number(mb);
                      }
                      if (extension) {
                        // console.log('HIII',links[row])
                        if (
                          !extension.includes("/") &&
                          !extension.includes("=") &&
                          !extension.includes("./")
                          ) {
                            const link =
                            extension.split(".")[extension.split(".").length - 1];
                            // console.log(extension.split('.'))
                            if (!obj[link]) {
                              obj[link] = { num: 1, size: mb };
                            } else {
                              obj[link].num++;
                              obj[link].size += mb;
                            }
                          } else if (
                            extension.includes("/") &&
                            !extension.includes("=") &&
                            !extension.includes("./") &&
                            links[row] != url
                            ) {
                              // console.log('HIII',links[row])
                              if (extension.includes(url))
                              arr.push(links[row].split(url)[1]);
                      else arr.push(url + links[row]);
                    }
                  }

                  // total += mb;
                }
              }
              // mb = mb > 1024 ? (mb / 1024) + ' GB' : mb + ' MB'
              // console.log(mb)
            }
          }
        }
      }
      // console.log(table, 'yoo')


      //console.log(obj)
      // console.log(arr)
      // console.log(total, 'total');
    })
    .catch(e => e)
    return total
  };

  const ipMapper = async (url) => {
    let total = 0;
    // const ip = [10, 10, 10, 10]
    // for (let i = 0; i < 4; i++) {
      //   for (let j = 0; j < 1000; j++) {
  //     ip[i] = j
  //     const url = ip.join('.')
  //     const res = await fetch('http://'+ url)
  //     const data = await res.json()
  //     console.log(data)

  //   }

  // }
  const obj = {};
  const arr = [];

  url = url.replace(/\\/g, '')
  // console.log(url)
  total += await crawl(url, obj, arr, total);

  while (arr.length) {
    const curr = arr.pop();
    // console.log('STACK', encodeURI(curr.split(url)[1]))
    if (url + curr != url) {
      total += await crawl(curr, obj, arr, total);
      // console.log(obj)
      const entries = Object.entries(obj);

          // Sort the array based on values
          entries.sort((a, b) => b[1].num - a[1].num);

          // Convert the sorted array back to an object
          const sortedObj = Object.fromEntries(entries.slice(0, 5));
          console.log(sortedObj)
          await sleep(500)
    }
  }
  // console.log(arr);
  for (let key of Object.keys(obj)) {
    const mb = obj[key].size;
    // console.log(mb)
    // total += mb;
    console.log("Original: ", mb);

    if (mb < 1) obj[key].size = Number((mb * 1024).toFixed(2)) + " K";
    else if (mb > 1024) {
      if (mb / 1024 < 1024)
        obj[key].size = Number((mb / 1024).toFixed(2)) + " GB";
      else {
        // if ((mb / 1024) / 1024 > 1024)
          obj[key].size = Number(((mb / 1024) / 1024).toFixed(2)) + " TB";
        // else obj[key].size = Number((mb / 1024).toFixed(2)) + " GB"
      }
    } else obj[key].size = Number(mb.toFixed(2)) + " MB";

    // console.log("New: ", obj[key].size);
  }
  return [obj, total];
};

const reddit = async (url) => {
  const urls = {};
  let markdown = ``;

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  let data = await page.content();

  data = JSON.parse(
    data
      .split(
        '<html><head><meta name="color-scheme" content="light dark"></head><body><pre style="word-wrap: break-word; white-space: pre-wrap;">'
      )[1]
      .split("</pre></body></html>")[0]
  );
  const dataArr = data.data.children;
  const links = [];
  for (let post of dataArr) {
    const text = post.data.selftext;
    let start = 0;
    // console.log(post.data.author_fullname);
    if (post.data.author_fullname != "t2_3dfj970w" && text.includes("http")) {
      for (let i = 0; i < text.length; i++) {
        if (text[i] == "[") start = i;
        if (text[i] == "]") {
          if (text.slice(start + 1, i).includes("http"))
            links.push(text.slice(start + 1, i));
        }
      }
      if (!post.data.url.includes("reddit")) {
        arr.push(post.data.url);
      }
    }
  }
  console.log(links);
  console.log(links.length);
  await browser.close();

  // numOfLinks += links.length;
  for (let link of ['http://files.usgwarchives.net/', 'https://iop.archive.arm.gov/arm-iop-file/'].slice(0, 10)) {
    console.log(link);
    if (!link.includes("=") && link.includes("http")) {
      // console.log(link.href, url)
      let [crawled, total] = await ipMapper(link);
      const entries = Object.entries(crawled);

      // Sort the array based on values
      entries.sort((a, b) => b[1].num - a[1].num);

      // Convert the sorted array back to an object
      const sortedObj = Object.fromEntries(entries.slice(0, 5));

      urls[link] = sortedObj;
      Object.keys(sortedObj).forEach(key => {
        try {
          sortedObj[key].size?.split(" ")
        } catch (error) {
          // Object.values(sortedObj)
          // console.log('hello', url)
          return console.log(sortedObj[key], link)
        }

      })

      let innerTable = `| **Type** | **Count** | **Total** |\n`;
      Object.keys(sortedObj).forEach(
        (key) =>
          (innerTable += `| ${key} | ${sortedObj[key].num} | ${
            sortedObj[key].size?.split(" ")[0] != "NaN"
              ? sortedObj[key].size
              : "-"
          } |\n`)
      );
      innerTable += "\n\n&nbsp;&nbsp;\n\n";
      //innerTable += ''
      if (total < 1024) total += " MB";
      else if (total > 1024) {
        total = (total / 1024).toFixed(2);
        if (total < 1024) total += " GB";
        else {
          total = (total / 1024).toFixed(2);
          total += " TB";
        }
      }

      if (!total) total = "-";
      markdown += `| **URL** | | **Total Size** |\n|:---------|:---------|:--------|\n|[${link}](${link})||${total}|\n${innerTable}`;
      fs.writeFileSync("markdown.md", markdown);
      // console.log('markdown')
    }
  }
  console.log(urls, '398');
  return;
  // let numOfLinks = 0;

  // await fetch(url, {
  //   headers: {
  //     "User-Agent":
  //       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  //   },
  //   referrerPolicy: "strict-origin-when-cross-origin",
  // })
  //   .then(async (res) => {
  //     if (res.status == 200) {
  //       return res;
  //     } else {
  //       return console.log(res.status);
  //     }
  //   })
  //   .then(async (data) => {
  //     console.log(data);
  //     return;
  //     const urls = {};

  //     const doc = new jsdom.JSDOM(data, { runScripts: "dangerously" });

  //     const posts = doc.window.document.querySelectorAll("shreddit-post");

  //     for (let post of posts) {
  //       const links = Array.from(
  //         post.querySelectorAll("a.relative.pointer-events-auto")
  //       );
  //       numOfLinks += links.length;
  //       for (let link of links) {
  //         if (!link.href.includes("=") && link.href.includes("http")) {
  //           // console.log(link.href, url)
  //           let [crawled, total] = await ipMapper(link.href);
  //           const entries = Object.entries(crawled);

  //           // Sort the array based on values
  //           entries.sort((a, b) => b[1].num - a[1].num);

  //           // Convert the sorted array back to an object
  //           const sortedObj = Object.fromEntries(entries.slice(0, 5));

  //           urls[link.href] = sortedObj;

  //           let innerTable = `| **Type** | **Count** | **Total** | \n |:-|:-|:-| \n`;
  //           Object.keys(sortedObj).forEach(
  //             (key) =>
  //               (innerTable += `| ${key} | ${sortedObj[key].num} | ${
  //                 sortedObj[key].size.split(" ")[0] != "NaN"
  //                   ? sortedObj[key].size
  //                   : "-"
  //               } |\n`)
  //           );
  //           innerTable += "\n\n&nbsp;&nbsp;\n\n";
  //           //innerTable += ''
  //           if (total < 1024) total += " MB";
  //           if (total > 1024) {
  //             total = (total / 1024).toFixed(2);
  //             if (total < 1024) total += " GB";
  //             else {
  //               total = (total / 1024).toFixed(2);
  //               total += " TB";
  //             }
  //           }

  //           if (!total) total = "-";
  //           markdown += `| **URL** | **Total Size** |\n|:---------|:---------|\n|[${link.href}](${link.href})|${total}|\n\n&nbsp;&nbsp;\n\n${innerTable}`;
  //           fs.writeFileSync("markdown.md", markdown);
  //         }
  //       }

  //     }
  //     // console.log(doc.toString())
  //     //fs.writeFileSync("index.html", doc.serialize());
  //     // for (let url of urls) {
  //     //   await ipMapper(url)
  //     // }
  //   })
  //   .catch((e) => e);
  // console.log(markdown)
  console.log(numOfLinks);
};

const WordExtractor = require("word-extractor");
const extractor = new WordExtractor();


const test = async() => {
  //   await fetch(`https://www.navsea.navy.mil/Portals/103/Documents/Contacts/EEO/Q2%20FY2019%20No%20FEAR%20Act%20Report.pdf`)
  //   .then(async res => {
    //     if (res.status == 200) {
      //       return res.arrayBuffer(); // Get the reader for the response body

      //     }
      //   })
      //   .then(async data => {
        //     const pdf = Buffer.from(data)
        //   // fs.writeFileSync('test.pdf',pdf )
        //   // console.log(data)
        // })
        // const {getTextExtractor} = await import('office-text-extractor')
        // const pptExtractor = getTextExtractor()
        // const pdf = fs.readFileSync('NISP DIB - Cyber Risk and Compliance- 7-20-2022.pptx')
        // const text = await pptExtractor.extractText({ input: pdf, type: 'buffer' })
        // console.log(text)

        //WORD EXTRACTOR
        // const extracted = await extractor.extract(pdf);
        // console.log(extracted._body)
  // console.log(pdf)

  //PDF EXTRACTOR
  // pdfParse(pdf)
  // .then(data => {
  //   console.log(data.text.split('\n\n')[1])
  //   console.log(data.info)
  //   console.log(((pdf.length / 1024) / 1024).toFixed(2) + ' MB')
  // })
}

const test2 = async() => {
  const links = ['http://files.usgwarchives.net/', 'https://iop.archive.arm.gov/arm-iop-file/']
  for (let link of links) {
    await ipMapper(link)
  }
}

test2()

// test()
// getData('https://navsea.navy.mil/Portals/*')
// reddit("https://www.reddit.com/r/opendirectories/new.json?limit=2000");

// ipMapper('https://mcrgo.org/doc/?C=S;O=D')
// ipMapper('http://145.239.65.29/Records/')
// ipMapper('http://119.28.75.55/')
// ipMapper("https://www.kwasan.kyoto-u.ac.jp/~sakaue/AR_catalogue/movie4K/");
// console.log(obj, total)

// reddit('https://www.reddit.com/r/pushshift/comments/142y0pd/any_good_reddit_scrapers/')
