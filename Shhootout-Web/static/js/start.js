//const fs = require('fs');
const PAUSE_TIME = 500;
const DELAY_TIME = 1500;

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
        node.setAttribute("style",newval);
        i++;
        setTimeout(function() {loadbar(node,i)},50);
    }

}


const waitUserName = (textInput) => new Promise(function (resolve) {
    textInput.addEventListener('keyup', function _handleInput(event){
        if (event.key === 'Enter'){
            textInput.removeEventListener('keyup',_handleInput)
            resolve(event.currentTarget.value);
        }

    });
})

const waitUserClick = () => new Promise(function (resolve) {
    
    const newButton = document.getElementById('input-B')
    const regButton = document.getElementById('input-B2')
    
    typetext(newButton,"> I am a new agent.",0);
    typetext(regButton,"> I am a registered agent.",0);
    
    
    newButton.addEventListener('click', function _handleInput(event){
            newButton.removeEventListener('click',_handleInput)
            resolve(0);
    });
    
    regButton.addEventListener('click', function _handleInput(event){
            regButton.removeEventListener('click',_handleInput)
            resolve(1);
    });
})


function getSessionDate(){

return "- May 25, 2022";
}




function assignScriptNode(n){
    return document.getElementById("script-"+n);
}
function assignInputNode(n){
    return document.getElementById("input-"+n);
}
function assignInputNodeAux(n){
    return document.getElementById("input-"+n+"a");
}

async function splash(){
    
    const today = new Date();
    const sessionDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let terminal = document.getElementById("console-div");
    let scriptPath = "../static/script.txt"
    //let script = JSON.parse(fs.readFileSync(scriptPath));
    let script =
    {
    'welcomeScript' : ["<DATE>","-initializing comm channel...","<LOADBAR>","- Agent Portal System"],
    'registerScript' : [" > Please enter your email address...","> What is your name?...","> Please enter a password..."],
    'authScript': ["- authenticating..."],
    'errorMessages': [" !! That is not a correct email address !! ", "!! That name is too short !!", "!! That is a weak password !!"],
    'endScript': ["> Welcome.", "> Your assigned mission is ready.", "> Be seen and heard by no one.", "- loading agent portal...", "<LOADBAR>"]
    };

    
    script.welcomeScript[0] = " -192.168.1.215 : " + sessionDate;
    let cursor = document.getElementById("cursor-div");
    let cursor_input = document.getElementById("cursor-div-input");
    const LINE_BREAK = document.createElement("br");
    
    
    terminal.removeChild(cursor);
    terminal.removeChild(cursor_input);

    let scriptGuide = 0;
    let inputGuide = 0;
    
    let nodeGuide = 0;
    
    let inputNode = assignInputNode(inputGuide);
    let scriptNode = assignScriptNode(scriptGuide);
    

    // Welcome Script START
    
    for(let i=0; i<2; i++){
        let linebreak = document.createElement("br")
        let currentCursor = cursor.cloneNode();
        scriptNode = assignScriptNode(scriptGuide);
        scriptNode.after(currentCursor);
        currentCursor.after(linebreak);
        await wait(DELAY_TIME);
        let text = script.welcomeScript[scriptGuide];
        typetext(scriptNode,text,0);
        scriptNode.scrollIntoView();
        scriptGuide++;
        await wait(PAUSE_TIME);
        terminal.removeChild(currentCursor);
    }

    await wait(DELAY_TIME/6);
    scriptNode = assignScriptNode(scriptGuide);
    loadbar(scriptNode,0);
    scriptGuide++;
    await wait(DELAY_TIME);
    
    for(let i=3; i<4; i++){
        let linebreak = document.createElement("br")
        let currentCursor = cursor.cloneNode();
        scriptNode = assignScriptNode(scriptGuide);
        scriptNode.after(currentCursor);
        currentCursor.after(linebreak);
        await wait(DELAY_TIME);
        let text = script.welcomeScript[scriptGuide];
        typetext(scriptNode,text,0);
        scriptNode.scrollIntoView();
        scriptGuide++;
        await wait(PAUSE_TIME);
        terminal.removeChild(currentCursor);
    }
    
    
    let button = await waitUserClick();
    
    if (button === 0){
        
        let register = [];
        let keys = ['email','username','password']
        for(let i=4; i<7; i++){
            
            let linebreak = document.createElement("br")
            let currentCursor = cursor.cloneNode();
            let otherCursor = cursor_input.cloneNode();
            scriptNode = assignScriptNode(scriptGuide);
            scriptNode.after(currentCursor);
            currentCursor.after(linebreak);
            await wait(DELAY_TIME);
            let text = script.registerScript[scriptGuide-4];
            typetext(scriptNode,text,0);
            scriptNode.scrollIntoView();
            
            inputNode = assignInputNodeAux(inputGuide);
            typetext(inputNode,"> ",0);
            
            inputNode = assignInputNode(inputGuide);
            inputNode.before(otherCursor);
            let result = await waitUserName(inputNode);
            
            inputGuide++
            scriptGuide++
            await wait(PAUSE_TIME);
            terminal.removeChild(currentCursor);
            terminal.removeChild(otherCursor);
            
            register.push(result);
            
        }
        
        let requestbody = []
        
        for (let i = 0; i<4; i++){
            let key = encodeURIComponent(keys[i]);
            let value = encodeURIComponent(register[i])
            requestbody.push(key + "=" + value);
        }
        requestbody = requestbody.join("&")
        
        let request = new XMLHttpRequest();
        request.open('POST','https://api.shhootout.tk/register',true);
        request.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=UTF-8');
        request.send(requestbody);

        
    } else {
        
    }

    

    
    scriptGuide = 7;
    for(let i=7; i<8; i++){
        
        let linebreak = document.createElement("br")
        let currentCursor = cursor.cloneNode();
        scriptNode = assignScriptNode(scriptGuide);
        scriptNode.after(currentCursor);
        currentCursor.after(linebreak);
        await wait(DELAY_TIME);
        let text = script.authScript[scriptGuide-7];
        typetext(scriptNode,text,0);
        scriptNode.scrollIntoView();
        scriptGuide++
        await wait(PAUSE_TIME);
        terminal.removeChild(currentCursor);
    }
    
    await wait(DELAY_TIME/6);
    scriptNode = assignScriptNode(scriptGuide);
    loadbar(scriptNode,0);
    scriptGuide++;
    await wait(DELAY_TIME);
    
    for(let i=9; i<12; i++){
        let linebreak = document.createElement("br")
        let currentCursor = cursor.cloneNode();
        scriptNode = assignScriptNode(scriptGuide);
        scriptNode.after(currentCursor);
        currentCursor.after(linebreak);
        await wait(DELAY_TIME);
        let text = script.endScript[scriptGuide-9];
        typetext(scriptNode,text,0);
        scriptNode.scrollIntoView();
        scriptGuide++
        await wait(PAUSE_TIME);
        terminal.removeChild(currentCursor);
    }
    
    await wait(DELAY_TIME/6);
    scriptNode = assignScriptNode(scriptGuide);
    loadbar(scriptNode,0);
    scriptGuide++;
    await wait(DELAY_TIME);
    
    window.location.replace("splash");

}

window.addEventListener("load",splash);
