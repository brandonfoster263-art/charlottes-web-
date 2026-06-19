/* Original retelling — character names and plot beats follow the classic
   farmyard-friendship story, but every sentence below is newly written,
   simplified for an early reader, not quoted from any existing book. */

(function () {
  const I = window.Illustrations;
  const wrap = (inner) => I.svgWrap(I.defsBlock() + inner);

  // Maps each story page (1-65, in order) to one of the 60 numbered photo
  // illustrations in assets/illustrations/story/, chosen by matching plot beat.
  const STORY_PHOTOS = [
    1, 1, 2, 3, 4, 5, 6, 7, 8, 8,
    15, 18, 17, 19, 9, 10, 11, 12, 20, 22,
    23, 25, 24, 14, 21, 31, 32, 33, 34, 35,
    26, 30, 39, 38, 36, 41, 41, 42, 40, 42,
    43, 43, 44, 46, 45, 47, 49, 51, 52, 54,
    53, 55, 57, 56, 56, 56, 51, 56, 58, 59,
    59, 59, 59, 59, 59,
  ];
  const storyPhoto = (n) => `assets/illustrations/story/img${String(n).padStart(2, '0')}.jpg`;

  const illoTitle = wrap(`
    ${I.sky('day')}
    ${I.sun(500, 60, 36)}
    ${I.grassHill()}
    ${I.farmhouse(60, 190, 0.9)}
    ${I.barn(330, 170, 0.75)}
    ${I.fenceRow(310)}
  `);

  const illoEnd = wrap(`
    ${I.sky('evening')}
    ${I.sun(300, 70, 34)}
    ${I.grassHill()}
    ${I.barn(360, 170, 0.55)}
    ${I.webCircle(200, 140, 50, '')}
    ${I.spiderCharlotte(200, 140, 0.9)}
    ${I.pigWilbur(260, 300, 1, 'happy')}
    ${I.heart(420, 110, 1)}
  `);

  const illoBack = wrap(`
    ${I.sky('night')}
    ${I.moonStars()}
    ${I.grassHill()}
    ${I.webCircle(300, 170, 70, '')}
    ${I.spiderCharlotte(300, 170, 1)}
  `);

  const storyPages = [
    {
      text: 'One spring morning, a tiny pig was born on the Arable farm. He was the smallest piglet in the whole litter.',
      scene: () => `${I.sky('day')}${I.sun(60, 50, 30)}${I.grassHill()}${I.farmhouse(360, 170, 0.9)}${I.pigWilbur(260, 330, 0.4, 'sad')}`,
    },
    {
      text: 'Fern saw the tiny pig and begged her father not to give him away. "He is too small to live," said Papa. "Please let me raise him," said Fern.',
      scene: () => `${I.sky('day')}${I.sun(60, 50, 30)}${I.grassHill()}${I.farmhouse(360, 170, 0.85)}${I.girlFern(150, 260, 1)}${I.farmerZuckerman(440, 260, 0.9)}${I.pigWilbur(270, 330, 0.35, 'sad')}`,
    },
    {
      text: 'Papa agreed. Fern named the piglet Wilbur and fed him warm milk from a little bottle every day.',
      scene: () => `${I.sky('day')}${I.sun(60, 50, 30)}${I.grassHill()}${I.farmhouse(360, 170, 0.85)}${I.girlFern(220, 270, 1.1)}${I.pigWilbur(300, 320, 0.45, 'happy')}`,
    },
    {
      text: "Wilbur slept in a cozy box beside Fern's bed. He grew a little bigger with every sunrise.",
      scene: () => `${I.sky('evening')}${I.sun(520, 80, 30)}${I.grassHill()}${I.farmhouse(300, 170, 0.9)}${I.girlFern(220, 260, 1)}${I.pigWilbur(300, 320, 0.5, 'happy')}`,
    },
    {
      text: "Every morning, Wilbur followed Fern down the lane to the old apple tree. He loved the cool grass under his feet.",
      scene: () => `${I.sky('day')}${I.sun(60, 50, 30)}${I.grassHill()}${I.appleTree(420, 180, 1)}${I.girlFern(150, 260, 1)}${I.pigWilbur(260, 320, 0.55, 'happy')}`,
    },
    {
      text: 'Wilbur loved running in the sun and rolling in cool, squishy mud. He felt free and happy on the farm.',
      scene: () => `${I.sky('day')}${I.sun(500, 50, 30)}${I.grassHill()}${I.appleTree(80, 170, 0.8)}${I.pigWilbur(300, 320, 0.6, 'happy')}`,
    },
    {
      text: 'When Wilbur was one month old, he grew too big for his little box. "He needs a real pen," said Papa.',
      scene: () => `${I.sky('day')}${I.sun(60, 50, 30)}${I.grassHill()}${I.farmhouse(360, 170, 0.8)}${I.girlFern(150, 260, 1)}${I.pigWilbur(290, 320, 0.65, 'sad')}`,
    },
    {
      text: "So Wilbur went to live in the big barn at Fern's uncle's farm. The barn belonged to Mr. Zuckerman.",
      scene: () => `${I.sky('evening')}${I.sun(520, 80, 28)}${I.grassHill()}${I.barn(300, 150, 0.85)}${I.farmerZuckerman(440, 260, 0.9)}${I.pigWilbur(220, 320, 0.65, 'sad')}`,
    },
    {
      text: 'Fern was sad to see Wilbur go. But she visited every single day and sat quietly by his pen.',
      scene: () => `${I.sky('day')}${I.sun(60, 50, 28)}${I.grassHill()}${I.barn(330, 150, 0.8)}${I.girlFern(150, 270, 1)}${I.pigWilbur(290, 320, 0.7, 'happy')}`,
    },
    {
      text: 'The barn smelled like warm hay and fresh wood. Wilbur had a cozy new pen all his own.',
      scene: () => `${I.sky('day')}${I.sun(60, 50, 28)}${I.grassHill()}${I.barn(280, 130, 1)}${I.fenceRow(330)}${I.pigWilbur(300, 330, 0.75, 'happy')}`,
    },
    {
      text: 'Wilbur explored the barnyard and met a goose who lived by the fence. "Good morning!" honked the goose.',
      scene: () => `${I.sky('day')}${I.sun(60, 50, 28)}${I.grassHill()}${I.fenceRow(320)}${I.goose(150, 300, 1.2)}${I.pigWilbur(320, 320, 0.8, 'happy')}`,
    },
    {
      text: 'Wilbur asked the goose to play. "Not now, not now, not now," she said. "I am watching my eggs."',
      scene: () => `${I.sky('day')}${I.sun(60, 50, 28)}${I.grassHill()}${I.fenceRow(320)}${I.goose(180, 300, 1.2)}${I.pigWilbur(350, 320, 0.8, 'sad')}`,
    },
    {
      text: 'Wilbur asked the sheep to play, too. "We have no time for games," the sheep said, and went back to grazing.',
      scene: () => `${I.sky('day')}${I.sun(60, 50, 28)}${I.grassHill()}${I.fenceRow(320)}${I.sheep(420, 300, 1.2)}${I.pigWilbur(250, 320, 0.8, 'sad')}`,
    },
    {
      text: "Under Wilbur's trough lived a rat named Templeton. He only cared about finding food, not making friends.",
      scene: () => `${I.sky('evening')}${I.sun(520, 90, 26)}${I.grassHill()}${I.barn(330, 160, 0.7)}${I.rat(300, 330, 1.3)}${I.pigWilbur(180, 330, 0.8, 'sad')}`,
    },
    {
      text: 'Every night, Wilbur felt very lonely. He missed Fern, and he wished for one true friend.',
      scene: () => `${I.sky('night')}${I.moonStars()}${I.grassHill()}${I.barn(330, 150, 0.7)}${I.pigWilbur(260, 320, 0.85, 'sad')}`,
    },
    {
      text: 'One quiet night, a small voice whispered, "I will be your friend, Wilbur." Wilbur looked all around.',
      scene: () => `${I.sky('night')}${I.moonStars()}${I.grassHill()}${I.barn(330, 150, 0.7)}${I.pigWilbur(260, 320, 0.85, 'happy')}`,
    },
    {
      text: '"Who said that? Where are you?" asked Wilbur. "Be patient," said the voice. "You will see me in the morning."',
      scene: () => `${I.sky('night')}${I.moonStars()}${I.grassHill()}${I.barn(330, 150, 0.7)}${I.webCircle(420, 150, 40, '')}${I.pigWilbur(220, 320, 0.85, 'happy')}`,
    },
    {
      text: 'When the sun rose, Wilbur saw a gray spider spinning silk above his pen door. Her name was Charlotte.',
      scene: () => `${I.sky('day')}${I.sun(60, 50, 28)}${I.grassHill()}${I.barn(330, 150, 0.7)}${I.webCircle(420, 150, 55, '')}${I.spiderCharlotte(420, 150, 1.1)}${I.pigWilbur(220, 320, 0.85, 'happy')}`,
    },
    {
      text: 'Wilbur was unsure at first, but Charlotte explained kindly that she only caught flies in her web, never pigs. They became fast friends.',
      scene: () => `${I.sky('day')}${I.sun(60, 50, 28)}${I.grassHill()}${I.barn(360, 150, 0.7)}${I.webCircle(420, 160, 55, '')}${I.spiderCharlotte(420, 160, 1.15)}${I.pigWilbur(220, 320, 0.9, 'happy')}`,
    },
    {
      text: 'One day, an old sheep told Wilbur a terrible secret. Most pigs, she said, do not get to grow old on the farm.',
      scene: () => `${I.sky('evening')}${I.sun(520, 90, 26)}${I.grassHill()}${I.fenceRow(320)}${I.sheep(420, 300, 1.2)}${I.pigWilbur(230, 310, 0.9, 'sad')}`,
    },
    {
      text: 'Wilbur was terrified. He cried and screamed, "I don\'t want to die! I want to live!"',
      scene: () => `${I.sky('evening')}${I.grassHill()}${I.barn(360, 150, 0.65)}${I.pigWilbur(260, 310, 0.9, 'sad')}`,
    },
    {
      text: 'Charlotte heard his cries. "Hush now, Wilbur," she said gently. "I will help you. I promise."',
      scene: () => `${I.sky('night')}${I.moonStars()}${I.barn(360, 150, 0.65)}${I.webCircle(420, 160, 55, '')}${I.spiderCharlotte(420, 160, 1.2)}${I.pigWilbur(220, 310, 0.9, 'sad')}`,
    },
    {
      text: '"How will you help me?" asked Wilbur. "I don\'t know yet," said Charlotte, "but I will think of a plan."',
      scene: () => `${I.sky('night')}${I.moonStars()}${I.barn(360, 150, 0.6)}${I.webCircle(420, 160, 50, '')}${I.spiderCharlotte(420, 160, 1.1)}${I.pigWilbur(220, 310, 0.9, 'sad')}`,
    },
    {
      text: 'Wilbur trusted his clever friend. He felt calmer, closed his eyes, and finally fell fast asleep.',
      scene: () => `${I.sky('night')}${I.moonStars()}${I.barn(360, 150, 0.6)}${I.webCircle(420, 160, 50, '')}${I.spiderCharlotte(420, 160, 1.1)}${I.pigWilbur(220, 310, 0.95, 'happy')}`,
    },
    {
      text: 'All night, Charlotte stayed awake beneath the stars, watching over her sleeping friend and thinking.',
      scene: () => `${I.sky('night')}${I.moonStars()}${I.barn(360, 150, 0.6)}${I.webCircle(420, 160, 50, '')}${I.spiderCharlotte(420, 160, 1.2)}${I.pigWilbur(220, 310, 0.95, 'happy')}`,
    },
    {
      text: 'Early the next morning, Charlotte began spinning something very special in the corner of her web.',
      scene: () => `${I.sky('day')}${I.sun(60, 50, 28)}${I.barn(330, 150, 0.7)}${I.webCircle(420, 150, 60, '')}${I.spiderCharlotte(420, 150, 1.2)}${I.pigWilbur(220, 310, 1, 'happy')}`,
    },
    {
      text: 'Lurvy the farmhand came to feed the pigs. He gasped when he saw words shining in the web above the door.',
      scene: () => `${I.sky('day')}${I.sun(60, 50, 28)}${I.barn(330, 150, 0.7)}${I.webCircle(300, 130, 90, 'SOME PIG')}${I.farmerZuckerman(440, 300, 0.85)}${I.pigWilbur(280, 320, 1, 'happy')}`,
    },
    {
      text: '"Mr. Zuckerman! Come quick!" he shouted. "There is a sign in the web. It says SOME PIG!"',
      scene: () => `${I.sky('day')}${I.barn(220, 150, 0.6)}${I.webCircle(280, 130, 85, 'SOME PIG')}${I.farmerZuckerman(440, 290, 0.85)}${I.pigWilbur(280, 320, 1, 'happy')}`,
    },
    {
      text: 'Word spread fast. People came from all around to see the wondrous web and the amazing pig.',
      scene: () => `${I.sky('day')}${I.barn(150, 130, 0.55)}${I.webCircle(260, 120, 75, 'SOME PIG')}${I.girlFern(80, 300, 0.8)}${I.farmerZuckerman(440, 300, 0.8)}${I.pigWilbur(280, 330, 1, 'happy')}`,
    },
    {
      text: 'Charlotte told Wilbur to stand up tall and look his very best whenever visitors came to see him.',
      scene: () => `${I.sky('day')}${I.barn(330, 150, 0.7)}${I.webCircle(300, 130, 90, 'SOME PIG')}${I.pigWilbur(300, 320, 1.05, 'happy')}`,
    },
    {
      text: 'Charlotte needed new words. Templeton grumbled, but he agreed to search the dump for scraps of paper with good words on them.',
      scene: () => `${I.sky('evening')}${I.sun(520, 90, 26)}${I.barn(330, 160, 0.65)}${I.rat(420, 330, 1.3)}${I.pigWilbur(220, 320, 1, 'happy')}`,
    },
    {
      text: 'Templeton returned, dragging a soap label in his teeth. "Radiant," Charlotte read. "That will do nicely."',
      scene: () => `${I.sky('night')}${I.moonStars()}${I.barn(330, 150, 0.6)}${I.rat(400, 330, 1.2)}${I.spiderCharlotte(420, 160, 1.1)}${I.webCircle(420, 160, 50, '')}${I.pigWilbur(220, 320, 1, 'happy')}`,
    },
    {
      text: 'By morning, the web sparkled with a new word: RADIANT. Even more people came to admire Wilbur.',
      scene: () => `${I.sky('day')}${I.barn(330, 150, 0.7)}${I.webCircle(300, 130, 95, 'RADIANT')}${I.pigWilbur(300, 320, 1.05, 'happy')}`,
    },
    {
      text: 'Crowds gathered every day. Wilbur felt proud, and just a little bit shy, under all those watching eyes.',
      scene: () => `${I.sky('day')}${I.barn(220, 150, 0.55)}${I.webCircle(260, 120, 75, 'RADIANT')}${I.girlFern(80, 300, 0.8)}${I.farmerZuckerman(440, 300, 0.8)}${I.pigWilbur(280, 330, 1.05, 'happy')}`,
    },
    {
      text: "Templeton found one more word in an old crate. That night, Charlotte spun TERRIFIC, and Wilbur's fame grew across the whole county.",
      scene: () => `${I.sky('day')}${I.barn(330, 150, 0.7)}${I.webCircle(300, 130, 95, 'TERRIFIC')}${I.pigWilbur(300, 320, 1.1, 'happy')}`,
    },
    {
      text: 'Mr. Zuckerman decided Wilbur was special enough for the County Fair. He began planning the trip right away.',
      scene: () => `${I.sky('day')}${I.sun(60, 50, 26)}${I.farmerZuckerman(440, 260, 0.95)}${I.pigWilbur(280, 320, 1.1, 'happy')}`,
    },
    {
      text: '"Don\'t worry," said Charlotte. "I will come along, hidden in the crate with you."',
      scene: () => `${I.sky('evening')}${I.barn(360, 150, 0.6)}${I.webCircle(420, 160, 50, '')}${I.spiderCharlotte(420, 160, 1.1)}${I.pigWilbur(220, 310, 1, 'sad')}`,
    },
    {
      text: 'On the morning of the fair, Wilbur got a special buttermilk bath until his skin shone pink and clean.',
      scene: () => `${I.sky('day')}${I.sun(60, 50, 28)}${I.barn(330, 150, 0.65)}${I.pigWilbur(300, 320, 1.1, 'happy')}`,
    },
    {
      text: 'Templeton agreed to come too, lured by the promise of delicious leftovers all over the fairgrounds.',
      scene: () => `${I.sky('day')}${I.fairTent(440, 280, 0.7)}${I.rat(300, 330, 1.2)}${I.pigWilbur(200, 320, 1, 'happy')}`,
    },
    {
      text: 'At the fair, Wilbur saw bright tents, spinning rides, and animals of every kind. It was a big, exciting adventure.',
      scene: () => `${I.sky('day')}${I.fairTent(440, 280, 0.8)}${I.fairTent(170, 290, 0.6)}${I.pigWilbur(300, 320, 1, 'happy')}${I.spiderCharlotte(345, 270, 1)}`,
    },
    {
      text: 'Wilbur met Uncle, an enormous prize pig from another farm. Wilbur suddenly felt very small indeed.',
      scene: () => `${I.sky('day')}${I.fairTent(440, 280, 0.7)}${I.pigWilbur(180, 320, 0.9, 'sad')}${I.pigWilbur(400, 300, 1.6, 'happy')}`,
    },
    {
      text: '"Size isn\'t everything," Charlotte whispered. "What matters is who you are. I have one more word to spin."',
      scene: () => `${I.sky('evening')}${I.fairTent(440, 280, 0.65)}${I.webCircle(260, 140, 60, '')}${I.spiderCharlotte(260, 140, 1.2)}${I.pigWilbur(180, 310, 0.9, 'sad')}`,
    },
    {
      text: "That night, while the fairground slept, Charlotte spun her finest word yet, high above Wilbur's pen: HUMBLE.",
      scene: () => `${I.sky('night')}${I.moonStars()}${I.fairTent(440, 280, 0.6)}${I.webCircle(260, 150, 70, 'HUMBLE')}${I.spiderCharlotte(260, 150, 1.1)}${I.pigWilbur(180, 320, 0.9, 'happy')}`,
    },
    {
      text: 'In the morning, judges gathered around the web in amazement. A crowd grew bigger by the minute.',
      scene: () => `${I.sky('day')}${I.fairTent(440, 280, 0.7)}${I.webCircle(260, 140, 75, 'HUMBLE')}${I.pigWilbur(180, 310, 0.95, 'happy')}`,
    },
    {
      text: "Meanwhile, sneaky Templeton found a rotten egg near Uncle's pen and gave it a mischievous little roll.",
      scene: () => `${I.sky('day')}${I.fairTent(440, 280, 0.6)}${I.rat(380, 330, 1.2)}${I.pigWilbur(400, 300, 1.6, 'sad')}`,
    },
    {
      text: 'Pop! The rotten egg burst with a terrible smell. Everyone near Uncle\'s pen hurried away, pinching their noses.',
      scene: () => `${I.sky('day')}${I.fairTent(440, 280, 0.6)}${I.pigWilbur(400, 300, 1.6, 'sad')}${I.rat(380, 330, 1.1)}`,
    },
    {
      text: 'With the fuss settled, all eyes turned back to Wilbur. He was given a special, shining prize, and the crowd cheered louder than ever.',
      scene: () => `${I.sky('day')}${I.fairTent(440, 280, 0.6)}${I.ribbon(420, 200, 1.2)}${I.pigWilbur(280, 320, 1.15, 'happy')}`,
    },
    {
      text: 'After all the excitement, Charlotte felt very weak. Spinning so many words had used up her strength.',
      scene: () => `${I.sky('evening')}${I.fairTent(450, 280, 0.55)}${I.webCircle(260, 140, 60, '')}${I.spiderCharlotte(260, 140, 1)}${I.pigWilbur(180, 320, 0.95, 'sad')}`,
    },
    {
      text: '"I will not be going home with you, Wilbur," Charlotte said softly. She showed him a small, papery egg sac.',
      scene: () => `${I.sky('evening')}${I.fairTent(450, 280, 0.55)}${I.eggSac(310, 175, 1)}${I.spiderCharlotte(260, 140, 1)}${I.pigWilbur(180, 320, 0.95, 'sad')}`,
    },
    {
      text: '"Please come home," begged Wilbur. "My work here is done," said Charlotte gently. "My children are inside this sac."',
      scene: () => `${I.sky('evening')}${I.fairTent(470, 290, 0.5)}${I.eggSac(300, 250, 1.2)}${I.pigWilbur(180, 310, 0.95, 'sad')}`,
    },
    {
      text: "Charlotte asked Templeton to carry her egg sac down carefully. Grumbling, but kindly, he agreed to help.",
      scene: () => `${I.sky('evening')}${I.fairTent(470, 290, 0.5)}${I.eggSac(300, 230, 1.2)}${I.rat(380, 320, 1.2)}${I.pigWilbur(160, 310, 0.95, 'sad')}`,
    },
    {
      text: 'Wilbur held the tiny egg sac gently in his mouth and climbed into his crate for the long ride home.',
      scene: () => `${I.sky('night')}${I.moonStars()}${I.fairTent(470, 290, 0.45)}${I.eggSac(280, 250, 1.1)}${I.pigWilbur(220, 310, 0.95, 'sad')}`,
    },
    {
      text: 'That night, alone under the stars at the quiet fairground, Charlotte closed her eyes one last time, peaceful and still.',
      scene: () => `${I.sky('night')}${I.moonStars()}${I.fairTent(470, 290, 0.4)}${I.webCircle(300, 150, 45, '')}${I.spiderCharlotte(300, 150, 0.9)}`,
    },
    {
      text: '"I will guard you forever," Wilbur promised, and placed the egg sac safely on a high shelf above his pen.',
      scene: () => `${I.sky('evening')}${I.barn(330, 150, 0.7)}${I.eggSac(320, 200, 1.1)}${I.pigWilbur(220, 320, 1, 'sad')}`,
    },
    {
      text: 'Autumn came, and the leaves turned gold and red. Wilbur watched over the egg sac every single day.',
      scene: () => `${I.sky('evening')}${I.grassHill()}${I.barn(330, 150, 0.7)}${I.eggSac(320, 200, 1)}${I.pigWilbur(220, 320, 1, 'happy')}`,
    },
    {
      text: 'Winter arrived, and soft snow drifted over the barn roof. Wilbur kept the precious egg sac warm and safe.',
      scene: () => `${I.sky('night')}${I.moonStars()}${I.snowfall()}${I.barn(330, 150, 0.7)}${I.eggSac(320, 200, 1)}${I.pigWilbur(220, 320, 1, 'happy')}`,
    },
    {
      text: 'On cold winter nights, the goose and the sheep told stories about clever Charlotte, keeping her memory warm and alive.',
      scene: () => `${I.sky('night')}${I.moonStars()}${I.snowfall()}${I.barn(330, 150, 0.7)}${I.goose(150, 320, 1)}${I.sheep(420, 320, 1)}${I.pigWilbur(280, 330, 1, 'happy')}`,
    },
    {
      text: 'At last, spring arrived. The snow melted, flowers bloomed, and the little egg sac began to stir.',
      scene: () => `${I.sky('day')}${I.sun(60, 50, 30)}${I.grassHill()}${I.barn(330, 150, 0.7)}${I.eggSac(320, 200, 1.1)}${I.pigWilbur(220, 320, 1, 'happy')}`,
    },
    {
      text: 'One bright morning, tiny spiders began hatching from the egg sac. Hundreds of them, no bigger than specks!',
      scene: () => `${I.sky('day')}${I.sun(60, 50, 30)}${I.barn(360, 160, 0.7)}${I.babySpiders()}${I.pigWilbur(220, 320, 1, 'happy')}`,
    },
    {
      text: 'Most of the baby spiders spun tiny silk balloons and floated away on the breeze to find new homes far away.',
      scene: () => `${I.sky('day')}${I.sun(500, 50, 30)}${I.barn(360, 160, 0.6)}${I.babySpiders()}${I.pigWilbur(220, 320, 1, 'happy')}`,
    },
    {
      text: '"Don\'t go!" Wilbur cried, worried they would all leave. But three little spiders stayed close beside him.',
      scene: () => `${I.sky('day')}${I.sun(60, 50, 30)}${I.barn(360, 160, 0.6)}${I.webCircle(220, 150, 40, '')}${I.spiderCharlotte(190, 150, 0.4)}${I.spiderCharlotte(220, 160, 0.4)}${I.spiderCharlotte(250, 150, 0.4)}${I.pigWilbur(220, 320, 1, 'happy')}`,
    },
    {
      text: 'Wilbur happily named his three new friends Joy, Aranea, and Nellie, just like their wonderful mother before them.',
      scene: () => `${I.sky('day')}${I.barn(360, 160, 0.6)}${I.webCircle(220, 150, 45, '')}${I.spiderCharlotte(195, 150, 0.45)}${I.spiderCharlotte(225, 165, 0.45)}${I.spiderCharlotte(255, 150, 0.45)}${I.pigWilbur(220, 320, 1, 'happy')}`,
    },
    {
      text: "Joy, Aranea, and Nellie grew up and spun their own webs above Wilbur's pen, just where their mother once lived.",
      scene: () => `${I.sky('day')}${I.barn(330, 150, 0.7)}${I.webCircle(420, 150, 55, '')}${I.spiderCharlotte(420, 150, 1.1)}${I.pigWilbur(220, 320, 1.05, 'happy')}`,
    },
    {
      text: 'Year after year, new baby spiders hatched in that same doorway. Wilbur was never lonely again.',
      scene: () => `${I.sky('evening')}${I.grassHill()}${I.barn(330, 150, 0.7)}${I.webCircle(420, 150, 50, '')}${I.spiderCharlotte(420, 150, 1)}${I.pigWilbur(220, 320, 1.05, 'happy')}`,
    },
    {
      text: 'Every spring, Wilbur watched new spiders spin silk in the morning light, just as he watched over them, the way Charlotte once watched over him.',
      scene: () => `${I.sky('day')}${I.sun(300, 60, 32)}${I.grassHill()}${I.barn(360, 170, 0.6)}${I.webCircle(220, 150, 40, '')}${I.spiderCharlotte(220, 150, 0.9)}${I.heart(420, 110, 1)}${I.pigWilbur(260, 320, 1.05, 'happy')}`,
    },
  ];

  window.BOOK_PAGES = [
    {
      id: 'title',
      kind: 'title',
      illustration: illoTitle,
      text: "Charlotte's Web",
      sub: 'Retold simply, for little readers',
    },
    ...storyPages.map((p, i) => ({
      id: `p${i + 1}`,
      illustration: wrap(p.scene()),
      photo: storyPhoto(STORY_PHOTOS[i]),
      text: p.text,
    })),
    {
      id: 'end',
      kind: 'end',
      illustration: illoEnd,
      photo: storyPhoto(60),
      text: "Wilbur never forgot Charlotte. She was clever, and kind, and brave. That is the tale of Charlotte's Web. THE END.",
    },
    {
      id: 'backcover',
      kind: 'end',
      illustration: illoBack,
      text: 'Thank you for reading along!',
      sub: 'Made with love, for curious little readers.',
    },
  ];
})();
