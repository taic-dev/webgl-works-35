export type ElementPositionAndSize = {
  dom: { width: number; height: number; x: number; y: number };
};

export type ImagePositionAndSize = {
  image: { src: string; width: number; height: number };
} & ElementPositionAndSize;

export type PositionAndSize = ElementPositionAndSize | ImagePositionAndSize;

export const getElementCoordinates = (rect: DOMRect) => {
  const x = rect.left - window.innerWidth / 2 + rect.width / 2;
  const y = -rect.top + window.innerHeight / 2 - rect.height / 2;

  return { x, y };
};

export const getElementPositionAndSize = (
  element: HTMLElement
): ElementPositionAndSize => {
  const rect = element.getBoundingClientRect();
  const { width, height } = rect;
  const { x, y } = getElementCoordinates(rect);

  return { dom: { width, height, x, y } };
};

export const getImagePositionAndSize = (
  element: HTMLImageElement
): ImagePositionAndSize => {
  const { src, naturalWidth, naturalHeight } = element;

  return {
    image: { src, width: naturalWidth, height: naturalHeight },
    ...getElementPositionAndSize(element),
  };
};
