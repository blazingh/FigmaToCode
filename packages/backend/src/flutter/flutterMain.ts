import { className, generateWidgetCode } from "../common/numToAutoFixed";
import { retrieveTopFill } from "../common/retrieveFill";
import { FlutterDefaultBuilder } from "./flutterDefaultBuilder";
import { FlutterTextBuilder } from "./flutterTextBuilder";
import { indentString } from "../common/indentString";
import { PluginSettings } from "../code";
import {
  getCrossAxisAlignment,
  getMainAxisAlignment,
} from "./builderImpl/flutterAutoLayout";

let localSettings: PluginSettings;

const getFullAppTemplate = (name: string, injectCode: string): string =>
  `import 'package:flutter/material.dart';

void main() {
  runApp(const FigmaToCodeApp());
}

// Generated by: https://www.figma.com/community/plugin/842128343887142055/
class FigmaToCodeApp extends StatelessWidget {
  const FigmaToCodeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color.fromARGB(255, 18, 32, 47),
      ),
      home: Scaffold(
        body: ListView(children: [
          ${name}(),
        ]),
      ),
    );
  }
}

class ${name} extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ${indentString(injectCode, 4).trimStart()};
  }
}`;

const getStatelessTemplate = (name: string, injectCode: string): string =>
  `class ${name} extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ${indentString(injectCode, 4).trimStart()};
  }
}`;

export const flutterMain = (
  sceneNode: ReadonlyArray<SceneNode>,
  settings: PluginSettings
): string => {
  localSettings = settings;

  let result = flutterWidgetGenerator(sceneNode);
  switch (localSettings.flutterGenerationMode) {
    case "snippet":
      return result;
    case "stateless":
      result = generateWidgetCode("Column", { children: [result] });
      return getStatelessTemplate(className(sceneNode[0].name), result);
    case "fullApp":
      result = generateWidgetCode("Column", { children: [result] });
      return getFullAppTemplate(className(sceneNode[0].name), result);
  }

  return result;
};

const flutterWidgetGenerator = (
  sceneNode: ReadonlyArray<SceneNode>
): string => {
  let comp: string[] = [];

  // filter non visible nodes. This is necessary at this step because conversion already happened.
  const visibleSceneNode = sceneNode.filter((d) => d.visible);
  const sceneLen = visibleSceneNode.length;

  visibleSceneNode.forEach((node, index) => {
    switch (node.type) {
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON":
      case "LINE":
        comp.push(flutterContainer(node, ""));
        break;
      case "GROUP":
        comp.push(flutterGroup(node));
        break;
      case "FRAME":
      case "INSTANCE":
      case "COMPONENT":
        comp.push(flutterFrame(node));
        break;
      case "TEXT":
        comp.push(flutterText(node));
        break;
      default:
      // do nothing
    }

    if (index !== sceneLen - 1) {
      const spacing = addSpacingIfNeeded(node);
      if (spacing) {
        comp.push(spacing);
      }
    }
  });

  return comp.join(",\n");
};

const flutterGroup = (node: GroupNode): string => {
  return flutterContainer(
    node,
    generateWidgetCode("Stack", {
      children: [flutterWidgetGenerator(node.children)],
    })
  );
};

const flutterContainer = (
  node: SceneNode & BlendMixin & LayoutMixin,
  child: string
): string => {
  let propChild = "";

  let image = "";
  if ("fills" in node && retrieveTopFill(node.fills)?.type === "IMAGE") {
    image = `FlutterLogo(size: ${Math.min(node.width, node.height)})`;
  }

  if (child.length > 0 && image.length > 0) {
    const prop1 = generateWidgetCode("Positioned.fill", {
      child: child,
    });
    const prop2 = generateWidgetCode("Positioned.fill", {
      child: image,
    });

    propChild = generateWidgetCode("Stack", {
      children: [prop1, prop2],
    });
  } else if (child.length > 0) {
    propChild = child;
  } else if (image.length > 0) {
    propChild = image;
  }

  const builder = new FlutterDefaultBuilder(propChild)
    .createContainer(node, localSettings.optimizeLayout)
    .blendAttr(node)
    .position(node, localSettings.optimizeLayout);

  return builder.child;
};

const flutterText = (node: TextNode): string => {
  const builder = new FlutterTextBuilder()
    .createText(node)
    .blendAttr(node)
    .textAutoSize(node)
    .position(node, localSettings.optimizeLayout);

  return builder.child;
};

const flutterFrame = (
  node: FrameNode | InstanceNode | ComponentNode
): string => {
  const children = flutterWidgetGenerator(node.children);

  if (node.layoutMode !== "NONE") {
    const rowColumn = makeRowColumn(node, node, children);
    return flutterContainer(node, rowColumn);
  } else {
    if (localSettings.optimizeLayout && node.inferredAutoLayout) {
      const rowColumn = makeRowColumn(node, node.inferredAutoLayout, children);
      return flutterContainer(node, rowColumn);
    }

    return flutterContainer(
      node,
      generateWidgetCode("Stack", {
        children: [children],
      })
    );
  }
};

const makeRowColumn = (
  node: FrameNode | InstanceNode | ComponentNode,
  autoLayout: inferredAutoLayoutResult,
  children: string
): string => {
  const rowOrColumn = node.layoutMode === "HORIZONTAL" ? "Row" : "Column";

  const widgetProps = {
    mainAxisSize: "MainAxisSize.min",
    // mainAxisSize: getFlex(node, autoLayout),
    mainAxisAlignment: getMainAxisAlignment(autoLayout),
    crossAxisAlignment: getCrossAxisAlignment(autoLayout),
    children: [children],
  };

  return generateWidgetCode(rowOrColumn, widgetProps);
};

const addSpacingIfNeeded = (node: SceneNode): string => {
  if (node.parent?.type === "FRAME" && node.parent.layoutMode !== "NONE") {
    if (node.parent.itemSpacing > 0) {
      if (node.parent.layoutMode === "HORIZONTAL") {
        return generateWidgetCode("const SizedBox", {
          width: node.parent.itemSpacing,
        });
      } else {
        return generateWidgetCode("const SizedBox", {
          height: node.parent.itemSpacing,
        });
      }
    }
  }
  return "";
};
