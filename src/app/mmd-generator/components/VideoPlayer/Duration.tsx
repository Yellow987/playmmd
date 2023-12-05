import { format } from "date-fns";
import { Text } from "@chakra-ui/react";
import { useState } from "react";

interface Props {
  second: number;
  endSecond: number;
}
function Duration(props: Props) {
  function formatSecondsToMMSS(seconds: number): string {
    return format(new Date(0, 0, 0, 0, 0, seconds), "mm:ss");
  }
  const { second, endSecond } = props;

  return (
    <Text minWidth="50px" textAlign="center">
      {formatSecondsToMMSS(second)}/{formatSecondsToMMSS(endSecond)}
    </Text>
  );
}

export default Duration;
