import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay" />

      <div className="hero-content">
        {/* <span className="hero-kicker">
          9 TO 6 • MAJDOORI • OVERTIME
        </span> */}

        <h1>
          Corporate
          <span>Majdoor</span>
        </h1>

        <p>
          9 to 6 ki Majdoori • Overtime Playlist
        </p>
      </div>
    </section>
  );
};

export default Hero;