class storyFile {
    constructor(storyOn) {

        this.storyOn = storyOn;

        this.counter = 0;

        this.vizHeight = 900;
        this.svgWidth = 1200;

    }

    drawStory () {
        let that = this;

        if (this.storyOn === true) {

            if (that.counter === 0) {
            
            let buttonBack = document.createElement("button");
            buttonBack.innerHTML = "Back";
            buttonBack.id = "back-button";
        
            let body = document.getElementById("back");
            body.appendChild(buttonBack);

            buttonBack.addEventListener ("click", function() {
                if (that.counter !== 0) {
                    that.counter = that.counter - 1;
                    that.alterStory();
                }
            });

            let buttonNext = document.createElement("button");
            buttonNext.innerHTML = "Next";
            buttonNext.id = "next-button";

            body = document.getElementById("front");
            body.appendChild(buttonNext);

            buttonNext.addEventListener ("click", function() {
                if (that.counter < 8) {
                    that.counter = that.counter + 1;
                    that.alterStory();
                }
            });

            let story_div = d3.select('#overlay')
                          .attr("width", that.svgWidth/2)
                          .attr("height", that.vizHeight/2)
                          .style("top", 250 + "px")
                          .style("z-index", 1);

            story_div
                .append("iframe")
                .attr("id", "storyID")
                .attr("width", that.svgWidth/2.25)
                .attr("height", that.vizHeight/2)
                .attr("src", "https://www.youtube.com/embed/3cGTf57VV7I");
            }

            
        }
        
    }

    alterStory() {

        d3.select("#storyID").remove();

        if (this.counter === 0) {
            
        let story_div = d3.select('#overlay');
            
            story_div
            .append("iframe")
            .attr("id", "storyID")
            .attr("width", that.svgWidth/2.25)
            .attr("height", that.vizHeight/2)
            .attr("src", "https://www.youtube.com/embed/3cGTf57VV7I");
        }
        else if (this.counter === 1) {

        let story_div = d3.select('#overlay');
            story_div
                .append("iframe")
                .attr("id", "storyID")
                .attr("width", that.svgWidth/2.25)
                .attr("height", that.vizHeight/2)
                .attr("src", "https://www.youtube.com/embed/ZZJ9Qc2lrRU");
        }
    }

    removeStory () {
        d3.select("#storyID").remove();
    }
}
