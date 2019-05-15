const randomChoice = (list, num) => (
  list
    .sort(() => 0.5 - Math.random())
    .slice(0, num)
);

export default randomChoice;
