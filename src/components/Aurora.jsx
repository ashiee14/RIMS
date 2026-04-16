import React from "react";

const Aurora = ({
  colorStops = ["#4618ff", "#8769fe", "#000000", "#2200a8"],
  amplitude = 1,
  blend = 0.5,
}) => {
  return (
    <div className="aurora-container">
      <div
        className="aurora-layer aurora-layer-1"
        style={{
          background: `radial-gradient(circle at 20% 30%, ${colorStops[0]}, transparent 60%)`,
          opacity: blend,
          filter: `blur(${80 * amplitude}px)`,
        }}
      />
      <div
        className="aurora-layer aurora-layer-2"
        style={{
          background: `radial-gradient(circle at 80% 20%, ${colorStops[1]}, transparent 60%)`,
          opacity: blend,
          filter: `blur(${90 * amplitude}px)`,
        }}
      />
      <div
        className="aurora-layer aurora-layer-3"
        style={{
          background: `radial-gradient(circle at 50% 80%, ${colorStops[2]}, transparent 60%)`,
          opacity: blend,
          filter: `blur(${100 * amplitude}px)`,
        }}
      />
    </div>
  );
};

export default Aurora;