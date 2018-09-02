module.exports = {
  cache: {
    cacheId: "keyword-lookup",
    runtimeCaching: [
      {
        handler: "fastest",
        urlPattern: "/$"
      }
    ],
    staticFileGlobs: ["dist/**/*"]
  },
  manifest: {
    background: "#FFFFFF",
    title: "keyword-lookup",
    short_name: "PWA",
    theme_color: "#FFFFFF"
  }
};
