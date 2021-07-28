export interface Theme {
    name: string;
    properties: any;
  }
  
  export const light: Theme = {
    name: "light",
    properties: {
      "--foreground-default": "#08090A",
      "--foreground-secondary": "#41474D",
      "--foreground-tertiary": "#e9ecef",
      "--foreground-quaternary": "#F4FAFF",
      "--bg-handler": "rgba(126, 140, 168, 0.432)",
  
      "--background-default": "#0071C5",
      "--background-navbar": "#F3F3F3",
      "--background-table": "#F3F3F3",
      "--background-view": "#f1f1f1",
      "--background-thead": "#8b8787",
      "--background-light": "#ffffff",
      "--backgroundLight-image-body":  "url(assets/images/bkg-blu.jpg)",
      "--bg-color-body": "#e9ecef",
  
      "--color-default": "#5DFDCB",
      "--color-dark": "#000000",
      "--color-light": "#FFFFFF",
  
      "--error-default": "#EF3E36",
      "--error-dark": "#800600",
      "--error-light": "#FFCECC",
  
      "--background-tertiary-shadow": "0 1px 3px 0 rgba(92, 125, 153, 0.5)"
    }
  };
  
  export const dark: Theme = {
    name: "dark",
    properties: {
      "--foreground-default": "#5C7D99",
      "--foreground-secondary": "#A3B9CC",
      "--foreground-tertiary": "#33343a",
      "--foreground-quaternary": "#E5E5E5",
      "--bg-handler": "#60718270",

      "--background-default": "rgb(14 40 51 / 23%)",
      "--background-navbar": "#262626",
      "--background-table": "#2A2B30",
      "--background-view": "#54585d82",
      "--background-thead": "#252525",
      "--background-light": "#ffffff",
      "--backgroundLight-image-body": "#1A202E",
      "--bg-color-body": "#1A202E",
  
      "--color-default": "#ffffff",
      "--color-dark": "#F7F7F7",
      "--color-light": "#ffffff",
  
      "--error-default": "#EF3E36",
      "--error-dark": "#800600",
      "--error-light": "#FFCECC",
  
      "--background-tertiary-shadow": "0 1px 3px 0 rgba(8, 9, 10, 0.5)"
    }
  }