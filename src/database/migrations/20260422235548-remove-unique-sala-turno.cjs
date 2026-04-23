'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.removeConstraint(
      'turmas',
      'turma_sala_turno_unique'
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addConstraint('turmas', {
      fields: ['sala_id', 'turno'],
      type: 'unique',
      name: 'turma_sala_turno_unique'
    });
  }
};