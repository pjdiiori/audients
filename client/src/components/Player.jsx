import React, { useEffect, useState, useRef } from 'react'
import Dropdown from "./Dropdown";
import ReactWaves from "@dschoon/react-waves";

const play = <i className="far fa-play-circle"></i>
const pause = <i className="far fa-pause-circle"></i>

function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id)
        }
    }, [delay]);
}

export const Player = ({ audient }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [wavesurfer, setWavesurfer] = useState(null);
    const [icon, setIcon] = useState(play);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [volDisplay, setVolDisplay] = useState("vol")
    const [rate, setRate] = useState(1);
    const [rateDisplay, setRateDisplay] = useState("rate")
    const [delay, setDelay] = useState(1000)
    const [looping, setLooping] = useState(true);

    const handleLoad = ({ wavesurfer }) => {
        setWavesurfer(wavesurfer);
        setDuration(Math.round(wavesurfer.getDuration()));
    }

    const playPause = () => {
        setIsPlaying(!isPlaying);
        wavesurfer.on('play', () => {
            setIcon(pause);
        })
        wavesurfer.on('pause', () => setIcon(play))
    }

    const updateDuration = () => {
        setDuration(Math.floor(wavesurfer.getDuration() - wavesurfer.getCurrentTime()))
    }

    const handleVolume = (e) => {
        setVolume(e.target.valueAsNumber);
        setVolDisplay(`${e.target.valueAsNumber * 100}%`);
    }

    const handleRate = (e) => {
        setDelay(e.target.valueAsNumber**-1*1000);
        setRate(e.target.valueAsNumber)
        setRateDisplay(e.target.value + 'x')
    }

    const handleLooping = () => {
        setLooping(!looping)
    }

    const seekStart = () => {
        if(isPlaying){
            playPause();
        }
        wavesurfer.seekTo(0);
        setDuration(Math.round(wavesurfer.getDuration()))
    }

    const seekSkip = () => {
        const d = wavesurfer.getDuration();
        d > 60 ? wavesurfer.skip(Math.sqrt(d)) : wavesurfer.skip(d/8);
        updateDuration();
    }

    const inputRate = () => {
        const handleInput = (e) => {
            if(e.key === 'Enter'){
                setRateDisplay("rate");
                if(isNaN(e.target.valueAsNumber)){
                    setRate(1);
                } else setRate(e.target.valueAsNumber);
            } else if (e.key === "Escape") setRateDisplay("rate");
        }

        const input =
                <div className="input-group ">
                    <input
                        min={0.5}
                        max={2}
                        step={0.01}
                        type="number"
                        className="form-control border-0 p-0 m-0"
                        autoFocus
                        onKeyDown={handleInput}
                    />
                </div>

        setRateDisplay(input);
    }

    useInterval(() => {
        if (isPlaying) {
            updateDuration();
            wavesurfer.on('finish', () => {
                setDuration(Math.round(wavesurfer.getDuration()));
                if(looping === false){
                    setIsPlaying(false);
                    wavesurfer.seekTo(0);
                } else setIsPlaying(true);
            })
        }
    }, delay);

    const format = (duration) => {
        const mins = duration <= 0 ? 0 : Math.floor(duration / 60);
        const secs = duration <= 0 ? 0 : duration - (mins * 60);
        const timeString = mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
        return timeString;
    }

    const showTicks = (min, max, step) => {
        const arr = [];
        for (let i = min; i <= max; i += step) {
            arr.push(i);
        }
        return arr.map(x => <option key={x} value={x}></option>)
    }

    return (
        <div className="card mb-5 font-2">
            <div className="row no-gutters">
                <div className="col-auto">
                    <button
                        className="btn btn-warning mr-2"
                        onClick={playPause}
                    ><h1 className="display-1">
                        {icon}
                    </h1>
                    </button>
                </div>
                <button
                    className="btn btn-sm btn-warning start"
                    onClick={seekStart}
                ><i className="fas fa-fast-backward"></i>
                </button>
                <button
                    className="btn btn-sm btn-warning skip"
                    onClick={seekSkip}
                ><i className="fas fa-forward"></i>
                </button>
                <div className="col-auto controls">
                    <label className="mb-0 mt-1 mx-1 font-1" htmlFor="volume">{volDisplay}</label>
                    <input
                        list="v-tick"
                        name="volume"
                        title="volume"
                        type="range"
                        className="form-control-range mt-1 ml-1"
                        orient="vertical"
                        onChange={e => handleVolume(e)}
                        onMouseDown={e => setVolDisplay(`${e.target.valueAsNumber * 100}%`)}
                        onMouseUp={() => setVolDisplay("vol")}
                        min={0}
                        max={1}
                        step={0.1}
                        value={volume}
                    />
                    <datalist id="v-tick">
                        {showTicks(0, 1, 0.1)}
                    </datalist>
                </div>

                <div className="col-auto controls">
                    <label
                        className="mb-0 mt-1 mx-1 font-1"
                        htmlFor="rate"
                        onDoubleClick={inputRate}
                        >{rateDisplay}
                    </label>
                    <input
                        list="r-tick"
                        name="rate"
                        title="rate"
                        type="range"
                        className="form-control-range mt-1 ml-1"
                        orient="vertical"
                        onChange={e => handleRate(e)}
                        onMouseDown={(e) => setRateDisplay(e.target.value + 'x')}
                        onMouseUp={() => setRateDisplay("rate")}
                        min={0.5}
                        max={2}
                        step={0.01}
                        value={rate}
                    />
                    <datalist id="r-tick">
                        <option value="0.5"></option>
                        <option value="1"></option>
                        <option value="2"></option>
                    </datalist>
                </div>

                <div className="overflow-auto">
                    <div className="card-body pt-3 pb-0 pr-0 pl-2">
                        <h5 className="card-title mb-0">{audient.title}</h5>
                        <div className="card-text">
                            <p className="font-1"><i>{audient.artist}</i></p>
                            <p className="font-1">{format(duration)}</p>
                            <p className="text-muted small">{audient.description}</p>
                        </div>
                    </div>
                </div>
                <div className="col col-wave">
                    <div className="card-body pb-0">
                        <ReactWaves
                            onReady={(wavesurfer) => handleLoad(wavesurfer)}
                            audioFile={audient.src}
                            className="react-waves"
                            onPosChange={updateDuration}
                            options={{
                                audioRate: rate,
                                barHeight: 1,
                                barWidth: 3,
                                barRadius: 3,
                                cursorWidth: 2,
                                height: 101,
                                hideScrollbar: false,
                                progressColor: "#EC407A",
                                responsive: true,
                                waveColor: "#D1D6DA",
                                hideScrollbar: true,
                            }}
                            volume={volume}
                            playing={isPlaying}
                        />
                    </div>
                </div>
            </div>
            <Dropdown
                handleLooping={handleLooping}
                audient={audient}
            />
        </div>
    )
}
