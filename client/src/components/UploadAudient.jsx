import React, { useState, useRef } from 'react'
import { useHistory } from "react-router";
import audientFinder from "../apis/audientFinder";


export const UploadAudient = () => {
    let history = useHistory();
    const disc = <i className="fas fa-compact-disc"></i>;
    const [loading, setLoading] = useState("");
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [description, setDescription] = useState("");
    const form = useRef(null)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form.current);
        const config = { headers: { 'content-type': 'multipart/form-data' } };
        setLoading(disc)
        try {
            await audientFinder.post(
                "/upload",
                formData,
                config
            )
        } catch (error) {
            console.log(error);
        }
        history.push("/")
    }

    return (
        <div className="card mt-5">
            <div className="card-header py-0">
                <div className="row">
                    <div className="col-9">
                        <h1 className="display-4 heading">upload audient</h1>
                    </div>
                    <div className="col-3 p-2">
                        <button
                            className="btn btn-sm btn-dark float-right sub-head"
                            onClick={() => history.push("/")}
                        ><i className="fas fa-backward"></i> Back to All
                        </button>
                    </div>
                </div>
            </div>
            <div className="card-body font-2">
                <form ref={form} action="" method="POST">
                    <div className="form-group">
                        <input
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="title"
                            className="form-control"
                            type="text"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            name="artist"
                            value={artist}
                            onChange={(e) => setArtist(e.target.value)}
                            placeholder="artist"
                            className="form-control"
                            type="text"
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-control"
                            type="text"
                            placeholder="description"
                            maxLength={150}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            name="audioFile"
                            className="form-control-file"
                            type="file"
                        />
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-3">
                            <button
                                onClick={handleSubmit}
                                type="submit"
                                className="btn btn-lg btn-primary btn-block font-1"
                            >{loading ? "uploading..." : "upload"}
                            </button>
                            <h1 className="display-6 text-center text-secondary mt-2">
                                {loading}
                            </h1>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

