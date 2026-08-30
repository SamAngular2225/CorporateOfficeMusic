import Hero from "./components/Hero";
import Header from "./components/Header";
import MusicPlayer from "./components/MusicPlayer";
import "./App.css";

function App() {
  return (
    <main className="app">
      <Hero />
      <Header />
      <MusicPlayer/>
    </main>
  );
}

export default App;