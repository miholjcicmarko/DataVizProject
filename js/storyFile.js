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
                if (that.counter < 7) {
                    that.counter = that.counter + 1;
                    that.alterStory();
                }
            });

            let story_div = d3.select('#overlay')
                          .attr("width", that.svgWidth/2)
                          .attr("height", that.vizHeight/3)
                          .style("top", 420 + "px")
                          .style("left", 110 + "px")
                          .style("z-index", 2);

            // Hornets buzzer beater
            story_div
                .append("iframe")
                .attr("id", "storyID")
                .attr("width", that.svgWidth/2.5)
                .attr("height", that.vizHeight/3)
                .attr("src", "https://www.youtube.com/embed/3cGTf57VV7I");

            let tv = d3.select('#tv')
                .style("z-index", 1);

            tv
                .style("top", 380 +"px")
                .style("opacity", 1);

            let ball = d3.select("#ball")
                .attr("width", that.svgWidth/5)
                .attr("height", that.vizHeight/5)
                .style("top", 880 + "px")
                .style("left", 970+ "px")
                .style("z-index", 1);

            ball.style("opacity", 1);

            let summary_div = d3.select('#story-summary')
                          .attr("width", that.svgWidth/2.55)
                          .attr("height", that.vizHeight/5)
                          .style("top", 840 + "px")
                          .style("left", 65 + "px")
                          .style("z-index", 2);

            summary_div.style("background-color", "rgb(253,185,39)")
                        .style("color", "black");

            summary_div.html(that.story_summary(that.counter));

            }
            
        }
        
    }

    alterStory() {

        d3.select("#storyID").remove();

        if (this.counter === 0) {
        
        // Hornets buzzer beater
        let story_div = d3.select('#overlay');
            
            story_div
            .append("iframe")
            .attr("id", "storyID")
            .attr("width", this.svgWidth/2.1)
            .attr("height", this.vizHeight/2)
            .attr("src", "https://www.youtube.com/embed/3cGTf57VV7I")
            .attr("allowfullscreen", true);
        }
        else if (this.counter === 1) {

        // Grizzlies buzzer beater
        let story_div = d3.select('#overlay');

            story_div
                .append("iframe")
                .attr("id", "storyID")
                .attr("width", this.svgWidth/2.1)
                .attr("height", this.vizHeight/2)
                .attr("src", "https://www.youtube.com/embed/ZZJ9Qc2lrRU");
        }

        else if (this.counter === 2) {
            // Nuggets buzzer beater

            let story_div = d3.select('#overlay');
    
            story_div
                .append("iframe")
                .attr("id", "storyID")
                .attr("width", this.svgWidth/2.1)
                .attr("height", this.vizHeight/2)
                .attr("src", "https://www.youtube.com/embed/gUDWxiBn6k0");
        }

        else if (this.counter === 3) {
            let story_div = d3.select('#overlay');
            // Blazers buzzer beater

            story_div
                .append("iframe")
                .attr("id", "storyID")
                .attr("width", this.svgWidth/2.1)
                .attr("height", this.vizHeight/2)
                .attr("src", "https://www.youtube.com/embed/lgSmpCAq4-4");
        }

        else if (this.counter === 4) {
            let story_div = d3.select('#overlay');
            // Suns buzzer beater
            
            story_div
                .append("iframe")
                .attr("id", "storyID")
                .attr("width", this.svgWidth/2.1)
                .attr("height", this.vizHeight/2)
                .attr("src", "https://www.youtube.com/embed/v9rtbKzpXDY");
        }

        else if (this.counter === 5) {
            let story_div = d3.select('#overlay');
            // Heat Buzzer Beater

            story_div
                .append("iframe")
                .attr("id", "storyID")
                .attr("width", this.svgWidth/2.1)
                .attr("height", this.vizHeight/2)
                .attr("src", "https://www.youtube.com/embed/Bbdt-ZL_S1M");
        }

        else if (this.counter === 6) {
            let story_div = d3.select('#overlay');
            // Bucks buzzer beater

            story_div
                .append("iframe")
                .attr("id", "storyID")
                .attr("width", this.svgWidth/2.1)
                .attr("height", this.vizHeight/2)
                .attr("src", "https://www.youtube.com/embed/i871mbuJ2I0"); 
        }

        else if (this.counter === 7) {
            // Kings Buzzer Beater
            let story_div = d3.select('#overlay');

            story_div
                .append("iframe")
                .attr("id", "storyID")
                .attr("width", this.svgWidth/2.1)
                .attr("height", this.vizHeight/2)
                .attr("src", "https://www.youtube.com/embed/j6nBQQ5LC88"); 
        }
    }

    removeStory () {
        d3.select("#storyID").remove();
        d3.select('#overlay').style("z-index", -1);
    }

    story_summary (counter) {

        if (counter === 0) {
            return "<h2>" + "Kobe's First Game Winning Buzzer Beater" + "<h2>" + 
            "<p>" + "Date: February 22, 2002" + "</p>" + "<p>" +
            "Bryant drills game winner over the outstretched arm of George Lynch"
            + "</p>";
        }



    }
}
