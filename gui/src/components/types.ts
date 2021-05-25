export enum imageSource {
  url = 'url',
  file = 'file'
}

export enum transformations {
  saturate = "saturate",
  monochrome = "monochrome",
  brighten = "brighten",
  darken = "darken",
  sharpen = "sharpen"
};

export type transformHistoryItem = {
  url: string,
  timestamp: Date;
};