import RestaurantCard from "../components/RestaurantCard";
import resList from "../utils/swiggyData";
import { useState, useEffect } from "react";
import Shimmer from "./shimmer";
import { Link } from "react-router-dom";
import { useOnlineStatus } from "../utils/useOnlineStatus";

const Body = () => {
  // Local State Variable - super powerful variable
  const [ListOfRestaurants, setListOfRestaurant] = useState([]);
  const [filteredRestaurant, setFilteredRestaurant] = useState([]);
  const [searchText, setSearchText] = useState("");
  console.log("body rendered");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await fetch(
      "https://www.swiggy.com/dapi/restaurants/list/v5?lat=11.2367855&lng=75.8257955&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING"
    );
    const json = await data.json();
    console.log(json);

    const restaurants =
      // Optional Chaining
      json?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle
        ?.restaurants || [];

    setListOfRestaurant(restaurants);
    setFilteredRestaurant(restaurants);
  };

  const onlinStatus = useOnlineStatus();
  if (onlinStatus == false) {
    return <h1>You are offline please check your network</h1>;
  }

  // Conditional Rendering
  return !ListOfRestaurants || ListOfRestaurants.length == 0 ? (
    <Shimmer />
  ) : (
    <div className="body">
      <div className="body-head">
        <div className="search-div">
          <input
            type="text"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <button
            onClick={() => {
              console.log(searchText);
              const filteredRestaurantCards = ListOfRestaurants.filter(
                (res) => {
                  return res.info.name
                    .toLowerCase()
                    .includes(searchText.toLowerCase());
                }
              );
              setFilteredRestaurant(filteredRestaurantCards);
            }}
          >
            Search
          </button>
        </div>
        <div className="filter">
          <button
            className="filter-btn"
            onClick={() => {
              const filteredList = ListOfRestaurants.filter(
                (res) => res.info.avgRating >= 4.5
              );
              setFilteredRestaurant(filteredList);
            }}
          >
            Top Rated Restaurants
          </button>
        </div>
      </div>

      <div className="res-container">
        {filteredRestaurant.map((restaurant) => (
          <Link to={"/restaurantmenu/" + restaurant.info.id}>
            <RestaurantCard key={restaurant.info.id} resData={restaurant} />
          </Link>
        ))}
        {/* <Shimmer /> */}
      </div>
    </div>
  );
};

export default Body;
