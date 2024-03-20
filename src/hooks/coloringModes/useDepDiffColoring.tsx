import { useMemo } from 'react';
import cytoscape from 'cytoscape';
import { getIncomingOutgoingRatio } from '../../cytoscape/operations';
import { DEFAULT_NODE_COLOR_RATIO, getRatioColor, IRatioColoring } from '../../helpers/color';

export const dependencyDifferenceColors = DEFAULT_NODE_COLOR_RATIO;

export default function useOutgoingDepsColoring() {
  const log10 = (val: number) => Math.log10(val + 1);

  const coloring: IRatioColoring = useMemo(() => ({
    name: 'Dependency ratio (log scale)',
    type: 'ratio',
    colors: dependencyDifferenceColors,
    rangeFunction: (nodes: cytoscape.NodeCollection) => {
      let min = Number.POSITIVE_INFINITY;
      let max = Number.NEGATIVE_INFINITY;

      nodes.forEach((node) => {
        const value = getIncomingOutgoingRatio(node);
        min = Math.min(min, value);
        max = Math.max(max, value);
      });

      return [min, max];
    },
    colorFunction: (node: cytoscape.NodeSingular, range2: [number, number]) => {
      const [min, max] = range2;
      const logMin = log10(min);
      const logMax = log10(max);
      const incomingDeps = log10(getIncomingOutgoingRatio(node));
      const [firstColor, secondColor, ...restColors] = dependencyDifferenceColors;
      return getRatioColor(
        (incomingDeps - logMin) / (logMax - logMin),
        firstColor,
        secondColor,
        ...restColors,
      );
    },
  }), []);

  return { coloring };
}