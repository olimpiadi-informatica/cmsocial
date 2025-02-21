import { type D3DragEvent, drag } from "d3-drag";
import {
  type SimulationLinkDatum,
  type SimulationNodeDatum,
  forceCollide,
  forceLink,
  forceSimulation,
  forceX,
  forceY,
} from "d3-force";
import { select } from "d3-selection";

export type Node = { label: string } & SimulationNodeDatum;
export type Link = { label?: string } & SimulationLinkDatum<Node>;

export function setupSimulation(
  nodes: Node[],
  edges: Link[],
  nodesEl: SVGGElement,
  edgesEl: SVGGElement,
  nodeSize: number,
  nodeDistance: number,
) {
  const simulation = forceSimulation(nodes)
    .force(
      "link",
      forceLink<Node, Link>(edges)
        .id((d) => d.label)
        .distance(nodeDistance),
    )
    .force("collide", forceCollide(nodeDistance / 2))
    .force("x", forceX())
    .force("y", forceY());

  const edgeElements = select(edgesEl)
    .selectAll<SVGLineElement, Link>("line")
    .data(edges)
    .join("line")
    .attr("stroke-width", 1)
    .classed("stroke-base-content", true);

  const edgeLabelElements = select(edgesEl)
    .selectAll("text")
    .data(edges)
    .join("text")
    .text((d) => d.label ?? null)
    .attr("dy", ".34em")
    .attr("text-anchor", "middle")
    .classed("stroke-base-100 fill-base-content text-sm select-none", true)
    .style("paint-order", "stroke")
    .style("text-shadow", "0 0 4px oklch(var(--b1))");

  const nodeElements = select(nodesEl)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", nodeSize)
    .classed("stroke-base-content fill-base-100 cursor-pointer", true);

  const nodeLabelElements = select(nodesEl)
    .selectAll("text")
    .data(nodes)
    .join("text")
    .text((d) => d.label)
    .attr("dy", ".34em")
    .attr("text-anchor", "middle")
    .classed("fill-base-content text-sm cursor-pointer select-none", true);

  simulation.on("tick", () => {
    edgeElements
      .attr("x1", (d) => (d.source as Node).x!)
      .attr("y1", (d) => (d.source as Node).y!)
      .attr("x2", (d) => (d.target as Node).x!)
      .attr("y2", (d) => (d.target as Node).y!);
    edgeLabelElements
      .attr("x", (d) => ((d.source as Node).x! + (d.target as Node).x!) / 2)
      .attr("y", (d) => ((d.source as Node).y! + (d.target as Node).y!) / 2);
    nodeElements.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);
    nodeLabelElements.attr("x", (d) => d.x!).attr("y", (d) => d.y!);
  });

  const dragStart = (ev: D3DragEvent<SVGCircleElement, any, Node>) => {
    if (!ev.active) simulation.alphaTarget(0.3).restart();
    ev.subject.fx = ev.subject.x;
    ev.subject.fy = ev.subject.y;
  };

  const dragged = (ev: D3DragEvent<SVGCircleElement, any, Node>) => {
    ev.subject.fx = ev.x;
    ev.subject.fy = ev.y;
  };

  const dragEnd = (ev: D3DragEvent<SVGCircleElement, any, Node>) => {
    if (!ev.active) simulation.alphaTarget(0);
    ev.subject.fx = null;
    ev.subject.fy = null;
  };

  nodeElements.call(
    drag<any, Node>().on("start", dragStart).on("drag", dragged).on("end", dragEnd),
  );
  nodeLabelElements.call(
    drag<any, Node>().on("start", dragStart).on("drag", dragged).on("end", dragEnd),
  );

  return simulation;
}
