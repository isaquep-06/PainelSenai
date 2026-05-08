export default function ordenarSalas(lista) {
  const collator = new Intl.Collator("pt-BR", {
    numeric: true,
    sensitivity: "base",
  });

  return lista.sort((a, b) => {
    const nomeA = (a.sala || "").toLowerCase();
    const nomeB = (b.sala || "").toLowerCase();

    const getTipo = (nome) => {
      if (nome.includes("sala")) return 1;
      if (nome.includes("lab")) return 2;
      return 3;
    };

    const tipoA = getTipo(nomeA);
    const tipoB = getTipo(nomeB);

    if (tipoA !== tipoB) return tipoA - tipoB;

    return collator.compare(nomeA, nomeB);
  });
}
