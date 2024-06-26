import cytoscape from 'cytoscape';
import { useMemo } from 'react';
import { DependencyProfileCategory } from '../../helpers/enums';
import useColorShading from '../useColorShading';
import { DEFAULT_NODE_COLOR } from '../../helpers/color';
import { ICategoryMetric } from '../../helpers/metrics';

/**
 * Given a node, get its dependency profile categorization. This function cannot be generalized for
 * any layered-like architecture, because the Dependency Profile is based on the Application-layer
 * as its upper layer. We cannot use the (sub)layer-layers, because by architecture standards these
 * (sub)layers are only categorizations of module types, but have no true architectural value.
 *
 * @param node
 * @returns DependencyProfileCategory
 * @returns null if node not on the "Module" layer
 */
export function getDependencyProfileCategory(
  node: cytoscape.NodeSingular,
): DependencyProfileCategory | null {
  return node.data('properties.dependencyProfileCategory') ?? null;
}

const dependencyProfileColor = {
  [DependencyProfileCategory.HIDDEN]: '#ff0000',
  [DependencyProfileCategory.INBOUND]: '#00ff00',
  [DependencyProfileCategory.OUTBOUND]: '#0099ff',
  [DependencyProfileCategory.TRANSIT]: '#ffff00',
};

/**
 * Dependency profile coloring object required for the coloring function of the graph
 */
export default function useDependencyProfileMetrics() {
  const { shadeColorByDepth } = useColorShading();

  const coloring: ICategoryMetric = useMemo(() => ({
    name: 'Dependency profile',
    context: 'graph',
    description: 'The dependency profile is a categorization of modules into groups. Hidden modules have no incoming or outgoing dependencies from/to other applications. Inbound modules only have incoming dependencies from other applications. Outbound modules only have outgoing dependencies to other applications. Transit modules have both. NOTE: this metric is only visible on the module layer.',
    nodeDetailsTitle: 'Dependency profile',
    nodeDetailsValue: getDependencyProfileCategory,
    type: 'category',
    colorFunction(node: cytoscape.NodeSingular) {
      const dependencyProfile = getDependencyProfileCategory(node);
      if (dependencyProfile == null) return shadeColorByDepth(node, DEFAULT_NODE_COLOR);
      return dependencyProfileColor[dependencyProfile];
    },
    legend: new Map([
      [dependencyProfileColor[DependencyProfileCategory.HIDDEN], 'Hidden module'],
      [dependencyProfileColor[DependencyProfileCategory.INBOUND], 'Inbound module'],
      [dependencyProfileColor[DependencyProfileCategory.OUTBOUND], 'Outbound module'],
      [dependencyProfileColor[DependencyProfileCategory.TRANSIT], 'Transit module'],
    ]),
  }), [shadeColorByDepth]);

  return { coloring };
}
