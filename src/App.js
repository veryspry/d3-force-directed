import React from "react";
import * as d3 from 'd3';

import graph from './data/graph'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  componentDidMount() {
    const width = 700;
    const height = 700;
    const nodeRadius = 5;

    const nodes = graph.nodes.map(node => ({ ...node }))
    const links = graph.links.map(link => ({ ...link }))

    
    // Get a reference to the div we will attach to
    const base = d3.select(this.canvas.current);
    // Append a canvas element to the div and store a reference to that element
    const canvas = base.append('canvas')
    .attr('width', 700)
    .attr('height', 700)
    // Set the context of the canvas and store a reference to it
    const context = canvas.node().getContext('2d')
    
    // // Make some custom elements to mount my biz to
    // const detachedContainer = document.createElement('custom');
    // // Create a d3 selection for the detached container.
    // // This will not get added to the DOM
    // const graphContainer = d3.select(detachedContainer);
    
    console.log(canvas.node())

    
      const simulation = d3.forceSimulation()
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink().id(d => d.id));
      let transform = d3.zoomIdentity

    
    d3.select(canvas.node())
      // .call(d3.drag()
      //   .container(canvas.node())
      //   .subject()
      // )
      .call(d3.zoom()
      .scaleExtent([1 / 10, 8])
      )

    simulation.nodes(nodes)
      .on('tick', simulationUpdate)
    simulation.force('link')
      .links(links)
    
    function simulationUpdate(){
      context.save();
      context.clearRect(0, 0, width, height);
      context.translate(transform.x, transform.y);
      context.scale(transform.k, transform.k);
      // Draw edges
      links.forEach(function(d) {
        // console.log('link', d)
        context.beginPath();
        context.moveTo(d.source.x, d.source.y);
        context.lineTo(d.target.x, d.target.y);
        context.lineWidth = Math.sqrt(d.value);
        context.strokeStyle = '#red';
        context.stroke();
      });
      // Draw nodes
      nodes.forEach(function(d, i) {
        // console.log('node', d)
        context.beginPath();
        // Node fill
        context.moveTo(d.x + nodeRadius, d.y);
        context.arc(d.x, d.y, nodeRadius, 0, 2 * Math.PI);
        context.fillStyle = color(d);
        context.fill();
        // Node outline
        context.strokeStyle = 'orange'
        context.lineWidth = '1.5'
        context.stroke();
      });
      context.restore();
    }

    function color(d) {
      const scale = d3.scaleOrdinal(d3.schemeCategory10)
      return d => scale(d.group);
    }

  }

  // ________ A working example is below _________________________________________________________
  workingGraphCreatorMethod = () => {

  // Get a reference to the div we will attach to
  const base = d3.select(this.canvas.current);
  // Append a canvas element to the div and store a reference to that element
  const canvas = base.append('canvas')
  .attr('width', 700)
  .attr('height', 700)
  // Set the context of the canvas and store a reference to it
  const context = canvas.node().getContext('2d')
  
  // Make some custom elements to mount my biz to
  const detachedContainer = document.createElement('custom');
  // Create a d3 selection for the detached container.
  // This will not get added to the DOM
  const graphContainer = d3.select(detachedContainer);
  
  console.log(canvas)


  // Get the data in the right format    
  const graphLayout = d3.forceSimulation(graph.nodes)
    .force("charge", d3.forceManyBody().strength(-3000))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX(width / 2).strength(1))
    .force("y", d3.forceY(height / 2).strength(1))
    .force("link", d3.forceLink(graph.links)
                        .id(node => node.id)
                        .distance(100)
                        .strength(1)
    )
    .on('tick', tick)

      const drawCustom = data => {

        // const scale = d3.scaleLinear()
        //   .range([10, 390])
        //   .domain(d3.extent(data))
        // console.log(scale)

        const dataBinding = graphContainer
          .selectAll('custom.rect')
          .data(data, d => {
            return d
          })
          console.log('dataBinding', dataBinding)
          const somethingNew = dataBinding.enter()
            .append('custom')
            .classed('rect', true)
            .attr('x', 400)
            .attr('y', 100)
            .attr('size', 10)
            .attr('fillStyle', 'red')
            .merge(dataBinding)
          
          console.log(somethingNew.nodes())
          
          dataBinding.exit()
            .attr('size', 5)
            .attr('fillStyle', 'lightgrey')

            drawCanvas(somethingNew);
      }

      const drawCanvas = elements => {
        context.fillStyle = "black"
        // context.rect(0, 0, 20, 20)
        // context.fill()

        // const elements = graphContainer.selectAll('custom.rect');

        context.beginPath()

        elements.each(function(d) {
          const node = d3.select(this);
          context.fillStyle = node.attr('fillStyle') || 'red'
          // context.rect(node.attr('x'), node.attr('y'), node.attr('size'), node.attr('size'))

          context.moveTo(node.attr('x'), node.attr('y'))
          context.arc(node.attr('x'), node.attr('y'), 4.5, 0, 2 * Math.PI)
        })
        
        context.fill()
        context.closePath()
      }

      drawCustom(graphLayout.nodes())

      console.log(graphLayout, graphLayout.nodes())
      

    }
    // ______________ End working example ___________________________________________________

  svgIshWorkingMethod = () => {
    // const dataBind = data => {
      //   // stupid values for now
      //   const groupSpacing = 4;
      //   const cellSpacing = 2;
      //   const cellSize = Math.floor((width - 11 * groupSpacing) / 100) - cellSpacing;

      //   const colorScale = d3.scaleSequential(d3.interpolateSpectral)
      //     .domain(d3.extent(data, d => d ));

      //   const graphData = graphContainer.selectAll('custom.rect').data(data);
        
      //   const enterSelection = graphData.enter()
      //     .append('custom')
      //     // .attr('class', 'rect') 
      //     .attr("x", function(d, i) {  
      //       const x0 = Math.floor(i / 100) % 10, x1 = Math.floor(i % 10);         
      //       return groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 10); 
      //     })  
      //     .attr("y", function(d, i) {  
      //       const y0 = Math.floor(i / 1000), y1 = Math.floor(i % 100 / 10);   
      //       return groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 10); 
      //     })  
      //     .attr('width', 0)  
      //     .attr('height', 0);

      //   const mergedData = graphData.merge(enterSelection)
      //     .transition()
      //     .attr('width', cellSize)  
      //     .attr('height', cellSize)  
      //     .attr('fillStyle', d => colorScale(d));

        
      //   const exitSelection = graphData.exit()
      //     .attr('width', 0) // may not need this one
      //     .attr('height', 0) // may not need this one
      //     .remove();
        
      //   console.log(graphData.nodes(), mergedData.nodes(), enterSelection.nodes(), exitSelection.nodes())
      // }
      

      // const draw = () => {

      //   context.clearRect(0, 0, width, height);

      //   const graphElements = graphContainer.selectAll('custom').nodes();
      //   console.log('graphElements', graphElements)

      //   context.fillStyle = 'darkorange';
      //   context.beginPath();

      //   graphElements.forEach(function(d, i) {
      //     // const node = d3.select(this);
      //     const node = d3.select(d)
      //     // console.log('node',i, node)

      //     // This is each individual element in the loop.     
      //     // var node = d3.select(this).node();  
      //     // Here you retrieve the colour from the individual in-memory node and set the fillStyle for the canvas paint
      //     context.fillStyle = node.attr('fillStyle', 'darkorange');
      //     // Here you retrieve the position of the node and apply it to the fillRect context function which will fill and paint the square.
      //     context.fillRect(
      //       node.attr('x'), 
      //       node.attr('y'), 
      //       node.attr('width'), 
      //       node.attr('height')
      //     );

      //   })

      // }

      // dataBind(graphLayout.nodes());
      // draw();

      // context.fillStyle = 'darkorange';
      // context.beginPath();
      // graphNodes.forEach(node => {
      //   context.moveTo(node.x, node.y);
      //   context.arc(node.x, node.y, 4.5, 0, 2 * Math.PI);
      // });
      // context.fill();

    // context.clearRect(0, 0, width, height)
    // // Apparently this will draw links
    // context.strokeStyle = "#ccc";
    // context.beginPath();
    // graph.links.forEach(link => {
    //   // console.log('what is this weirdo d', d);
    //   context.moveTo(link.source.x, link.source.y);
    //   context.lineTo(link.target.x, link.target.y)
    // });
    // context.stroke();

    // // Apparently this will draw nodes
    // context.fillStyle = 'darkorange';
    // context.beginPath();
    // graph.nodes.forEach(node => {
    //   // console.log('wtf is d', d);
    //   context.moveTo(node.x, node.y);
    //   context.arc(node.x, node.y, 4.5, 0, 2 * Math.PI);
    // });
    // context.fill();

    const tick = () => console.log('tick event')
  }


  render() {

    return (
      <GraphDemo
        canvasRef={this.canvas}
      />
    )
  }
}

const GraphDemo = props => {
  const { canvasRef, graphContainer } = props;


  return (
    <React.Fragment>
      <h1>Welcome to React Parcel Micro App!</h1>
      <p>Hard to get more minimal than this React app. yeet</p>
      <div ref={canvasRef} />
      {/* <canvas ref={canvasRef} width="700" height="700" /> */}
    </React.Fragment>
  );
}

export default App;
