import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';
export default function ClusterGraph({data}) {
  const svgRef=useRef(null);
  useEffect(()=>{
    if (!data||!data.nodes||data.nodes.length===0) return;
    const svg=d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width=800;
    const height=500;
    svg.attr('viewBox', `0 0 ${width} ${height}`);
    const simulation=d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id(d=>d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width/2, height/2))
      .force('collision', d3.forceCollide().radius(30));
    const link=svg.append('g')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', d=>d.type==='address'?'#6366f1':'#ef4444')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6)
      .attr('stroke-dasharray', d=>d.type==='device'?'5,5':'none');
    const node=svg.append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .call(d3.drag()
        .on('start', (event, d)=>{
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx=d.x;
          d.fy=d.y;
        })
        .on('drag', (event, d)=>{
          d.fx=event.x;
          d.fy=event.y;
        })
        .on('end', (event, d)=>{
          if (!event.active) simulation.alphaTarget(0);
          d.fx=null;
          d.fy=null;
        })
      );
    node.append('circle')
      .attr('r', 16)
      .attr('fill', '#6366f1')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('opacity', 0.9);
    node.append('text')
      .text(d=>d.name?.split(' ').pop()||'?')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#fff')
      .attr('font-size', '10px')
      .attr('font-weight', '600');
    node.append('title')
      .text(d=>`${d.name}\n${d.email}`);
    simulation.on('tick', ()=>{
      link
        .attr('x1', d=>d.source.x)
        .attr('y1', d=>d.source.y)
        .attr('x2', d=>d.target.x)
        .attr('y2', d=>d.target.y);
      node.attr('transform', d=>`translate(${d.x},${d.y})`);
    });
    const legend=svg.append('g').attr('transform', `translate(20, ${height-60})`);
    legend.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 30).attr('y2', 0).attr('stroke', '#6366f1').attr('stroke-width', 2);
    legend.append('text').attr('x', 35).attr('y', 4).text('Shared Address').attr('fill', '#aaa').attr('font-size', '12px');
    legend.append('line').attr('x1', 0).attr('y1', 20).attr('x2', 30).attr('y2', 20).attr('stroke', '#ef4444').attr('stroke-width', 2).attr('stroke-dasharray', '5,5');
    legend.append('text').attr('x', 35).attr('y', 24).text('Shared Device').attr('fill', '#aaa').attr('font-size', '12px');
    return ()=>simulation.stop();
  }, [data]);
  if (!data||!data.nodes||data.nodes.length===0) {
    return <div className="chart-empty">No cluster data available</div>;
  }
  return (
    <div className="cluster-graph-container">
      <svg ref={svgRef} className="cluster-svg"></svg>
    </div>
  );
}
