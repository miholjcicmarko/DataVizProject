class ShotData{
    /**
     * @param locX x-location on court
     * @param locY y-location on court
     * @param result whether shot was made or missed
     * @param zone basic area on court shot was taken from
     */

     constructor(LOC_X,LOC_Y,EVENT_TYPE,SHOT_ZONE_BASIC){
         this.locX = +LOC_X;
         this.locY = +LOC_Y;
         this.result = EVENT_TYPE;
         this.zone = SHOT_ZONE_BASIC;
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
                this.data[i].LOC_Y,this.data[i].EVENT_TYPE,this.data[i].SHOT_ZONE_BASIC);
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

        this.vizHeight = 600;
        this.vizWidth = 600;
        this.margin = 25;

        this.xScale = d3.scaleLinear()
            .domain([xMin, xMax])
            .range([this.margin,(this.vizWidth-this.margin)]);
        this.yScale = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([this.margin,(this.vizHeight)]);
        this.scaleColor = d3.scaleOrdinal()
            .domain(this.typeList)
            .range(d3.schemeSet2);

    }   

    drawHeatMap(){
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
            .attr("href","data/nba_halfcourt.jpg")
            .attr("width",this.vizWidth-2*this.margin)
            .attr("height",this.vizHeight-2*this.margin)
            .attr("transform","translate(25,25) rotate(-90,"+(that.vizWidth-2*this.margin)/2+","+(that.vizHeight-2*this.margin)/2+")");

        svg.append("g")
            .attr("class","hexbins")
            .attr("stroke","white")
            .attr("stroke-opacity",0.5)
            // .attr("fill", d => th.scaleColor(d.zone))
           .selectAll("path")
           .data(bins)
           .join("path")
            .attr("transform", function(d) {
                return "rotate(90,"+that.vizWidth/2+","+that.vizHeight/2+") translate("+(d.x)+","+d.y+")";
            })
            .attr("d",hexbin.hexagon())
            .attr("opacity",0.6)
            .attr("fill",function(d){
                console.log(d)
                return that.scaleColor(d[0].zone)
            });
    }

}