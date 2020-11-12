class Story {
    constructor(storyOn) {

        this.storyOn = storyOn;

        this.counter = 0;

        this.drawStory();

    }

    drawStory () {

        if (this.storyOn === true) {
            let buttonBack = document.createElement("button");
            buttonBack.innerHTML = "Back";
            buttonBack.id = "back-button";
        
        let body = document.getElementsByTagName("body")[0];
            body.appendChild(buttonBack);

        buttonBack.addEventListener ("click", function() {
            alert("Backwards");
        });

        let buttonNext = document.createElement("button");
            buttonNext.innerHTML = "Next";
            buttonNext.id = "next-button";

        body.appendChild(buttonNext);

        buttonNext.addEventListener ("click", function() {
            alert("Forwards");
        });

        let story_div = d3.select('#overlay')
                          .style("top", 250 + "px")
                          .style("z-index", 1);

            story_div
                .append("iframe")
                .attr("width", that.svgWidth/2.25)
                .attr("height", that.vizHeight/2)
                .attr("src", "https://www.youtube.com/embed/3cGTf57VV7I");
        

        }
        
    }
}
