import React, { useRef, useMemo } from "react";
import {
    Chart as ChartJS,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from "chart.js";

import zoomPlugin from "chartjs-plugin-zoom";
import { Line } from "react-chartjs-2";
import jsPDF from "jspdf";
import "chartjs-adapter-date-fns";

import {
    FiDownload,
    FiZoomIn,
    FiZoomOut,
    FiRefreshCw
} from "react-icons/fi";

import { MdPictureAsPdf } from "react-icons/md";

ChartJS.register(
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    zoomPlugin
);

const LiveChart = ({
    data = [],
    title = "",
    lineWidth = 1,
    controls = {}
}) => {
    const chartRef = useRef();

    // 🔄 Transform data
    const chartData = useMemo(() => {
        const datasets = data.map((serie) => {
            const lastX = serie["x-axis"].slice(-100);
            const lastY = serie["y-axis"].slice(-100);

            const formatted = lastX.map((x, i) => ({
                x: new Date(x),
                y: lastY[i]
            }));

            return {
                label: serie.seriesName,
                data: formatted,
                borderColor: serie.color || "#3b82f6",
                backgroundColor: serie.color || "#3b82f6",
                borderWidth: 2,
                tension: 0.4,
                cubicInterpolationMode: "monotone",
                fill: false,
                stepped: false
            };
        });

        return { datasets };
    }, [data, lineWidth]);

    // ⚙️ Options
    const options = {
        responsive: true,
        animation: false,

        interaction: {
            mode: "index",
            intersect: false
        },

        plugins: {
            legend: {
                display: true,
                position: "top",
                labels: {
                    usePointStyle: true,   
                    pointStyle: "circle", 
                    boxWidth: 8,           
                    boxHeight: 8,
                    padding: 15,
                    font: {
                        size: 12
                    }
                }
            },

            zoom: {
                pan: { enabled: controls.pan ?? true, mode: "x" },
                zoom: {
                    wheel: { enabled: controls.zoomEnabled ?? true },
                    pinch: { enabled: controls.zoomEnabled ?? true },
                    mode: "x"
                }
            }
        },

        layout: {
            padding: 10
        },

        scales: {
            x: {
                type: "time",
                grid: {
                    display: false
                }
            },
            y: {
                grid: {
                    color: "rgba(0,0,0,0.05)"
                }
            }
        },

        elements: {
            point: {
                radius: 2
            }
        }
    };

    // 🔘 Controls
    const zoomIn = () => chartRef.current.zoom(1.2);
    const zoomOut = () => chartRef.current.zoom(0.8);
    const resetZoom = () => chartRef.current.resetZoom();

    const downloadPNG = () => {
        const url = chartRef.current.toBase64Image();
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title}.png`;
        a.click();
    };

    const downloadPDF = () => {
        const pdf = new jsPDF();
        const img = chartRef.current.toBase64Image();
        pdf.addImage(img, "PNG", 10, 10, 180, 100);
        pdf.save(`${title}.pdf`);
    };

    return (
        <div className="w-full mx-auto rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 rounded-t-2xl bg-gradient-to-r from-primary-50 to-white border-b border-gray-100">

                <h3 className="font-semibold text-sm md:text-base text-gray-700 tracking-wide">
                    {title}
                </h3>

                {/* Toolbar */}
                <div className="flex items-center gap-2">

                    {controls.download && (
                        <>
                            <button
                                onClick={downloadPNG}
                                title="Download PNG"
                                className="p-2 rounded-lg hover:bg-gray-100 transition"
                            >
                                <FiDownload className="text-gray-600 hover:text-black text-sm" />
                            </button>

                            <button
                                onClick={downloadPDF}
                                title="Download PDF"
                                className="p-2 rounded-lg hover:bg-gray-100 transition"
                            >
                                <MdPictureAsPdf className="text-gray-600 hover:text-black text-sm" />
                            </button>
                        </>
                    )}

                    {controls.zoomin && (
                        <button
                            onClick={zoomIn}
                            title="Zoom In"
                            className="p-2 rounded-lg hover:bg-gray-100 transition"
                        >
                            <FiZoomIn className="text-gray-600 hover:text-black text-sm" />
                        </button>
                    )}

                    {controls.zoomout && (
                        <button
                            onClick={zoomOut}
                            title="Zoom Out"
                            className="p-2 rounded-lg hover:bg-gray-100 transition"
                        >
                            <FiZoomOut className="text-gray-600 hover:text-black text-sm" />
                        </button>
                    )}

                    {controls.reset && (
                        <button
                            onClick={resetZoom}
                            title="Reset"
                            className="p-2 rounded-lg hover:bg-gray-100 transition"
                        >
                            <FiRefreshCw className="text-gray-600 hover:text-black text-sm" />
                        </button>
                    )}

                </div>
            </div>

            {/* Chart */}
            <div className="p-2 md:p-3">
                <Line ref={chartRef} data={chartData} options={options} />
            </div>

        </div>
    );
};

export default LiveChart;