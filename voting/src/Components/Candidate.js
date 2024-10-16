import React, { useState, useEffect } from "react";

import close from "../assets/close.svg";
import houseImage from "../assets/houses.png";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function Candidate(props) {
  const { index } = useParams();
  const [data, setData] = useState([]);
  const [imageurl, setImgeurl] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        let headersList = {
          Accept: "*/*",
          // "User-Agent": "Thunder Client (https://www.thunderclient.com)"
        };

        let response = await fetch(
          `https://red-historic-wolf-312.mypinata.cloud/ipfs/QmSt3WpRSwbJtKUWrNeHKR1sfnBbP2F2tJjmud1oy5YJw1/${index}`,
          {
            method: "GET",
            headers: headersList,
          }
        );
        let resultData = await response.json();
        console.log(resultData.image);
        let newString = resultData.image.substring(
          resultData.image.indexOf("Q")
        ); // Extract from "Q" to the end
        console.log(newString);
        setImgeurl(newString);
        setData(resultData.attributes);

        console.log("state data", data);
      } catch (error) {
        console.log("error message when fetching data", error);
      }
    };

    fetchData();
  }, [props.CandidateIndex]); // Empty array means this useEffect runs once when component mounts
  console.log(props.CandidateIndex);
  useEffect(() => {
    if (data.length > 0) {
      console.log("Updated state data:", data); // Logs only after the state has changed
    }
  }, [data]);
  return (
    <div className="modal-overlay" onClick={props.toggleHandler}>
      <div className="home-modal" onClick={(e) => e.stopPropagation()}>
        <div className="home-modal__details">
          <div className="home-modal__image">
            <img
              src={`https://red-historic-wolf-312.mypinata.cloud/ipfs/${imageurl}`}
              alt="HomeImage"
            />
          </div>

          <div className="home-modal__overview">
            {/* Conditional rendering to ensure data is available */}
            {data.length > 0 ? (
              <>
                <h1>{data[0].value}</h1>
                <hr />
                <p>
                  <strong>Party:</strong> {data[1]?.value || "N/A"}
                </p>
                <p>
                  <strong>Biography:</strong> {data[2]?.value || "N/A"}
                </p>
              </>
            ) : (
              <p>Loading...</p> // Display a loading message while data is being fetched
            )}
          </div>

          <button
            className="home-modal__close"
            onClick={() => navigate("/voting")}
          >
            <img src={close} alt="closeButton" />
          </button>
        </div>
      </div>
    </div>
  );
}
