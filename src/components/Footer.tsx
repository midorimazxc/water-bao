import { useState } from "react";
import Modal from "./Modal";

export default function Footer() {
  const [modal, setModal] = useState<string | null>(null);

  // ✅ определяем устройство
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  return (
    <>
      <footer>
        <div>
          <span className="flogo">
            Вода <em>для всех</em>
          </span>

          <p className="fdesc">
            Поставка и установка питьевых фонтанчиков и систем очистки воды для учреждений по всему Казахстану.
          </p>

          {/* СОЦ КНОПКИ */}
          <div className="social-footer">
            <button onClick={() => window.open("https://instagram.com/yourpage", "_blank")}>
              📷
            </button>

            <button onClick={() => setModal("whatsapp")}>
              💬
            </button>

            <button onClick={() => setModal("email")}>
              📧
            </button>

            <button onClick={() => setModal("phone")}>
              📞
            </button>
          </div>
        </div>

        <div className="fc">
          <h4>Продукты</h4>
          <ul>
            <li><a href="#">Питьевые фонтанчики</a></li>
            <li><a href="#">Пурификаторы воды</a></li>
            <li><a href="#">Замена фильтров</a></li>
            <li><a href="#">Сервисный договор</a></li>
          </ul>
        </div>

        <div className="fc">
          <h4>Клиенты</h4>
          <ul>
            <li><a href="#">Школы и университеты</a></li>
            <li><a href="#">Больницы и клиники</a></li>
            <li><a href="#">Офисы и БЦ</a></li>
            <li><a href="#">Госучреждения</a></li>
          </ul>
        </div>

        <div className="fc">
          <h4>Компания</h4>
          <ul>
            <li><a href="#">О нас</a></li>
            <li><a href="#">Сертификаты</a></li>
            <li><a href="#contact">Контакты</a></li>
            <li><a href="#">Рассчитать стоимость</a></li>
          </ul>
        </div>
      </footer>

      <div className="fbot">
        <span>© 2025 Вода для всех. Все права защищены.</span>
        <span>г. Алматы, Казахстан</span>
      </div>

      {/* === МОДАЛКИ === */}

      {/* WhatsApp */}
      <Modal isOpen={modal === "whatsapp"} onClose={() => setModal(null)}>
        <h2 style={{ marginBottom: 10 }}>Связь через WhatsApp</h2>

        <p style={text}>
          Напишите нам — ответим максимально быстро и проконсультируем по всем вопросам.
        </p>

        <a href="https://wa.me/77767306846" target="_blank" style={btn}>
          Написать в WhatsApp
        </a>
      </Modal>

      {/* Email */}
      <Modal isOpen={modal === "email"} onClose={() => setModal(null)}>
        <h2 style={{ marginBottom: 10 }}>Связь по почте</h2>

        <p style={text}>
          Отправьте нам письмо — ответим в ближайшее время.
        </p>

        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=ryfat5mart2007@gmail.com"
          target="_blank"
          style={btn}
        >
          Написать на Gmail
        </a>

        <p style={emailText}>
          📩 ryfat5mart2007@gmail.com
        </p>
      </Modal>

      {/* Phone */}
      <Modal isOpen={modal === "phone"} onClose={() => setModal(null)}>
        <h2 style={{ marginBottom: 10 }}>Связь по телефону</h2>

        <p style={text}>
          Свяжитесь с нами удобным способом.
        </p>

        {isMobile ? (
          <a href="tel:+77767306846" style={btn}>
            Позвонить
          </a>
        ) : (
          <div style={phoneBox}>
            📞 +7 776 730 68 46
          </div>
        )}
      </Modal>
    </>
  );
}

/* === СТИЛИ === */

const btn: React.CSSProperties = {
  display: "block",
  textAlign: "center",
  background: "linear-gradient(135deg, #00c8ff, #00e5cc)",
  color: "#04111f",
  padding: "12px",
  borderRadius: "30px",
  textDecoration: "none",
  fontWeight: 500,
  letterSpacing: "0.08em",
};

const text: React.CSSProperties = {
  color: "#9fc0d4",
  marginBottom: 20,
  lineHeight: "1.6",
};

const emailText: React.CSSProperties = {
  marginTop: 15,
  fontSize: 13,
  color: "#6f9bb3",
};

const phoneBox: React.CSSProperties = {
  marginTop: 10,
  padding: "14px",
  borderRadius: "14px",
  textAlign: "center",
  fontSize: "16px",
  letterSpacing: "0.08em",
  color: "#00c8ff",
  border: "1px solid rgba(0,200,255,0.25)",
  background: "rgba(0,200,255,0.05)",
};