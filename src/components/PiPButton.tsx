import React from "react";
import Button from "@mui/material/Button";
import PictureInPictureAltIcon from "@mui/icons-material/PictureInPictureAlt";

interface PiPButtonProps {
  isAvailablePiP: boolean;
  clock: boolean;
  video: React.RefObject<HTMLVideoElement>;
  videoClock: React.RefObject<HTMLVideoElement>;
}

const PiPButton = React.forwardRef<HTMLButtonElement, PiPButtonProps>(
  ({ isAvailablePiP, clock, video, videoClock, ...props }, ref) => {
    const handleClick = async () => {
      try {
        if (clock) {
          if (videoClock.current && videoClock.current !== document.pictureInPictureElement) {
            await videoClock.current.requestPictureInPicture();
          } else {
            await document.exitPictureInPicture();
          }
        } else {
          if (video.current && video.current !== document.pictureInPictureElement) {
            await video.current.requestPictureInPicture();
          } else {
            await document.exitPictureInPicture();
          }
        }
      } catch (error) {
        console.log("ERROR", error);
      }
    };

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        disabled={!isAvailablePiP}
        startIcon={<PictureInPictureAltIcon />}
        {...props}
      >
        PiP
      </Button>
    );
  }
);

export { PiPButton };
