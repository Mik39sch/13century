export const randomInt = ({ max, min }) => (
  Math.floor(Math.random() * max) + min
);

export const getTime = function () {
  return new Date().getTime();
}
