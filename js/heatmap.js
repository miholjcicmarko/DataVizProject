class ShotData{
    /**
     * @param LOC_X x-location on court
     * @param LOC_Y y-location on court
     * @param EVENT_TYPE whether shot was made or missed
     * @param SHOT_ZONE_BASIC basic area on court shot was taken from
     * @param SHOT_MADE_FLAG binary representation of result
     * @param SHOT_ZONE_RANGE distance of shot
     * @param GAME_DATE date of game
     * @param SEASON regular/playoff
     * @param NAME name of player
     */

     constructor(LOC_X,LOC_Y,EVENT_TYPE,SHOT_ZONE_BASIC,SHOT_MADE_FLAG,
        SHOT_ZONE_RANGE, GAME_DATE, SEASON, NAME){
         this.locX = +LOC_X;
         this.locY = +LOC_Y;
         this.result = EVENT_TYPE;
         this.zone = SHOT_ZONE_BASIC;
         this.shotFlag = +SHOT_MADE_FLAG;
         this.zone_range = SHOT_ZONE_RANGE;
         let stringyear = GAME_DATE.slice(0,4);
         this.year = +stringyear;
         this.season = SEASON;
         this.name = NAME;

        //  let stringyear = GAME_DATE.slice(0,4);
        //  let yearnumber = +stringyear;
        //  let stringmonth = +GAME_DATE.slice(4,6);
        //     if (stringmonth > 7) {
        //         yearnumber = yearnumber+1;
        //         let yearnumberstring = "" + yearnumber
        //         let yearnumberstringformatted = yearnumberstring.slice(2,4);
        //         this.year = stringyear + "-" + yearnumberstringformatted;
        //     }
        //     else if (stringmonth < 7) {
        //         yearnumber = yearnumber-1;
        //         let yearnumberstring = "" + yearnumber
        //         let yearnumberstringformatted = stringyear.slice(2,3);
        //         this.year = yearnumberstring + "-" + yearnumberstringformatted;
        //     }
    }
}

class HeatMap {
    constructor(data, updateYearKobe, storyTell, playerComp, updateYearPlayer){
        this.updateYearKobe = updateYearKobe;
        this.storyTell = storyTell;
        this.playerComp = playerComp;
        this.updateYearPlayer = updateYearPlayer;
        this.playerCompON = false;
        this.storyON = false;
        this.playoffOn = false;

        this.slider = false;
        this.slider2 = false;
        this.sliderPresent = false;
        this.slider2present = false;

        this.data = data;
        
        this.shotData = [];
        let xlist = [];
        let ylist = [];
        let typeList = [];
        let distList = [];
        for(let i = 0; i < this.data.length; i++){
            let node = new ShotData(this.data[i].LOC_X,
                this.data[i].LOC_Y,this.data[i].EVENT_TYPE,
                this.data[i].SHOT_ZONE_BASIC,this.data[i].SHOT_MADE_FLAG,
                this.data[i].SHOT_ZONE_RANGE, this.data[i].GAME_DATE, 
                this.data[i].Season, this.data[i].PLAYER_NAME);
            this.shotData.push(node);

            xlist.push(+this.data[i].LOC_X);
            ylist.push(+this.data[i].LOC_Y);
            typeList.push(this.data[i].SHOT_ZONE_BASIC);
            distList.push(this.data[i].SHOT_ZONE_RANGE);

        }
        this.typeList = [...new Set(typeList)];
        this.distList = [...new Set(distList)];
        let xMax = d3.max(xlist);
        let xMin = d3.min(xlist);
        let yMax = d3.max(ylist);
        let yMin = d3.min(ylist);

        this.vizHeight = 950;
        this.svgWidth = 1750;
        this.vizWidth = 1750;
        this.margin = 25;
        this.xOffset = 495;
        this.yOffset = -200;

        this.xScale = d3.scaleLinear()
            .domain([xMin, xMax])
            .range([this.margin,(this.vizWidth-282)/2]);
        this.yScale = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([this.margin,this.vizHeight+260]);
        this.scaleColor = d3.scaleOrdinal()
            .domain(this.typeList)
            .range(d3.schemeSet2);
        this.leftShotData = this.shotData;
        this.resetData = this.shotData;
        this.drawYearBar(updateYearKobe);

        let leftLabel = d3.select("#playoff-season-labelA")
                .append("svg").attr("id", "left-label")
                .classed("svg-text", true);
        
        leftLabel.append("text")
            .attr("transform", "translate(155,55)")
            .text("Playoff Kobe");

        let rightLabel = d3.select("#playoff-season-labelB")
            .append("svg").attr("id", "right-label")
            .classed("svg-text", true);

        rightLabel.append("text")
            .attr("transform", "translate(155,55)")
            .text("Season Kobe")
            .attr("fill", "rgb(85,37,130)");

        this.player_name = "Kobe Bryant";

        let sliderPlayer = d3.select("#sliderLabel2")
                .append("svg").attr("id", "slider-label2")
                .classed("svg-text", true);

            let displays = "Choose year for " + this.player_name;
    
            sliderPlayer.append("text")
                    .attr("transform", "translate(155,15)")
                    .style("font-size", "18px")
                    .text(displays);
    }   

    /**
     * Draws the hexagonal heatmap for Kobe using the data input into the HeatMap class
     * @param {the radius of the hexagonal bins} hexRad 
     * @param {the number of shots at which stroke will fully saturate} strokeLim 
     */
    drawHeatMapRight(hexRad,strokeLim){
        d3.select('#heatmap-div')
            .append('div')
            .attr("class", "tooltip")
            .attr("id", "tooltip")
            .style("opacity", 0);

        let that = this;

        let rightShotData = [];

        if (that.playoffOn === true && that.playerCompON === true) {
            for (let i = 0; i < that.shotData.length; i++) {
                if (that.shotData[i].season === "Playoffs") {
                    rightShotData.push(that.shotData[i]);
                }
            }
        }
        else if (that.playoffOn === false) {
            for (let i = 0; i < that.shotData.length; i++) {
                if (that.shotData[i].season === "Regular") {
                    rightShotData.push(that.shotData[i]);
                }
            }
        }

        // defines hexbin function used to determine paths of hexagonal bins
        let hexbin = d3.hexbin()
            .x(d => this.xScale(d.locX))
            .y(d => this.yScale(d.locY))
            .radius(hexRad)
            .extent([0,0],[this.vizHeight,this.vizWidth]);
        // performs binning process
        this.binsR = hexbin(rightShotData);
        d3.select("#heatmap-div").append("div")
            .attr("id","heatmap-svg-div");
        d3.select("#heatmap-svg-div").append("svg")

            .attr("height",this.vizHeight)
            .attr("width",this.vizWidth)
            .attr("id","heatmap-svg");
        // inserts image of court into SVG
        let svg = d3.select("#heatmap-svg").append("g").attr("class","fullCourt");
        svg.append("image")
            .attr("href","data/LakersCourt.jpg")
            .attr("width",this.vizWidth-2*this.margin)
            .attr("height",this.vizHeight-2*this.margin)
            .attr("transform","translate(25,25)");
        // renders hexagonal heatmap into specific group of SVG
        let hexbins = svg.append("g")
            .attr("class","hexbins")
            .attr("stroke-width",hexRad/4)
            .attr("id", "rightCourt")
           .selectAll("path")
           .data(this.binsR)
           .join("path")
            .attr("transform", function(d) {
                return "rotate(90,"+that.vizWidth/2+","+that.vizHeight/2+") translate("+that.xOffset+","+that.yOffset+")";
            })
            .attr("d",function(d) { return "M"+d.x+","+d.y+hexbin.hexagon();})
            .attr("fill",function(d,i){
                // calculates teh shot percentage and number of shots made in each bin
                let sumFlag = 0;
                    d.forEach(element => sumFlag = sumFlag+element.shotFlag);
                    d.fg_perc = (sumFlag/d.length)*100;
                    d.made_shots = sumFlag;
                    d.num_shots = d.length;
                    if(i  == 3){d.flag = "This is the test Hex"};
                // defines colorscale for heatmap and applies it to any bins with made shots
                that.purples = d3.scaleSequential().range(["rgb(255,255,255)","rgb(85,37,130)"]).domain([-10,75]);
                if(d.fg_perc > 0){
                    return that.purples(d.fg_perc);
                }
                else{
                    return "none";
                }
            })
            .attr("stroke",function(d){
                // defines color scale for stroke based off number of shots
                let strokeColor = d3.scaleSequential().range(["rgb(0,0,0)","rgb(255,0,0)"])
                    .domain([0,strokeLim]).clamp(true);
                return strokeColor(d.num_shots);
            })
            .attr("opacity",function(d){
                if(d.length >= 3){
                    return 1;
                }
                else{
                    return 0.7;
                }
            })
            .attr("stroke-opacity",function(d){
                if(d.fg_perc == 0){
                    return 0;
                }
                else{
                    return d.length/4;
                }
            });

        let dropdown = d3.select("#selectNow");
            dropdown.on("change", function () {
                let player = this.value;

                that.playerCompON = true;

                if (that.storyON === true) {
                    let pressed = false;
                    that.storyTell(pressed);
                }

                if (player === '-') {
                    that.resetViz();
                }
                else {
                    that.playerComp(player);
                }
            });

        if (this.sliderPresent === false) {
            let sliderKobe = d3.select("#sliderLabel")
            .append("svg").attr("id", "slider-label")
            .classed("svg-text", true);

            sliderKobe.append("text")
                .attr("transform", "translate(155,25)")
                .style("font-size", "26px")
                .text("Choose Year for Kobe");

            this.sliderPresent = true;
        }

        this.tooltip(hexbins);

        let toggleStory = d3.select("#story-button");

        let playoffButton = d3.select(".toggle-button");

        let resetButton = d3.select("#reset-button");

        let regionSelect = d3.select("#brush-button");

        toggleStory.on("click", function() {
            if (that.storyON === false) {
                let pressed = true;
                that.storyTell(pressed);
            }
        });

        playoffButton.on("click", function() {
            if (that.playoffOn === false) {
                that.playoffOn = true;
                d3.select("#tooltip").remove();
                d3.select("#heatmap-svg-div").remove();

                that.drawHeatMapRight(8,5);
                if (that.playerCompON === true) {
                    that.leftShotData = that.resetLeftData;
                }
               
                that.drawHeatMapLeft(8,5);
            }
            else if (that.playoffOn === true) {
                that.playoffOn = false;
                d3.select("#tooltip").remove();
                d3.select("#heatmap-svg-div").remove();

            if (that.playerCompON === true) {

                if (that.slider === true && that.slider2 === true) {
                    that.drawHeatMapRight(8,5);
                    that.drawHeatMapLeft(8,5);
                }
                else if (that.slider === true && that.slider2 === false) {
                    that.drawHeatMapRight(8,5);
                    that.drawHeatMapLeft(6,15);
                }
                else if (that.slider === false && that.slider2 === true) {
                    that.drawHeatMapRight(6,15);
                    that.drawHeatMapLeft(8,5);
                }
                else if (that.slider === false && that.slider2 === false) {
                    that.drawHeatMapRight(6,15);
                    that.drawHeatMapLeft(6,15);
                }
            }
            else if (that.playerCompON === false) {
                if (that.slider === true) {
                    that.drawHeatMapRight(8,5);
                    that.drawHeatMapLeft(8,5);
                }
                else if (that.slider === false) {
                    that.drawHeatMapRight(6,15);
                    that.drawHeatMapLeft(6,15);
                }
            }
        }
        })

        if (this.player_name !== "Kobe Bryant" && this.playoffOn === true) {
            let rightLabel = d3.select("#right-label");

            rightLabel.selectAll("text")
                .text("Playoff Kobe")
                .attr("fill", "rgb(85,37,130)");
        }
        else if (this.player_name !== "Kobe Bryant" && this.playoffOn === false) {
            let rightLabel = d3.select("#right-label");

            rightLabel.selectAll("text")
                .text("Season Kobe")
                .attr("fill", "rgb(85,37,130)");
        }

        resetButton.on("click", function() {
            that.resetViz();
        });

        regionSelect.on("change", function(){
            that.drawBrush();
        })
        
    }

    /**
     * This function creates the tooltip
     * @param {hexbins} hexbins - the hexabin that the mouse hovers over
    */
    tooltip (hexbins) {
        let that = this;
        let tooltip = d3.select('.tooltip');

        // tooltip for the hexagons
        hexbins.on('mouseover', function(d,i) {

            let pageX = d.clientX;
            let pageY = d.clientY + 5;
            
            d3.select(this).classed("hovered",true);

        tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
        
        tooltip.html(that.tooltipDivRender(d))
            .style("left", (pageX) + "px")
            .style("top", (pageY) + "px");
        });

        hexbins.on("mouseout", function(d,i) {
            d3.select(this).classed("hovered",false);

            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
    }

    // same as drawHeatMapRight w/o the function calls and without appending things like divs/svgs
    drawHeatMapLeft(hexRad,strokeLim){
        let that = this;

        let hexbinL = d3.hexbin()
            .x(d => this.xScale(d.locX))
            .y(d => this.yScale(d.locY))
            .radius(hexRad)
            .extent([0,0],[this.vizHeight,this.vizWidth]);

        this.leftShots = [];

        if (that.playoffOn === true && that.playerCompON === true) {
            for (let i = 0; i < that.leftShotData.length; i++) {
                if (that.leftShotData[i].season === "Playoffs") {
                    this.leftShots.push(that.leftShotData[i]);
                }
            }
        }
        else if (that.playoffOn === false && that.playerCompON === true) {
            for (let i = 0; i < that.leftShotData.length; i++) {
                if (that.leftShotData[i].season === "Regular") {
                    this.leftShots.push(that.leftShotData[i]);
                }
            }
        }
        else if (that.playerCompON === false) {
            for (let i = 0; i < that.leftShotData.length; i++) {
                if (that.leftShotData[i].season === "Playoffs") {
                    this.leftShots.push(that.leftShotData[i]);
                }
            }
        }

        if (this.slider === false && this.slider2 === false) {
            that.resetLeftDataKobe = this.leftShotData;
        }

        this.binsL = hexbinL(this.leftShots);
        let svg = d3.select(".fullCourt");

        let hexbins = svg.append("g")
            .attr("class","hexbins")
            .attr("id", "leftCourt")
            .attr("stroke-width",hexRad/4)
           .selectAll("path")
           .data(this.binsL)
           .join("path")
            .attr("transform", function(d) {
                return "rotate(-90,"+that.vizWidth/2+","+that.vizHeight/2+") translate("+that.xOffset+","+that.yOffset+")";
            })
            .attr("d",function(d) { return "M"+d.x+","+d.y+hexbinL.hexagon();})
            .attr("fill",function(d){
                let sumFlag = 0;
                    d.forEach(element => sumFlag = sumFlag+element.shotFlag);
                    d.fg_perc = (sumFlag/d.length)*100;
                    d.made_shots = sumFlag;
                    d.num_shots = d.length;
                that.grays = d3.scaleSequential().range(["rgb(255,255,255)","rgb(16,25,25)"]).domain([-10,75]);
                if(d.fg_perc > 0 & d.length > 2){
                    return that.grays(d.fg_perc);
                }
                else if (d.fg_perc > 0 & d.length <= 2){
                    return that.grays(d.fg_perc);
                }
                else{
                    return "none";
                }
            })
            .attr("stroke",function(d){
                let strokeColor = d3.scaleSequential().range(["rgb(0,0,0)","rgb(253,185,39)"]).domain([0,strokeLim]).clamp(true);
                return strokeColor(d.num_shots);
            })
            .attr("opacity",function(d){
                if(d.length >= 7){
                    return 1;
                }
                else{
                    return 0.7;
                }
            })
            .attr("stroke-opacity",function(d){
                if(d.fg_perc == 0){
                    return 0;
                }
                else{
                    return 1;
                }
            });

            if (this.playerCompON === true && this.slider2present === false) {
                that.drawYearBarPlayer(this.updateYearPlayer);
            }

            if (this.player_name !== "Kobe Bryant" && this.playoffOn === true) {
                let leftLabel = d3.select("#left-label");

                let display = "Playoff" + " " + this.player_name;
    
                leftLabel.selectAll("text")
                    .text(display);
            }
            else if (this.player_name !== "Kobe Bryant" && this.playoffOn === false) {
                let leftLabel = d3.select("#left-label");

                let display = "Season" + " " + this.player_name;
    
                leftLabel.selectAll("text")
                    .text(display);
            }
          
            that.tooltip(hexbins);
    }

    /**
     * This function creates the tool tip div with all of the information of the 
     * highlighted hexbin
     * @param {data} data - the data from the highlighted hexbin
     * 
     */
    tooltipDivRender (data){
        let percentage = data.currentTarget.__data__.fg_perc;
        let shot_range = data.currentTarget.__data__[0].zone_range;
            let percent = percentage.toFixed(1);
        let attempts = data.currentTarget.__data__.num_shots;
        let made = data.currentTarget.__data__.made_shots;
        let name = data.currentTarget.__data__[0].name;
        let year = data.currentTarget.__data__[0].year;
        let season_playoff = data.currentTarget.__data__[0].season;
        if (shot_range === "Less Than 8 ft.") {
            shot_range = "< 8 ft."
        }

        return "<h5>" + percent + "%" + "<br/>" + 
            "Distance: " + shot_range +" <br/>" +
            "Made: "+made+" Attempted: "+attempts+
            "<br/>"+ name + " " + year + "</br>"+ season_playoff+ "</h5>";
    }

    /**
     * This function draws the year bar slider for Kobe Bryant
     */
    drawYearBar () {
        let that = this;

        this.slider = false;

        let yearScale = d3.scaleLinear()
                            .domain([1996, 2016])
                            .range([30, 730]);
        
        let yearSlider = d3.select('#slider')
            .append('div').classed('slider-wrap', true)
            .append('input').classed('slider', true)
            .attr('type', 'range')
            .attr('min', 1996)
            .attr('max', 2016)
            .attr('value', this.activeYear);

        let sliderLabel = d3.select('.slider-wrap')
            .append('div').classed('slider-label', true)
            .append('svg').attr("id", "slider-text");

        if (this.activeYear !== null || this.reset === true || this.activeYear === null) {
        let sliderText = sliderLabel.append('text')
            .text(this.activeYear);

            sliderText.attr('x', yearScale(this.activeYear));
            sliderText.attr('y', 25);

        yearSlider.on('input', function () {
            that.slider = true;

            sliderText
                .text(this.value)
                .attr('x', yearScale(this.value))
                .attr('y', 25); 

            that.updateYearKobe(this.value);

        })
        
        // yearSlider.on('click', function() {
        //     that.slider = true;

        //     sliderText
        //         .text(this.value)
        //         .attr('x', yearScale(this.value))
        //         .attr('y', 25); 

        //     that.updateYearKobe(this.value);
        // })
        }
    }

    /**
     * This function draws the year bar slider for the selected player
     */
    drawYearBarPlayer () {
        let that = this;

        this.slider2 = false;

        let yearArray = []

        for (let i = 0; i < this.leftShotData.length; i++) {
            yearArray.push(this.leftShotData[i].year);
        }

        let min = d3.min(yearArray);
        let max = d3.max(yearArray);

        let yearScale = d3.scaleLinear()
                            .domain([min, max])
                            .range([30, 730]);
        
        if (this.slider2present === false) {

        let yearSlider = d3.select('#playerCompSlider')
            .append('div').classed('slider-wrap', true).attr('id', 'slider-wrap-Comp')
            .append('input').classed('slider2', true)
            .attr('type', 'range')
            .attr('min', min)
            .attr('max', 2020)
            .attr('value', this.activeYearPlayer);

        let sliderLabel = d3.select('#slider-wrap-Comp')
            .append('div').classed('slider-label', true)
            .append('svg').attr("id", "slider-text-playerComp");

            this.slider2present = true;
 
        if (this.activeYearPlayer !== null || this.slider2present === true) {
        //let sliderLabelpresent = d3.select('#slider-wrap-Comp');
        //let yearSlider = d3.select('#playerCompSlider');
        
        let sliderText = sliderLabel.append('text')
            .text(this.activeYearPlayer);

            sliderText.attr('x', yearScale(this.activeYearPlayer));
            sliderText.attr('y', 25);
        
            yearSlider.on('input', function () {
                that.slider2 = true;

                sliderText
                    .text(this.value)
                    .attr('x', yearScale(this.value))
                    .attr('y', 25); 
    
                that.updateYearPlayer(this.value);
    
            })
            
            // yearSlider.on('click', function() {
            //     that.slider2 = true;
                
            //     sliderText
            //         .text(this.value)
            //         .attr('x', yearScale(this.value))
            //         .attr('y', 25); 
    
            //     that.updateYearPlayer(this.value);
            // })
        }
        }
        
    }


    /**
     * This function filters Kobe's data for the specific year chosen in the slider
     * @param {year} year - the year inputted using the slider
     */
    updateChartKobe (year) {

        this.shotData = this.resetData;

        let newData = [];
        
        for (let i = 0; i < this.shotData.length; i++) {
            if (this.shotData[i].year === +year) {
                newData.push(this.shotData[i]);
            }
        }

        this.shotData = newData;

        d3.select("#heatmap-svg").remove();
        d3.select("#tooltip").remove();

        this.drawHeatMapRight(8,5);

        if (this.playerCompON === false) {
            this.leftShotData = newData;
            this.drawHeatMapLeft(8,5);
        }
        else if (this.playerCompON === true && this.slider2 === false) {
            this.drawHeatMapLeft(6,15);
        }
        else if (this.playerCompON === true && this.slider2 === true) {
            this.drawHeatMapLeft(8,5);
        }

    }

    /**
    * This function filters Player's data for the specific year chosen in the slider
    * @param {year} year - the year inputted using the slider
    */ 
    updateChartPlayer (year) {
        this.leftShotData = this.resetLeftData;

        let newData = [];
        
        for (let i = 0; i < this.leftShotData.length; i++) {
            if (this.leftShotData[i].year === +year) {
                newData.push(this.leftShotData[i]);
            }
        }

        this.leftShotData = newData;

        d3.select("#back").attr("width", "50px")
            .attr("height", "50px");

        d3.select("#next").attr("width", "50px")
            .attr("height", "50px");

        d3.select("#heatmap-svg").remove();
        d3.select("#tooltip").remove();

        if (this.slider === false) {
            this.drawHeatMapRight(6,15);
        }
        else if (this.slider = true) {
            this.drawHeatMapRight(8,5);
        }
        this.drawHeatMapLeft(8,5);

    }

    /**
     * This functon updates inputs the data into the left side of the court
     * @param {newData} newData 
     */
    playerCompChart(newData) {

        this.leftShotData = [];

        for(let i = 0; i < newData.length; i++){
            let node = new ShotData(newData[i].LOC_X,
                newData[i].LOC_Y,newData[i].EVENT_TYPE,
                newData[i].SHOT_ZONE_BASIC,newData[i].SHOT_MADE_FLAG,
                newData[i].SHOT_ZONE_RANGE, newData[i].GAME_DATE, newData[i].Season, 
                newData[i].PLAYER_NAME);
            this.leftShotData.push(node);

        }

        let leftLabel = d3.select("#left-label");

        this.player_name = this.leftShotData[0].name; 
        
        if (this.playoffOn === true) {
            this.displays = "Playoff " + this.player_name;
        }
        else if (this.playoffOn === false) {
            this.displays = "Season " + this.player_name;
        }

        if (this.player_name !== "Giannis Antetokounmpo") {
            leftLabel.selectAll("text")
            .attr("transform", "translate(155,55)")
            .style("font-size", "24px")
            .text(this.displays);
        }
        else {
            leftLabel.selectAll("text")
            .attr("transform", "translate(155,55)")
            .style("font-size", "16px")
            .text(this.displays);
        }

        d3.select("#slider-label2").remove();

        let sliderPlayer = d3.select("#slider-label2");

        let playerDisplays = "Choose year for " + this.player_name;

        sliderPlayer.selectAll("text")
            .attr("transform", "translate(155,15)")
            .style("font-size", "18px")
            .text(playerDisplays);
        

        this.resetLeftData = this.leftShotData;

        d3.select("#heatmap-svg").remove();
        d3.select("#tooltip").remove();
        d3.selectAll(".slider-wrap").remove();
        
        this.drawYearBar(this.updateYearKobe);
        this.slider2present = false;
        this.drawYearBarPlayer(this.updateYearPlayer);

        this.shotData = this.resetData;
        if (this.playoffOn === true) {
            this.drawHeatMapRight(8,5);
            this.drawHeatMapLeft(8,5);
        }
        else if (this.playoffOn === false) {
            this.drawHeatMapRight(6,15);
            this.drawHeatMapLeft(6,15);
        }

        //this.drawBrush();

    }

    /**
     * This function signals that the story is on and removes the hexabins from the chart.
     */
    storyMode () {
        this.storyON = true;

        d3.select("#leftCourt").remove();
        d3.select("#rightCourt").remove();
        d3.selectAll(".slider-wrap").remove();

        d3.select("#slider-label").remove();
        this.sliderPresent = false;

        if (this.slider2present === true) {
            d3.select("#slider-label2").remove();
        }

        this.playerCompON = false;
        this.playoffOn = false;

        this.slider = false;
        this.slider2 = false;
        this.slider2present = false;
        this.newSlider2 = false;

        document.getElementById("playoff-check").checked = false;
        document.getElementById("selectNow").selectedIndex = 0;

        d3.select("#left-label").remove();
        d3.select("#right-label").remove();

        let leftLabel = d3.select("#playoff-season-labelA")
                .append("svg").attr("id", "left-label")
                .classed("svg-text", true);
        
        leftLabel.append("text")
            .attr("transform", "translate(155,55)")
            .text("Playoff Kobe");

        let rightLabel = d3.select("#playoff-season-labelB")
            .append("svg").attr("id", "right-label")
            .classed("svg-text", true);

        rightLabel.append("text")
            .attr("transform", "translate(155,55)")
            .text("Season Kobe")
            .attr("fill", "rgb(85,37,130)");

        this.player_name = "Kobe Bryant";

    }

    /**
     * This function resets the entire visualization to its default state. 
     */
    resetViz () {

        d3.selectAll("#heatmap-svg-div").remove();
        d3.selectAll("#heatmap-svg").remove();
        d3.selectAll("#tooltip").remove();

        this.activeYear = null;

        this.activeYearPlayer = null;

        this.slider = false;
        this.slider2 = false;
        this.newSlider2 = false;
        
        //if (this.playoffOn === true) {
            this.playoffOn = false;
            document.getElementById("playoff-check").checked = false;
        //}
        
        //if (this.playerCompON === true) {
            this.playerCompON = false;
            document.getElementById("selectNow").selectedIndex = 0;
        //}

        d3.select("#slider-label2").remove();

        d3.selectAll(".slider-wrap").remove();

        if (this.storyON === true) {
            d3.select("#next-button").remove();
            d3.select("#back-button").remove();
            this.storyON = false;
            let pressed = false;
            this.storyTell(pressed);
        }

        this.shotData = this.resetData;
        this.leftShotData = this.resetData;
        this.drawHeatMapRight(6,15);
        this.drawHeatMapLeft(6,15);
        this.reset = true;
        this.drawYearBar(this.updateYearKobe);
        this.reset = false;

        d3.select("#left-label").remove();
        d3.select("#right-label").remove();

        let leftLabel = d3.select("#playoff-season-labelA")
                .append("svg").attr("id", "left-label")
                .classed("svg-text", true);
        
        leftLabel.append("text")
            .attr("transform", "translate(155,55)")
            .text("Playoff Kobe");

        let rightLabel = d3.select("#playoff-season-labelB")
            .append("svg").attr("id", "right-label")
            .classed("svg-text", true);

        rightLabel.append("text")
            .attr("transform", "translate(155,55)")
            .text("Season Kobe")
            .attr("fill", "rgb(85,37,130)");

        this.player_name = "Kobe Bryant";
    }

    // rotation function to use in draw brush to convert between pixel location and d.x d.y 
    // this rotates in the opposite direction of d3's rotation transform
    rotate(cx, cy, x, y, angle) {
        var radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
            ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return [nx, ny];
    }
    
    /**
     * draws two brushes - one offset to match the data flipped onto the other half of the court
     */
    drawBrush(){
        let that = this;
        
        let brush1 = d3.select(".fullCourt").classed("brush",true);
        let brushBinsR = [...this.binsR];
        let brushBinsL = [...this.binsL];
    // defines the primary brush and performs the selection of bins within brush boundaries
        let courtBrush = d3.brush().extent([[that.margin,that.margin],[that.vizWidth-that.margin,that.vizHeight-that.margin]])
            .on("start",function(){
                d3.select(".fullCourt").selectAll("path").classed("selectedHex",false).classed("not-selected",false);
            })
            .on("brush",function(){
                let brSelect = d3.brushSelection(this);

                let selectedIndicesR = [];
                let selectedIndicesL = [];
                let [x1,y1] = [0,0];
                let [x2,y2] = [0,0];
                
                if(brSelect){
                    [x1,y1] = brSelect[0];
                    [x2,y2] = brSelect[1];

                    if(x1 > 0){
                        d3.select(".fullCourt").selectAll("path").classed("selectedHex",false).classed("not-selected",true)
                    }
                    // translates the group calling the secondary brush to be in its reflected location
                    let xavg = (x1+x2)/2;
                    let yavg = (y1+y2)/2;
                    let brShiftX = (2*((that.vizWidth/2)-xavg));
                    let brShiftY = (2*((that.vizHeight/2)-yavg));
                    d3.select(".fullCourt2").attr("transform","translate("+brShiftX+","+brShiftY+")");

                    let [x1R,y1R] = [0,0];
                    let [x2R,y2R] = [0,0];

                    if(x1 > that.vizWidth/2){
                        [x1R,y1R] = that.rotate(that.vizWidth/2,that.vizHeight/2,x1,y1,90);
                        [x2R,y2R] = that.rotate(that.vizWidth/2,that.vizHeight/2,x2,y2,90);
                    }

                    let x1Rt = x1R-that.xOffset;
                    let x2Rt = x2R-that.xOffset;
                    let y1Rt = y1R-that.yOffset;
                    let y2Rt = y2R-that.yOffset;
                    
                    brushBinsR.forEach((d,i) => {
                        if((d.x >= x1Rt && d.x <= x2Rt) &&
                            (d.y <= y1Rt && d.y >= y2Rt)
                        ){selectedIndicesR.push(i)}
                    })
                    brushBinsL.forEach((d,i) => {
                        if((d.x >= x1Rt && d.x <= x2Rt) &&
                            (d.y <= y1Rt && d.y >= y2Rt)
                        ){selectedIndicesL.push(i)}
                    })
                }
                if(selectedIndicesR.length > 0){
                    let selectedHexR = d3.select("#rightCourt").selectAll("path");
                    let selectedHexL = d3.select("#leftCourt").selectAll("path");
                    selectedHexR.filter((_,i) => {
                        return selectedIndicesR.includes(i);
                    })
                    .classed("selectedHex",true).classed("not-selected",false);
                    selectedHexL.filter((_,i) => {
                        return selectedIndicesL.includes(i);
                    })
                    .classed("selectedHex",true).classed("not-selected",false);
                }
                // calls draw subvis and inputs the selected bins as their indices
                that.drawSubVis(selectedIndicesR,selectedIndicesL,x2,y1);
            })
            .on("end",function(){

            });
        // defines the secondary brush that is a reflection of the main across the origin
        let courtBrush2 = d3.brush().extent([[that.margin,that.margin],
            [that.vizWidth-that.margin,that.vizHeight-that.margin]]);
        d3.select(".fullCourt").append("g").attr("class","fullCourt2");
        let brush2 = d3.select(".fullCourt2").classed("brush",true);
        
        brush1.call(courtBrush).call(courtBrush.move,[0,0])
        brush2.call(courtBrush2).call(courtBrush2.move,[0,0]);
        
        // this.testTransform();
    }


    /**
     * Calculates the average fg% for the region selected by year an displays it in the subVis div as
     * a barchart
     * @ param indR: the indices of the bins being selected in the right heatmap
     * @ param indL: the indices of the bins being selected in the left heatmap
     * @ param x: the current x location of the right edge of the brush
     * @ param y: the current y location of the top edge of the brush
    */
    drawSubVis(indR,indL,x,y){
        let that = this;
        d3.select(".subVis").remove();
        if(x > 0){
            d3.select("#heatmap-div")
                .append("div")
                .attr("class","subVis")
                .attr("id","subVis-div")
                .style("left",function(){
                    if(x>(0.7*that.vizWidth)){
                        return (x-750)+"px"
                    }
                    else {return (x+100)+"px"}
                })
                .style("top", function(){
                    if(y>(0.5*that.vizHeight)){
                        return (y-200)+"px"
                    }
                    else {return (y+200)+"px"}
                })
                .style("opacity",1);
            d3.select("#subVis-div")
                .append("svg")
                .attr("height",250)
                .attr("width",350)
                .attr("x",that.margin)
                .attr("y",that.margin)
                .attr("id","subSVG-1");
            d3.select("#subVis-div")
                .append("svg")
                .attr("height",250)
                .attr("width",350)
                .attr("x",that.margin)
                .attr("y",300+that.margin)
                .attr("id","subSVG-2")
        }

        let selectBinsR = this.binsR.filter((_,i) => {
            return indR.includes(i);
        })
        let selectBinsL = this.binsL.filter((_,i) => {
            return indL.includes(i);
        })
       
        let subVis1 = d3.select("#subSVG-1");
        let subVis2 = d3.select("#subSVG-2");
        
        subVis1.append("text").data(selectBinsR).text(selectBinsR[0][0].name+": Fg% over time")
            .attr("x",350/2)
            .attr("y",that.margin)
            .attr("class","subvis-label");
        subVis2.append("text").data(selectBinsL).text(selectBinsL[0][0].name+": Fg% over time")
            .attr("x",350/2)
            .attr("y",that.margin)
            .attr("class","subvis-label");

        let totalShotsR = 0;
        let totalMadeR = 0;
        let yearsListR = [];
        selectBinsR.forEach(function(d){
            totalShotsR = totalShotsR+d.num_shots;
            totalMadeR = totalMadeR+d.made_shots;
            yearsListR.push(d[0].year);
        })
        yearsListR = [...new Set(yearsListR)];

        let totalShotsL = 0;
        let totalMadeL = 0;
        let yearsListL = [];
        selectBinsL.forEach(function(d){
            totalShotsL = totalShotsL+d.num_shots;
            totalMadeL = totalMadeL+d.made_shots;
            yearsListL.push(d[0].year);
        })
        yearsListL = [...new Set(yearsListL)];
        
        let yearAvgFgR = [];
        let yearAvgFgL = [];
        for(let i = 0; i < yearsListR.length; i++){
            let numShotYear = 0;
            let numMadeYear = 0;
            selectBinsR.forEach(function(d){
                d.forEach(function(d){
                    if(d.year == yearsListR[i]){
                        numShotYear = numShotYear+1;
                        numMadeYear = numMadeYear+d.shotFlag;
                    }
                })   
            })
            yearAvgFgR.push((numMadeYear/numShotYear)*100);
            subVis1.append("text")
                .text(yearsListR[i])
                .attr("x",((i+2)*20)+10)
                .attr("y",225)
                .attr("text-anchor","middle")
                .attr("class","year-label")
                .attr("transform","rotate(-90,"+(((i+2)*20)+10)+",250)");

            numShotYear = 0;
            numMadeYear = 0;
            selectBinsL.forEach(function(d){
                d.forEach(function(d){
                    if(d.year == yearsListL[i]){
                        numShotYear = numShotYear+1;
                        numMadeYear = numMadeYear+d.shotFlag;
                    }
                })   
            })
            yearAvgFgL.push((numMadeYear/numShotYear)*100);
            subVis2.append("text")
                .text(yearsListL[i])
                .attr("x",((i+2)*20)+10)
                .attr("y",225)
                .attr("text-anchor","middle")
                .attr("class","year-label")
                .attr("transform","rotate(-90,"+(((i+2)*20)+10)+",250)");
        }

        subVis1.selectAll("rect")
            .data(yearAvgFgR)
            .join("rect")
            .attr("height",d => d*2)
            .attr("width",19)
            .attr("x",(d,i) => (i*20)+10)
            .attr("y", d => 250-that.margin-(d*2))
            .attr("fill",d => this.purples(d));
        subVis2.selectAll("rect")
            .data(yearAvgFgL)
            .join("rect")
            .attr("height",d => d*2)
            .attr("width",19)
            .attr("x",(d,i) => (i*20)+10)
            .attr("y", d => 250-that.margin-(d*2))
            .attr("fill",d => this.grays(d));
        
        // console.log(yearsListR)
        // console.log(yearAvgFg)
    }

}