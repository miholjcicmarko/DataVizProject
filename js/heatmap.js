class ShotData{
    /**
     * @param locX x-location on court
     * @param locY y-location on court
     * @param result whether shot was made or missed
     * @param zone basic area on court shot was taken from
     * @param shotFlag binary representation of result
     */

     constructor(LOC_X,LOC_Y,EVENT_TYPE,SHOT_ZONE_BASIC,SHOT_MADE_FLAG){
         this.locX = +LOC_X;
         this.locY = +LOC_Y;
         this.result = EVENT_TYPE;
         this.zone = SHOT_ZONE_BASIC;
         this.shotFlag = +SHOT_MADE_FLAG;
     }
}

class HeatMap {
    constructor(data){
        this.data = data[0];
        
        this.shotData = [];
        let xlist = [];
        let ylist = [];
        let typeList = [];
        let distList = [];
        for(let i = 0; i < this.data.length; i++){
            let node = new ShotData(this.data[i].LOC_X,
                this.data[i].LOC_Y,this.data[i].EVENT_TYPE,this.data[i].SHOT_ZONE_BASIC,this.data[i].SHOT_MADE_FLAG);
            this.shotData.push(node);

            xlist.push(+this.data[i].LOC_X);
            ylist.push(+this.data[i].LOC_Y);
            typeList.push(this.data[i].SHOT_ZONE_BASIC);
            distList.push(this.data[i].SHOT_ZONE_RANGE);

        }
        console.log(this.data)
        this.typeList = [...new Set(typeList)];
        this.distList = [...new Set(distList)];
        let xMax = d3.max(xlist);
        let xMin = d3.min(xlist);
        let yMax = d3.max(ylist);
        let yMin = d3.min(ylist);
        console.log(this.typeList)
        console.log(this.distList)

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

    }   

    drawHeatMapRight(){
        let that = this;

        let hexbin = d3.hexbin()
            .x(d => this.xScale(d.locX))
            .y(d => this.yScale(d.locY))
            .radius(4)
            .extent([0,0],[this.vizHeight,this.vizWidth]);

        let bins = hexbin(this.shotData);
        console.log(bins)
        d3.select("#heatmap-div").append("svg")
            .attr("height",this.vizHeight)
            .attr("width",this.vizWidth)
            .attr("id","heatmap-svg");

        let svg = d3.select("#heatmap-svg");
        svg.append("image")
            .attr("href","data/LakersCourt.jpg")
            .attr("width",this.vizWidth-2*this.margin)
            .attr("height",this.vizHeight-2*this.margin)
            .attr("transform","translate(25,25)");

        let hexbins = svg.append("g")
            .attr("class","hexbins")
            .attr("stroke","black")
           .selectAll("path")
           .data(bins)
           .join("path")
            .attr("transform", function(d) {
                return "rotate(90,"+that.vizWidth/2+","+that.vizHeight/2+") translate("+(d.x+277)+","+(d.y-112)+")";
            })
            .attr("d",hexbin.hexagon())
            .attr("fill",function(d){
                let sumFlag = 0;
                    d.forEach(element => sumFlag = sumFlag+element.shotFlag);
                    d.fg_perc = (sumFlag/d.length)*100;
                let purples = d3.scaleSequential(d3.interpolatePurples).domain([-20,75]);
                let purples2 = d3.scaleSequential().range(["rgb(255,255,255)","rgb(85,37,130)"]).domain([-10,75]);
                if(d.fg_perc > 0 & d.length > 2){
                    // return purples(d.fg_perc);
                    return purples2(d.fg_perc);
                    // return that.scaleColor(d[0].zone)
                }
                else if (d.fg_perc > 0 & d.length <= 2){
                    return purples2(30);
                }
                else{
                    return "none";
                }
            })
            .attr("opacity",function(d){
                if(d.length >= 7){
                    return d.length/12;
                // return 0.5;
                }
                else{
                    return 0.55
                }
            })
            .attr("stroke-opacity",function(d){
                if(d.fg_perc == 0){
                    return 0;
                }
                else{
                    return 0.75;
                }
            });

        d3.select('#heatmap-div')
            .append('div')
            .attr("class", "tooltip")
            .style("opacity", 0);

        let tooltip = d3.select('.tooltip');

        // tooltip for the circles in the bubblechart
        hexbins.on('mouseover', function(d,i) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
        
            tooltip.html(that.tooltipDivRender(d))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            });

        hexbin.on("mouseout", function(d,i) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    }

    drawHeatMapLeft(){
        let that = this;

        let hexbinL = d3.hexbin()
            .x(d => this.xScale(d.locX))
            .y(d => this.yScale(d.locY))
            .radius(4)
            .extent([0,0],[this.vizHeight,this.vizWidth]);

        let binsL = hexbinL(this.shotData);
        console.log(binsL)
        let svg = d3.select("#heatmap-svg");

        svg.append("g")
            .attr("class","hexbins")
            .attr("stroke","black")
           .selectAll("path")
           .data(binsL)
           .join("path")
            .attr("transform", function(d) {
                return "rotate(-90,"+that.vizWidth/2+","+that.vizHeight/2+") translate("+(d.x+277)+","+(d.y-112)+")";
            })
            .attr("d",hexbinL.hexagon())
            .attr("fill",function(d){
                let sumFlag = 0;
                    d.forEach(element => sumFlag = sumFlag+element.shotFlag);
                    d.fg_perc = (sumFlag/d.length)*100;
                let purples = d3.scaleSequential(d3.interpolatePurples).domain([-20,75]);
                let purples2 = d3.scaleSequential().range(["rgb(255,255,255)","rgb(16,25,25)"]).domain([-10,75]);
                if(d.fg_perc > 0 & d.length > 2){
                    // return purples(d.fg_perc);
                    return purples2(d.fg_perc);
                    // return that.scaleColor(d[0].zone)
                }
                else if (d.fg_perc > 0 & d.length <= 2){
                    return purples2(30);
                }
                else{
                    return "none";
                }
            })
            .attr("opacity",function(d){
                if(d.length >= 7){
                    return d.length/12;
                // return 0.5;
                }
                else{
                    return 0.55
                }
            })
            .attr("stroke-opacity",function(d){
                if(d.fg_perc == 0){
                    return 0;
                }
                else{
                    return 0.75;
                }
            });
    }

TooltipRender (data){
    let percentage = data.fg_perc;
    
    if (pos > 0) {
        party = party + "R+"
    }
    else if (pos < 0) {
        party = party + "D+"
        let pos_val = pos * -1;
        pos = pos_val.toFixed(3);
    }
    return "<h5>" + phrase + "<br/>" + 
        party + " " + pos + "%" +"<br/>" + 
        "In " + frequency_fixed + "%" + " of speeches" + "</h5>";
}
    

}