const brandColor = '#18324a';
const danger = '#d9534f';
const warning = '#f0ad4e';
const success = '#5cb85c';
const getBrandColorByOpacity = (transparency: number) =>
  `rgba(24,50,74,${transparency})`;
export default {
  brandColor,
  danger,
  warning,
  success,
  getBrandColorByOpacity,
};
