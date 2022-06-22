const ReactorButtons    = [...document.getElementsByClassName('botaoReator')];
const VisorImages       = [...document.getElementsByClassName('imagemVisor')];
const ReactorLeds       = [...document.getElementsByClassName('acertos')];

const REACTOR_MAX_COMBINATION = 5;
const ARRAY_5 = [...Array(REACTOR_MAX_COMBINATION)];

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);

let reactorState = 
{
    combination: [],
    playerTries: 0,
    level: 1,
    reactorOn: false
};

function blinkLedAsync(image)
{
    return new Promise(resolve => {
        image.classList.add("led-ligado");
        setTimeout(() => {
            image.classList.remove("led-ligado");
            setTimeout(resolve, 300);
        }, 1000);
    })
    
    
}

function blinkLeds()
{
    VisorImages.forEach(led => {
        led.classList.add("led-ligado");
        setTimeout(() => {
            led.classList.remove("led-ligado");
        }, 500);
    });
}

function buttonClick(number)
{
    if(reactorState.reactorOn == false)
    {
        reactorState.reactorOn = true;
        VisorImages.forEach(image => image.classList.remove("led-ligado"));
        restart();
        blinkLeds();
        return;
    }

    checkButton(number);
}

function checkButton(number)
{
    if(reactorState.combination[reactorState.playerTries] == number)
    {
        ReactorLeds[reactorState.playerTries].classList.add('acertos-led-ativo');
        reactorState.playerTries++;
    }
    else
    {
        blinkLeds();
        restart();
    }

    
    if(reactorState.playerTries == reactorState.level)
    {
        if(reactorState.level == reactorState.combination.length)
        {
            alert("Reator Reiniciado.");
            reactorState.reactorOn = true;
            return;
        }
        reactorState.playerTries = 0;
        reactorState.level++;
        blinkOrder();
    }
}

async function blinkOrder()
{
    ReactorButtons.forEach(button => button.disabled = true);

    for (let index = 0; index < reactorState.level; index++)
    {
        const led = reactorState.combination[index];
        await blinkLedAsync(VisorImages[led]);
    }

    ReactorButtons.forEach(button => button.disabled = false);
    
    ReactorLeds.forEach(led => led.classList.remove('acertos-led-ativo'));
}

function restart() 
{
    reactorState.combination = ARRAY_5.map(_ => getRandomNumber(0, REACTOR_MAX_COMBINATION));
    reactorState.playerCombination = [];
    reactorState.playerTries = 0;
    reactorState.level = 1;

    setTimeout(() => blinkOrder(), 1000);
}