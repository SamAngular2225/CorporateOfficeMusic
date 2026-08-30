import { useEffect, useRef, useState } from "react";

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

import YouTube from "react-youtube";

import "./MusicPlayer.css";


/* ==========================================
   YOUTUBE PLAYLIST
========================================== */

const PLAYLIST_ID = "PLSOFlsBoq91o";


const MusicPlayer = () => {

  const playerRef = useRef(null);


  const [isReady, setIsReady] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);


  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);


  const [volume, setVolume] = useState(70);

  const [isMuted, setIsMuted] = useState(false);


  const [currentVideo, setCurrentVideo] = useState(null);


  /* ==========================================
     YOUTUBE PLAYER OPTIONS
  ========================================== */

  const playerOptions = {

    height: "0",

    width: "0",

    playerVars: {

      autoplay: 0,

      controls: 0,

      disablekb: 1,

      fs: 0,

      playsinline: 1,

      rel: 0,

    },
  };


  /* ==========================================
     PLAYER READY
  ========================================== */

  const handleReady = (event) => {

    const player = event.target;

    playerRef.current = player;


    /* Set volume */

    player.setVolume(volume);


    /* Load playlist */

    player.loadPlaylist({
      listType: "playlist",
      list: PLAYLIST_ID,
      index: 0,
    });


    setIsReady(true);


    /*
     * Give YouTube a moment to load
     * the first playlist video.
     */

    setTimeout(() => {

      updateVideoInfo(player);

      try {

        const total =
          player.getDuration();

        setDuration(total || 0);

      } catch {
        // Player still loading
      }

    }, 1000);

  };


  /* ==========================================
     PLAYER STATE CHANGE
  ========================================== */

  const handleStateChange = (event) => {

    const state = event.data;


    /* PLAYING */

    if (state === 1) {

      setIsPlaying(true);

      updateVideoInfo(event.target);

    }


    /* PAUSED */

    if (state === 2) {

      setIsPlaying(false);

    }


    /* ENDED */

    if (state === 0) {

      setIsPlaying(false);


      setTimeout(() => {

        updateVideoInfo(event.target);

      }, 500);

    }

  };


  /* ==========================================
     GET CURRENT VIDEO INFORMATION
  ========================================== */

  const updateVideoInfo = (player) => {

    if (!player) return;


    try {

      const videoData =
        player.getVideoData();


      if (!videoData) return;


      setCurrentVideo({

        title:
          videoData.title ||
          "Corporate Playlist",

        author:
          videoData.author ||
          "YouTube",

        videoId:
          videoData.video_id ||
          "",

      });

    } catch (error) {

      console.error(
        "Unable to get YouTube video information:",
        error
      );

    }

  };


  /* ==========================================
     PLAY / PAUSE
  ========================================== */

  const togglePlay = () => {

    if (!playerRef.current || !isReady) {
      return;
    }


    if (isPlaying) {

      playerRef.current.pauseVideo();

    } else {

      playerRef.current.playVideo();

    }

  };


  /* ==========================================
     PREVIOUS
  ========================================== */

  const previousTrack = () => {

    if (!playerRef.current || !isReady) {
      return;
    }


    playerRef.current.previousVideo();


    setTimeout(() => {

      updateVideoInfo(playerRef.current);

    }, 700);

  };


  /* ==========================================
     NEXT
  ========================================== */

  const nextTrack = () => {

    if (!playerRef.current || !isReady) {
      return;
    }


    playerRef.current.nextVideo();


    setTimeout(() => {

      updateVideoInfo(playerRef.current);

    }, 700);

  };


  /* ==========================================
     UPDATE PROGRESS
  ========================================== */

  useEffect(() => {

    const interval =
      setInterval(() => {

        if (
          !playerRef.current ||
          !isPlaying
        ) {
          return;
        }


        try {

          const current =
            playerRef.current
              .getCurrentTime();


          const total =
            playerRef.current
              .getDuration();


          setCurrentTime(
            current || 0
          );


          setDuration(
            total || 0
          );

        } catch {

          // Player not ready

        }

      }, 500);


    return () => {

      clearInterval(interval);

    };

  }, [isPlaying]);


  /* ==========================================
     SEEK
  ========================================== */

  const handleProgressChange = (event) => {

    if (!playerRef.current) {
      return;
    }


    const newTime =
      Number(event.target.value);


    playerRef.current.seekTo(
      newTime,
      true
    );


    setCurrentTime(newTime);

  };


  /* ==========================================
     VOLUME
  ========================================== */

  const handleVolumeChange = (event) => {

    const newVolume =
      Number(event.target.value);


    setVolume(newVolume);


    if (!playerRef.current) {
      return;
    }


    playerRef.current.setVolume(
      newVolume
    );


    if (newVolume === 0) {

      playerRef.current.mute();

      setIsMuted(true);

    } else {

      playerRef.current.unMute();

      setIsMuted(false);

    }

  };


  /* ==========================================
     MUTE / UNMUTE
  ========================================== */

  const toggleMute = () => {

    if (!playerRef.current) {
      return;
    }


    if (isMuted) {

      playerRef.current.unMute();

      playerRef.current.setVolume(
        volume || 70
      );

      setIsMuted(false);

    } else {

      playerRef.current.mute();

      setIsMuted(true);

    }

  };


  /* ==========================================
     FORMAT TIME
  ========================================== */

  const formatTime = (time) => {

    if (
      !time ||
      Number.isNaN(time)
    ) {

      return "0:00";

    }


    const minutes =
      Math.floor(time / 60);


    const seconds =
      Math.floor(time % 60)
        .toString()
        .padStart(2, "0");


    return `${minutes}:${seconds}`;

  };


  return (

    <>

      {/* ==========================================
          HIDDEN YOUTUBE PLAYER
      ========================================== */}

      <div className="youtube-hidden-player">

        <YouTube
          opts={playerOptions}
          onReady={handleReady}
          onStateChange={handleStateChange}
        />

      </div>


      {/* ==========================================
          CUSTOM MUSIC PLAYER
      ========================================== */}

      <div className="music-player">


        {/* ==========================================
            ALBUM ART
        ========================================== */}

        <div className="album-art">

          {currentVideo?.videoId ? (

            <img
              src={`https://i.ytimg.com/vi/${currentVideo.videoId}/hqdefault.jpg`}
              alt={currentVideo.title}
            />

          ) : (

            <div className="youtube-placeholder">

              <span>♪</span>

            </div>

          )}

        </div>


        {/* ==========================================
            SONG INFORMATION
        ========================================== */}

        <div className="track-information">


          <div className="track-title">

            {currentVideo?.title ||
              "Corporate Majdoor Playlist"}

          </div>


          <div className="track-artist">

            {currentVideo?.author ||
              "YouTube Music"}

          </div>


          {/* PROGRESS */}

          <div className="progress-section">


            <span className="time">

              {formatTime(currentTime)}

            </span>


            <input
              className="progress-bar"
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              disabled={!isReady}
            />


            <span className="time">

              {formatTime(duration)}

            </span>


          </div>

        </div>


        {/* ==========================================
            CONTROLS
        ========================================== */}

        <div className="player-controls">


          {/* PREVIOUS */}

          <button
            className="player-icon"
            onClick={previousTrack}
            disabled={!isReady}
            aria-label="Previous song"
          >

            <SkipBack size={18} />

          </button>


          {/* PLAY / PAUSE */}

          <button
            className="play-button"
            onClick={togglePlay}
            disabled={!isReady}
            aria-label={
              isPlaying
                ? "Pause"
                : "Play"
            }
          >

            {isPlaying ? (

              <Pause
                size={21}
                fill="currentColor"
              />

            ) : (

              <Play
                size={21}
                fill="currentColor"
              />

            )}

          </button>


          {/* NEXT */}

          <button
            className="player-icon"
            onClick={nextTrack}
            disabled={!isReady}
            aria-label="Next song"
          >

            <SkipForward size={18} />

          </button>


        </div>


        {/* ==========================================
            VOLUME
        ========================================== */}

        <div className="volume-control">


          <button
            className="volume-button"
            onClick={toggleMute}
            aria-label={
              isMuted
                ? "Unmute"
                : "Mute"
            }
          >

            {isMuted ? (

              <VolumeX size={18} />

            ) : (

              <Volume2 size={18} />

            )}

          </button>


          <input
            className="volume-slider"
            type="range"
            min="0"
            max="100"
            value={
              isMuted
                ? 0
                : volume
            }
            onChange={
              handleVolumeChange
            }
          />


        </div>


      </div>

    </>

  );

};


export default MusicPlayer;