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

    this.activeYearPlayer = null;

    this.storyOn = false;

    this.playerCompON = false;

    let that = this;

    /**
     * Callback function filtering the data by year selection
     * @param {year} year - year recieved from the selected player's slider
     */
    function updateYearPlayer (year) {
        if (year === null) {
            let heatMap = new HeatMap(Kobedata, updateYearKobe, storyTell,
                playerComp, updateYearPlayer);

            heatMap.drawHeatMapRight();
            heatMap.drawHeatMapLeft();
        }
        else {
            that.activeYearPlayer = year;
            heatMap.updateChartPlayer(year);
        }
    }

    /**
     * Callback function filtering the data by year selection
     * @param {year} year - year recieved from Kobe's slider
     */
    function updateYearKobe (year) {
        if (year === null) {
            let heatMap = new HeatMap(Kobedata, updateYearKobe, 
                storyTell, playerComp, updateYearPlayer);

            heatMap.drawHeatMapRight();
            heatMap.drawHeatMapLeft();
        }
        else {
            that.activeYear = year;
            heatMap.updateChartKobe(year);
        }
    }

    /**
     * Callback function calling the story mode object
     * @param {boolean} boolean - a flag for when the button is selected
     */
    function storyTell (boolean) {
         if (boolean === false) {
            that.storyOn = false;

             let heatMap = new HeatMap(Kobedata, updateYearKobe, 
                storyTell, playerComp, updateYearPlayer);

            let story = new storyFile(boolean);
            story.removeStory();

            heatMap.drawHeatMapRight(4,12);
            heatMap.drawHeatMapLeft(4,12);
         }
         else if (boolean === true) {
            if (that.storyOn === false) {
                that.storyOn = true;
                heatMap.storyMode();
                let story = new storyFile(boolean);
                story.drawStory();
            }
         }
    }

    /**
     * Callback function importing data for different players
     * @param {name} name - name recieved from the dropdown menu
     */
    function playerComp (name) {
        if (name === "Stephen Curry") {
            that.playerCompON = true;
            let playerData = data[1];
            heatMap.playerCompChart(playerData);
        }
        else if (name === "James Harden") {
            that.playerCompON = true;
            let playerData = data[2];
            heatMap.playerCompChart(playerData);
        }
        else if (name === "Luka Doncic") {
            that.playerCompON = true;
            let playerData = data[3];
            heatMap.playerCompChart(playerData);
        }

    }
    
    let heatMap = new HeatMap(Kobedata, updateYearKobe, 
        storyTell, playerComp, updateYearPlayer);
    //let heatMap = new HeatMap(data,updateYearKobe);
    heatMap.drawHeatMapRight(4,12);
    heatMap.drawHeatMapLeft(4,12);

})

