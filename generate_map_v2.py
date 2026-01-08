import re

def convert_svg_to_react(svg_path, output_path):
    with open(svg_path, 'r') as f:
        svg_content = f.read()

    width_match = re.search(r'width="([^"]+)"', svg_content)
    height_match = re.search(r'height="([^"]+)"', svg_content)
    width = width_match.group(1) if width_match else "559.57092"
    height = height_match.group(1) if height_match else "1024.7631"

    paths = []
    path_pattern = re.compile(r'<path\s+(.*?)/>', re.DOTALL)
    
    for match in path_pattern.finditer(svg_content):
        attrs_str = match.group(1)
        
        def get_attr(name, text):
            m = re.search(name + r'\s*=\s*"([^"]+)"', text, re.DOTALL)
            return m.group(1) if m else ""

        d = get_attr('d', attrs_str)
        pid = get_attr('id', attrs_str)
        title = get_attr('title', attrs_str)
        
        if d and pid:
            d_clean = d.replace('\n', ' ').replace('"', '\\"')
            title_clean = title.replace('"', '\\"')
            paths.append({'d': d_clean, 'id': pid, 'title': title_clean})

    if not paths:
        print("ERROR: No paths found!")
        return

    print(f"Found {len(paths)} paths.")

    # Build the paths array string
    paths_array = "const PROVINCE_PATHS: { id: string; d: string; title: string }[] = [\n"
    for p in paths:
        paths_array += f'    {{ id: "{p["id"]}", d: "{p["d"]}", title: "{p["title"]}" }},\n'
    paths_array += "];\n"

    ts_content = f'''"use client";

import React, {{ useState }} from "react";

interface InteractiveMapProps {{
    onProvinceSelect: (provinceId: string) => void;
    selectedProvinceId: string | null;
}}

// Province path data for the full Thailand map
{paths_array}

// Active provinces that can be clicked
const ACTIVE_PROVINCE_IDS = ["TH-10", "TH-13", "TH-52"];

const InteractiveMap: React.FC<InteractiveMapProps> = ({{
    onProvinceSelect,
    selectedProvinceId,
}}) => {{
    const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

    const handleProvinceClick = (provinceId: string) => {{
        if (ACTIVE_PROVINCE_IDS.includes(provinceId)) {{
            onProvinceSelect(provinceId);
        }}
    }};

    const getProvinceStyle = (provinceId: string): React.CSSProperties => {{
        const isActive = ACTIVE_PROVINCE_IDS.includes(provinceId);
        const isSelected = selectedProvinceId === provinceId;
        const isHovered = hoveredProvince === provinceId;

        if (!isActive) {{
            // Inactive province style
            return {{
                fill: "#e2e8f0",
                stroke: "#cbd5e1",
                strokeWidth: 1,
                cursor: "default",
                transition: "all 0.3s ease",
            }};
        }}

        // Active province styles
        if (isSelected || isHovered) {{
            return {{
                fill: "#f9d100", // Relife Yellow
                stroke: "#073f8a",
                strokeWidth: 2,
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: "scale(1.03)",
                transformOrigin: "center",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
            }};
        }}

        // Default active province style
        return {{
            fill: "#073f8a", // Relife Blue
            stroke: "#ffffff",
            strokeWidth: 1.5,
            cursor: "pointer",
            transition: "all 0.3s ease",
        }};
    }};

    return (
        <div className="relative w-full max-w-[500px] mx-auto">
            <svg
                viewBox="0 0 {width} {height}"
                className="w-full h-auto"
                xmlns="http://www.w3.org/2000/svg"
                style={{{{ overflow: "visible" }}}}
            >
                {{/* Province paths */}}
                {{PROVINCE_PATHS.map((province) => (
                    <path
                        key={{province.id}}
                        d={{province.d}}
                        id={{province.id}}
                        style={{getProvinceStyle(province.id)}}
                        onClick={{() => handleProvinceClick(province.id)}}
                        onMouseEnter={{() => {{
                            if (ACTIVE_PROVINCE_IDS.includes(province.id)) {{
                                setHoveredProvince(province.id);
                            }}
                        }}}}
                        onMouseLeave={{() => setHoveredProvince(null)}}
                    >
                        <title>{{province.title}}</title>
                    </path>
                ))}}

                {{/* Legend */}}
                <g transform="translate(20, 950)">
                    <rect x="0" y="0" width="20" height="20" fill="#073f8a" rx="4" />
                    <text x="30" y="15" fontSize="20" fill="#475569" fontWeight="500">พื้นที่ลงสมัคร</text>
                    
                    <rect x="0" y="35" width="20" height="20" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" rx="4" />
                    <text x="30" y="50" fontSize="20" fill="#94a3b8" fontWeight="500">จังหวัดอื่นๆ</text>
                </g>
            </svg>
        </div>
    );
}};

export default InteractiveMap;
'''

    with open(output_path, 'w') as f:
        f.write(ts_content)
    print(f"Successfully generated {output_path}")

convert_svg_to_react('thailand.svg', 'app/components/InteractiveMap.tsx')
