import { Button } from "@mui/material";
import PictureInPictureAltIcon from "@mui/icons-material/PictureInPictureAlt";

type PiPButtonProps = {
  isAvailablePiP: boolean | undefined;
  clock: boolean;
  videoClock: any;
  video: any;
};

export const PiPButton = ({
  isAvailablePiP,
  clock,
  videoClock,
  video,
}: PiPButtonProps) => {
  return (
    <Button
      disabled={!isAvailablePiP}
      onClick={async () => {
        try {
          if (clock) {
            if (videoClock.current !== document.pictureInPictureElement) {
              await videoClock.current.requestPictureInPicture();
            } else {
              await document.exitPictureInPicture();
            }
          } else {
            if (video.current !== document.pictureInPictureElement) {
              await video.current.requestPictureInPicture();
            } else {
              await document.exitPictureInPicture();
            }
          }
        } catch (error) {
          console.log("ERROR", error);
        }
      }}
      startIcon={<PictureInPictureAltIcon />}
    >
      PiP
    </Button>
  );
};
