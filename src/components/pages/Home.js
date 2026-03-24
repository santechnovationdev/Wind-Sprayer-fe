import React, { useEffect, useState, useMemo, useContext } from "react";
import LiveChart from "../blocks/LiveChart";
import { DContext } from "../../context/Datacontext";
import { RobatButton } from "./RobatButton";

const CHART_CONFIG = [
  { key: "field1", label: "Roll", color: "#ef4444" },
  { key: "field2", label: "Pitch", color: "#6366f1" },
  { key: "field3", label: "Yaw", color: "#ED254E" },
  { key: "field4", label: "ECG", color: "#00F874" },
  { key: "field5", label: "Sleep Position", color: "#2A4494" },
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

    return CHART_CONFIG.map(({ key, label, color }) => ({
      "x-axis": xAxis,
      "y-axis": feeds.map((f) => Number(f[key]) || 0),
      color,
      seriesName: label,
    }));
  }, [feeds]);

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

  // Loading State
  if (!chartData.length) {
    return <div className="text-center mt-10">Loading dashboard...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-3 mt-10 space-y-6">

      <RobatButton />
      <div className="max-w-4xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Roll */}
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-sm">Roll</p>
          <h2 className="text-xl font-semibold">{latest?.field1 ?? "-"}</h2>
        </div>

        {/* Pitch */}
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-sm">Pitch</p>
          <h2 className="text-xl font-semibold">{latest?.field2 ?? "-"}</h2>
        </div>

        {/* Yaw */}
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-sm">Yaw</p>
          <h2 className="text-xl font-semibold">{latest?.field3 ?? "-"}</h2>
        </div>

        {/* ECG */}
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-sm">ECG</p>
          <h2 className="text-xl font-semibold">{latest?.field4 ?? "-"}</h2>
        </div>

        {/* Sleep Position */}
        <div className="bg-white shadow rounded-xl p-4 col-span-1 sm:col-span-2 lg:col-span-1">
          <p className="text-gray-500 text-sm">Sleeping Position</p>
          <h2 className={`text-xl font-semibold ${latest?.field5 === "1" ? "text-red-500" : "text-green-500"
            }`}>
            {latest?.field5 === "1" ? "Abnormal ⚠️" : "Normal ✅"}
          </h2>
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