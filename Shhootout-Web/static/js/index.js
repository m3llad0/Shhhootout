

async function queryLevels(){
    let url = 'https://api.shhootout.tk/levels/trend';
    let response = await fetch(url);
    let res = await response.json();
    console.log(res);
    
    let toplevel1 = document.getElementById("toplevel1");
    let toplevel2 = document.getElementById("toplevel2");
    let toplevel3 = document.getElementById("toplevel3");
    
    if (res.length >= 1){
        toplevel1.innerText = res[0].name;
    }
    
    if (res.length >= 2){
        toplevel1.innerText = res[1].name;
    }
    
    if (res.length >= 3){
        toplevel1.innerText = res[2].name;
    }
    
    
    
    
}

async function getUserStat(){

    
    
    let usernameSearch = document.getElementById("statlookup").value;
    let levelsPlayed = document.getElementById("stat1");
    let deaths = document.getElementById("stat2");
    let timePlayed = document.getElementById("stat3");
    let levelsCreated = document.getElementById("stat4");
    
    let url = 'https://api.shhootout.tk/statistics/user/'+usernameSearch;
    let response = await fetch(url);
    let res = await response.json();
    
    levelsPlayed.innerText = res['levels_played'];
    deaths.innerText = res['deaths'];
    timePlayed.innerText = res['total_time_played'];
    levelsCreated.innerText = res['levels_played'];
    
    
}



window.addEventListener('load', function () {
    queryLevels()
    let statButton = document.getElementById("statsubmit");
    statButton.addEventListener("click",getUserStat);
    
})



