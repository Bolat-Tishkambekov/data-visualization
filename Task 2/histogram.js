const tLowAccessor = d => d.temperatureLow;
const tHighAccessor = d => d.temperatureHigh;
const tMinAccessor = d => d.temperatureMin;
const tMaxAccessor = (d) => d.temperatureHigh;

var wrapper;

async function drawBar(xAccessorName) {
    if (typeof wrapper !== 'undefined') wrapper.remove();
    var xAccessor;
    if (xAccessorName == "LOW") {
        xAccessor = tLowAccessor
    } else if (xAccessorName == "HIGH") {
        xAccessor = tHighAccessor
    } else if (xAccessorName == "MIN") {
        xAccessor = tMinAccessor
    } else if (xAccessorName == "MAX") {
        xAccessor = tMaxAccessor
    }

    const dataset = await d3.json("./my_weather_data.json")
    //Accessor
    const yAccessor = d => d.length;

    const width = 800
    let dimensions = {
        width: width,
        height: width * 0.6,
        margin: {
            top: 20,
            right: 30,
            bottom: 20,
            left: 30,
        },
    }
    dimensions.boundedWidth = dimensions.width
        - dimensions.margin.left
        - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
        - dimensions.margin.top
        - dimensions.margin.bottom

    // 3. Draw canvas

    wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);

    const bounds = wrapper.append("g")
        .style("translate", `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);

    const xScaler = d3.scaleLinear()
        .domain(d3.extent(dataset, xAccessor))
        .range([0, dimensions.boundedWidth])
        .nice()

    const binsGen = d3.bin()
        .domain(xScaler.domain())
        .value(xAccessor)
        .thresholds(12);

    const bins = binsGen(dataset);
    console.log(bins);

    const yScaler = d3.scaleLinear()
        .domain([0, d3.max(bins, yAccessor)])
        .range([dimensions.boundedHeight, 0])
        .nice()

    const binGroup = bounds.append("g");
    const binGroups = binGroup.selectAll("g")
        .data(bins)
        .enter()
        .append("g");


    const barPadding = 10
    const barRect = binGroups.append("rect")
        .attr("x", d => xScaler(d.x0) + barPadding / 2)
        .attr("y", d => yScaler(yAccessor(d)))
        .attr("width", d => d3.max([0, xScaler(d.x1) - xScaler(d.x0) - barPadding]))
        .attr("height", d => dimensions.boundedHeight - yScaler(yAccessor(d)))
        .attr("fill", "#AAAAEE");

    const mean = d3.max(bins, yAccessor) / 2;
    console.log("MEAN", mean)
    console.log(mean);
    const meanLine = bounds.append("line")
        .attr("x1", 0)
        .attr("x2", dimensions.boundedWidth)
        .attr("y1", yScaler(mean))
        .attr("y2", yScaler(mean))
        .attr("stroke", "black")
        .attr("stroke-dasharray", "2px 4px");

    const meanLabel = bounds.append("text")
        .attr("x", 40)
        .attr("y", yScaler(mean) - 10)
        .text("Mean " + mean.toString())
        .attr("fill", "maroon")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle");

    const xAxisGen = d3.axisBottom(xScaler)
        .ticks(0);
    const xAxis = bounds.append("g")
        .call(xAxisGen)
        .style("transform", `translateY(${dimensions.boundedHeight}px)`)

    const xAxisLabel = bounds.append("text")
        .attr("x", dimensions.boundedWidth)
        .attr("y", yScaler(0) + 35)
        .text("Temperature")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle");

    const yAxisGen = d3.axisLeft(yScaler)
        .ticks(0);
    const yAxis = bounds.append("g")
        .call(yAxisGen)

    const yAxisLabel = bounds.append("text")
        .attr("x", 25)
        .attr("y", 30)
        .text("Count")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle");


    const barText = binGroups.filter(yAccessor)
        .append("text")
        .attr("x", d => xScaler(d.x0) + (xScaler(d.x1) - xScaler(d.x0)) / 2)
        .attr("y", d => yScaler(-3))
        .text(yAccessor)
        .attr("font-size", "12px")
        .attr("text-anchor", "middle");

    return wrapper
}

drawBar("LOW")