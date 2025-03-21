export const getRandomColor = () => {
  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#F033FF",
    "#FF33A8",
    "#33FFF6",
    "#FFD133",
    "#8C33FF",
    "#FF8C33",
    "#33FFBD",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
