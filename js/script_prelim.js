// load in the Kobe dataset

// Promise.all([d3.json('./data/Kobedata.json')]).then( dataJson =>
//     {
//         console.log(dataJson)
//     })

// reading in as csv results in much more useful data structure
Promise.all([d3.csv("./data/Kobedata.csv")]).then( data =>
{
    this.activeYear = null;

    this.story = false;

    let that = this;
    
    function updateYearKobe (year) {
        if (year === null) {
            let heatMap = new HeatMap(data, updateYearKobe, storyTell);

            heatMap.drawHeatMapLeft();
        }
        else {
            that.activeYear = year;
            heatMap.updateChartKobe(year);
        }
    }

    function storyTell (story) {
        if (story === false) {
            let heatMap = new HeatMap(data, updateYearKobe, storyTell);

            heatMap.drawHeatMapLeft();
        }
        else {
            that.story = true;
            let storyFile = new storyFile(story);
            storyFile.depict();
        }
    }
    
    let heatMap = new HeatMap(data, updateYearKobe, storyTell);

    heatMap.drawHeatMapLeft();
})