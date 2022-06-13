const PAUSE_TIME = 1000;
const DELAY_TIME = 3000;
let terminal = document.getElementById("console-div")



// Auxiliary Functions

function generateRandom(max){
    return Math.floor(Math.random() * max);
}

function wait(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

function typetext(node,s,i){
    if (i<s.length){
        node.textContent += s.charAt(i);
        i++
        setTimeout(function() {typetext(node,s,i)
        },50);
}
}

function loadbar(node,i){
    if(i<=95){
        let newval = "width:"+i+"%";
        console.log(newval);
        node.setAttribute("style",newval);
        i++;
        setTimeout(function() {loadbar(node,i)},50);
    }

}

function getSessionDate(){

return "- May 25, 2022";
}

function assignScriptNode(n){
    return document.getElementById("script-"+n);
}

function assignInputNode(n){
    return document.getElementById("input-"+n);
}


// Flow Control Functions

async function writeScript(guide, start, end, cursor){
    
    for (let i = start; i<end; i++){
        let linebreak = document.createElement("br")
        let currentCursor = cursor.cloneNode();
        let scriptNode = assignScriptNode(guide);
        scriptNode.after(currentCursor);
        currentCursor.after(linebreak);
        await wait(DELAY_TIME);
        typetext(scriptNode,script[guide],0);
        scriptNode.scrollIntoView();
        guide++
        await wait(PAUSE_TIME);
        terminal.removeChild(currentCursor);
    }
    
    return guide;
}


async function writeBar(guide){
    
    let scriptNode = assignScriptNode(scriptGuide);
    loadbar(scriptNode,0);
    guide++;
    await wait(DELAY_TIME);
    return guide;
}


async function writeInput(guide, cursor){
    let field = assignInputNode(guide);
    let currentCursor = cursor.cloneNode();
    field.before(currentCursor);
    let value = await waitInput(field);
    await wait(DELAY_TIME);
    terminal.removeChild(currentCursor);
    guide++;
    return [guide,value];
    
}



function waitInput(node){
    
    return new Promise(function (resolve){
        node.addEventListener('keyup', function _handleInput(event){
            if (event.key === 'Enter'){
                node.removeEventListener('keyup', _handleInput)
                resolve(event.currentTarget.value);
            }
        })
    })
    
}


// Flow Functions
async function returningUser(){

}

async function newUser(){

}


// Main Function

async function splash(){
    
    // DOM Objects
    
    const CURSOR = document.getElementById("cursor-div")
    const CURSOR_INPUT = document.getElementById("cursor-div-input")
    
    
    // Setup DOM
    
    terminal.removeChild(CURSOR);
    terminal.removeChild(CURSOR_INPUT);
    
    let scriptGuide = 0
    let inputGuide = 0
    
    let userName = ""
    let emailAdd = ""
    let passKey = ""
    
    scriptGuide = await writeScript(scriptGuide, scriptGuide, 2, CURSOR);
    scriptGuide = await writeBar(scriptGuide);
    scriptGuide = await writeScript(scriptGuide,scriptGuide,6,CURSOR);
    
    [inputGuide, userName] = await writeInput(inputGuide,CURSOR_INPUT);
    
    scriptGuide = await writeScript(scriptGuide, scriptGuide, 12, CURSOR);
    scriptGuide = await writeBar(scriptGuide);
        
    window.location.replace("start.html/?uname="+userName);
    
    
}



window.addEventListener("load",splash);
