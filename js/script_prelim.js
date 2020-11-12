// load in the Kobe dataset

// Promise.all([d3.json('./data/Kobedata.json')]).then( dataJson =>
//     {
//         console.log(dataJson)
//     })

// reading in as csv results in much more useful data structure
Promise.all([d3.csv("./data/Kobedata.csv")]).then( data =>
{
    this.activeYear = null;

    this.storyOn = false;

    let that = this;
    
    function updateYearKobe (year) {
        if (year === null) {
            let heatMap = new HeatMap(data, updateYearKobe, storyTell);
            //let heatMap = new HeatMap(data,updateYearKobe);

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

             heatMap.drawHeatMapLeft();
         }
         else if (boolean === true) {
             that.storyOn = true;
             heatMap.storyMode();
             let storyFile = new Story(storyOn);
         }
    }
    
    let heatMap = new HeatMap(data, updateYearKobe, storyTell);
    //let heatMap = new HeatMap(data,updateYearKobe);

    heatMap.drawHeatMapLeft();
})