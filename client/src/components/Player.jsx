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
    const [delay, setDelay] = useState(1000)
    const [rateDisplay, setRateDisplay] = useState("rate")
    const [looping, setLooping] = useState(false)

    const handleLoad = ({ wavesurfer }) => {
        setWavesurfer(wavesurfer);
        setDuration(Math.round(wavesurfer.getDuration()));
    }

    const handleClick = () => {
        setIsPlaying(!isPlaying);
        wavesurfer.on('play', () => setIcon(pause))
        wavesurfer.on('pause', () => setIcon(play))
        // console.log(wavesurfer.getPlaybackRate());
        // console.log(wavesurfer.getCurrentTime());
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

    const showTicks = (min, max, step) => {
        const arr = [];
        for (let i = min; i <= max; i += step) {
            arr.push(i);
        }
        return arr.map(x => <option key={x} value={x}></option>)
    }

    useInterval(() => {
        if (isPlaying) {
            setDuration(duration - 1);
            wavesurfer.on('finish', () => {
                setDuration(Math.round(wavesurfer.getDuration()));
                wavesurfer.seekTo(0)
                setIsPlaying(looping);
            })
        }
        // give this an inverse relationship.
        // rate at 2x should be a 500 delay, 0.5x should be a 2000 delay
    }, delay);

    const format = (duration) => {
        const mins = duration <= 0 ? 0 : Math.floor(duration / 60);
        const secs = duration <= 0 ? 0 : duration - (mins * 60);
        const timeString = mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
        return timeString;
    }

    return (
        <div className="card mb-5 font-2">
            <div className="row no-gutters">
                <div className="col-auto">
                    <button
                        className="btn btn-warning mr-2"
                        onClick={handleClick}
                    >
                        <h1 className="display-1">
                            {icon}
                        </h1>
                    </button>
                </div>

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
                    <label className="mb-0 mt-1 mx-1 font-1" htmlFor="rate">{rateDisplay}</label>
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
                                hideScrollbar: true
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
