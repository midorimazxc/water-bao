import { useState, useEffect } from "react";
import { Calculator, TrendingDown, CheckCircle, X } from "lucide-react";

const ComparisonSection = () => {
  const [teamSize, setTeamSize] = useState<string>("");
  // Добавляем состояние для отслеживания мобильной версии
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const avgWeight = 70;
  const bottlePrice = 1100;
  const bottleVolume = 19;
  const purifierCost = 4;
  
  const dispenserPricePerLiter = bottlePrice / bottleVolume;
  const teamSizeNum = Number(teamSize) || 0;
  const dailyWaterPerPerson = (avgWeight * 30) / 1000;
  const monthlyWaterPerPerson = dailyWaterPerPerson * 22;
  const totalMonthlyWater = monthlyWaterPerPerson * teamSizeNum;
  const bottlesNeeded = Math.ceil(totalMonthlyWater / 19);
  const dispenserCost = bottlesNeeded * bottlePrice;
  const purifierTotalCost = totalMonthlyWater * purifierCost;
  const monthlySavings = Math.max(0, dispenserCost - purifierTotalCost);
  const savingsPercent = dispenserCost > 0 ? Math.round((monthlySavings / dispenserCost) * 100) : 0;

  const formatOrDash = (val: number | string, opts?: Intl.NumberFormatOptions) => {
    if (!teamSizeNum) return "—";
    if (typeof val === "string") return val || "—";
    if (!isFinite(val)) return "—";
    if (opts) return val.toLocaleString(undefined, opts);
    return val.toLocaleString();
  };

  const content = {
    title: "Калькулятор потребления воды",
    subtitle: "Рассчитайте экономию с пурифайером",
    calculator: {
      title: "Калькулятор потребления воды",
      formula: "Формула расчета: 30 мл на кг массы тела",
      teamSize: "Количество человек в офисе",
      dailyPerPerson: "Потребление в день на человека",
      monthlyTotal: "Общее потребление в месяц",
      bottlesNeeded: "Необходимо бутылей (19л)",
    },
    dispenser: {
      name: "Диспенсер",
      bottlePrice: "Стоимость 1 бутыли (19л)",
      bottlesPerMonth: "Кол-во бутылей в месяц",
      waterPrice: "Цена за литр воды",
      totalCost: "Общая сумма затрат/мес",
    },
    purifier: {
      name: "Пурифайер",
      waterPrice: "Цена за литр воды",
      totalCost: "Общая сумма затрат/мес",
    },
    savings: "Ежемесячная выгода от пурифайера составляет",
    benefits: {
      title: "Преимущества пурифайера",
      items: [
        "Экономия до 61.5% на расходах",
        "Неограниченное количество воды",
        "Отсутствие логистических проблем",
        "Экологичность - нет пластиковых бутылей",
        "Всегда свежая вода",
        "Контроль качества в реальном времени",
      ],
    },
  };

  return (
    <section className="pad" style={{ padding: isMobile ? '3rem 1rem' : undefined }}>
      <div className="wrap">
        <div style={{ 
          textAlign: 'center', 
          maxWidth: '560px', 
          margin: isMobile ? '0 auto 3rem' : '0 auto 5rem' 
        }} className="reveal">
          <span className="sec-tag">Калькулятор</span>
          <h2 className="sec-h2" style={{ fontSize: isMobile ? '1.8rem' : undefined }}>
            Докажем вам выгоду
            <br />
            <em>пурифайера</em>
          </h2>
        </div>

        {/* Input */}
        <div style={{
          padding: isMobile ? '1.5rem' : '2rem',
          borderRadius: '20px',
          border: '1px solid rgba(0,200,255,.15)',
          background: 'rgba(0,200,255,.03)',
          backdropFilter: 'blur(20px)',
          marginBottom: isMobile ? '2.5rem' : '4rem',
          maxWidth: '420px',
          margin: `0 auto ${isMobile ? '2.5rem' : '4rem'}`
        }}>
          <label style={{ display: 'block', fontSize: '.7rem', letterSpacing: '.16em', color: '#00c8ff', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: 600 }}>
            {content.calculator.teamSize}
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="введите число (напр. 30)"
            value={teamSize}
            onChange={(e) => {
              const onlyDigits = e.target.value.replace(/\D+/g, "");
              setTeamSize(onlyDigits);
            }}
            style={{
              width: '100%',
              padding: '1rem 1.4rem',
              border: '1px solid rgba(0,200,255,.3)',
              background: 'rgba(0,200,255,.06)',
              borderRadius: '10px',
              fontSize: isMobile ? '1rem' : '1.1rem',
              color: '#f0faff',
              outline: 'none',
              transition: 'all .3s',
              fontFamily: "'Outfit',sans-serif",
              fontWeight: 500
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0,200,255,.5)';
              e.currentTarget.style.background = 'rgba(0,200,255,.12)';
              e.currentTarget.style.boxShadow = '0 0 24px rgba(0,200,255,.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0,200,255,.3)';
              e.currentTarget.style.background = 'rgba(0,200,255,.06)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Сравнение: адаптивная сетка */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '1.5rem' : '2.4rem',
          marginBottom: isMobile ? '2.5rem' : '4rem',
          alignItems: 'start'
        }}>
          {/* ДИСПЕНСЕР */}
          <div style={{
            padding: isMobile ? '1.5rem' : '2.4rem',
            borderRadius: '20px',
            border: '2px solid rgba(255,100,100,.3)',
            background: 'rgba(255,100,100,.05)',
            backdropFilter: 'blur(16px)',
            position: 'relative',
            opacity: teamSizeNum ? 1 : 0.6,
            transform: teamSizeNum ? 'scale(1)' : 'scale(0.98)',
            transition: 'all .4s'
          }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1.2rem', color: '#ff6464', fontSize: '1.2rem' }}>✗</div>
            <h3 style={{ fontSize: '1.4rem', fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 300, color: '#f0faff', marginBottom: '1.8rem' }}>
              {content.dispenser.name}
            </h3>
            
            <div style={{ marginBottom: '1.6rem', paddingBottom: '1.6rem', borderBottom: '1px solid rgba(255,100,100,.15)' }}>
              <p style={{ fontSize: '.7rem', color: 'rgba(159,192,212,.5)', marginBottom: '.4rem', textTransform: 'uppercase', letterSpacing: '.1em' }}>
                Кол-во бутылей
              </p>
              <p style={{ fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: 700, color: '#ff6464' }}>
                {formatOrDash(bottlesNeeded)}
              </p>
            </div>

            <div style={{ marginBottom: '1.6rem', paddingBottom: '1.6rem', borderBottom: '1px solid rgba(255,100,100,.15)' }}>
              <p style={{ fontSize: '.7rem', color: 'rgba(159,192,212,.5)', marginBottom: '.4rem', textTransform: 'uppercase', letterSpacing: '.1em' }}>
                Цена за литр
              </p>
              <p style={{ fontSize: '1.3rem', fontWeight: 600, color: '#f0faff' }}>
                {teamSizeNum ? `${dispenserPricePerLiter.toFixed(0)} ₸/л` : "—"}
              </p>
            </div>

            <div style={{ 
              padding: '1.4rem', 
              background: 'rgba(255,100,100,.15)',
              borderRadius: '12px',
              border: '1px solid rgba(255,100,100,.25)'
            }}>
              <p style={{ fontSize: '.7rem', color: 'rgba(255,100,100,.7)', marginBottom: '.6rem', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 500 }}>
                Ежемесячно
              </p>
              <p style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', fontWeight: 700, color: '#ff6464' }}>
                {formatOrDash(dispenserCost)} ₸
              </p>
            </div>
          </div>

          {/* ПУРИФАЙЕР */}
          <div style={{
            padding: isMobile ? '1.5rem' : '2.4rem',
            borderRadius: '20px',
            border: '2px solid rgba(0,229,204,.4)',
            background: 'rgba(0,229,204,.08)',
            backdropFilter: 'blur(16px)',
            position: 'relative',
            transform: (teamSizeNum && !isMobile) ? 'scale(1.02)' : 'scale(1)',
            transition: 'all .4s',
            boxShadow: (teamSizeNum && !isMobile) ? '0 0 40px rgba(0,229,204,.15)' : 'none'
          }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1.2rem', color: '#00e5cc', fontSize: '1.2rem' }}>✓</div>
            <h3 style={{ fontSize: '1.4rem', fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 300, color: '#f0faff', marginBottom: '1.8rem' }}>
              {content.purifier.name}
            </h3>
            
            <div style={{ marginBottom: '1.6rem', paddingBottom: '1.6rem', borderBottom: '1px solid rgba(0,229,204,.15)' }}>
              <p style={{ fontSize: '.7rem', color: 'rgba(159,192,212,.5)', marginBottom: '.4rem', textTransform: 'uppercase', letterSpacing: '.1em' }}>
                Бутыли не нужны
              </p>
              <p style={{ fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: 700, color: '#00e5cc' }}>
                0
              </p>
            </div>

            <div style={{ marginBottom: '1.6rem', paddingBottom: '1.6rem', borderBottom: '1px solid rgba(0,229,204,.15)' }}>
              <p style={{ fontSize: '.7rem', color: 'rgba(159,192,212,.5)', marginBottom: '.4rem', textTransform: 'uppercase', letterSpacing: '.1em' }}>
                Цена за литр
              </p>
              <p style={{ fontSize: '1.3rem', fontWeight: 600, color: '#f0faff' }}>
                {purifierCost} ₸/л
              </p>
            </div>

            <div style={{ 
              padding: '1.4rem', 
              background: 'rgba(0,229,204,.12)',
              borderRadius: '12px',
              border: '1px solid rgba(0,229,204,.3)'
            }}>
              <p style={{ fontSize: '.7rem', color: '#00c8ff', marginBottom: '.6rem', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600 }}>
                Ежемесячно
              </p>
              <p style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', fontWeight: 700, color: '#00e5cc' }}>
                {formatOrDash(purifierTotalCost)} ₸
              </p>
            </div>
          </div>
        </div>

        {/* ВЫИГРЫШ */}
        {teamSizeNum ? (
          <div style={{
            padding: isMobile ? '2rem 1rem' : '3.2rem 2rem',
            background: 'linear-gradient(135deg, rgba(0,200,255,.12), rgba(0,229,204,.12))',
            border: '2px solid rgba(0,229,204,.3)',
            borderRadius: '24px',
            textAlign: 'center',
            marginBottom: isMobile ? '3rem' : '4rem',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: '.75rem', letterSpacing: '.16em', color: '#00c8ff', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: 600 }}>
                Экономия в месяц
              </p>
              <p style={{ fontSize: isMobile ? '2.4rem' : '3.6rem', fontWeight: 800, color: '#00e5cc', marginBottom: '.6rem', lineHeight: 1 }}>
                {monthlySavings.toLocaleString()} ₸
              </p>
              <p style={{ fontSize: isMobile ? '1rem' : '1.1rem', color: '#9fc0d4', marginBottom: '1.2rem' }}>
                Это <strong style={{ color: '#00e5cc', fontSize: isMobile ? '1.1rem' : '1.3rem' }}>{savingsPercent}%</strong> экономии
              </p>
              <p style={{ fontSize: '.85rem', color: 'rgba(159,192,212,.8)', lineHeight: 1.8 }}>
                При коллективе из <strong>{teamSizeNum}</strong> человек пурифайер дешевле на{' '}
                <br />
                <strong style={{ color: '#00e5cc' }}>
                  {(monthlySavings * 12).toLocaleString()} ₸ в год
                </strong>
              </p>
            </div>
          </div>
        ) : null}

        {/* Основные преимущества: сетка меняется с 3 в ряд на 1 */}
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: isMobile ? '1.4rem' : '1.6rem', fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 300, color: '#f0faff', marginBottom: '2rem' }}>
            Почему пурифайер лучше
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '1rem' : '1.4rem'
          }}>
            {[
              ['💰', 'Дешевле', 'В 10+ раз ниже цена за литр'],
              ['♻️', 'Экологично', 'Ноль пластиковых отходов'],
              ['🚀', 'Удобнее', 'Вода всегда под рукой'],
              ['🔧', 'Просто', 'Без логистики и заказов'],
              ['💎', 'Качество', 'Всегда свежая вода'],
              ['📊', 'Контроль', 'Мониторинг в реальном времени'],
            ].map((item: any, idx: number) => (
              <div key={idx} style={{
                padding: '1.6rem',
                borderRadius: '16px',
                border: '1px solid rgba(0,200,255,.15)',
                background: 'rgba(0,200,255,.04)',
                backdropFilter: 'blur(12px)',
                transition: 'all .3s'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '.8rem' }}>{item[0]}</div>
                <p style={{ fontSize: '.95rem', fontWeight: 600, color: '#f0faff', marginBottom: '.4rem' }}>
                  {item[1]}
                </p>
                <p style={{ fontSize: '.8rem', color: '#9fc0d4', lineHeight: 1.6 }}>
                  {item[2]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;