import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import 'vis-network/styles/vis-network.css';

const GraphVisualizer = ({ graphData }) => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !graphData) return;

    // Define color mappings for different node groups
    const options = {
      nodes: {
        shape: 'dot',
        size: 20,
        font: {
          size: 14,
          color: '#333'
        },
        borderWidth: 2,
      },
      edges: {
        width: 2,
        color: { color: '#999' },
        font: { size: 10, align: 'middle' },
        arrows: {
          to: { enabled: true, scaleFactor: 0.5 }
        }
      },
      groups: {
        customer: {
          color: { background: '#4F46E5', border: '#3730A3' },
          font: { color: 'white' }
        },
        card: {
          color: { background: '#10B981', border: '#047857' }
        },
        transaction: {
          color: { background: '#F59E0B', border: '#B45309' }
        },
        device: {
          color: { background: '#EC4899', border: '#BE185D' }
        }
      },
      physics: {
        forceAtlas2Based: {
          gravitationalConstant: -26,
          centralGravity: 0.005,
          springLength: 230,
          springConstant: 0.18
        },
        maxVelocity: 146,
        solver: 'forceAtlas2Based',
        timestep: 0.35,
        stabilization: { iterations: 150 }
      }
    };

    networkRef.current = new Network(containerRef.current, graphData, options);

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [graphData]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full"
    />
  );
};

export default GraphVisualizer;
