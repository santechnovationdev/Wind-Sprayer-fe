import React, { useEffect, useState, useMemo, useContext } from "react";
import LiveChart from "../blocks/LiveChart";
import { DContext } from "../../context/Datacontext";
import { RobatButton } from "./RobatButton";
import { HomeTwo } from "./HomeTwo";
import { Loading } from "../blocks/Loading";


const CHART_CONFIG = [
  { key: "field1", label: "Wind Generation", color: "red" },
  { key: "field2", label: "Battery FOC", color: "green" },
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
  const {BeURL}=useContext(DContext)
  const [feeds, setFeeds] = useState([]);
  const [latest,setLatest]= useState(null)

  console.log("feeds" , feeds)

  const url = process.env.REACT_APP_ThinkSpeak_URL;

  //Fetch Logic
  useEffect(() => {
    if (!url) return;

    let interval;

    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const json = await res.json();

        if (!json?.feeds?.length) return;

        setFeeds(json.feeds);
        setLatest(json.feeds.at(-1))

      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    fetchData();
    interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [url]);

  

  // Transform Data (Memoized)
  const chartData = useMemo(() => {
    if (!feeds.length) return [];

    const xAxis = feeds.map((f) =>
      new Date(f.created_at).getTime()
    );

    return CHART_CONFIG.map(({ key, label, color }) => {
      const yAxis = feeds.map((f) => {
        const val = f[key];
        return val !== null && val !== undefined ? Number(val) : null;
      });

      return {
        "x-axis": xAxis,
        "y-axis": yAxis,
        color,
        seriesName: label,
      };
    });
  }, [feeds]);


  // Transform Data (Memoized)
  // const chartData = useMemo(() => {
  //   if (!feeds.length) return [];

  //   // 1. Create a shared X-Axis (timestamps)
  //   const xAxis = feeds.map((f) => new Date(f.created_at).getTime());

  //   // 2. Map through your config to create a series for each field
  //   return CHART_CONFIG.map(({ key, label, color }, index) => ({
  //     "x-axis": xAxis,
  //     "y-axis": feeds.map((f) => {
  //       // Split the "10,20,50" string into an array
  //       const values = f.field1 ? f.field1.split(",") : [];
  //       // Extract the value based on the index (0 for field1, 1 for field2, etc.)
  //       return Number(values[index]) || 0;
  //     }),
  //     color,
  //     seriesName: label,
  //   }));
  // }, [feeds]);



  useEffect(()=>{
       fetch(`${BeURL}/feed-values`,{
        method : 'POST',
        credentials : 'include',
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ feeds })
       })
       .then(res=>res.json())
       .then(data=>{
        console.log("data" , data)
       })
       .catch(err=>{
        console.log("Error in feeds" , err)
       })
  },[feeds,BeURL])


  const windGeneration = latest?.field1
  const batteryFoc = latest?.field2
  const separatedValues = latest?.field3
    ? latest.field3.split(",").map(val => val.trim())
    : [];

  const metrics = [
    { label: "Index", value: separatedValues?.[0], unit: "" },
    { label: "Angle", value: separatedValues?.[1], unit: "°" },
    { label: "Direction", value: separatedValues?.[2], unit: "" },
  ];

  // Loading State
  if (!chartData.length) {
    return <Loading />;
  }

  return (
    <div className="mx-auto max-w-6xl px-3 mt-10 space-y-6">

      <RobatButton />


      <div className="bg-indigo-100 rounded-xl p-3">
        <h2 className="text-xl font-semibold">Latest Value</h2>
        <div className="w-full mx-auto mt-2 px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LEFT SIDE */}
          <div className="flex flex-col gap-4 h-full">

            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 shadow-lg flex-1 flex flex-col justify-between">
              <p className="text-sm text-gray-400 mb-2">Wind Generation</p>
              <p className="text-3xl font-bold text-white">{windGeneration || "-"}</p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 shadow-lg flex-1 flex flex-col justify-between">
              <p className="text-sm text-gray-400 mb-2">Battery FOC</p>
              <p className="text-3xl font-bold text-white">{batteryFoc || "-"}</p>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="border border-gray-800 bg-gray-900 shadow-xl rounded-2xl p-6 flex flex-col h-full">

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-blue-400">🌬️ Wind Direction</h2>

              <p className="text-xs text-green-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Live Data
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              {metrics.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-800 p-4 rounded-xl border border-gray-700"
                >
                  <span className="text-gray-400 text-sm font-medium">
                    {item.label}
                  </span>

                  <span className="text-lg font-semibold text-white">
                    {item.value || "-"} {item.unit}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>



      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {chartData.map((chart, index) => (
          <div key={index}>
            <LiveChart
              data={[chart]}
              title={chart.seriesName}
              controls={CONTROLS}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;