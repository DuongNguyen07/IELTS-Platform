import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";

export default function Alert({ message, type = "error" }) {
  const styles = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-green-50 border-green-200 text-green-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
  };

  const icons = {
    error: <ErrorIcon fontSize="small" />,
    success: <CheckCircleIcon fontSize="small" />,
    info: <InfoIcon fontSize="small" />,
  };

  return (
    <div className={`flex items-center border px-4 py-3 rounded-lg mb-5 text-sm ${styles[type]}`}>
      <span className="mr-2">{icons[type]}</span>
      {message}
    </div>
  );
}
