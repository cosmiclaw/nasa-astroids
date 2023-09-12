import "./App.css";

import * as React from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";

import Loader from "../../components/loader";
import Item from "../../components/item";

import compareDate from "../../utility/compare-date";
import { useFetch } from "../../hooks/useFetch";

import { auth } from "../../firebase/config";

function App() {
  const navigate = useNavigate();

  const [user, setUser] = React.useState(null);

  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [search, setSearch] = React.useState("");

  const [filteredItems, setFilteredItems] = React.useState([]);
  const [items, setItems] = React.useState([]);
  const [likedItems, setLikedItems] = React.useState([]);

  const [isFetching, setIsFetching] = React.useState(true);
  const [diameterIn, setDiameterIn] = React.useState("kilometers");
  const [velocityIn, setVelocityIn] = React.useState("kilometers_per_hour");
  const [missDistanceIn, setMissDistanceIn] = React.useState("astronomical");

  const { data, error, loading, refetch } = useFetch(null, {
    initialFetch: false,
  });

  const handleLogout = () => {
    setIsFetching(true);
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        alert("Something Went Wrong!");
      })
      .finally(() => setIsFetching(false));
  };

  const handleSearchChange = async (value) => {
    setSearch(value);

    let filteredList = [...items];
    filteredList = filteredList.filter((item) => {
      if (item.id.includes(value) || item.name.includes(value)) {
        return true;
      }

      return false;
    });

    setFilteredItems(filteredList);

    if (!filteredList.length && value.length > 6) {
      try {
        const res = await axios.get(
          `https://api.nasa.gov/neo/rest/v1/neo/${value}?api_key=vcev3RCDZbkaSBn2h02IkxWztKU5hjBAIswhJ4zG`
        );

        setFilteredItems([res.data]);
      } catch (err) {
        alert(`No Item Find with id: "${value}"`);
      }
    }
  };

  const handleItemClick = async (id) => {
    try {
      setIsFetching(true);
      const res = await axios.get(
        `https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=vcev3RCDZbkaSBn2h02IkxWztKU5hjBAIswhJ4zG`
      );

      setItems([res.data]);
    } catch {
      alert("Something went wrong!");
    } finally {
      setIsFetching(false);
    }
  };

  const handleLike = async (likeData) => {
    try {
      const likeDataRes = await axios.get(
        `http://localhost:4000/favourites?email=${user.email}`
      );

      let isLiked = false;
      likeDataRes.data.forEach((item) => {
        if (item.id === likeData.id) {
          isLiked = true;
        }
      });

      if (isLiked) {
        await axios.delete(`http://localhost:4000/favourites/${likeData.id}`);

        const filteredLikes = likedItems.filter(
          (data) => data.id !== likeData.id
        );
        setLikedItems(filteredLikes);
      } else {
        await axios.post(
          "http://localhost:4000/favourites",
          { email: user.email, ...likeData },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setLikedItems((prev) => [...prev, likeData]);
      }
    } catch (err) {
      alert("Something Went Wrong!");
    }
  };

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        navigate("/login");
      }

      setIsFetching(false);
    });
  }, [navigate]);

  React.useEffect(() => {
    (async function () {
      const res = await axios.get(
        `http://localhost:4000/favourites?email=${user?.email}`
      );

      setLikedItems(res.data);
    })();
  }, [user]);

  React.useEffect(() => {
    if (data && !error && !loading) {
      const results = Object.keys(data.near_earth_objects).map((key) => {
        return data.near_earth_objects[key];
      });

      const arr = [];
      results.forEach((itemArray) => {
        itemArray.forEach((item) => arr.push(item));
      });

      setItems(arr);
    }
  }, [data, error, loading]);

  React.useEffect(() => {
    if (!startDate.length || !endDate.length) return;

    const error = compareDate(startDate, endDate, 7);
    if (!error) {
      refetch(`start_date=${startDate}&end_date=${endDate}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  if (error) alert(error.message);
  if (loading || isFetching) return <Loader />;

  return (
    <div>
      <div className="auth-state">
        Welcome: "{user?.displayName}"<span onClick={handleLogout}>Logout</span>
      </div>
      <h1 className="title">꧁꧁𓊈𒆜Nasa Astroids𒆜𓊉꧂꧂</h1>
      {/* Header */}
      <div className="date_header">
        <div className="date_container">
          <div>
            <label htmlFor="start_date">Start Date</label>
            <input
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              id="start_date"
              type="date"
            />
          </div>
          <div>
            <label htmlFor="end_date">End Date</label>
            <input
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              id="end_date"
              type="date"
            />
          </div>
          <div>
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search..."
            />
          </div>
        </div>
      </div>
      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Absolute Magnitude Height</th>
            <th>
              Estimated Diameter{" "}
              <select
                value={diameterIn}
                onChange={(e) => setDiameterIn(e.target.value)}
              >
                <option value="kilometers">Kilometers</option>
                <option value="meters">Meters</option>
                <option value="miles">Miles</option>
                <option value="feet">Feet</option>
              </select>
            </th>
            <th>Close Approach Date</th>
            <th>
              Relative Velocity{" "}
              <select
                value={velocityIn}
                onChange={(e) => setVelocityIn(e.target.value)}
              >
                <option value="kilometers_per_hour">Km/h</option>
                <option value="kilometers_per_second">Km/s</option>
                <option value="miles_per_hour">miles/h</option>
              </select>
            </th>
            <th>
              Miss Distance{" "}
              <select
                value={missDistanceIn}
                onChange={(e) => setMissDistanceIn(e.target.value)}
              >
                <option value="astronomical">Astronomical</option>
                <option value="lunar">Lunar</option>
                <option value="kilometers">Kilometers</option>
                <option value="miles">Miles</option>
              </select>
            </th>
            <th>Orbiting Body</th>
            <th>Add To Favourite</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length
            ? filteredItems.map((obj) => {
                const isLiked = Boolean(
                  likedItems.find((item) => item.id === obj.id)
                );

                return (
                  <Item
                    key={obj.id}
                    likeData={obj}
                    onLike={handleLike}
                    isLiked={isLiked}
                    id={obj.id}
                    name={obj.name}
                    absMagnitudeHeight={obj.absolute_magnitude_h}
                    closeApproachData={obj.close_approach_data}
                    diameter={obj.estimated_diameter[diameterIn]}
                    velocityIn={velocityIn}
                    missDistanceIn={missDistanceIn}
                    onClick={handleItemClick}
                  />
                );
              })
            : items.map((obj) => {
                const isLiked = Boolean(
                  likedItems.find((item) => item.id === obj.id)
                );

                return (
                  <Item
                    key={obj.id}
                    likeData={obj}
                    onLike={handleLike}
                    isLiked={isLiked}
                    id={obj.id}
                    name={obj.name}
                    absMagnitudeHeight={obj.absolute_magnitude_h}
                    closeApproachData={obj.close_approach_data}
                    diameter={obj.estimated_diameter[diameterIn]}
                    velocityIn={velocityIn}
                    missDistanceIn={missDistanceIn}
                    onClick={handleItemClick}
                  />
                );
              })}
        </tbody>
      </table>

      {/* Favourites */}
      <div className="likes">
        <h1 className="title">𓂀 𝔽𝕒𝕧𝕠𝕦𝕣𝕚𝕥𝕖𝕤 𓂀</h1>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Favourites</th>
            </tr>
          </thead>
          <tbody>
            {likedItems.map((obj) => {
              return (
                <Item
                  key={obj.id}
                  likeData={obj}
                  onLike={handleLike}
                  id={obj.id}
                  name={obj.name}
                  isLiked={true}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
