// Theme Properties - colors for dark and light theme
export interface Theme {
  name: string;
  properties: any;
}

export const light: Theme = {
  name: "light",
  properties: {
    "--background-default": "#ffffff",
    "--background-table-title": "#ebebee",
    "--background-searchBox": "#ffffff",
    "--background-body": "#f0f3fb",
    "--background-mini-card": "#F5F5F5",

    "--color-default": "#f4faff",
    "--color-dark": "#212121",
    "--color-light": "#212121",
    "--color-theme-icon": "#212121",

    "--error-default": "#EF3E36",
    "--error-dark": "#800600",
    "--error-light": "#FFCECC",

    "--background-tertiary-shadow": "0 1px 3px 0 rgba(92, 125, 153, 0.5)"
  }
};

export const dark: Theme = {
  name: "dark",
  properties: {

    "--background-default": '#1A202E',
    "--background-table-title": "#020910",
    "--background-searchBox": "#12161F",
    "--background-body": "#232b3e",
    "--background-mini-card": "#212529",

    "--color-default": "#f4faff",
    "--color-dark": "#96A2AC",
    "--color-light": "#Ffffff",
    "--color-theme-icon": "yellow",


    "--error-default": "#EF3E36",
    "--error-dark": "#800600",
    "--error-light": "#FFCECC",

    "--background-tertiary-shadow": "0 1px 3px 0 rgba(8, 9, 10, 0.5)"
  }
}