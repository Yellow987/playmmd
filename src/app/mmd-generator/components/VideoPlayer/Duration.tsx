import { format } from "date-fns";
import { Text } from "@chakra-ui/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

function Duration() {
  const second = useSelector((state: RootState) => state.mmd.second);
  const duration = useSelector(
    (state: RootState) => state.mmd.animationDuration,
  );

  function formatSecondsToMMSS(num: number): string {
    if (!Number.isFinite(num)) return "--:--";
    return format(new Date(0, 0, 0, 0, 0, num), "mm:ss");
  }

  return (
    <Text minWidth="50px" textAlign="center">
      {formatSecondsToMMSS(second)}/{formatSecondsToMMSS(duration)}
    </Text>
  );
}

export default Duration;
