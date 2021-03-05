let interval;
let counter = 0;
let ms = 1000;


const looping = async () => {
    clearInterval(interval);
    counter++;
    // Here I will have some async / await code
    console.log(`${counter} - Inside loop - ${ms}ms`);
    ms = ms * 2;
    interval = setInterval(looping, ms);
}

const executeIntervals = async () => {
    
};
interval = setInterval(looping, ms);

module.exports = executeIntervals;