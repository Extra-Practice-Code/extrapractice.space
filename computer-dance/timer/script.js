const breaks = [
    'walk',
    'downward dog',
    'cat-cow',
    'move hands through space',
    'stare out the window',
    'breathing deeply',
    'buy a muffin',
    'meditate',
    'cartwheel practice',
    'touch a plant',
    'water plants',
    'clean the garden',
    'read one page of a book',
    'climb around the table / lava',
    'sing a song',
    'look at the corner of the room',
    'press palms together',
    'up dog',
    'plank',
    'clean up studio',
    'walk around the block'
]
const prompts = [
    'switch computers with your neighbor',
    'continue coding'
]
const colors = [
    'white'
]





var chime_success = new Audio('https://spring.restnotes.email/assets/sounds/send.mp3');

var timeInSecs;
var ticker;

function startTimer(secs) {
    timeInSecs = parseInt(secs);
    ticker = setInterval("tick()", 1000); 
}

function tick( ) {
    var secs = timeInSecs;
    if (secs > 0) {
    timeInSecs--; 
} else {
    clearInterval(ticker);
    startTimer(15*20); // 4 minutes in seconds

    console.log('do something');

    let text = document.querySelector('#text');
    let countdown = document.querySelector('#countdown');
    let label = document.querySelector('#label');

    if (text.dataset.type == 'prompt') {
        text.innerText = breaks[Math.floor(Math.random()*breaks.length)];
        text.dataset.type = 'break';
        label.innerText = 'break mode';
        label.classList.remove('write');
        label.classList.add('break');
    } else {
        text.innerText = prompts[Math.floor(Math.random()*prompts.length)];
        text.dataset.type = 'prompt';
        label.innerText = 'write mode';
        label.classList.remove('break');
        label.classList.add('write');
    }

    chime_success.play();

    countdown.style.color = colors[Math.floor(Math.random()*colors.length)];

}

var days= Math.floor(secs/86400); 
secs %= 86400;
var hours= Math.floor(secs/3600);
secs %= 3600;
var mins = Math.floor(secs/60);
secs %= 60;
var pretty = ( (mins < 10) ? "0" : "" ) + mins + ":" + ( (secs < 10) ? "0" : "" ) + secs;

document.getElementById("countdown").innerHTML = pretty;
}

startTimer(15*20); // 4 minutes in seconds

//Credits to Philip M from codingforum