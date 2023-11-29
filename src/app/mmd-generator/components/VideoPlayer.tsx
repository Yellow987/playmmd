"use client";
import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./VideoPlayer.module.css";

const VideoPlayer = () => {
  const videoNode = useRef(null);

  useEffect(() => {
    if (!videoNode.current) return;
    const player = videojs(videoNode.current, {
      controls: true,
      autoplay: false,
      preload: "auto",
      controlBar: {
        // Include the components you want, omit 'playToggle'
        volumePanel: { inline: false },
        currentTimeDisplay: true,
        timeDivider: true,
        durationDisplay: true,
        remainingTimeDisplay: true,
        progressControl: true,
        fullscreenToggle: true,
        playbackRateMenuButton: true,
      },
    });

    //onPlayerReady(player);
    player.tech().el();

    return () => {
      player.dispose();
    };
  }, []);

  return (
    <div data-vjs-player>
      <div className="none">TESTING</div>
      <video ref={videoNode} className="video-js" />
    </div>
  );
};

export default VideoPlayer;
