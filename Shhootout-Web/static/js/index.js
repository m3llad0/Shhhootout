//import {Chart} from '../js/chart.js/dist/chart.js'

let myChart;

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
    
    if (myChart){
        myChart.destroy();
    }
    
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
    levelsCreated.innerText = res['levels_created'];
    
    
    let canvas = document.getElementById("createdvsplayed");
    let ctx = canvas.getContext('2d');

     //Chart.defaults.global.defaultFontColor = '#18cde6';
     //Chart.defaults.global.defaultFontSize = 16;

    let data = {
        labels: ["Played ", "Created"],
          datasets: [
            {
                fill: true,
                backgroundColor: [
                    '#18cde6',
                    '#d89e05'],
                data: [res['levels_played'], res['levels_created'] ],
            }
        ]
    };

    // Notice the rotation from the documentation.

    let options = {
            title: {
                      display: true,
                      text: 'Is this player a creator or a player?',
                      position: 'top'
                  },
            rotation: -0.7 * Math.PI
    };


    // Chart declaration:
    myChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });
    
    
    
    
    
}



window.addEventListener('load', function () {
    queryLevels()
    let statButton = document.getElementById("statsubmit");
    statButton.addEventListener("click",getUserStat);
    
})



