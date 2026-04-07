import React, { useEffect, useMemo, useState, useContext } from "react";
import LiveChart from "../blocks/LiveChart";
import { DContext } from "../../context/Datacontext";
import { RobatButton } from "./RobatButton";
import { Loading } from "../blocks/Loading";

const CHART_CONFIG = [
  { key: "field1", label: "Wind Generation", color: "#10b981" },
  { key: "field2", label: "Battery FOC", color: "#22c55e" },
];

const CONTROLS = {
  show: true,
  download: true,
  zoomin: true,
  zoomout: true,
  pan: true,
  reset: true,
  zoomEnabled: true,
};

function Home() {
  const { BeURL } = useContext(DContext);
  const [feeds, setFeeds] = useState([]);
  const [latest, setLatest] = useState(null);

  const url = process.env.REACT_APP_ThinkSpeak_URL;

  useEffect(() => {
    if (!url) return;

    let interval;

    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const json = await res.json();

        if (!json?.feeds?.length) return;
        setFeeds(json.feeds);
        setLatest(json.feeds.at(-1));
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    fetchData();
    interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [url]);

  useEffect(() => {
    if (!feeds.length) return;

    fetch(`${BeURL}/feed-values`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feeds }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
      })
      .catch((err) => {
        console.log("Error in feeds", err);
      });
  }, [feeds, BeURL]);

  const chartData = useMemo(() => {
    if (!feeds.length) return [];
    const xAxis = feeds.map((f) => new Date(f.created_at).getTime());
    return CHART_CONFIG.map(({ key, label, color }) => ({
      "x-axis": xAxis,
      "y-axis": feeds.map((f) => {
        const val = f[key];
        return val !== null && val !== undefined ? Number(val) : null;
      }),
      color,
      seriesName: label,
    }));
  }, [feeds]);

  const windGeneration = latest?.field1;
  const batteryFoc = latest?.field2;
  const separatedValues = latest?.field3 ? latest.field3.split(",").map((val) => val.trim()) : [];
  const metrics = [
    { label: "Index", value: separatedValues?.[0], unit: "" },
    { label: "Angle", value: separatedValues?.[1], unit: "°" },
    { label: "Direction", value: separatedValues?.[2], unit: "" },
  ];

  if (!chartData.length) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Farm monitoring</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Wind Sprayer Overview</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                A clean white and green dashboard for your real-time wind, battery and direction data.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:auto-cols-max lg:grid-flow-col">
              <div className="rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-100">
                <p className="text-sm text-emerald-700">Wind generation</p>
                <p className="mt-3 text-3xl font-semibold text-emerald-900">{windGeneration || "-"}</p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-5 ring-1 ring-slate-200">
                <p className="text-sm text-slate-500">Battery FOC</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{batteryFoc || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 ">
          <div className="space-y-6">
            <RobatButton />
            <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Direction metrics</h2>
                  <p className="mt-1 text-sm text-slate-500">Most recent wind direction values from your feed.</p>
                </div>
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 ring-1 ring-emerald-100">
                  Live
                </span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {metrics.map((item, index) => (
                  <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm">
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <p className="mt-3 text-2xl font-semibold">{item.value || "-"} <span className="text-sm text-slate-500">{item.unit}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {chartData.map((chart, index) => (
            <div key={index} className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-xl shadow-slate-200/10">
              <LiveChart data={[chart]} title={chart.seriesName} controls={CONTROLS} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
