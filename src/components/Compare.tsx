import { useState, useEffect } from "react";

export default function Compare() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="pad" style={{ padding: isMobile ? '3rem 1rem' : undefined }}>
      <div className="wrap reveal">
        <div style={{ 
          textAlign: 'center', 
          maxWidth: '560px', 
          margin: isMobile ? '0 auto 2.5rem' : '0 auto 4rem' 
        }}>
          <span className="sec-tag">Сравнение</span>
          <h2 className="sec-h2" style={{ fontSize: isMobile ? '1.8rem' : undefined }}>
            Мы против
            <br />
            <em>бутилированной</em> воды
          </h2>
        </div>

        {/* Контейнер для адаптации таблицы */}
        <div style={{
          width: '100%',
          overflowX: isMobile ? 'auto' : 'visible',
          WebkitOverflowScrolling: 'touch', // плавный скролл на iOS
          paddingBottom: isMobile ? '1rem' : '0'
        }}>
          <table className="cmp-table" style={{ 
            width: '100%', 
            minWidth: isMobile ? '650px' : 'auto', // предотвращает сжатие колонок на мобилках
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr>
                <th style={{ fontSize: isMobile ? '.85rem' : undefined }}>Критерий</th>
                <th style={{ fontSize: isMobile ? '.85rem' : undefined }}>Вода для всех</th>
                <th style={{ fontSize: isMobile ? '.85rem' : undefined }}>Бутилированная</th>
                <th style={{ fontSize: isMobile ? '.85rem' : undefined }}>Только кулер</th>
              </tr>
            </thead>
            <tbody>
              <tr className="cmp-ours">
                <td>Стоимость / 100 чел. в год</td>
                <td className="hi">от 60 000 ₸</td>
                <td className="lo">400 000+ ₸</td>
                <td>180 000 ₸</td>
              </tr>
              <tr>
                <td>Качество очистки</td>
                <td className="hi">ВОЗ, СанПиН</td>
                <td>Непостоянное</td>
                <td>Базовое</td>
              </tr>
              <tr>
                <td>Вода 24/7</td>
                <td className="hi">✓ Да</td>
                <td className="lo">✗ По запасам</td>
                <td>Частично</td>
              </tr>
              <tr>
                <td>Пластиковые отходы</td>
                <td className="hi">Нет</td>
                <td className="lo">40 000+ бутылок</td>
                <td>Есть</td>
              </tr>
              <tr>
                <td>Техобслуживание</td>
                <td className="hi">✓ Включено</td>
                <td className="lo">—</td>
                <td className="lo">Не включено</td>
              </tr>
              <tr>
                <td>Срок установки</td>
                <td className="hi">1 день</td>
                <td className="lo">Постоянные доставки</td>
                <td>2–3 дня</td>
              </tr>
              <tr>
                <td>Гарантия качества</td>
                <td className="hi">✓ Лаб. контроль</td>
                <td className="lo">✗ Нет</td>
                <td className="lo">✗ Нет</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Маленькая подсказка для пользователя на мобилке (опционально) */}
        {isMobile && (
          <div style={{ 
            textAlign: 'center', 
            fontSize: '0.7rem', 
            color: 'rgba(159,192,212,0.4)', 
            marginTop: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            Листайте таблицу вправо →
          </div>
        )}
      </div>
    </section>
  );
}