import { useEffect, useRef } from 'react';

// Импортируйте изображения (замените пути на ваши файлы)
import schoolImage from '../assets/school.jpg';
import hospitalImage from '../assets/hospital.jpg';
import officeImage from '../assets/office.jpg';
import governmentImage from '../assets/government.jpg';

function ClientCanvas({ hue }: { hue: number }) {
  // Код ClientCanvas оставляем, если хотите сохранить анимацию как фон
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.width = canvas.parentElement!.clientWidth;
    let H = canvas.height = canvas.parentElement!.clientHeight;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < 9; i++) {
        const p = ((t * 0.006 + i / 9) % 1);
        ctx.beginPath();
        ctx.ellipse(
          W / 2,
          H * 0.45 + p * H * 0.32,
          W * 0.44 * (1 - p * 0.5),
          W * 0.1 * (1 - p * 0.4),
          0,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = `hsla(${hue},75%,60%,${p * 0.45 * (1 - p)})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }
      t++;
      requestAnimationFrame(draw);
    };

    draw();
  }, [hue]);

  return <canvas ref={canvasRef} className="client-canvas"></canvas>;
}

// Массив данных клиентов
const clients = [
  {
    tag: 'Образование',
    title: 'Школы и университеты',
    text: 'Фонтанчики в коридорах, пурификаторы в столовых.',
    image: schoolImage,
    hue: 200,
  },
  {
    tag: 'Здравоохранение',
    title: 'Больницы и клиники',
    text: 'Медицинская чистота воды в палатах и зонах ожидания.',
    image: hospitalImage,
    hue: 160,
  },
  {
    tag: 'Бизнес',
    title: 'Офисы и бизнес-центры',
    text: 'Забота о сотрудниках. Идеально для ESG-стратегии.',
    image: officeImage,
    hue: 220,
  },
  {
    tag: 'Госсектор',
    title: 'Госучреждения и мэрии',
    text: 'Долгосрочные сервисные контракты. Полная документация.',
    image: governmentImage,
    hue: 35,
  },
];

export default function Clients() {
  return (
    <section id="clients" className="pad">
      <div className="wrap">
        <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 5rem' }} className="reveal">
          <span className="sec-tag">Наши клиенты</span>
          <h2 className="sec-h2">
            Решение для
            <br />
            <em>вашего</em> учреждения
          </h2>
        </div>
        <div className="clients-grid">
          {clients.map((client, index) => (
            <div key={index} className={`client-card ${index % 2 === 0 ? 'reveal' : 'reveal2'}`}>
              {/* Заменяем ClientCanvas на изображение */}
              <img src={client.image} alt={client.title} className="client-image" />
              {/* Если хотите сохранить анимацию как фон, оставьте ClientCanvas */}
              {/* <ClientCanvas hue={client.hue} /> */}
              <div className="client-overlay"></div>
              <div className="client-content">
                <span className="client-tag">{client.tag}</span>
                <div className="client-title">{client.title}</div>
                <p className="client-text">{client.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}