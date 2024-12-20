import Phaser from 'phaser';
import groundImg from '../assets/ground.png';
import islandImg from '../assets/island.png';
import starImg from '../assets/star.png';
import playerImg from '../assets/player.png';

interface GameConfig extends Phaser.Types.Core.GameConfig {
  physics: {
    default: string;
    arcade: {
      gravity: { x: number; y: number };
      debug: boolean;
    };
  };
}

const config: GameConfig = {
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
      gravity: { x: 0, y: 300 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
let player: Phaser.Physics.Arcade.Sprite;
let cursors: Phaser.Types.Input.Keyboard.CursorKeys;

function preload(this: Phaser.Scene): void {
  this.load.image('ground', groundImg);
  this.load.image('island', islandImg);
  this.load.image('star', starImg);
  this.load.spritesheet('player', playerImg, {
    frameWidth: 32,
    frameHeight: 48,
  });
}

function create(this: Phaser.Scene): void {
  // create group to hold still assets i.e. the platforms
  const platforms = this.physics.add.staticGroup();

  // add ground
  platforms.create(400, 588, 'ground');

  // add floating platform on x, y coordinates relative to top left corner, middle of image
  platforms.create(600, 450, 'island');
  platforms.create(50, 250, 'island');
  platforms.create(650, 220, 'island');
  platforms.create(250, 520, 'island');
  platforms.create(250, 320, 'island');

  // add player
  player = this.physics.add.sprite(380, 500, 'player');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true); // otherwise player falls through

  // add collider physics rule between player and all types of platforms
  this.physics.add.collider(player, platforms);

  // allow access to keyboard events
  cursors = this.input.keyboard.createCursorKeys();

  // create player animation
  this.anims.create({
    key: 'still',
    frames: [{ key: 'player', frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }), // composed of 4 frames
    frameRate: 10,
    repeat: -1, // infinitely repeated
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  // add stars
  const stars = this.physics.add.group();
  // drop from sky, y=0
  stars.create(22, 0, 'star');
  stars.create(122, 0, 'star');
  stars.create(222, 0, 'star');
  stars.create(322, 0, 'star');
  stars.create(422, 0, 'star');
  stars.create(522, 0, 'star');
  stars.create(622, 0, 'star');
  stars.create(722, 0, 'star');

  this.physics.add.collider(stars, platforms);

  // allow player to pick up stars
  let score = 0;
  const scoreText = this.add.text(16, 16, 'Stars: 0', {
    fontSize: '32px',
    color: '#000',
  });

  this.physics.add.overlap(
    player,
    stars,
    // hide star when overlap
    (player, star) => {
      const starSprite = star as Phaser.Physics.Arcade.Image;
      starSprite.disableBody(true, true);
      // increment star counter
      score += 1;
      scoreText.setText('Stars: ' + score);
    },
    undefined,
    this
  );
}

// this function is called continuously by the game loop
function update(): void {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true); // true sets animation to loop
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('still');
  }

  // if player sits on bottom, and up arrow pressed, push to top (gravity will be simulated)
  if (cursors.up.isDown && player.body?.touching.down) {
    player.setVelocityY(-330);
  }
}
