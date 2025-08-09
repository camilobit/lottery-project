import "./NumerosRifa.css";

export default function Rifa() {
  const numeros = Array.from({ length: 1000 }, (_, i) =>
    i.toString().padStart(3, "0")
  );

  // Lista de números vendidos (por ahora solo el 100 como ejemplo)
  const vendidos = ["080","100", "200", "300","013","010"];

  return (
    <div className="rifa-container">
      <h1 className="titulo">Rifa 3 Dígitos</h1>
      <div className="numeros-grid">
        {numeros.map((numero) => (
          <div
            key={numero}
            className={`numero ${vendidos.includes(numero) ? "vendido" : ""}`}
          >
            {numero}
          </div>
        ))}
      </div>
    </div>
  );
}
