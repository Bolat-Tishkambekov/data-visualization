async function buildPlot() {
    const data = await d3.json("my_weather_data.json");
    //console.table(data);
    const dateParser = d3.timeParse("%Y-%m-%d");
    const tMinAccessor = (d) => d.temperatureMin;
    const tMaxAccessor = (d) => d.temperatureHigh;
    const xAccessor = (d) => dateParser(d.date);
    // Функции для инкапсуляции доступа к колонкам набора данных

    var dimension = {
        width: window.innerWidth * 0.9,
        height: 400,
        margin: {
            top: 20,
            left: 20,
            bottom: 20,
            right: 20
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg")
    svg.attr("height", dimension.height);
    svg.attr("width", dimension.width);
    const bounded = svg.append("g");
    bounded.style("transform", `translate(${dimension.margin.left}px, ${dimension.margin.top}px)`);

    const yScaler = d3.scaleLinear()
        .domain(d3.extent(data, tMaxAccessor))
        .range([dimension.boundedHeight, 0]);

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data, xAccessor))
        .range([0, dimension.boundedWidth]);

    var lineGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler(tMinAccessor(d)));

    var tMaxLineGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler(tMaxAccessor(d)));

    const xAxis = d3.axisBottom(xScaler)
    const yAxis = d3.axisLeft(yScaler)

    bounded.append("path")
        .attr("d", lineGenerator(data))
        .attr("fill", "none")
        .attr("stroke", "blue")

    bounded.append("path")
        .attr("d", tMaxLineGenerator(data))
        .attr("fill", "none")
        .attr("stroke", "green")

    bounded.append("g")
        .attr("transform", "translate(0, " + dimension.boundedHeight + ")")
        .call(xAxis)

    bounded.append("g")
        .call(yAxis)
}

buildPlot();