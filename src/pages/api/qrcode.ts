// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import svg2img from 'svg2img';
import qrcode from 'qrcode';
import { performance } from 'perf_hooks';
import { registerFont } from 'canvas';
import fs from 'fs';

registerFont('./src/RobotoMedium.ttf', { family: 'Roboto-Medium' });
const base64font = fs.readFileSync('./src/RobotoMedium.woff2', 'base64');


const isValid = (vis: Buffer, row: number, col: number, size: number) => {
    if (row < 0 || col < 0 || row >= size || col >= size) {
        return false;
    }
    if (vis[row * size + col]) {
        return false;
    }
    return true;
}

const dRow = [0, 1, 0, -1];
const dCol = [-1, 0, 1, 0];

const DFS = (row: number, col: number, grid: Buffer, vis: Buffer, size: number) => {
    const stack: [number, number, number][] = [];
    stack.push([row, col, -1]);

    const res: [number, number, number][] = [];

    while (stack.length > 0) {
        const [cRow, cCol, direction] = stack.shift()!;

        if (!isValid(vis, cRow, cCol, size)) {
            continue;
        }

        if (!grid[cRow * size + cCol]) {
            continue;
        }

        vis[cRow * size + cCol] = 1;
        res.push([cRow, cCol, direction]);

        for (let i = 0; i < 4; i++) {
            stack.push([cRow + dRow[i], cCol + dCol[i], i]);
        }
    }
    return res;
}

// TODO: needs to be optimized
const convertSegmentToCornerList = (segment: [number, number, number][]) => {
    if (segment.length === 0) {
        return null;
    }

    const list: [number, number][] = [];
    segment.forEach(([cRow, cCol, direction]) => {
        switch (direction) {
            case -1:
                list.push([cRow, cCol], [cRow, cCol + 1], [cRow + 1, cCol + 1], [cRow + 1, cCol], [cRow, cCol]);
                break;
            case 0: {
                // left
                let startIndex = -1;
                for (let i = list.length - 2; i >= 0; i--) {
                    const [x1, y1] = list[i];
                    const [x2, y2] = list[i + 1];
                    if (x1 === cRow + 1 && y1 === cCol + 1 && x2 === cRow && y2 === cCol + 1) {
                        startIndex = i;
                        break;
                    }
                }
                if (startIndex > -1) {
                    if (list[startIndex - 1][0] === cRow + 1 && list[startIndex - 1][1] === cCol) {
                        list.splice(startIndex, 1, [cRow, cCol]);
                    } else if (list[startIndex + 2][0] === cRow && list[startIndex + 2][1] === cCol) {
                        list.splice(startIndex + 1, 1, [cRow + 1, cCol]);
                    } else {
                        list.splice(startIndex + 1, 0, [cRow + 1, cCol], [cRow, cCol]);
                    }
                }
                break;
            }
            case 1: {
                // bottom
                let startIndex = -1;
                for (let i = list.length - 2; i >= 0; i--) {
                    const [x1, y1] = list[i];
                    const [x2, y2] = list[i + 1];
                    if (x1 === cRow && y1 === cCol + 1 && x2 === cRow && y2 === cCol) {
                        startIndex = i;
                        break;
                    }
                }
                if (startIndex > -1) {
                    if (list[startIndex - 1][0] === cRow + 1 && list[startIndex - 1][1] === cCol + 1) {
                        list.splice(startIndex, 1, [cRow + 1, cCol]);
                    } else if (list[startIndex + 2][0] === cRow + 1 && list[startIndex + 2][1] === cCol) {
                        list.splice(startIndex + 1, 1, [cRow + 1, cCol + 1]);
                    } else {
                        list.splice(startIndex + 1, 0, [cRow + 1, cCol + 1], [cRow + 1, cCol]);
                    }
                }
                break;
            }
            case 2: {
                // right
                let startIndex = -1;
                for (let i = list.length - 2; i >= 0; i--) {
                    const [x1, y1] = list[i];
                    const [x2, y2] = list[i + 1];
                    if (x1 === cRow && y1 === cCol && x2 === cRow + 1 && y2 === cCol) {
                        startIndex = i;
                        break;
                    }
                }
                if (startIndex > -1) {
                    if (list[startIndex - 1][0] === cRow && list[startIndex - 1][1] === cCol + 1) {
                        list.splice(startIndex, 1, [cRow + 1, cCol + 1]);
                    } else if (list[startIndex + 2][0] === cRow + 1 && list[startIndex + 2][1] === cCol + 1) {
                        list.splice(startIndex + 1, 1, [cRow, cCol + 1]);
                    } else {
                        list.splice(startIndex + 1, 0, [cRow, cCol + 1], [cRow + 1, cCol + 1]);
                    }
                }
                break;
            }
            case 3: {
                // top
                let startIndex = -1;
                for (let i = list.length - 2; i >= 0; i--) {
                    const [x1, y1] = list[i];
                    const [x2, y2] = list[i + 1];
                    if (x1 === cRow + 1 && y1 === cCol && x2 === cRow + 1 && y2 === cCol + 1) {
                        startIndex = i;
                        break;
                    }
                }
                if (startIndex > -1) {
                    if (list[startIndex - 1][0] === cRow && list[startIndex - 1][1] === cCol) {
                        list.splice(startIndex, 1, [cRow, cCol + 1]);
                    } else if (list[startIndex + 2][0] === cRow && list[startIndex + 2][1] === cCol + 1) {
                        list.splice(startIndex + 1, 1, [cRow, cCol]);
                    } else {
                        list.splice(startIndex + 1, 0, [cRow, cCol], [cRow, cCol + 1]);
                    }
                }
                break;
            }
            default:
                break;
        }
    });

    return list;
}

const optimizeCornerList = (list: [number, number][]) => {
    for (let i = 1; i < list.length - 1; i++) {
        const pCorner = list[i - 1];
        const cCorner = list[i];
        const nCorner = list[i + 1];

        if (pCorner[0] === nCorner[0] && pCorner[1] === nCorner[1]) {
            list.splice(i, 2);
            i -= i === 1 ? 1 : 2;
        } else if (pCorner[0] === cCorner[0] && cCorner[0] === nCorner[0]) {
            list.splice(i, 1);
            i--;
        } else if (pCorner[1] === cCorner[1] && cCorner[1] === nCorner[1]) {
            list.splice(i, 1);
            i--;
        }
    }
}

const convertCornerListToPath = (list: [number, number][], offsetX: number = 0, offsetY: number = 0, width: number = 1): string => {
    if (list.length === 0) {
        return '';
    }
    let prevCorner: [number, number];
    let corner: [number, number] = list[0];
    let svgPath = `M${offsetX + corner[1] * width} ${offsetY + corner[0] * width}`;
    for (let i = 1; i < list.length - 1; i++) {
        prevCorner = corner;
        corner = list[i];
        if (corner[0] === prevCorner[0]) {
            svgPath += `h${(corner[1] - prevCorner[1]) * width}`;
        } else {
            svgPath += `v${(corner[0] - prevCorner[0]) * width}`;
        }
    }
    return svgPath + 'z';
}

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians)),
    };
};

const parseParameters = (req: NextApiRequest) => {
    const query = new Proxy(req.query, {
        get: (target, name: string) => {
            const prop = name in target ? name : Object.keys(target).find((key) => key.toLowerCase() === name.toLowerCase());
            if (!prop) return undefined;
            const value = target[prop];
            return Array.isArray(value) ? value[value.length - 1] : value;
        },
    });

    const options: any = {};
    ({
        value: options.value,
        width: options.width,
        optimization: options.optimization,
        color: options.color,
        format: options.format,
        text: options.text,
        circle: options.circle,
    } = query);

    if ('circle' in query) {
        options.circle = !(query.circle === '0' || query.circle === 'false');
    } else {
        options.circle = 1;
    }

    if ('optimization' in query) {
        options.optimization = !(query.optimization === '0' || query.optimization === 'false');
    } else {
        options.optimization = 1;
    }

    if (options.format !== 'svg' && options.format !== 'png') {
        options.format = 'png';
    }

    // prepend the hashtag for hex colors
    if (/^[a-fA-F0-9]{3,8}$/.test(options.color)) {
        options.color = `#${options.color}`;
    }
    options.color = options.color || '#000';

    // remove control characters, trailing and multiple spaces
    options.text = options.text?.replace((/[\x00-\x1F]/g), ' ').trim?.().replace?.(/\s+/g, ' ');

    // only allow 2000px
    options.width = Number.parseInt(options.width, 10) || 1000;
    if (options.width > 2000) {
        options.width = 2000;
    }

    return options;
};



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { value, width: exportWidth, color, optimization, circle, format, text } = parseParameters(req);

    if (!value) {
        res.status(400);
        res.end('Missing value');
        return;
    }

    if (req.headers['if-none-match'] === 'W/DEV') {
        res.status(304);
        return res.end();
    }
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Expires', new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString());
    res.setHeader('Cache-Control', 'must-revalidate');
    res.setHeader('ETag', 'W/DEV');

    const code = await qrcode.create(value, { errorCorrectionLevel: 'H', version: value.length > 24 ? undefined : 4 });

    const visited = Buffer.alloc(code.modules.data.length, 0);

    const icon = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
        [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0 ,0, 0, 0, 0, 0],
    ];

    const coloredIcon = color !== 'black' && color !== '#000' && color !== '#000000' && color !== '#000f' && color !== '#000000ff';

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const y = i + ((code.modules.size + 1) / 2) - 5;
            const x = j + ((code.modules.size - 1) / 2) - 5;
            code.modules.data[x * code.modules.size + y] = !coloredIcon ? icon[j][i] : 0;
        }
    }

    const viewport = 580;
    let width = viewport / (code.modules.size + 4);
    let offset = (viewport - code.modules.size * width) / 2 + (circle ? 294 : 0);
    let svgPath = circle
        ? `<path d="m584 0a584 584 0 1 0 0 1168A584 584 0 1 0 584 0z" fill="#fff"/>`
        : `<path d="M0 0h${viewport}v${viewport}H0z" fill="#fff"/>`;
    const angle1 = Math.asin(Math.sin(3 * Math.PI / 180) * 424 / 548) * 180 / Math.PI;
    const angle2 = 72 - angle1;
    let circlePath = '';
    for (let i = 0; i < 5 && circle; i++) {
        const corner1 = polarToCartesian(584, 584, 424, 72 * i + 3)
        const corner2 = polarToCartesian(584, 584, 424, 72 * i + 69);
        const corner3 = polarToCartesian(584, 584, 548, 72 * i + angle2);
        const corner4 = polarToCartesian(584, 584, 548, 72 * i + angle1);

        circlePath += `M${corner1.x},${corner1.y}A424,424,0,0,1,${corner2.x},${corner2.y}L${corner3.x},${corner3.y}A548,548 0 0 0 ${corner4.x},${corner4.y}Z`;
    }
    if (circlePath) {
        svgPath += `<path d="${circlePath}" fill="${color}"/>`;
    }
    let dataPath = '';
    const start = performance.now();
    const { data, size } = code.modules;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (data[i * size + j] && !visited[i * size + j]) {
                if (optimization) {
                    // optimized version with joined paths
                    const segment = DFS(i, j, data, visited, size);
                    if (segment.length) {
                        const list = convertSegmentToCornerList(segment)!;
                        optimizeCornerList(list);
                        dataPath += convertCornerListToPath(list);
                    }
                } else {
                    // naive version
                    // svgPath += `<path d="M${j * width + offset} ${i * width + offset}h${width}v${width}h${-width}z" fill="#000"/>`;
                    dataPath += `M${j} ${i}h1v1h-1z`;
                }
            }
        }
    }
    if (dataPath) {
        svgPath += `<path d="${dataPath}" transform="translate(${offset},${offset}) scale(${width})"/>`;
    }
    console.log('duration', performance.now() - start);

    if (coloredIcon) {
        const iconBuffer = Buffer.concat(icon.map(Buffer.from));
        const iconVisited = Buffer.alloc(iconBuffer.length, 0);
        
        let iconPath = '';
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (optimization) {
                    const segment = DFS(i, j, iconBuffer, iconVisited, 10);
                    if (segment.length) {
                        const list = convertSegmentToCornerList(segment)!;
                        optimizeCornerList(list);
                        iconPath += convertCornerListToPath(list, 0, 0, 1);
                    }
                } else if (icon[i][j]) {
                    iconPath += `M${j} ${i}h1v1h-1z`;
                }
            }
        }
        const offsetX = offset + (((code.modules.size + 1) / 2) - 5) * width;
        const offsetY = offset + (((code.modules.size - 1) / 2) - 5) * width;
        svgPath += `<path d="${iconPath}" fill="${color}" transform="translate(${offsetX},${offsetY}) scale(${width})"/>`;
    }

    let defs = '';
    if (text) {
        defs = `<defs>
        <style type="text/css">@font-face {
        font-family: 'Roboto-Medium';
        font-weight: 500;
        font-style: normal;
        src: local('Roboto Medium'), local('Roboto-Medium'), url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9fBBc4.woff2) format('woff2'), url(../RobotoMedium.ttf) format('truetype'), url(data:application/x-font-woff;charset=utf-8;base64,${base64font}) format('woff2');
    }
            </style>
            <path d="M 1059.0436379741525,372.4969456005839 A 520,520 0 0 0 638.3548008991798,66.84861440849784" id="curve0"/>
            <path d="M 931.9479153066063,970.435309248245 A 520,520 0 0 0 1092.6367523815788,475.88592077476517" id="curve1"/>
            <path d="M 324.0000000000001,1034.3332099679083 A 520,520 0 0 0 844,1034.333209967908" id="curve2"/>
            <path d="M 75.36324761842104,475.8859207747653 A 520,520 0 0 0 236.05208469339374,970.435309248245" id="curve3"/>
            <path d="M 529.6451991008203,66.84861440849784 A 520,520 0 0 0 108.95636202584745,372.4969456005841" id="curve4"/>
        </defs>`;
    
        // svgPath += '<text font-family="Roboto-Medium,Roboto" font-size="100" font-weight="500" letter-spacing=".04em" text-anchor="middle">';
        for (let i = 0; i < 5; i++) {
            svgPath += `<text font-family="Roboto-Medium,Roboto" font-size="100" font-weight="500" letter-spacing=".04em" text-anchor="middle"><textPath xlink:href="#curve${i}" startOffset="50%" fill="#fff">${text}</textPath></text>`;
        }
        // svgPath += '</text>';
    }

    const svg = `<?xml version="1.0" encoding="UTF-8"?><svg version="1.2" baseProfile="tiny" viewBox="0 0 ${circle ? 1168 : 580} ${circle ? 1168 : 580}" xmlns="http://www.w3.org/2000/svg"${text ? ' xmlns:xlink="http://www.w3.org/1999/xlink"' : ''}>${defs}${svgPath}</svg>`;

    if (format === 'svg') {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.end(svg);
        return;
    }

    const buffer = await new Promise((resolve) => {
        svg2img(svg, {
            width: exportWidth,
            height: exportWidth,
        }, (err, buffer) => {
            if (err) {
                console.log('err', err);
                resolve(null);
                return;
            }
            resolve(buffer);
        });
    });

    if (!buffer) {
        res.status(500);
        return res.end();
    }

    res.status(200);
    res.write(buffer);
    res.end();
}
