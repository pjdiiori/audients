import React, { useContext, useState } from 'react'
import audientFinder from '../apis/audientFinder';
import { AudientsContext } from "../context/AudientsContext";
import FileSaver, { saveAs } from "file-saver";

const Dropdown = (props) => {
    const [active, activate] = useState({ selected: "active", loopText: "unloop" })
    const { audients, setAudients } = useContext(AudientsContext);
    const { audient, handleLooping } = props;

    const toggleLoop = () => {
        handleLooping();
        !active.selected ?
            activate({ selected: "active", loopText: "unloop" }) :
            activate({ selected: "", loopText: "loop" });
    }

    const handleDelete = async () => {
        if(window.confirm("Are you sure you want to delete this track?")){
            try {
            // coming from Player
            await audientFinder.delete(`/${audient.id}/delete`);
            // coming from Context
            setAudients(audients.filter(a => a.id !== audient.id));
            } catch (error) {
                console.log(error);
            }
        }
    }

    const download = () => FileSaver.saveAs(audient.src, audient.title);

    return (
        <div className="dropdown">
            <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i className="fas fa-sliders-h"></i>
            </button>
            <div
                className="dropdown-menu dropdown-menu-right p-0 m-0"
                aria-labelledby="dropdownMenuButton"
            >
                <h6 className="dropdown-header pl-2 pb-0">options</h6>
                <div className="dropdown-divider mb-0"></div>
                <button
                    name="loop"
                    className={`dropdown-item pl-3 loop ${active.selected}`}
                    onClick={toggleLoop}
                >
                    <i className="fas fa-recycle"></i> {active.loopText}
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

    )
}

export default Dropdown;
