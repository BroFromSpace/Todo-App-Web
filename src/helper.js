export default function getJWT() {
  if (localStorage.getItem("jwt")) return localStorage.getItem("jwt");

  if (sessionStorage.getItem("jwt")) return sessionStorage.getItem("jwt");
}
