/* eslint-disable no-unused-vars */
const getImageUrl = (name) => {
  return new URL(`../assets/images/${name}`, import.meta.url).href;
};
const getIconUrl = (name) => {
  return new URL(`../assets/icons/${name}`, import.meta.url).href;
};
const getFileUrl = (name) => {
  return new URL(`../../public/${name}`, import.meta.url).href;
};

export { getImageUrl, getIconUrl, getFileUrl };
