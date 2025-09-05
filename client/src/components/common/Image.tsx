import { useState, type HTMLProps, type ReactNode } from "react"

type ImageProps = HTMLProps<HTMLImageElement> & {
  fallback?:  ReactNode
}

export function Image(props: ImageProps) {
  const { fallback = null } = props;

  const [isBroken, setIsBroken] = useState(false);

  function handleError() {
    setIsBroken(true)
  }

  if (isBroken) {
    return fallback;
  }

  return <img onError={handleError} {...props} />
}