const puppeteer = require('puppeteer');
const path = require("path");

const { getThreeRandomFriendsConcat, getAllFriends } = require("./helpers/getFriends");
const { saveCookies, setCookies, isCookiesDataAvailable } = require("./helpers/cookiesManagment");

const executeIntervals = require("./helpers/executeIntervals");

//Helpers
const { mergeFriendsData } = require("./helpers/getFriends");

//Controllers
const loginHandler = require("./controllers/login");
const commentHandler = require("./controllers/comment");
const { getDataFollowers, getDataFollowing } = require("./controllers/user");

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
        //Get initial followers data and merge it
        await getDataFollowers(USERNAME, page);
        await getDataFollowing(USERNAME, page);
        await mergeFriendsData(USERNAME);
        //Save cookies
        await saveCookies(page);
    } else {
        await setCookies(page);
    }

    //Get friends list
    const urlPost = "https://www.instagram.com/p/CMAGZ5wrnFU/";
    await page.goto(urlPost);
    for (let i = 0; i < 10; i++) {
        const friendsConcat = await getThreeRandomFriendsConcat(USERNAME);
        await commentHandler(urlPost, page, friendsConcat);
        await page.waitForTimeout(1000 * 60);
    }

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
    /* const urlPost = "https://www.instagram.com/p/CMAGZ5wrnFU/";
    await commentHandler(urlPost, page, async () => {
        const randomFriends = await getThreeRandomFriendsConcat();
        return randomFriends;
    }); */

    //Get Users data

    await page.waitForTimeout(5000);
    await browser.close();
})();