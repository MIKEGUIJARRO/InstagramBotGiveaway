let interval;
let counter = 0;
let ms, msBase, msMax, msMin;

const looping = async (cb) => {
    clearInterval(interval);
    counter++;
    // Here I will have some async / await code
    //console.log(`${counter} - Inside loop - ${ms}ms`);
    const msIncrement = Math.floor(Math.random() * (msMax - msMin)) + msMin;
    ms = msBase + msIncrement;
    await cb();
    console.log("ms: " + ms);
    interval = setInterval(looping.bind(this, cb), ms);
}

const executeIntervals = async (baseTime = 60000, maxTime = 60000, minTime = 0, cb) => {
    ms = baseTime;
    msBase = baseTime;
    msMax = maxTime;
    msMin = minTime;
    interval = setInterval(looping.bind(this, cb), ms);
};

module.exports = executeIntervals;