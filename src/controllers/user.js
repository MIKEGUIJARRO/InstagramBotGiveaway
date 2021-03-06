const puppeteer = require('puppeteer');
const path = require("path");
var fs = require('fs');
const rootFile = path.dirname(require.main.filename);

const { createFile } = require("../helpers/file");

//Global Variables
let followers = [];
let following = [];

const getDataFollowers = async (username, page) => {
    const urlUser = `https://www.instagram.com/${username}/`;
    await page.goto(urlUser);

    const ulBtns = await page.waitForSelector('ul.k9GMp', { visible: true });
    const followersBtn = await ulBtns.$('li:nth-child(2) a');
    await followersBtn.click();

    //Popup apperas in screen
    await page.waitForSelector(".PZuss");

    const urlJson = "https://www.instagram.com/graphql/query/?query_hash";
    await addPageResponseListener(urlJson, page);

    await loopFriendsBox(page, async () => {
        const lastItem = ".PZuss li:last-child";
        const response = await page.evaluate((selector) => {
            const lastItem = document.querySelector(selector);
            lastItem.scrollIntoView();
        }, lastItem);
        return response;
    })

    await saveFollowers(followers, username, "followers.txt");
}

const getDataFollowing = async (username, page) => {
    const urlUser = `https://www.instagram.com/${username}/`;
    await page.goto(urlUser);

    const ulBtns = await page.waitForSelector('ul.k9GMp', { visible: true });
    const followingBtn = await ulBtns.$('li:nth-child(3) a');
    await followingBtn.click();

    //Popup apperas in screen
    await page.waitForSelector(".PZuss");

    const urlJson = "https://www.instagram.com/graphql/query/?query_hash";
    await addPageResponseListener(urlJson, page);

    await loopFriendsBox(page, async () => {
        const lastItem = ".PZuss li:last-child";
        const response = await page.evaluate((selector) => {
            const lastItem = document.querySelector(selector);
            lastItem.scrollIntoView();
        }, lastItem);
        return response;
    })

    await saveFollowers(following, username, "following.txt");
}

const saveFollowers = async (data, username, fileName) => {
    //Save the data
    const userPath = path.join(rootFile, "data", username);
    if (!fs.existsSync(userPath)) {
        fs.mkdirSync(userPath, { recursive: true }, (err) => {
            if (err) {
                console.log(err);
            };
        })
    };
    const followersPath = path.join(userPath, fileName);
    await createFile(followersPath, data);
};

const loopFriendsBox = async (page, scrollLastElement) => {
    // Loop the friends box
    let isRunning = true;
    let lastName = "";
    const lastItem = ".PZuss li:last-child";

    while (isRunning) {
        const lastEl = await page.$(lastItem);
        const nameLastEl = await lastEl.$("span a.FPmhX");
        const currentName = await nameLastEl.evaluate(el => el.textContent);
        console.log(`LastName: ${lastName} \t CurrentName: ${currentName}`);
        await scrollLastElement();
        isRunning = currentName != lastName;
        lastName = currentName;
        await page.waitForTimeout(2000);
    }
};

const addPageResponseListener = async (URLResponse, page) => {
    page.on("response", async (response) => {
        if (response.request().url().includes(URLResponse)) {
            console.log('XHR response received');
            const json = await response.json();
            if (json.data.user.edge_followed_by) {
                const users = json.data.user.edge_followed_by?.edges;
                followers = [...followers, ...users];
            }
            if (json.data.user.edge_follow) {
                const users = json.data.user.edge_follow?.edges;
                following = [...following, ...users];
            }
        }
    });
}

module.exports = { getDataFollowers, getDataFollowing };