import { useState, useEffect } from "react";
import {
  isAndroid,
  isIPad13,
  isIPhone13,
  isWinPhone,
  isMobileSafari,
  isTablet,
} from "react-device-detect";

export function isTouchDevice() {
  if (typeof window === "undefined") {
    return false;
  }
  const prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
  function mq(query: any) {
    return typeof window !== "undefined" && window.matchMedia(query).matches;
  }
  // @ts-ignore
  if ("ontouchstart" in window || window?.DocumentTouch) {
    return true;
  }

  // include the 'heartz' - https://git.io/vznFH
  const query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join(
    ""
  );
  return mq(query);
}

export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(
      isTouch ||
        isAndroid ||
        isIPad13 ||
        isIPhone13 ||
        isWinPhone ||
        isMobileSafari ||
        isTablet ||
        isTouchDevice()
    );
  }, []);

  return isTouch;
}
