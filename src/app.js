const puppeteer = require('puppeteer');
const path = require("path");

const { getThreeRandomFriendsConcat } = require("./helpers/getFriends");
const { saveCookies, setCookies, isCookiesDataAvailable } = require("./helpers/cookiesManagment");

const executeIntervals = require("./helpers/executeIntervals");

//Controllers
const loginHandler = require("./controllers/login");
const commentHandler = require("./controllers/comment");

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    page.setViewport({ width: 750, height: 620 });

    if (!isCookiesDataAvailable()) {
        //Login
        await loginHandler(page, USERNAME, PASSWORD);
        //Save cookies
        await saveCookies(page);
    } else {
        await setCookies(page);
    }

    //Get friends list
    /*  await page.addScriptTag({ path: path.join(path.dirname(require.main.filename), "helpers", "scriptFriends.js") });
     const response = await page.evaluate(async () => {
         try {
             const response = await scriptFriends(process.env.USERNAME);
             return response;
         } catch (e) {
             return e;
         }
     });
 
     console.log(response); */

    //Go to giveaway page
    const urlPost = "https://www.instagram.com/p/CMAGZ5wrnFU/";
    await commentHandler(urlPost, page, async () => {
        const randomFriends = await getThreeRandomFriendsConcat();
        return randomFriends;
    });

    /*     const callback = async (page) => {
            console.log(page);
            const post = await getThreeRandomFriendsConcat();
            const commentInput = await page.waitForSelector('textarea');
            const postBtn = await page.waitForSelector('button[type="submit"]');
            await commentInput.type(post);
            console.log(`Post made: ${post}`);
            await postBtn.click();
        } */

    //await executeIntervals(1000 * 60, 1000 * 30, 0, callback.bind(this, page));



    await page.waitForTimeout(100000);
    await browser.close();
})();