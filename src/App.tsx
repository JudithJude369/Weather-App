import Weather from "./components/ Weather ";
import Logo from "./components/Logo";
import { ModeToggle } from "./components/mode-toggle";
import SearchInput from "./components/SearchInput";
import Title from "./components/Title";

function App() {
  return (
    <main className="flex flex-col justify-center p-8 font-body">
      <header className="flex justify-between items-center">
        <Logo />
        <ModeToggle />
      </header>
      <section>
        <Title />
        <SearchInput />
        <Weather />
      </section>
    </main>
  );
}

export default App;
