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
                          .attr("width", that.svgWidth/2.25)
                          .attr("height", that.vizHeight/3)
                          .style("top", 373 + "px")
                          .style("left", 680 + "px")
                          .style("z-index", 2);

            // Hornets buzzer beater
            story_div
                .append("iframe")
                .attr("id", "storyID")
                .attr("width", that.svgWidth/2.3)
                .attr("height", that.vizHeight/3)
                .attr("src", "https://www.youtube.com/embed/3cGTf57VV7I");

            let tv = d3.select('#tv')
                .style("z-index", 1);

            tv
                .style("top", 312 +"px")
                .style("opacity", 1);

            let ball = d3.select("#ball")
                .attr("width", that.svgWidth/5)
                .attr("height", that.vizHeight/5)
                .style("top", 900 + "px")
                .style("left", 1720 + "px")
                .style("z-index", 1);

            ball.style("opacity", 1);

            let summary_div = d3.select('#story-summary')
                          .attr("width", that.svgWidth/2.55)
                          .attr("height", that.vizHeight/5)
                          .style("top", 813 + "px")
                          .style("left", 628 + "px")
                          .style("z-index", 2);

            summary_div.style("background-color", "rgb(253,185,39)")
                        .style("color", "black")
                        .style("border-style","solid");

            summary_div.html(that.story_summary(that.counter));

            }
            
        }

        this.drawBubbles(this.counter);
        
    }

    alterStory() {

        d3.select("#storyID").remove();

        if (this.counter === 0) {
        
        // Hornets buzzer beater
        let story_div = d3.select('#overlay');
            
            story_div
            .append("iframe")
            .attr("id", "storyID")
            .attr("width", this.svgWidth/2.3)
            .attr("height", this.vizHeight/3)
            .attr("src", "https://www.youtube.com/embed/3cGTf57VV7I");

            let ball = d3.select("#ball")
                .attr("width", this.svgWidth/5)
                .attr("height", this.vizHeight/5)
                .style("top", 900 + "px")
                .style("left", 1720 + "px")
                .style("z-index", 1);

            ball.style("opacity", 1);

            let summary_div = d3.select('#story-summary');

            summary_div.html(this.story_summary(this.counter));
        }
        else if (this.counter === 1) {

        // Grizzlies buzzer beater
        let story_div = d3.select('#overlay');

            story_div
                .append("iframe")
                .attr("id", "storyID")
                .attr("width", this.svgWidth/2.3)
                .attr("height", this.vizHeight/3)
                .attr("src", "https://www.youtube.com/embed/ZZJ9Qc2lrRU");

            let ball = d3.select("#ball")
                .attr("width", this.svgWidth/5)
                .attr("height", this.vizHeight/5)
                .style("top", 615 + "px")
                .style("left", 1545 + "px")
                .style("z-index", 1);

            ball.style("opacity", 1);

            let summary_div = d3.select('#story-summary');

            summary_div.html(this.story_summary(this.counter));
        }

        else if (this.counter === 2) {
            // Nuggets buzzer beater

            let story_div = d3.select('#overlay');
    
            story_div
                .append("iframe")
                .attr("id", "storyID")
                .attr("width", this.svgWidth/2.3)
                .attr("height", this.vizHeight/3)
                .attr("src", "https://www.youtube.com/embed/gUDWxiBn6k0");

            let ball = d3.select("#ball")
                .attr("width", this.svgWidth/5)
                .attr("height", this.vizHeight/5)
                .style("top", 675 + "px")
                .style("left", 1545 + "px")
                .style("z-index", 1);

            ball.style("opacity", 1);

            let summary_div = d3.select('#story-summary');

            summary_div.html(this.story_summary(this.counter));
        }

        else if (this.counter === 3) {
            let story_div = d3.select('#overlay');
            // Blazers buzzer beater

            story_div
                .append("iframe")
                .attr("id", "storyID")
                .attr("width", this.svgWidth/2.3)
                .attr("height", this.vizHeight/3)
                .attr("src", "https://www.youtube.com/embed/lgSmpCAq4-4");

            let ball = d3.select("#ball")
                .attr("width", this.svgWidth/5)
                .attr("height", this.vizHeight/5)
                .style("top", 495 + "px")
                .style("left", 1520 + "px")
                .style("z-index", 1);

            ball.style("opacity", 1);

            let summary_div = d3.select('#story-summary');

            summary_div.html(this.story_summary(this.counter));
        }

        else if (this.counter === 4) {
            let story_div = d3.select('#overlay');
            // Suns buzzer beater
            
            story_div
                .append("iframe")
                .attr("id", "storyID")
                .attr("width", this.svgWidth/2.3)
                .attr("height", this.vizHeight/3)
                .attr("src", "https://www.youtube.com/embed/v9rtbKzpXDY");

            let ball = d3.select("#ball")
                .attr("width", this.svgWidth/5)
                .attr("height", this.vizHeight/5)
                .style("top", 770 + "px")
                .style("left", 1620 + "px")
                .style("z-index", 1);

            ball.style("opacity", 1);

            let summary_div = d3.select('#story-summary');

            summary_div.html(this.story_summary(this.counter));
        }

        else if (this.counter === 5) {
            let story_div = d3.select('#overlay');
            // Heat Buzzer Beater

            story_div
                .append("iframe")
                .attr("id", "storyID")
                .attr("width", this.svgWidth/2.3)
                .attr("height", this.vizHeight/3)
                .attr("src", "https://www.youtube.com/embed/Bbdt-ZL_S1M");

            let ball = d3.select("#ball")
                .attr("width", this.svgWidth/5)
                .attr("height", this.vizHeight/5)
                .style("top", 690 + "px")
                .style("left", 1470 + "px")
                .style("z-index", 1);

            ball.style("opacity", 1);

            let summary_div = d3.select('#story-summary');

            summary_div.html(this.story_summary(this.counter));
        }

        else if (this.counter === 6) {
            let story_div = d3.select('#overlay');
            // Bucks buzzer beater

            story_div
                .append("iframe")
                .attr("id", "storyID")
                .attr("width", this.svgWidth/2.3)
                .attr("height", this.vizHeight/3)
                .attr("src", "https://www.youtube.com/embed/i871mbuJ2I0");
                
            let ball = d3.select("#ball")
                .attr("width", this.svgWidth/5)
                .attr("height", this.vizHeight/5)
                .style("top", 475 + "px")
                .style("left", 1690 + "px")
                .style("z-index", 1);

            ball.style("opacity", 1);

            let summary_div = d3.select('#story-summary');

            summary_div.html(this.story_summary(this.counter));
        }

        else if (this.counter === 7) {
            // Kings Buzzer Beater
            let story_div = d3.select('#overlay');

            story_div
                .append("iframe")
                .attr("id", "storyID")
                .attr("width", this.svgWidth/2.3)
                .attr("height", this.vizHeight/3)
                .attr("src", "https://www.youtube.com/embed/j6nBQQ5LC88"); 

            let ball = d3.select("#ball")
                .attr("width", this.svgWidth/5)
                .attr("height", this.vizHeight/5)
                .style("top", 320 + "px")
                .style("left", 1775 + "px")
                .style("z-index", 1);

            ball.style("opacity", 1);

            let summary_div = d3.select('#story-summary')
                .style("z-index", 1);

            summary_div.html(this.story_summary(this.counter));
        }

        this.drawBubbles(this.counter);
    }

    removeStory () {
        d3.select("#storyID").remove();
        d3.select('#overlay').style("z-index", -1);

        d3.select('#tv').style("z-index", -1);
        let ball = d3.select("#ball");
        
        ball
            .style("z-index", -1)
            .style("opacity", 0);

        d3.select('#story-summary').style("z-index", -1);

        d3.select("#back-button").remove();
        d3.select("#next-button").remove();
        d3.selectAll("#bubbles-svg").remove();

    }

    story_summary (counter) {

        if (counter === 0) {
            return "<h2>" + "Kobe's First Game Winning Buzzer Beater" + "<h2>" + 
            "<p>" + "Date: February 22, 2002" + "</p>" + "<p>" +
            "Bryant drills game winner over the outstretched arm of George Lynch"
            + "</p>" + "<p>" + "Hornets: 94 Lakers: 96";
        }
        else if (counter === 1) {
            return "<h2>" + "Kobe's Second Game Winning Buzzer Beater" + "<h2>" +
            "<p>" + "Date: April 3, 2003" + "</p>" + "<p>" +
            "Bryant knocks down the final shot of the game over Shane Battier"
            + "</p>" + "<p>" + "Grizzlies: 102 Lakers: 101";
        }
        else if (counter === 2) {
            return "<h2>" + "Kobe's Third Game Winning Buzzer Beater" + "<h2>" +
            "<p>" + "Date: December 18, 2003" + "</p>" + "<p>" +
            "Bryant pump fakes Jon Barry and drains the game winner"
            + "</p>" + "<p>" + "Nuggets: 99 Lakers: 101";
        }
        else if (counter === 3) {
            return "<h2>" + "Kobe's Fourth Game Winning Buzzer Beater" + "<h2>" +
            "<p>" + "Date: April 13, 2004" + "</p>" + "<p>" +
            "Bryant drills game winner over Theo Ratliff in the 2nd overtime"
            + "</p>" + "<p>" + "Trail Blazers: 104 Lakers: 105";
        }
        else if (counter === 4) {
            return "<h2>" + "Kobe's Fifth Game Winning Buzzer Beater" + "<h2>" +
            "<p>" + "Date: April 29, 2006" + "</p>" + "<p>" +
            "Bryant pulls up over Boris Diaw and Raja Bell to deliver a 1st Round, Game 4 playoff win"
            + "</p>" + "<p>" + "Suns: 98 Lakers: 99";
        }
        else if (counter === 5) {
            return "<h2>" + "Kobe's Sixth Game Winning Buzzer Beater" + "<h2>" +
            "<p>" + "Date: December 3, 2009" + "</p>" + "<p>" +
            "Bryant shoots over Dwyane Wade and banks in the game winner"
            + "</p>" + "<p>" + "Heat: 107 Lakers: 108";
        }
        else if (counter === 6) {
            return "<h2>" + "Kobe's Seventh Game Winning Buzzer Beater" + "<h2>" +
            "<p>" + "Date: December 15, 2009" + "</p>" + "<p>" +
            "Bryant hits a turnaround jumper over Charlie Bell for the win"
            + "</p>" + "<p>" + "Bucks: 106 Lakers: 107";
        }
        else if (counter === 7) {
            return "<h2>" + "Kobe's Eighth and Final Game Winning Buzzer Beater" + "<h2>" +
            "<p>" + "Date: December 31, 2009" + "</p>" + "<p>" +
            "Bryant drills a jumper to complete a Laker comeback victory"
            + "</p>" + "<p>" + "Kings: 108 Lakers: 109";
        }
    }

    drawBubbles (counter) {
        d3.select("#bubbles-svg").remove();

        let bubbles = d3.select("#bubbles")
            .append("svg")
            .attr("id", "bubbles-svg");

        let id_bubbles = [1,2,3,4,5,6,7,8];

        bubbles.selectAll("circle")
            .data(id_bubbles)
            .join("circle")
            .attr("id", (d,i) => "circle" + i)
            .attr("cx", d => d*25)
            .attr("cy", 15)
            .attr("r", 7);

        bubbles
            .classed("bubble-style", true);

        if (counter === 0) {
            let bubbles = d3.select("#bubbles-svg");

            bubbles.selectAll("circle")
                .classed("bubble-style", true);

            let circle = d3.select("#circle0");

            circle.classed("bubble-fill", true);
        }
        else if (counter === 1) {
            let bubbles = d3.select("#bubbles-svg");

            bubbles.selectAll("circle")
                .classed("bubble-style", true);

            let circle = d3.select("#circle1");

            circle.classed("bubble-fill", true);
        }
        else if (counter === 2) {
            let bubbles = d3.select("#bubbles-svg");

            bubbles.selectAll("circle")
                .classed("bubble-style", true);

            let circle = d3.select("#circle2");

            circle.classed("bubble-fill", true);
        }
        else if (counter === 3) {
            let bubbles = d3.select("#bubbles-svg");

            bubbles.selectAll("circle")
                .classed("bubble-style", true);

            let circle = d3.select("#circle3");

            circle.classed("bubble-fill", true);
        }
        else if (counter === 4) {
            let bubbles = d3.select("#bubbles-svg");

            bubbles.selectAll("circle")
                .classed("bubble-style", true);

            let circle = d3.select("#circle4");

            circle.classed("bubble-fill", true);
        }
        else if (counter === 5) {
            let bubbles = d3.select("#bubbles-svg");

            bubbles.selectAll("circle")
                .classed("bubble-style", true);

            let circle = d3.select("#circle5");

            circle.classed("bubble-fill", true);
        }
        else if (counter === 6) {
            let bubbles = d3.select("#bubbles-svg");

            bubbles.selectAll("circle")
                .classed("bubble-style", true);

            let circle = d3.select("#circle6");

            circle.classed("bubble-fill", true);
        }
        else if (counter === 7) {
            let bubbles = d3.select("#bubbles-svg");

            bubbles.selectAll("circle")
                .classed("bubble-style", true);

            let circle = d3.select("#circle7");

            circle.classed("bubble-fill", true);
        }
    }
}
