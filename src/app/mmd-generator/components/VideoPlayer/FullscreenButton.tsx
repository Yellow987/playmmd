import { IconButton } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setIsFullscreen } from "@/redux/controls";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";

function FullscreenButton() {
  const dispatch = useDispatch();
  const isFullscreen = useSelector(
    (state: RootState) => state.controls.isFullscreen,
  );

  const toggleFullscreen = () => {
    dispatch(setIsFullscreen(!isFullscreen));
  };

  return (
    <IconButton
      aria-label="Fullscreen"
      icon={isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
      variant="ghost"
      onClick={toggleFullscreen}
    />
  );
}

export default FullscreenButton;
