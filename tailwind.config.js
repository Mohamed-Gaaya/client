module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Ensure Tailwind scans your files
  theme: {
      extend: {colors: {
        customBlue: "#70c6e5",
        customPink:"#ae4eb9",
        customGrey:"#8b90d0",
        customDark:"#353353",
      },},
  },
  plugins: [],
};
