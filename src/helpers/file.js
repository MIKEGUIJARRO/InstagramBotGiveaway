const fs = require("fs");

const readFile = async (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, "utf-8", (err, data) => {
            if (err) {
                console.log("Error!");
                reject(err);
            }
            const dataParsed = JSON.parse(data);
            resolve(dataParsed);
        });
    });
};

const createFile = async (path, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, JSON.stringify(data), function (err) {
            if (err) {
                console.log("The file could not be written. ", err);
                reject(err);
            }
            console.log("File has been succesfully saved");
            resolve();
        });
    });
};

module.exports = {createFile, readFile};