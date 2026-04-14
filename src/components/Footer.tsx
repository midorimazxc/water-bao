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
          <div id="contact" className="social-footer">
<a 
  href="https://www.instagram.com/rafffff._.s/" 
  target="_blank" 
  rel="noopener noreferrer"
  aria-label="Instagram"
>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm0 2h10c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3zm5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-2.5a1 1 0 100 2 1 1 0 000-2z"/>
  </svg>
</a>

<button onClick={() => setModal("whatsapp")} aria-label="WhatsApp">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 00-8.94 14.47L2 22l5.68-1.05A10 10 0 1012 2zm0 18a8 8 0 01-4.28-1.24l-.3-.18-3.37.62.66-3.28-.2-.34A8 8 0 1112 20zm4.2-5.6c-.23-.11-1.35-.67-1.56-.75-.21-.08-.36-.11-.52.11-.15.23-.6.75-.73.9-.13.15-.26.17-.49.06-.23-.11-.96-.35-1.83-1.11-.68-.6-1.13-1.34-1.26-1.57-.13-.23-.01-.35.1-.46.1-.1.23-.26.34-.39.11-.13.15-.23.23-.38.08-.15.04-.28-.02-.39-.06-.11-.52-1.25-.71-1.71-.19-.46-.38-.39-.52-.4h-.44c-.15 0-.39.06-.6.28-.21.23-.8.78-.8 1.9 0 1.12.82 2.2.94 2.36.11.15 1.62 2.48 3.93 3.48.55.24.98.38 1.31.49.55.17 1.05.15 1.45.09.44-.07 1.35-.55 1.54-1.08.19-.53.19-.99.13-1.08-.06-.09-.21-.15-.44-.26z"/>
  </svg>
</button>

<button onClick={() => setModal("email")} aria-label="Email">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
</button>

<button onClick={() => setModal("phone")} aria-label="Phone">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.62 10.79a15.91 15.91 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.07 21 3 13.93 3 5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
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