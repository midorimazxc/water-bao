import { useEffect, useState } from 'react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav id="nav" className={scrolled ? 'scrolled' : ''}>
     <a
  href="#"
  className="logo"
  onClick={(e) => {
    e.preventDefault();
    window.location.reload();
  }}
>
  Вода <em>для всех</em>
</a>
      <ul className="nav-links">
        <li><a href="#products">Продукты</a></li>
        <li><a href="#how">Технология</a></li>
        <li><a href="#install">Установка</a></li>
        <li><a href="#clients">Клиенты</a></li>
        <li><a href="#contact">Контакт</a></li>
      </ul>
      <button className="nav-cta">Получить консультацию</button>
    </nav>
  );
}
