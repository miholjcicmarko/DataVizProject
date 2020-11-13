// load in the Kobe dataset

// Promise.all([d3.json('./data/Kobedata.json')]).then( dataJson =>
//     {
//         console.log(dataJson)
//     })

// reading in as csv results in much more useful data structure

let kobe = d3.csv("./data/Kobedata.csv");
let luka = d3.csv("./data/Doncicdata.csv");
let harden = d3.csv("./data/Hardendata.csv");
let curry = d3.csv("./data/Currydata.csv");

Promise.all([kobe, curry, harden, luka]).then(data =>
{
    let Kobedata = data[0];

    this.activeYear = null;

    this.storyOn = false;

    this.playerComp = false;

    let that = this;
    
    function updateYearKobe (year) {
        if (year === null) {
            let heatMap = new HeatMap(Kobedata, updateYearKobe, 
                storyTell);
            //let heatMap = new HeatMap(data,updateYearKobe);

            heatMap.drawHeatMapRight();
            heatMap.drawHeatMapLeft();
        }
        else {
            that.activeYear = year;
            heatMap.updateChartKobe(year);
        }
    }

    function storyTell (boolean) {
         if (boolean === false) {
             let heatMap = new HeatMap(Kobedata, updateYearKobe, 
                storyTell, playerComp);

             heatMap.drawHeatMapRight();
             heatMap.drawHeatMapLeft();
         }
         else if (boolean === true) {
             that.storyOn = true;
             heatMap.storyMode();
             let story = new storyFile(boolean);
             story.drawStory();
         }
    }

    function playerComp (name) {
        if (name === "Stephen Curry") {
            that.playerComp = true;
            let playerData = data[1];
            let playerDisplay = new playerComparison(playerData, playerComp);
            playerDisplay.drawHeatMap();
        }
        else if (name === "James Harden") {
            that.playerComp = true;
            let playerData = data[2];
            let playerDisplay = new playerComparison(playerData, playerComp);
            playerDisplay.drawHeatMap();
        }
        else if (name === "Luka Doncic") {
            that.playerComp = true;
            let playerData = data[3];
            let playerDisplay = new playerComparison(playerData, playerComp);
            playerDisplay.drawHeatMap();
        }


    }
    
    let heatMap = new HeatMap(Kobedata, updateYearKobe, 
        storyTell, playerComp);
    //let heatMap = new HeatMap(data,updateYearKobe);
    heatMap.drawHeatMapRight();
    heatMap.drawHeatMapLeft();
})

