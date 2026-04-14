import { useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={overlay} onClick={onClose}>
      <div className="modal" style={modal} onClick={(e) => e.stopPropagation()}>
        <button
          style={closeBtn}
          onClick={onClose}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#00c8ff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}

/* === СТИЛИ === */

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(5, 15, 30, 0.85)",
  backdropFilter: "blur(10px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
  animation: "fadeIn 0.25s ease",
};

const modal: React.CSSProperties = {
  background: "linear-gradient(145deg, #061a2b, #0b2a44)",
  padding: "30px",
  borderRadius: "20px",
  width: "100%",
  maxWidth: "420px",
  maxHeight: "80vh",
  overflowY: "auto",
  overflowX: "hidden",
  position: "relative",
  boxShadow: "0 25px 100px rgba(0, 200, 255, 0.2)",
  border: "1px solid rgba(0, 200, 255, 0.2)",
  color: "#fff",
  animation: "scaleIn 0.25s ease",
  transform: "translateY(0)",
};

const closeBtn: React.CSSProperties = {
  position: "absolute",
  top: "12px",
  right: "14px",
  border: "none",
  background: "transparent",
  color: "#aaa",
  fontSize: "20px",
  cursor: "pointer",
  transition: "0.3s",
};