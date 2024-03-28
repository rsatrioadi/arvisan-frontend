import { useMemo } from 'react';
import cytoscape from 'cytoscape';
import { DEFAULT_NODE_COLOR_RATIO, getRatioColor } from '../../helpers/color';
import { getInboundEncapsulation, getOutboundEncapsulation, IRatioMetric } from '../../helpers/metrics';
import { NodeData } from '../../api';

export const encapsulationColors = DEFAULT_NODE_COLOR_RATIO;

export default function useEncapsulationColoring(): { colorings: IRatioMetric[] } {
  const colors = encapsulationColors;
  const rangeFunction = () => [0, 1] as [number, number];

  const getDependencyProfile = (node: cytoscape.NodeSingular) => node.data('properties.dependencyProfile') as NodeData['properties']['dependencyProfile'];

  const colorings: IRatioMetric[] = useMemo(() => ([{
    name: 'Inbound encapsulation',
    nodeDetailsTitle: 'Inbound encapsulation',
    nodeDetailsValue(node: cytoscape.NodeSingular) {
      const profile = getDependencyProfile(node);
      return getInboundEncapsulation(profile);
    },
    type: 'ratio',
    colors,
    rangeFunction,
    colorFunction(node: cytoscape.NodeSingular) {
      const profile = getDependencyProfile(node);
      const encapsulation = getInboundEncapsulation(profile);

      const [firstColor, secondColor, ...restColors] = colors;
      return getRatioColor(encapsulation, firstColor, secondColor, ...restColors);
    },
    sizeFunction(node: cytoscape.NodeSingular) {
      const profile = getDependencyProfile(node);
      const encapsulation = getInboundEncapsulation(profile);

      return encapsulation * 200;
    },
  }, {
    name: 'Outbound encapsulation',
    nodeDetailsTitle: 'Outbound encapsulation',
    nodeDetailsValue(node: cytoscape.NodeSingular) {
      const profile = getDependencyProfile(node);
      return getOutboundEncapsulation(profile);
    },
    type: 'ratio',
    colors,
    rangeFunction,
    colorFunction(node: cytoscape.NodeSingular) {
      const profile = getDependencyProfile(node);
      const encapsulation = getOutboundEncapsulation(profile);

      const [firstColor, secondColor, ...restColors] = colors;
      return getRatioColor(encapsulation, firstColor, secondColor, ...restColors);
    },
    sizeFunction(node: cytoscape.NodeSingular) {
      const profile = getDependencyProfile(node);
      const encapsulation = getInboundEncapsulation(profile);

      return encapsulation * 200;
    },
  }]), [colors]);

  return { colorings };
}
