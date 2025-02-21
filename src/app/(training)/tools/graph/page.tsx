"use client";

import { compact, uniq } from "lodash-es";
import { useEffect, useRef, useState } from "react";

import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { type Link, type Node, setupSimulation } from "./simulation";

const DEFAULT_NODE_SIZE = 15;
const DEFAULT_NODE_DISTANCE = 100;

const DEFAULT_GRAPH = `\
0 1
0 2
0 3
1 2
1 3`;

export default function Page() {
  const { _ } = useLingui();

  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([svg]) => setSize(svg.contentRect));
    observer.observe(ref.current);
    return () => void observer.disconnect();
  }, []);

  const [rawEdges, setRawEdges] = useState("");
  const [nodeSize, setNodeSize] = useState(DEFAULT_NODE_SIZE);
  const [nodeDistance, setNodeDistance] = useState(DEFAULT_NODE_DISTANCE);

  useEffect(() => {
    const savedEdges = localStorage.getItem("graph-editor");
    setRawEdges(savedEdges || DEFAULT_GRAPH);
  }, []);

  useEffect(() => {
    const beforeUnload = () => localStorage.setItem("graph-editor", rawEdges);

    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [rawEdges]);

  const nodesRef = useRef<SVGGElement>(null);
  const edgesRef = useRef<SVGGElement>(null);

  const prevNodes = useRef<Node[]>([]);
  useEffect(() => {
    const nodes = compact(
      uniq(rawEdges.split("\n").flatMap((line) => line.split(" ").slice(0, 2))),
    ).map((label): Node => ({ label }));

    const removedNodes = prevNodes.current.filter(
      (node) => !nodes.some((n) => n.label === node.label),
    );

    for (const node of nodes) {
      const prevNode = prevNodes.current.find((n) => n.label === node.label) ?? removedNodes.pop();
      if (prevNode) {
        node.x = prevNode.x;
        node.y = prevNode.y;
        node.vx = prevNode.vx;
        node.vy = prevNode.vy;
      }
    }
    prevNodes.current = nodes;

    const edges: Link[] = compact(
      rawEdges.split("\n").map((line): Link | undefined => {
        const [source, target, label] = line.split(" ");
        if (!target || source === target) return;
        return { source, target, label };
      }),
    );

    const simulation = setupSimulation(
      nodes,
      edges,
      nodesRef.current!,
      edgesRef.current!,
      nodeSize,
      nodeDistance,
    );
    return () => void simulation.stop();
  }, [rawEdges, nodeSize, nodeDistance]);

  return (
    <>
      <h1 className="text-center text-4xl font-bold m-4 mt-0">
        <Trans>Editor di grafi</Trans>
      </h1>
      <div className="flex max-md:flex-col-reverse grow gap-4">
        <div className="flex flex-col basis-[min(300px,45%)]">
          <label className="form-control flex flex-col grow w-full">
            <div className="label text-base-content/80">
              <Trans>Archi del grafo</Trans>
            </div>
            <textarea
              className="textarea textarea-bordered resize-none grow w-full min-h-48"
              value={rawEdges}
              onChange={(e) => setRawEdges(e.currentTarget.value)}
            />
          </label>
          <label className="form-control w-full">
            <div className="label text-base-content/80">
              <Trans>Dimensione nodi</Trans>
            </div>
            <input
              type="number"
              className="input input-bordered w-full"
              value={nodeSize}
              onChange={(e) => setNodeSize(e.target.valueAsNumber)}
            />
          </label>
          <label className="form-control w-full">
            <div className="label text-base-content/80">
              <Trans>Lunghezza archi</Trans>
            </div>
            <input
              type="number"
              step={5}
              className="input input-bordered"
              value={nodeDistance}
              onChange={(e) => setNodeDistance(e.target.valueAsNumber)}
            />
          </label>
        </div>
        <div className="form-control grow min-h-96">
          <div className="label text-base-content/80">
            <Trans>Grafo</Trans>
          </div>
          <div
            ref={ref}
            className="border border-base-content/20 rounded-lg grow relative overflow-hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox={`${-size.width / 2} ${-size.height / 2} ${size.width} ${size.height}`}
              width={size.width}
              height={size.height}
              className="absolute inset-0">
              <title>{_(msg`Grafo`)}</title>
              <g ref={edgesRef} />
              <g ref={nodesRef} />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
