const fs = require("fs");
const path = require("path");
const rootFile = path.dirname(require.main.filename);
const cookiesFilePath = path.join(rootFile, "data", "cookies.json");

const saveCookies = async (page) => {
    //Save session cookies
    const cookiesObject = await page.cookies();
    //Write cookies to temp file to be used in other profile pages
    fs.writeFile(cookiesFilePath, JSON.stringify(cookiesObject), function (err) {
        if (err) {
            console.log("The file could not be written. ", err);
        }
        console.log("Session has been succesfully saved");

    })
}

const setCookies = async (page) => {
    if (isCookiesDataAvailable()) {
        //If file exist load the cookies
        const cookiesString = fs.readFileSync(cookiesFilePath);
        const parsedCookies = JSON.parse(cookiesString);
        if (parsedCookies.length !== 0) {
            for (let cookie of parsedCookies) {
                await page.setCookie(cookie);
            }
            console.log("Session has been loaded to browser");
        }
    }
}

const isCookiesDataAvailable = () => {
    const previousSessionExists = fs.existsSync(cookiesFilePath);
    return previousSessionExists;
}

module.exports = { saveCookies, setCookies, isCookiesDataAvailable };