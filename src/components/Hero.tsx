import { useState } from "react";
import Modal from "./Modal";

export default function Hero() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async () => {
    if (!name || !phone) {
      alert("Заполни все поля");
      return;
    }

    const digits = phone.replace(/\D/g, "");

    if (digits.length !== 11) {
      alert("Введите полный номер телефона");
      return;
    }

    const text = `
🔥 Новая заявка
👤 ФИО: ${name}
📞 Телефон: +${digits}
    `;

    try {
      const res = await fetch(
        "https://dpbyblauovgdabyyrfai.supabase.co/functions/v1/send-telegram",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Ошибка сервера");
      }

      alert("Заявка отправлена 🚀");
      setOpen(false);
      setName("");
      setPhone("");

    } catch (error) {
      alert("Ошибка отправки ❌");
      console.error(error);
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-eyebrow">
          Питьевая вода · Казахстан · ВОЗ · СанПиН
        </p>

        <h1 className="hero-title">
          Чистая вода.<br />
          <em className="line2">Везде.</em>
        </h1>

        <p className="hero-sub">
          Поставляем и устанавливаем питьевые фонтанчики и системы очистки воды
          для школ, больниц, офисов и государственных учреждений по всему Казахстану.
        </p>

        <div className="hero-btns">
          <button className="btn-p" onClick={() => setOpen(true)}>
            Оставить заявку
          </button>

          <button className="btn-g">Наши продукты</button>
        </div>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <h2 style={title}>Оставить заявку</h2>
        <p style={subtitle}>
          Мы свяжемся с вами в течение 5 минут
        </p>

        {/* ФИО */}
        <input
          type="text"
          placeholder="Иванов Иван Иванович"
          value={name}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[a-zA-Zа-яА-ЯёЁ\s]*$/.test(value)) {
              setName(value);
            }
          }}
          style={inputStyle}
        />

        {/* Телефон */}
        <input
          type="tel"
          placeholder="+7 (707) 730-68-46"
          value={phone}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, "");

            if (value.startsWith("8")) {
              value = "7" + value.slice(1);
            }

            if (!value.startsWith("7")) {
              value = "7" + value;
            }

            value = value.slice(0, 11);

            let formatted = "+7";
            if (value.length > 1) formatted += ` (${value.slice(1, 4)}`;
            if (value.length >= 4) formatted += `) ${value.slice(4, 7)}`;
            if (value.length >= 7) formatted += `-${value.slice(7, 9)}`;
            if (value.length >= 9) formatted += `-${value.slice(9, 11)}`;

            setPhone(formatted);
          }}
          style={inputStyle}
        />

        <button onClick={handleSubmit} style={btnStyle}>
          Отправить заявку
        </button>
      </Modal>

      <div className="scroll-cue">
        <div className="scroll-line"></div>
        <span>Смотреть</span>
      </div>
    </section>
  );
}

const title: React.CSSProperties = {
  marginBottom: "6px",
  fontSize: "24px",
  fontWeight: 600,
  color: "#00d4ff",
};

const subtitle: React.CSSProperties = {
  marginBottom: "18px",
  color: "#9fb3c8",
  fontSize: "14px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid rgba(0, 200, 255, 0.2)",
  background: "#081f33",
  color: "#fff",
  outline: "none",
};

const btnStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #00d4ff, #00aaff)",
  color: "#001018",
  fontWeight: 600,
  cursor: "pointer",
};