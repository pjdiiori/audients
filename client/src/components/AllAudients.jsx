import React, { useContext, useEffect } from "react";
import { AudientsContext } from "../context/AudientsContext";
import audientFinder from "../apis/audientFinder";
import { Player } from "./Player";

export const AllAudients = () => {
  const { audients, setAudients } = useContext(AudientsContext);
  // const [display, setDisplay] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await audientFinder.get("/");
        setAudients(response.data.audients);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [setAudients]);

  return (
    <div className="all-audients">
      <div className="row justify-content-between">
        <div className="col">
          <h1 className="display-4 heading">Audients</h1>
        </div>
        <div className="col-2 align-self-center">
          <a
            className="btn btn-success btn-block btn-lg"
            title="Upload"
            href="/upload"
          >
            <i className="fas fa-upload"></i>
          </a>
        </div>
      </div>

      <div className="players">
        {audients &&
          audients.map((audient) => {
            return <Player key={audient.id} audient={audient} />;
          })}
      </div>
    </div>
  );
};
