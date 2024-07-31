const fs = require('fs') // Using 'fs.promises' for async/await with fs

// const func = async () => {
//     try {
//         const data = await fs.readFile('filtered-dupes.json');
//         const json = JSON.parse(data);
//         let i = 1
//         const newObj = {}
//         let dupe = 0;

//         for (let post of Object.keys(json)) {
//             const getData = async (url) => {
//                 const controller = new AbortController();
//                 const timeoutId = setTimeout(() => controller.abort(), 1000); // Set timeout to 1 second

//                 try {
//                     const res = await fetch(url.replace(/\\/g, '/'), { signal: controller.signal });
//                     clearTimeout(timeoutId); // Clear timeout if fetch succeeds
//                     console.log(res.status);
//                     json[post].status = res.status;
//                 } catch (e) {
//                     if (e.name === 'AbortError') {
//                         console.log(`Fetch aborted for ${url.replace(/\\/g, '/')}`);
//                         json[post].status = 'Fetch aborted';
//                     } else {
//                         console.log(url.replace(/\\/g, '/'));
//                         json[post].status = e.message;
//                     }
//                 }

//                 console.log(json[post]);
//             };

//             // await getData(post);
//             if (json[post].status == 200) {
//                 newObj[post] = json[post]
//                 newObj[post].id = i
//                 i++
//             }

//         }

//         await fs.writeFile('final.json', JSON.stringify(newObj, null, 2));
//     } catch (error) {
//         console.error('Error:', error);
//     }
// };

const cleanup = async () => {
    //   let duplicates = 0
    //   let count = 0
      const newMaster = {}
    // const masterStack = {}
      const data = await fs.readFileSync('final.json')
      const json = JSON.parse(data)
      for (let post of Object.keys(json)) {
        json[post].url = post
        const url = json[post]
        newMaster[url.id] = url
        // const stack = []
        // json[post].urls = json[post].urls.filter(link => link != 'removed' && link != 'deleted')
        // const arr = json[post].urls.filter(link => link.includes('http') && link.split('.').length >= 2)
        // if (arr.length) {
        //   // console.log(arr)

        //   for (let link of arr) {
        //     if (!masterStack[link]) {
        //       masterStack[link] = true
        //       stack.push(link)
        //     }
        //     else {
        //       duplicates++
        //       // console.log(stack[stack.indexOf(link)])
        //       // console.log('Dupes: ',duplicates)

        //     }
        //   }
        //   // stack.concat(arr)
        //   json[post].urls = stack
        //   if (stack.length) {
        //     newMaster[count] = json[post]
        //     // console.log(stack)
        //     // console.log(count, '/', post)
        //     count++
        //   }
          // console.log(post)
          // }
        }
        fs.writeFileSync(`final.json`, JSON.stringify(newMaster, null, 2));
      return
    }

cleanup();
