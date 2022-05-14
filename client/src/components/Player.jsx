import React, { useEffect, useState, useRef } from "react";
import Dropdown from "./Dropdown";
import ReactWaves from "@dschoon/react-waves";
import Range from "./Range";

const play = <i className="far fa-play-circle"></i>;
const pause = <i className="far fa-pause-circle"></i>;

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
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const Player = ({ audient }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [wavesurfer, setWavesurfer] = useState(null);
  const [icon, setIcon] = useState(play);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [rate, setRate] = useState(1);
  const [delay, setDelay] = useState(1000);
  const [looping, setLooping] = useState(true);
  const [djMode, setDjMode] = useState(false);

  const handleLoad = ({ wavesurfer }) => {
    setWavesurfer(wavesurfer);
    setDuration(Math.round(wavesurfer.getDuration()));
  };

  const playPause = () => {
    if(djMode){
      seekStart();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
      wavesurfer.on("play", () => setIcon(pause));
      wavesurfer.on("pause", () => setIcon(play));
    }
  };

  const updateDuration = () => {
    setDuration(
      Math.floor(wavesurfer.getDuration() - wavesurfer.getCurrentTime())
    );
  };

  const handleRate = (value) => {
    setDelay(value ** -1 * 1000);
    setRate(value);
  };

  const seekStart = () => {
    if (isPlaying && !djMode) {
      playPause();
    }
    wavesurfer.seekTo(0);
    setDuration(Math.round(wavesurfer.getDuration()));
  };

  const seekSkip = () => {
    const d = wavesurfer.getDuration();
    d > 60 ? wavesurfer.skip(Math.sqrt(d)) : wavesurfer.skip(d / 8);
    updateDuration();
  };

  useInterval(() => {
    if (isPlaying) {
      updateDuration();
      wavesurfer.on("finish", () => {
        setDuration(Math.round(wavesurfer.getDuration()));
        if (!looping) {
          setIsPlaying(false);
          wavesurfer.seekTo(0);
        } else setIsPlaying(true);
      });
    }
  }, delay);

  const format = (duration) => {
    const mins = duration <= 0 ? 0 : Math.floor(duration / 60);
    const secs = duration <= 0 ? 0 : duration - mins * 60;
    const timeString =
      mins.toString().padStart(2, "0") + ":" + secs.toString().padStart(2, "0");
    return timeString;
  };

  return (
    <div className="card mb-5 font-2">
      <div className="row no-gutters">
        <div className="col-auto">
          <button className="btn btn-warning mr-2" onClick={playPause}>
            <h1 className="display-1">{icon}</h1>
          </button>
        </div>
        <button className="btn btn-sm btn-warning start" onClick={seekStart}>
          <i className="fas fa-fast-backward"></i>
        </button>
        <button className="btn btn-sm btn-warning skip" onClick={seekSkip}>
          <i className="fas fa-forward"></i>
        </button>
        <Range
          name="vol"
          min={0}
          max={1}
          step={0.01}
          tickStep={0.1}
          value={volume}
          handler={(value) => setVolume(value)}
          displayStyle="percent"
        />
        <Range
          name="rate"
          min={0.5}
          max={2}
          step={0.01}
          tickStep={0.5}
          value={rate}
          handler={handleRate}
        />

        <div className="overflow-auto">
          <div className="card-body pt-3 pb-0 pr-0 pl-2">
            <h5 className="card-title mb-0">{audient.title}</h5>
            <div className="card-text">
              <p className="font-1">
                <i>{audient.artist}</i>
              </p>
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
        audient={audient}
        handleLooping={() => {
            setLooping(!looping)
            setDjMode(false)
          }
        }
        handleDjMode={() => {
            setDjMode(!djMode)
            setLooping(false)
          }
        }
      />
    </div>
  );
};
