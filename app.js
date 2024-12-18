import Phaser from 'phaser';

const config = {
  width: 800,
  height: 600,
  backgroundColor: 0xffffff,
  scene: {
    preload,
    create,
    update,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);

function preload() {}

function create() {}

function update() {}
