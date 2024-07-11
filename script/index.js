const fs = require("fs");
const jsdom = require("jsdom");
const puppeteer = require("puppeteer");
const pdfParse = require("pdf-parse");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const govcloud = ".amazonaws.com";
const mimeType = "&filter=mimetype:text/html";
const url = "*.1.1/*";

const { Readable } = require("stream");
const { finished } = require("stream/promises");

const getSnapshots = async (url) => {
  const res = await fetch(
    `http://archive.org/wayback/available?url=${url}&output=json`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parse response as JSON
    })
    .then(async (data) => {
      console.log(data);
      // await fetch(data.archived_snapshots.closest.url)
      //   .then((res) => {
      //     if (res.status == 200) {
      //       return res.text();
      //     }
      //   })
      // .then((data) => {
      //   const doc = new jsdom.JSDOM(data, { runScripts: "dangerously" });
      //   const scripts = doc.window.document.querySelectorAll("script");
      //   //scripts.forEach(script => doc.window.eval(script.textContent))
      //   // for (let script of scripts) {
      //   //   doc.defaultView.eval(script.textContent)
      //   // }
      //   // console.log(doc.toString())
      //   fs.writeFileSync("index.html", doc.serialize());
      // });
      if (data.archived_snapshots.closest) {
        return data.archived_snapshots.closest.url;
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  return res;
};

const getData = async (url) => {
  await fetch(
    `http://web.archive.org/cdx/search/cdx?url=${url}&output=json&` //matchType=domain`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parse response as JSON
    })
    .then(async (data) => {
      // const pdfs = data.filter((list) => list.includes("application/pdf"));
      // const powerpoints = data.filter((list) =>
      //   list.icludes("application/powerpoint")
      // );
      return console.log(data);
      // const docs = data.filter((list) => list.includes("application/msword"));
      const master = {};
      const list = data.slice(1).forEach((list) => {
        const url = list[2].split("/").slice(0, 3).join("/");
        const ext = list[2].split(".").slice(-1)[0];

        // if (list[2].includes('ftp')) {
        // const o = list[2]
        if (!master[url]) {
          master[url] = {};
          console.log(url);
        }
        // else {
        //   master[url][list[2]] = {}
        // }
        // }

        // if (ext) {
        //   if (!master[url][ext.toLowerCase()]) {
        //     master[url][ext.toLowerCase()] = 1;
        //   } else master[url][ext.toLowerCase()]++;
        // }
      });
      // fs.writeFileSync('ca-mil-info.json', JSON.stringify(master, null, 2))

      console.log(master);
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
      const tmp = Array.from(linksArr)
        .map((el) => el.href)
        .filter((link) => !link.includes("=") && link != "/");
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
                return Number(size.slice(0, size.length - 1));
              } else if (size.slice(size.length - 1).toLowerCase() == "g") {
                return Number(size.slice(0, size.length - 1)) * 1024;
              } else if (size.slice(size.length - 1).toLowerCase() == "t") {
                return Number(size.slice(0, size.length - 1)) * 1024 * 1024;
              } else if (size.slice(size.length - 1).toLowerCase() == "k") {
                return Number(size.slice(0, size.length - 1)) / 1024;
              } else return Number(data.split(" ").slice(-1)) / 1024 / 1024;
            }
          });
        console.log("yo", tmp.length, metaData.length);

        for (let i = 0; i < tmp.length; i++) {
          const url = tmp[i];
          const extension = url.split(".").slice(-1).toLowerCase();
          console.log("yooo", tmp[i]);

          if (!decodeURIComponent(url).includes("/") && !url.includes("=")) {
            //  console.log('HIT', metaData[i])
            if (!obj[extension]) {
              obj[extension] = { num: 1, size: metaData[i] };
              // console.log(links[i].href)
            } else {
              obj[extension].num++;
              if (metaData[i] != NaN) obj[extension].size += metaData[i];
            }
          } else if (
            !url.includes("../") &&
            url != "/" &&
            !url.includes("=") &&
            url + url != url
          ) {
            arr.push(url + tmp[i]);
          }
          console.log(obj);
        }
      } else {
        // console.log('yo')

        const tables = doc.window.document.querySelectorAll("tbody");

        for (let table of tables) {
          if (
            table
              .querySelectorAll("tr")[0]
              .textContent.toLowerCase()
              .includes("size")
          ) {
            // console.log(table.querySelectorAll('tr')[0].textContent.toLowerCase())
            let rows = Array.from(table.children).map((row) =>
              Array.from(row.querySelectorAll("td")).map((td) => td.textContent)
            );
            // console.log(rows)
            rows = rows.filter(
              (arr) =>
                arr.length > 0 &&
                !arr.includes("Parent Directory") &&
                !arr.includes("../") &&
                (decodeURIComponent(arr).includes("/") ||
                  decodeURIComponent(arr).includes("."))
            );

            const headers = Array.from(
              doc.window.document.querySelectorAll("th")
            ).map((el) => el.textContent.toLowerCase());
            // console.log('headers')
            const sizeHeader = headers.indexOf("size");
            const nameHeader = headers.indexOf("name");
            // console.log(rows.slice(-1))
            // return
            // rows = rows.slice(3, -1);
            // console.log('new row', rows)
            // console.log(Array.from(doc.window.document.querySelectorAll("tr")).length)
            // const currDir = decodeURIComponent(url.split('/').slice(-2)[0])
            let links = Array.from(doc.window.document.querySelectorAll("a"))
              .map((link) => link.href)
              .filter(
                (link) =>
                  (link.includes("/") || link.includes(".")) &&
                  !link.includes("../") &&
                  link != "/" &&
                  !link.includes("@") &&
                  !link.includes("http")
              );
            if (decodeURIComponent(url).includes(decodeURIComponent(links[0])))
              links.shift();

            //.filter(href => ))

            // if (links.length != rows.length) console.log(links, rows)
            // return
            // links = links.slice(3, -1).map((link) => link.href);
            //.filter(href => !href.includes('=') && href != '/');
            // console.log('New links',links)
            //  console.log(links)
            if (rows.length != links.length) {
              console.log("CURRENT: ", url);
              console.log(rows.length, links.length);
            }

            for (let row in rows) {
              // console.log(extension)
              if (row.length) {
                console.log(links[row]);
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
    .catch((e) => e);
  return total;
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

  url = url.replace(/\\/g, "");
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
      console.log(sortedObj);
      await sleep(500);
    }
  }
  // console.log(arr);
  for (let key of Object.keys(obj)) {
    const mb = obj[key].size;
    console.log(mb);
    // total += mb;
    console.log("Original: ", mb);

    if (mb < 1) obj[key].size = Number((mb * 1024).toFixed(2)) + " K";
    else if (mb > 1024) {
      if (mb / 1024 < 1024)
        obj[key].size = Number((mb / 1024).toFixed(2)) + " GB";
      else {
        // if ((mb / 1024) / 1024 > 1024)
        obj[key].size = Number((mb / 1024 / 1024).toFixed(2)) + " TB";
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

  // const browser = await puppeteer.launch({ headless: false });
  // const page = await browser.newPage();
  // await page.goto(url);

  // let data = await page.content();

  // data = JSON.parse(
  //   data
  //     .split(
  //       '<html><head><meta name="color-scheme" content="light dark"></head><body><pre style="word-wrap: break-word; white-space: pre-wrap;">'
  //     )[1]
  //     .split("</pre></body></html>")[0]
  // );
  // const dataArr = data.data.children;
  // const links = [];
  // for (let post of dataArr) {
  //   const text = post.data.selftext;
  //   let start = 0;
  //   // console.log(post.data.author_fullname);
  //   if (post.data.author_fullname != "t2_3dfj970w" && text.includes("http")) {
  //     for (let i = 0; i < text.length; i++) {
  //       if (text[i] == "[") start = i;
  //       if (text[i] == "]") {
  //         if (text.slice(start + 1, i).includes("http"))
  //           links.push(text.slice(start + 1, i));
  //       }
  //     }
  //     if (!post.data.url.includes("reddit")) {
  //       arr.push(post.data.url);
  //     }
  //   }
  // }
  // console.log(links);
  // console.log(links.length);
  // await browser.close();

  // numOfLinks += links.length;
  for (let link of [
    "http://danvolodar.ru/files/",
    "http://dogjdw.ipdisk.co.kr/public/VOL1/public/",
    "http://movie.basnetbd.com/Data/",
  ].slice(0, 10)) {
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
      Object.keys(sortedObj).forEach((key) => {
        try {
          sortedObj[key].size?.split(" ");
        } catch (error) {
          // Object.values(sortedObj)
          // console.log('hello', url)
          return console.log(sortedObj[key], link);
        }
      });

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
  console.log(urls, "398");
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

const test = async () => {
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
};

const test2 = async () => {
  const links = [
    "http://files.usgwarchives.net/",
    "https://iop.archive.arm.gov/arm-iop-file/",
  ];
  for (let link of links) {
    await ipMapper(link);
  }
};

// test2()

const ip = async () => {
  let ips = [20, 20, 20, 20];

  let digit = 0;

  // while (true) {

  //   if (digit == 3) digit = 0
  //   for (let i = 20; i < 255; i++) {

  //     ips[digit] = i;
  //     console.log(url, ips);
  //   }
  // }
  const min = 20;
  const max = 255;

  for (let a = min; a <= max; a++) {
    for (let b = min; b <= max; b++) {
      for (let c = 190; c <= max; c++) {
        for (let d = 183; d <= max; d++) {
          // Here, you can do whatever you want with the combination of values
          const timeout = setTimeout(() => {
            controller.abort();
            // console.log("Request timed out");
          }, 2500);
          const controller = new AbortController();
          const signal = controller.signal;
          const url = `http://${a}.${b}.${c}.${d}`;

          await fetch(url)
            .then((res) => {
              console.log(res);
              // clearTimeout(timeout)
              if (res.status == 200) {
                return res.text();
              }
            })
            .then((data) => {
              console.log(url);
              console.log("hit");
              fs.writeFileSync(`${a}-${b}-${c}-${d}.html`, data);
              console.log(data);
            })
            .catch((e) => {
              console.log(e);
            });
          console.log(a, b, c, d);
        }
      }
    }
  }
};

const testar = async () => {
  // const arr3 = []
  const browser = await puppeteer.launch({ headless: false });
  for (let el of testArr) {
    const url = await getSnapshots(el);
    if (url) {
      const page = await browser.newPage();
      await page.goto(url);
    }
  }
};

const amazon = async () => {
  const json = fs.readFileSync("amzawss3.json");
  const parsed = JSON.parse(json);
  const arr = Object.keys(parsed).slice(210);
  const obj = {};
  for (let url of arr) {
    await fetch(url)
      .then(async (res) => {
        if (res.status == 200) return await res.text();
      })
      .then(async (data) => {
        // console.log(data)
        const doc = new jsdom.JSDOM(data);
        const buck = doc.window.document.querySelectorAll("Contents");
        if (data && buck && !obj[url]) {
          for (let file of buck) {
            const children = file.children;
            if (children) {
              const filePath = children[0].textContent;
              const lastModified = children[1].textContent;
              const eTag = children[2].textContent;
              const size = children[3].textContent;
              const storageClass = children[4].textContent;
              // console.log(filePath)
              const extension = filePath.split(".").slice(-1)[0];
              if (!obj[url]) {
                obj[url] = {};
                obj[url][`${url}/${filePath}`] = {
                  filePath: `${url}/${filePath}`,
                  lastModified,
                  eTag,
                  size,
                  storageClass,
                  extension,
                };

                // obj.fileTypes[extension] = 1
              } else {
                obj[url][`${url}/${filePath}`] = {
                  filePath: `${url}/${filePath}`,
                  lastModified,
                  eTag,
                  size,
                  storageClass,
                  extension,
                };
              }
              if (!obj[url].fileTypes) {
                obj[url].fileTypes = {};
              }
              if (!obj[url].fileTypes[extension])
                obj[url].fileTypes[extension] = 1;
              else obj[url].fileTypes[extension]++;
            }
            // console.log(obj)
            fs.writeFileSync(`awsFiles.json`, JSON.stringify(obj, null, 2));
          }
          // obj[url] = `./aws/${arr.indexOf(url)}.html`
        }
      })
      .catch((e) => console.log(e));
  }
};
// amazon()

// testar()

// ip();
const dataFromSnapshot = async () => {
  const json = fs.readFileSync("ca-mil.json");
  const parsed = JSON.parse(json);

  for (let url of Object.keys(parsed)) {
    const data = await getData(url);
    console.log(data);
  }
};

const apachIcons = async () => {
  await fetch("https://www.apache.org/icons/").then(async (res) => {
    const data = await res.text();
    const dom = new jsdom.JSDOM(data);
    const document = dom.window.document;

    // Find all image (img) elements and extract their src attributes
    const imageUrls = Array.from(document.querySelectorAll("a"))
      .slice(5)
      .map((a) => a.href);

    // Iterate over the image URLs and download each image
    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      if (!imageUrl.includes("/")) {
        const response = await fetch(
          "https://www.apache.org/icons/" + imageUrl
        );
        const imageBuffer = await response.arrayBuffer();
        const imgData = Buffer.from(imageBuffer);

        // Extract the filename from the image URL
        // const filename = path.basename(imageUrl);

        // Write the image data to a file in the output directory
        // const outputFile = path.join(outputDirectory, imageUrl);
        fs.writeFileSync("icons/" + imageUrl, imgData);

        console.log(`Image downloaded and saved: ${imageUrl}`);
      }
    }
  });
};

// apachIcons()
// getData('.mil.ca');
// dataFromSnapshot()
// test()
// getData('https://navsea.navy.mil/Portals/*')
// reddit("https://www.reddit.com/r/opendirectories/new.json?limit=2000");

// ipMapper('https://mcrgo.org/doc/?C=S;O=D')
// ipMapper('http://145.239.65.29/Records/')
// ipMapper('http://119.28.75.55/')
// ipMapper("https://www.kwasan.kyoto-u.ac.jp/~sakaue/AR_catalogue/movie4K/");
// console.log(obj, total)

// reddit(
//   "https://www.reddit.com/r/pushshift/comments/142y0pd/any_good_reddit_scrapers/"
// );

const func = async () => {
  const masterFile = {};

  const url = "https://api.pullpush.io/reddit/search/submission/?subreddit=opendirectories&before=";
  let index = 0;
  let after = "1717095044";
  let count = 0

  const fetchData = async () => {
    const res = await fetch(url + after);
    const data = await res.json();
    return data.data;
  };

  const processPosts = async () => {
    const posts = await fetchData();
    count+= posts.length
    after = posts[posts.length - 1].created_utc
    console.log(new Date(after * 1000), count)

    const urls = [];
    const postUrls = [];

    for (let post of posts) {
      if (posts.length < 100 && index > posts.length) {
        return;
      }

      const obj = {};
      const text = post.selftext;
      obj.text = text
      const date = new Date(post.created_utc * 1000);

      obj.createdAt = date;
      obj.postUrl = `https://reddit.com/r/opendirectories/comments/${post.id}`;

      const arr = text.split("\n").join(" ").split(" ").filter((text) => !text.includes("[http") && !text.includes("(http"));
      const links = arr.filter(
        (text) =>
          text.includes("http") ||
          text.includes("www") ||
          (!isNaN(parseInt(text.split(".")[1])) &&
            !isNaN(parseInt(text.split(".")[2])) &&
            !isNaN(parseInt(text.split(".")[3])))
      );

      let start = 0;
      let end = 0;
      const newText = text.split("\n").join(" ").split(" ").join(" ");
      for (let letter in newText) {
        if (text[letter] === "[") {
          start = Number(letter) + 1;
        }
        if (text[letter] === "]") {
          end = Number(letter);
          const link = newText.split("").slice(start, end).join("");
          if (link && link != 'removed' && link != 'deleted' && !link.includes(' ')) {
            urls.push(link);
            postUrls.push(link);
          }
          start = 0;
          end = 0;
        }
      }

      obj.urls = postUrls.concat(links);
      masterFile[index] = obj;
      fs.writeFileSync(`master-index.json`, JSON.stringify(masterFile, null, 2));
      index++;
    }
  };

  const fetchAndProcess = async () => {
    while (after) {
      await processPosts();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for 1 second
    }
  };

  await fetchAndProcess();
};

// func();

const cleanup = async () => {
  let duplicates = 0
  let count = 0
  const newMaster = {}
const masterStack = []
  const data = await fs.readFileSync('master-index.json')
  const json = JSON.parse(data)
  for (let post of Object.keys(json)) {
    const stack = []
    json[post].urls = json[post].urls.filter(link => link != 'removed' && link != 'deleted')
    const arr = json[post].urls.filter(link => link.includes('http') && link.split('.').length >= 2)
    if (arr.length) {
      // console.log(arr)

      for (let link of arr) {
        if (!masterStack.includes(link)) {
          masterStack.push(link.split('/').slice(2, link.split('/').length - 1))
          stack.push(link)
        }
        else {
          duplicates++
          // console.log(stack[stack.indexOf(link)])
          // console.log(link)

        }
      }
      // stack.concat(arr)
      json[post].urls = stack
      if (json[post].urls.length) {
        newMaster[count] = json[post]
        console.log(json[post])
        console.log(count, '/', post)
        count++
      }
      // console.log(post)
      fs.writeFileSync(`master-index3.json`, JSON.stringify({masterStack}, null, 2));
    }
  }
}

cleanup()
