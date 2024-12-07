import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar/SearchBar";
import { Users, searchUserData, Recreation, getAllRecData, getRecreationByRecName } from "../services/services";
import RecList from "../components/RecList/RecList";
import { useLocation } from "react-router-dom";  

// import { recreationData } from "../services/mockData";

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState<Users[]>([]);
  const [recData, setRecData] = useState<Recreation[] | undefined>(undefined);

  // to deal with # in recname
  const location = useLocation();  
  useEffect(() => {
    if (location.hash) {
      console.log("Hash found: ", location.hash); 
      const hash = decodeURIComponent(location.hash.substring(1));  // Remove '#' and decode the URL
      setSearchQuery(hash);  // Update searchQuery state
    }
  }, [location.hash]);  

  
  // handling search bar
  const handleSearch = (query: string) => {
    setSearchQuery(query);  
  };

  // users based on search - not needed??
  useEffect(() => {
    const fetchData = async () => {
      setUserData([]);
      const data = await searchUserData(searchQuery);
      setUserData(data);
    };

    fetchData();
  }, [searchQuery]); 


  // recreation based on search or default all 
  useEffect(() => {
    const fetchRecData = async () => {
      try {
        let data: Recreation[] | undefined;
  
        if (searchQuery.trim()) {
          // Fetch based on search query
          console.log("in searched.");
          const searchData = await getRecreationByRecName(searchQuery);
          data = searchData ? [searchData] : []; 
        } else {
          // Fetch all data if no search query
          data = await getAllRecData();
        }
  
        // Ensure data is either a valid array or undefined
        setRecData(data);
      } catch (error) {
        console.error("Error fetching recreation data:", error);
      }
    };
  
    fetchRecData();
  }, [searchQuery]);





  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* Title */}
        <h1 className="font-bold text-center text-6xl text-blue-600 mb-4">
          TraversAll
        </h1>

        {/* SearchBar centered */}
        <div className="w-full max-w-md mb-6">
          <SearchBar onSearch={handleSearch} />
          
        </div>
      </div>

      {/* RecList container with max width */}
      <div className="mt-6 py-10 sm:py-15">
        <div className="w-full max-w-screen-lg mx-auto px-4">
          <RecList recData={recData ?? []} />
        </div>
      </div>
    </>
  );
};

export default HomePage;
