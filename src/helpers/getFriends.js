
const fs = require("fs");
const path = require("path");
const rootFile = path.dirname(require.main.filename);

const { readFile, createFile } = require("../helpers/file");

const mergeFriendsData = async (username) => {
    //Merge Data should be called once
    //followers.txt and following.txt 
    //are available documents in usernames folder
    const userPath = path.join(rootFile, "data", username);
    const followers = await readFile(path.join(userPath, "followers.txt"));
    const following = await readFile(path.join(userPath, "following.txt"));

    const friends = [];

    followers.forEach((followerItem) => {
        following.forEach((followingItem) => {
            if (followerItem.node.id === followingItem.node.id) {
                //They are friends!
                friends.push(followingItem);
            }
        });
    });

    //Print users data
    //console.log(`Followers: ${followers.length}`);
    //console.log(`Following: ${following.length}`);
    //console.log(`Friends: ${friends.length}`);

    await createFile(path.join(userPath, "friends.txt"), friends);
}

const getAllFriends = async (username) => {
    const userPath = path.join(rootFile, "data", username);
    const pathFriends = path.join(userPath, "friends.txt");
    const data = await readFile(pathFriends);
    return data;
}

const getThreeRandomFriends = async (username) => {
    const allFriends = await getAllFriends(username);
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
    numbCandidates.forEach((number) => {
        threeFriends.push(allFriends[number].node);
    });

    return threeFriends;
}

const getThreeRandomFriendsConcat = async (username) => {
    const threeFriends = await getThreeRandomFriends(username);
    let stringFriends = "";
    threeFriends.forEach((friend) => {
        stringFriends += `@${friend.username} `;
    });

    return stringFriends;
}

module.exports = { getAllFriends, getThreeRandomFriends, getThreeRandomFriendsConcat, mergeFriendsData };