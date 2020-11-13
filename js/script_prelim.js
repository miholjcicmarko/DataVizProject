// load in the Kobe dataset

// Promise.all([d3.json('./data/Kobedata.json')]).then( dataJson =>
//     {
//         console.log(dataJson)
//     })

// reading in as csv results in much more useful data structure
Promise.all([d3.csv("./data/Kobedata.csv")]).then(data =>
{
    this.activeYear = null;

    this.storyOn = false;

    let that = this;
    
    function updateYearKobe (year) {
        if (year === null) {
            let heatMap = new HeatMap(data, updateYearKobe, storyTell);
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
             let heatMap = new HeatMap(data, updateYearKobe, storyTell);

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
    
    let heatMap = new HeatMap(data, updateYearKobe, storyTell);
    //let heatMap = new HeatMap(data,updateYearKobe);
    heatMap.drawHeatMapRight();
    heatMap.drawHeatMapLeft();
})

let luka = d3.csv("./data/Doncicdata.csv");
let harden = d3.csv("./data/Hardendata.csv");
let curry = d3.csv("./data/Currydata.csv");

Promise.all([luka, harden, curry]).then(datasets => {
    console.log(datasets);
})