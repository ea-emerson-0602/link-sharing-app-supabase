import { FaGithub, FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";

export const platformColors = {
  GitHub: "#333",
  Facebook: "#4267B2",
  Instagram: "#C13584",
  YouTube: "#FF0000",
  LinkedIn: "#0077B5",
};

export const platformIcons = {
  GitHub: FaGithub,
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  YouTube: FaYoutube,
  LinkedIn: FaLinkedin,
};

export const linkTypes = Object.keys(platformColors).map((type) => ({
  type,
  icon: platformIcons[type],
}));
