const gbans = require("../gbans.json");

const gbanCheck = (userId) => {
    const data = gbans[userId];

    if (!data) return false;
    return data;
} 

exports.gbanCheck = gbanCheck;