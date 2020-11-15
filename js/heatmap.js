class ShotData{
    /**
     * @param locX x-location on court
     * @param locY y-location on court
     * @param result whether shot was made or missed
     * @param zone basic area on court shot was taken from
     * @param shotFlag binary representation of result
     * @param zone_range distance of shot
     * @param year Year that the shot event occured
     */

     constructor(LOC_X,LOC_Y,EVENT_TYPE,SHOT_ZONE_BASIC,SHOT_MADE_FLAG,
        SHOT_ZONE_RANGE, GAME_DATE){
         this.locX = +LOC_X;
         this.locY = +LOC_Y;
         this.result = EVENT_TYPE;
         this.zone = SHOT_ZONE_BASIC;
         this.shotFlag = +SHOT_MADE_FLAG;
         this.zone_range = SHOT_ZONE_RANGE;
         let stringyear = GAME_DATE.slice(0,4);
         this.year = +stringyear;

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
    constructor(data, updateYearKobe, storyTell, playerComp){
        this.updateYearKobe = updateYearKobe;
        this.storyTell = storyTell;
        this.playerComp = playerComp;
        this.playerCompON = false;

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
                this.data[i].SHOT_ZONE_RANGE, this.data[i].GAME_DATE);
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

        this.vizHeight = 900;
        this.svgWidth = 1200;
        this.vizWidth = 1200;
        this.margin = 25;

        this.xScale = d3.scaleLinear()
            .domain([xMin, xMax])
            .range([this.margin,(this.vizWidth+1.5*this.margin)/2]);
        this.yScale = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([this.margin,(this.vizHeight+100)]);
        this.scaleColor = d3.scaleOrdinal()
            .domain(this.typeList)
            .range(d3.schemeSet2);
        this.leftShotData = this.shotData;
        this.resetData = this.shotData;
        this.drawYearBar(updateYearKobe);

    }   

    drawHeatMapRight(hexRad,strokeLim){
        d3.select('#heatmap-div')
            .append('div')
            .attr("class", "tooltip")
            .attr("id", "tooltip")
            .style("opacity", 0);

        let that = this;

        let hexbin = d3.hexbin()
            .x(d => this.xScale(d.locX))
            .y(d => this.yScale(d.locY))
            .radius(hexRad)
            .extent([0,0],[this.vizHeight,this.vizWidth]);

        this.binsR = hexbin(this.shotData);
        d3.select("#heatmap-div").append("div")
            .attr("id","heatmap-svg-div");
        d3.select("#heatmap-svg-div").append("svg")
            .attr("height",this.vizHeight)
            .attr("width",this.vizWidth)
            .attr("id","heatmap-svg");

        let svg = d3.select("#heatmap-svg").append("g").attr("class","fullCourt");
        svg.append("image")
            .attr("href","data/LakersCourt.jpg")
            .attr("width",this.vizWidth-2*this.margin)
            .attr("height",this.vizHeight-2*this.margin)
            .attr("transform","translate(25,25)");
            
        let hexbins = svg.append("g")
            .attr("class","hexbins")
            .attr("stroke-width",hexRad/4)
            .attr("id", "rightCourt")
           .selectAll("path")
           .data(this.binsR)
           .join("path")
            .attr("transform", function(d) {
                return "rotate(90,"+that.vizWidth/2+","+that.vizHeight/2+") translate(277,-112)";
            })
            .attr("d",function(d) { return "M"+d.x+","+d.y+hexbin.hexagon();})
            .attr("fill",function(d,i){
                let sumFlag = 0;
                    d.forEach(element => sumFlag = sumFlag+element.shotFlag);
                    d.fg_perc = (sumFlag/d.length)*100;
                    d.made_shots = sumFlag;
                    d.num_shots = d.length;
                    if(i  == 3){d.flag = "This is the test Hex"};
                let purples = d3.scaleSequential().range(["rgb(255,255,255)","rgb(85,37,130)"]).domain([-10,75]);
                if(d.fg_perc > 0 & d.length > 2){
                    return purples(d.fg_perc);
                }
                else if (d.fg_perc > 0 & d.length <= 2){
                    return purples(d.fg_perc);
                }
                else{
                    return "none";
                }
            })
            .attr("stroke",function(d){
                // gold is rgb(253,185,39)
                let strokeColor = d3.scaleSequential().range(["rgb(0,0,0)","rgb(255,0,0)"]).domain([0,strokeLim]).clamp(true);
                return strokeColor(d.num_shots);
            })
            .attr("opacity",function(d){
                if(d.length >= 3){
                    return 1;
                }
                else{
                    return 0.75
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

        let dropdown = d3.select("#selectNow");
            dropdown.on("change", function () {
                let player = this.value;

                that.playerComp(player);
            });

        this.tooltip(hexbins);

        let toggleStory = d3.select("#story-button");

        let resetButton = d3.select("#reset-button");

        let regionSelect = d3.select("#brush-button");

        toggleStory.on("click", function() {
            let pressed = true;
            that.storyTell(pressed);
        });

        resetButton.on("click", function() {
            that.resetViz();
        });

        regionSelect.on("change", function(){
            that.drawBrush();
        })
        
    }

    // creates the tooltip
    tooltip (hexbins) {
        let that = this;
        let tooltip = d3.select('.tooltip');

        // tooltip for the hexagons
        hexbins.on('mouseover', function(d,i) {

            let pageX = d.clientX;
            let pageY = d.clientY + 5;

        tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
        
        tooltip.html(that.tooltipDivRender(d))
            .style("left", (pageX) + "px")
            .style("top", (pageY) + "px");
        });

        hexbins.on("mouseout", function(d,i) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
    }

    drawHeatMapLeft(hexRad,strokeLim){
        let that = this;

        let hexbinL = d3.hexbin()
            .x(d => this.xScale(d.locX))
            .y(d => this.yScale(d.locY))
            .radius(hexRad)
            .extent([0,0],[this.vizHeight,this.vizWidth]);

        this.binsL = hexbinL(this.leftShotData);

        let svg = d3.select(".fullCourt");

        let hexbins = svg.append("g")
            .attr("class","hexbins")
            .attr("id", "leftCourt")
            .attr("stroke-width",hexRad/4)
           .selectAll("path")
           .data(this.binsL)
           .join("path")
            .attr("transform", function(d) {
                return "rotate(-90,"+that.vizWidth/2+","+that.vizHeight/2+") translate(277,-112)"
            })
            .attr("d",function(d) { return "M"+d.x+","+d.y+hexbinL.hexagon();})
            .attr("fill",function(d){
                let sumFlag = 0;
                    d.forEach(element => sumFlag = sumFlag+element.shotFlag);
                    d.fg_perc = (sumFlag/d.length)*100;
                    d.made_shots = sumFlag;
                    d.num_shots = d.length;
                let grays = d3.scaleSequential().range(["rgb(255,255,255)","rgb(16,25,25)"]).domain([-10,75]);
                if(d.fg_perc > 0 & d.length > 2){
                    return grays(d.fg_perc);
                }
                else if (d.fg_perc > 0 & d.length <= 2){
                    return grays(d.fg_perc);
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
                    return 0.75
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

            that.tooltip(hexbins);
    }

    // creates the words in the tooltip
    tooltipDivRender (data){
        let percentage = data.currentTarget.__data__.fg_perc;
        let shot_range = data.currentTarget.__data__[0].zone_range;
            let percent = percentage.toFixed(1);
        let attempts = data.currentTarget.__data__.num_shots;
        let made = data.currentTarget.__data__.made_shots;
        if (shot_range === "Less Than 8 ft.") {
            shot_range = "< 8 ft."
        }

        return "<h5>" + percent + "%" + "<br/>" + 
            "Distance: " + shot_range +" <br/>" +
            "Made: "+made+" Attempted: "+attempts+"</h5>";
    }

    drawYearBar () {
        let that = this;

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

        if (this.activeYear !== null) {
        let sliderText = sliderLabel.append('text')
            .text(this.activeYear);

            sliderText.attr('x', yearScale(this.activeYear));
            sliderText.attr('y', 25);

        yearSlider.on('input', function () {

            sliderText
                .text(this.value)
                .attr('x', yearScale(this.value))
                .attr('y', 25); 

            that.updateYearKobe(this.value);

        })
        }
    }

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
        this.drawHeatMapLeft(8,5);

    }

    storyMode () {
        
        d3.select("#leftCourt").remove();
        d3.select("#rightCourt").remove();
        d3.select(".slider-wrap").remove();

    }

    playerCompChart(newData) {
        this.playerCompON = true;

        this.leftShotData = [];

        for(let i = 0; i < newData.length; i++){
            let node = new ShotData(newData[i].LOC_X,
                newData[i].LOC_Y,newData[i].EVENT_TYPE,
                newData[i].SHOT_ZONE_BASIC,newData[i].SHOT_MADE_FLAG,
                newData[i].SHOT_ZONE_RANGE, newData[i].GAME_DATE);
            this.leftShotData.push(node);

        }
        d3.select("#leftCourt").remove();
        this.drawHeatMapLeft(4,15);
        this.drawBrush();

    }

    resetViz () {
        this.story = false;

        d3.select("#next-button").remove();
        d3.select("#back-button").remove();

        d3.select("#heatmap-svg").remove();
        d3.select("#tooltip").remove();

        this.activeYear = null;

        d3.select("#slider-text").selectAll("text").text("");

        this.shotData = this.resetData;
        this.drawHeatMapRight();
        this.drawHeatMapLeft();
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
    
    // draws two brushes - one offset to match the data flipped onto the other half of the court
    drawBrush(){
        let that = this;
        
        let brush1 = d3.select(".fullCourt").classed("brush",true);
        let brushBinsR = [...this.binsR];
        let brushBinsL = [...this.binsL];
    
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
                    
                    let xavg = (x1+x2)/2;
                    let yavg = (y1+y2)/2;
                    let brShiftX = (2*((that.vizWidth/2)-xavg));
                    let brShiftY = (2*((that.vizHeight/2)-yavg));
                    d3.select(".fullCourt2").attr("transform","translate("+brShiftX+","+brShiftY+")");

                    let [x1R,y1R] = [0,0];
                    let [x2R,y2R] = [0,0];

                    if(x1 > that.vizWidth/2){
                        [x1R,y1R] = that.rotate(600,450,x1,y1,90);
                        [x2R,y2R] = that.rotate(600,450,x2,y2,90);
                    }

                    let x1Rt = x1R-277;
                    let x2Rt = x2R-277;
                    let y1Rt = y1R+112;
                    let y2Rt = y2R+112;
                    
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
                that.drawSubVis(selectedIndicesR,selectedIndicesL,x2,y1);
            })
            .on("end",function(){

            });
        
        let courtBrush2 = d3.brush().extent([[that.margin,that.margin],[that.vizWidth-that.margin,that.vizHeight-that.margin]]);
        d3.select(".fullCourt").append("g").attr("class","fullCourt2");
        let brush2 = d3.select(".fullCourt2").classed("brush",true);
        
        brush1.call(courtBrush).call(courtBrush.move,[0,0])
        brush2.call(courtBrush2).call(courtBrush2.move,[0,0]);
        
        // this.testTransform();
    }

    // to figure out what tranformation exactly was necessary to make the brushing able to select correctly
    testTransform(){
        let x = 322;
        let y = 78;
       
        let xt = x+277;
        let yt = y-112;
        let [xr,yr] = this.rotate(600,450,xt,yt,-90);
    
        console.log("x-test",x,xt,xr)
        console.log("y-test",y,yt,yr)

        let xrev = 1084;
        let yrev = 450;
        let [xrevr,yrevr] = this.rotate(600,450,xrev,yrev,90);
        let xrevt = xrevr-277;
        let yrevt = yrevr+112;
        console.log("rev",xrevt,yrevt)
    }

    drawSubVis(indR,indL,x,y){
        let that = this;
        d3.select(".subVis").remove();
        if(x > 0){
            d3.select("#heatmap-div")
                .append("div")
                .attr("class","subVis")
                .attr("id","subVis-div")
                .style("left",(x+100)+"px")
                .style("top",function(){
                    // if(y<that.vizHeight/2){
                    //     return (y+50)+"px"
                    // }
                    // else{
                        return (y-(y/2)+100)+"px"
                    // }
                })
                // .style("opacity",0)
                // .transition()
                // .duration(250)
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

        let subVis1 = d3.select("#subSVG-1");
        let totalShotsR = 0;
        let totalMadeR = 0;
        let yearsListR = [];
        selectBinsR.forEach(function(d){
            totalShotsR = totalShotsR+d.num_shots;
            totalMadeR = totalMadeR+d.made_shots;
            yearsListR.push(d[0].year);
        })
        yearsListR = [...new Set(yearsListR)];
        let yearAvgFg = [];
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
            yearAvgFg.push(numMadeYear/numShotYear);
        }

        subVis1.selectAll("rect")
            .data(yearAvgFg)
            .join("rect")
            
        
        console.log(yearsListR)
        console.log(yearAvgFg)

        let avgFgPercR = (totalMadeR/totalShotsR)*100;
        // console.log(avgFgPercR,totalMadeR,totalShotsR)
    }

}