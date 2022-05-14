import React, { useContext, useState } from "react";
import audientFinder from "../apis/audientFinder";
import { AudientsContext } from "../context/AudientsContext";
import FileSaver from "file-saver";

const Dropdown = (props) => {
  const [looping, activateLooping] = useState({
    active: "active",
    text: "unloop",
  });
  const [djMode, activateDjMode] = useState({
    active: false,
    text: "OFF"
  })
  const { audients, setAudients } = useContext(AudientsContext);
  const { audient, handleLooping, handleDjMode } = props;

  const toggleLooping = () => {
    handleLooping();
    if (!looping.active) {
      // activate looping
      activateLooping({ active: "active", text: "unloop" });
      // deactivate DJ Mode
      activateDjMode({ active: false, text: "OFF"});
    } else {
      // deactivate looping
      activateLooping({ active: false, text: "loop" });
    }
  };

  const toggleDjMode = () => {
    handleDjMode();
    if(!djMode.active){
      // activate DJ Mode
      activateDjMode({ active: "active", text: "ON" })
      // deactivate Looping
      activateLooping({ active: false, text: "loop" })
    } else {
      // deactivate DJ Mode
      activateDjMode({ active: false, text: "OFF"});
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this track?")) {
      try {
        // coming from Player
        await audientFinder.delete(`/${audient.id}/delete`);
        // coming from Context
        setAudients(audients.filter((a) => a.id !== audient.id));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const download = () => FileSaver.saveAs(audient.src, audient.title);

  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary btn-sm dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <i className="fas fa-sliders-h"></i>
      </button>
      <div
        className="dropdown-menu dropdown-menu-right p-0 m-0"
        aria-labelledby="dropdownMenuButton"
      >
        <h6 className="dropdown-header pl-2 pb-0">options</h6>
        <div className="dropdown-divider mb-0"></div>
        
        {/* DJ MODE */}
        <button
          name="djMode"
          className={`dropdown-item pl-3 djMode ${djMode.active}`}
          onClick={toggleDjMode}
        >
          <i className="fas fa-recycle"></i> DJ Mode {djMode.text}
        </button>
        
        {/* LOOPING */}
        <button
          name="loop"
          className={`dropdown-item pl-3 loop ${looping.active}`}
          onClick={toggleLooping}
        >
          <i className="fas fa-recycle"></i> {looping.text}
        </button>
        
        <button
          name="download"
          className="dropdown-item pl-3 download"
          onClick={download}
        >
          <i className="fas fa-download"></i> download
        </button>
        <button
          name="delete"
          className="dropdown-item pl-3 delete"
          onClick={handleDelete}
        >
          <i className="far fa-trash-alt"></i> delete
        </button>
      </div>
    </div>
  );
};

export default Dropdown;
