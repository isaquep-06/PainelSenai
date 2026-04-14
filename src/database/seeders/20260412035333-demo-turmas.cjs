'use strict';

module.exports = {
  async up(queryInterface) {

    const turmas = [];

    const turnos = ['matutino', 'vespertino', 'noturno'];

    const cursos = [
      'ELT', 'MEC', 'DDS', 'AUT', 'SEP', 'CLP', 'REDES'
    ];

    let contador = 1;

    const salas = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26
    ]; // salas comuns

    const labs = [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38];

    const especiais = [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54];

    function gerarNome() {
      const curso = cursos[Math.floor(Math.random() * cursos.length)];
      return `${curso}-${String(contador++).padStart(2, '0')}`;
    }

    // 🔹 SALAS COMUNS → 3 turnos
    for (const sala of salas) {
      for (const turno of turnos) {
        turmas.push({
          name: gerarNome(),
          turno,
          sala_id: sala,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // 🔹 LABS → só matutino e vespertino
    for (const sala of labs) {
      for (const turno of ['matutino', 'vespertino']) {
        turmas.push({
          name: gerarNome(),
          turno,
          sala_id: sala,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // 🔹 ESPECIAIS → só 1 turno (mais realista)
    for (const sala of especiais) {
      turmas.push({
        name: gerarNome(),
        turno: 'vespertino',
        sala_id: sala,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('turmas', turmas, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('turmas', null, {});
  }
};