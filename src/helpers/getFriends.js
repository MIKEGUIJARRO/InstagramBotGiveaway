
const fs = require("fs");
const path = require("path");
const rootFile = path.dirname(require.main.filename);

const readFile = async (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, "utf-8", (err, data) => {
            if (err) {
                console.log("Error!");
                reject(err);
            }
            const friends = JSON.parse(data);
            resolve(friends);
        });
    });
};

const getAllFriends = async () => {
    const pathFriends = path.join(rootFile, "data", "friends.txt");
    const data = await readFile(pathFriends);
    return data;
}

const getThreeRandomFriends = async () => {
    const allFriends = await getAllFriends();
    const min = 0;
    const max = allFriends.length;

    const numbCandidates = [];

    while (numbCandidates.length < 3) {
        const number = Math.floor(Math.random() * (max - min)) + min;
        const isIncluded = numbCandidates.includes(number);
        if (isIncluded) {
            continue;
        } 
        numbCandidates.push(number);
    }
    
    const threeFriends = [];
    numbCandidates.forEach((number)=> {
        threeFriends.push(allFriends[number]);
    });

    return threeFriends;
}

module.exports = { getAllFriends, getThreeRandomFriends, readFile };