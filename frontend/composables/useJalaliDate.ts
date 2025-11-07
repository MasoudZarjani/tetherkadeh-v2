export default function (date: string) {
  return (
    new Date(date).toLocaleDateString("fa-IR") +
    " " +
    new Date(date).toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}
