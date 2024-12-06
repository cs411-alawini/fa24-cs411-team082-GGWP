import React, { useEffect, useState } from "react";
import { Recreation } from "../../services/services";


const RecInfoPage: React.FC<{ recreation: Recreation }> = ({ recreation }) => {
    const [recreationData, setRecreationData] = React.useState<Recreation | null>(null);  
    useEffect(() => {
      setRecreationData(recreation);
    }, [recreation]);
  
    if (!recreationData) {
        return (<div className="loading-indicator">
          Loading...
        </div>); 
    }

    const recreationStats = [
      { label: 'Name', value: recreationData.RecName },
      { label: 'Type', value: recreationData.RecType },
      { label: 'State', value: recreationData.StateName },
      { label: 'Address', value: recreationData.Address }
    ];
  
    return (
      <section className="container px-6 m-auto">
          {/* Recreation Details List */}
          <div className="mt-6">
              {recreationStats.map((stat, index) => (
                <div key={index} className="py-2">
                  <dt className="text-lg font-medium text-gray-900">{stat.label}</dt>
                  <dd className="mt-1 text-base text-gray-700">{stat.value}</dd>
                </div>
              ))}
          </div>
      </section>
    );
  };
  
  

export default RecInfoPage;