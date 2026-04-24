'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('salas', [
      // Salas comuns
      { name: 'Sala 02', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 03', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 05', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 06', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 07', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 08', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 11', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 12', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 13', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 14', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 15', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 16', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 17', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 18', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 19', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 20', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 21', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 22', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 23', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 25', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 26', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 27', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 28', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 29', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 30', type: 'comum', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sala 33', type: 'comum', createdAt: new Date(), updatedAt: new Date() },

      // Laboratórios
      { name: 'Lab 01', type: 'laboratorio', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Lab 03', type: 'laboratorio', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Lab 04', type: 'laboratorio', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Lab 05', type: 'laboratorio', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Lab 06', type: 'laboratorio', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Lab Redes', type: 'laboratorio', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Lab Comissionamento', type: 'laboratorio', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Lab Inst. FV', type: 'laboratorio', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Lab SeguranÃ§a', type: 'laboratorio', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Lab Projetos', type: 'laboratorio', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Lab Eletropostos', type: 'laboratorio', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Lab RefrigeraÃ§Ã£o', type: 'laboratorio', createdAt: new Date(), updatedAt: new Date() },

      // Especiais
      { name: 'EletrÃ´nica', type: 'especial', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Predial', type: 'especial', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Industrial', type: 'especial', createdAt: new Date(), updatedAt: new Date() },
      { name: 'CLP', type: 'especial', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ensaios ElÃ©tricos', type: 'especial', createdAt: new Date(), updatedAt: new Date() },
      { name: 'SEP', type: 'especial', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tornearia', type: 'especial', createdAt: new Date(), updatedAt: new Date() },
      { name: 'ManutenÃ§Ã£o', type: 'especial', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Caldeiraria', type: 'especial', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Soldagem', type: 'especial', createdAt: new Date(), updatedAt: new Date() },
      { name: 'PlÃ¡stico', type: 'especial', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Metrologia', type: 'especial', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Metalografia', type: 'especial', createdAt: new Date(), updatedAt: new Date() },
      { name: 'AutomaÃ§Ã£o MecÃ¢nica', type: 'especial', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ferramentaria', type: 'especial', createdAt: new Date(), updatedAt: new Date() },
      { name: 'AuditÃ³rio', type: 'especial', createdAt: new Date(), updatedAt: new Date() },

    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('salas', null, {});
  },
};
