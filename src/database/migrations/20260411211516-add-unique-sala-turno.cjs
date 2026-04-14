'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('turmas', 'turmas_sala_id_key').catch(() => { });

    await queryInterface.addConstraint('turmas', {
      fields: ['sala_id', 'turno'],
      type: 'unique',
      name: 'turma_sala_turno_unique'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('turmas', 'turma_sala_turno_unique');

    await queryInterface.addConstraint('turmas', {
      fields: ['sala_id'],
      type: 'unique',
      name: 'turmas_sala_id_key'
    });
  }
};