const path = require("path");

const { getAllFriends, getThreeRandomFriends} = require("./helpers/getFriends");

const rootFile = path.dirname(require.main.filename);

getThreeRandomFriends().then((friends) => {
    console.log(friends);
});

