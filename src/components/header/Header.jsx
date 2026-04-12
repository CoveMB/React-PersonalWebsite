import HeaderCard from "./HeaderCard";

export default function Header() {
  return (
    <section className="headerSection">
      <div aria-hidden="true" className="headerBackdrop" />
      <div className="headerShell">
        <HeaderCard />
      </div>
    </section>
  );
}
