export default function ordenarSalas(lista) {
  const getNumero = (nome) => {
    const match = nome.match(/\d+/);
    return match ? parseInt(match[0]) : 999;
  };

  return lista.sort((a, b) => {
    const nomeA = (a.sala || "").toLowerCase();
    const nomeB = (b.sala || "").toLowerCase();

    // 🔹 prioridade por tipo
    const getTipo = (nome) => {
      if (nome.includes("sala")) return 1;
      if (nome.includes("lab")) return 2;
      return 3; // especiais
    };

    const tipoA = getTipo(nomeA);
    const tipoB = getTipo(nomeB);

    if (tipoA !== tipoB) return tipoA - tipoB;

    // 🔹 ordenar pelo número
    return getNumero(nomeA) - getNumero(nomeB);
  });
}