// load in the Kobe dataset

// Promise.all([d3.json('./data/Kobedata.json')]).then( dataJson =>
//     {
//         console.log(dataJson)
//     })

// reading in as csv results in much more useful data structure
async function loadCompData() {

    let lebron = await d3.csv("./data/Lebrondata.csv");
    let booker = await d3.csv("./data/Bookerdata.csv");
    let davis = await d3.csv("./data/Davisdata.csv");
    let giannis = await d3.csv("./data/Giannisdata.csv");
    let kemba = await d3.csv("./data/Kembadata.csv");
    let leonard = await d3.csv("./data/Leonarddata.csv");
    let pascal = await d3.csv("./data/Pascaldata.csv");
    let trae = await d3.csv("./data/Traedata.csv");
    let doncic = await d3.csv("./data/Doncicdata.csv");
    let harden = await d3.csv("./data/Hardendata.csv");
    let curry = await d3.csv("./data/Currydata.csv");

    return{
        "Stephen Curry": curry,
        "James Harden": harden,
        "Luka Doncic": doncic,
        "LeBron James": lebron,
        "Anthony Davis": davis,
        "Kawhi Leonard": leonard,
        "Kemba Walker": kemba,
        "Giannis Antetokounmpo": giannis,
        "Pascal Siakam": pascal,
        "Trae Young": trae,
        "Devin Booker": booker
    }
}

let kobe = d3.csv("./data/Kobedata.csv");
let compData = loadCompData();

Promise.all([kobe,compData]).then(data => {
    let Kobedata = data[0];
    let playerCompData = data[1];
    
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

            let story = new storyFile(boolean);
                story.removeStory();

            // let heatMap = new HeatMap(Kobedata, updateYearKobe, 
            //     storyTell, playerComp, updateYearPlayer);

            // heatMap.drawHeatMapRight(4,12);
            // heatMap.drawHeatMapLeft(4,12);
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
        that.playerCompON = true;
        let playerData = playerCompData[name];
        heatMap.playerCompChart(playerData);
        
        // if (name === "Stephen Curry") {
        //     that.playerCompON = true;
        //     let playerData = data[1];
        //     heatMap.playerCompChart(playerData);
        // }
        // else if (name === "James Harden") {
        //     that.playerCompON = true;
        //     let playerData = data[2];
        //     heatMap.playerCompChart(playerData);
        // }
        // else if (name === "Luka Doncic") {
        //     that.playerCompON = true;
        //     let playerData = data[3];
        //     heatMap.playerCompChart(playerData);
        // }

    }

    let heatMap = new HeatMap(Kobedata, updateYearKobe, 
        storyTell, playerComp, updateYearPlayer);
    //let heatMap = new HeatMap(data,updateYearKobe);
    heatMap.drawHeatMapRight(6,15);
    heatMap.drawHeatMapLeft(6,15);

})

