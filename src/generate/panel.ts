import { GenerationOptions } from "./prompt";
import { write } from "./index";

type PanelType = "graphic" | "dashboard";

// region html generation

const graphicFileName = "index.html";
const dashboardFile = "panel.html";

const graphicComment =
    "You can display anything you want here and add it to your broadcaster software by adding a webview with a link to this graphic.";
const dashboardComment = "You can display anything you want here to control and monitor your bundle.";

function genPanel(type: PanelType, opts: GenerationOptions): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${opts.bundleName}</title>
    <style>
        body {
            font-family: sans-serif;
        }
    </style>
</head>
<body>
    <!-- ${type === "graphic" ? graphicComment : dashboardComment} -->
    <p>
        Hello, I'm the ${type} of bundle "${opts.bundleName}" that was generated by nodecg-io-cli.
    </p>

    <script>
        // You can use the nodecg object here to e.g. send and receive nodecg messages or access replicants.
        nodecg.log.info("Hello World, I'm bundle ${opts.bundleName}.");
    </script>
</body>
</html>
`;
}

export async function genGraphic(opts: GenerationOptions, bundlePath: string): Promise<void> {
    await write(genPanel("graphic", opts), bundlePath, "graphics", graphicFileName);
}

export async function genDashboard(opts: GenerationOptions, bundlePath: string): Promise<void> {
    await write(genPanel("dashboard", opts), bundlePath, "dashboard", dashboardFile);
}

// endregion
// region nodecg package.json configs

interface NodeCGGraphicConfig {
    file: string;
    width: number;
    height: number;
}

interface NodeCGDashboardConfig {
    name: string;
    title: string;
    width: number;
    file: string;
    headerColor: string;
}

export function genNodeCGDashboardConfig(opts: GenerationOptions): NodeCGDashboardConfig[] | undefined {
    if (!opts.dashboard) {
        return undefined;
    }

    return [
        {
            name: "panel",
            title: opts.bundleName,
            width: 2,
            file: dashboardFile,
            headerColor: "#525F78",
        },
    ];
}

export function genNodeCGGraphicConfig(opts: GenerationOptions): NodeCGGraphicConfig[] | undefined {
    if (!opts.graphic) {
        return undefined;
    }

    return [
        {
            file: graphicFileName,
            width: 1920,
            height: 1080,
        },
    ];
}

// endregion
