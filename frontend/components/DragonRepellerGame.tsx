'use client';

import { useState, useEffect } from 'react';

interface Weapon {
  name: string;
  power: number;
}

interface Monster {
  name: string;
  level: number;
  health: number;
  emoji: string;
}

interface Location {
  name: string;
  buttonText: string[];
  buttonFunctions: string[];
  text: string;
}

interface GameState {
  xp: number;
  health: number;
  maxHealth: number;
  gold: number;
  currentWeapon: number;
  inventory: string[];
  level: number;
}

export default function DragonRepellerGame() {
  // Game state
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [health, setHealth] = useState(100);
  const [maxHealth, setMaxHealth] = useState(100);
  const [gold, setGold] = useState(50);
  const [currentWeapon, setCurrentWeapon] = useState(0);
  const [fighting, setFighting] = useState<number | null>(null);
  const [monsterHealth, setMonsterHealth] = useState(0);
  const [maxMonsterHealth, setMaxMonsterHealth] = useState(0);
  const [inventory, setInventory] = useState(['stick']);
  const [currentLocation, setCurrentLocation] = useState(0);
  const [gameText, setGameText] = useState(
    'Welcome to Dragon Repeller. You must defeat the dragon that is preventing people from leaving the town. You are in the town square. Where do you want to go? Use the buttons above.'
  );
  const [showMonsterStats, setShowMonsterStats] = useState(false);
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [damageNumber, setDamageNumber] = useState<{ value: number; type: 'damage' | 'heal' } | null>(null);

  // Game data - EXPANDED
  const weapons: Weapon[] = [
    { name: 'stick', power: 5 },
    { name: 'dagger', power: 30 },
    { name: 'claw hammer', power: 50 },
    { name: 'sword', power: 100 },
    { name: 'battle axe', power: 150 },
    { name: 'enchanted bow', power: 200 },
    { name: 'dragon slayer', power: 300 }
  ];

  const monsters: Monster[] = [
    { name: 'slime', level: 2, health: 15, emoji: '🟢' },
    { name: 'fanged beast', level: 8, health: 60, emoji: '🐺' },
    { name: 'goblin', level: 5, health: 40, emoji: '👺' },
    { name: 'skeleton', level: 12, health: 100, emoji: '💀' },
    { name: 'troll', level: 15, health: 150, emoji: '👹' },
    { name: 'vampire', level: 18, health: 200, emoji: '🧛' },
    { name: 'dark knight', level: 22, health: 250, emoji: '⚔️' },
    { name: 'dragon', level: 30, health: 400, emoji: '🐉' }
  ];

  const locations: Location[] = [
    {
      name: 'town square',
      buttonText: ['Go to store', 'Go to cave', 'Go to dungeon'],
      buttonFunctions: ['goStore', 'goCave', 'goDungeon'],
      text: 'You are in the town square. Where do you want to go?'
    },
    {
      name: 'store',
      buttonText: ['Buy 10 health (10 gold)', 'Buy weapon (30 gold)', 'Go to town square'],
      buttonFunctions: ['buyHealth', 'buyWeapon', 'goTown'],
      text: 'You enter the store. The merchant greets you.'
    },
    {
      name: 'cave',
      buttonText: ['Fight slime', 'Fight fanged beast', 'Go to town square'],
      buttonFunctions: ['fightSlime', 'fightBeast', 'goTown'],
      text: 'You enter the cave. Weak monsters lurk in the shadows.'
    },
    {
      name: 'dungeon',
      buttonText: ['Fight goblin', 'Fight skeleton', 'Go to mountains'],
      buttonFunctions: ['fightGoblin', 'fightSkeleton', 'goMountains'],
      text: 'You enter the dark dungeon. Dangerous creatures lurk here.'
    },
    {
      name: 'fight',
      buttonText: ['Attack', 'Dodge', 'Run'],
      buttonFunctions: ['attack', 'dodge', 'goTown'],
      text: 'You are fighting a monster.'
    },
    {
      name: 'kill monster',
      buttonText: ['Go to town square', 'Go to town square', 'Go to town square'],
      buttonFunctions: ['goTown', 'goTown', 'goTown'],
      text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
    },
    {
      name: 'lose',
      buttonText: ['REPLAY?', 'REPLAY?', 'REPLAY?'],
      buttonFunctions: ['restart', 'restart', 'restart'],
      text: 'You die. ☠️'
    },
    {
      name: 'win',
      buttonText: ['REPLAY?', 'REPLAY?', 'REPLAY?'],
      buttonFunctions: ['restart', 'restart', 'restart'],
      text: 'You defeat the dragon! YOU WIN THE GAME! 🎉'
    },
    {
      name: 'easter egg',
      buttonText: ['2', '8', 'Go to town square?'],
      buttonFunctions: ['pickTwo', 'pickEight', 'goTown'],
      text: 'You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!'
    },
    {
      name: 'mountains',
      buttonText: ['Fight troll', 'Fight vampire', 'Go to castle'],
      buttonFunctions: ['fightTroll', 'fightVampire', 'goCastle'],
      text: 'You climb the treacherous mountains. Powerful monsters await.'
    },
    {
      name: 'castle',
      buttonText: ['Fight dark knight', 'Fight dragon', 'Go to town square'],
      buttonFunctions: ['fightKnight', 'fightDragon', 'goTown'],
      text: 'You enter the ancient castle. The most powerful enemies guard this place.'
    }
  ];

  // Check for saved game on mount
  useEffect(() => {
    const savedGame = localStorage.getItem('dragonRepellerSave');
    if (savedGame) {
      setHasSavedGame(true);
    }
  }, []);

  // Auto-save game state
  useEffect(() => {
    const gameState: GameState = {
      xp,
      health,
      maxHealth,
      gold,
      currentWeapon,
      inventory,
      level
    };
    localStorage.setItem('dragonRepellerSave', JSON.stringify(gameState));
  }, [xp, health, maxHealth, gold, currentWeapon, inventory, level]);

  // Level up system
  useEffect(() => {
    const xpNeeded = level * 100;
    if (xp >= xpNeeded) {
      setLevel(level + 1);
      const newMaxHealth = maxHealth + 20;
      setMaxHealth(newMaxHealth);
      setHealth(newMaxHealth);
      setGameText(`🎉 LEVEL UP! You are now level ${level + 1}! Max health increased to ${newMaxHealth}.`);
    }
  }, [xp, level, maxHealth]);

  // Load saved game
  const loadGame = () => {
    const savedGame = localStorage.getItem('dragonRepellerSave');
    if (savedGame) {
      const gameState: GameState = JSON.parse(savedGame);
      setXp(gameState.xp);
      setHealth(gameState.health);
      setMaxHealth(gameState.maxHealth);
      setGold(gameState.gold);
      setCurrentWeapon(gameState.currentWeapon);
      setInventory(gameState.inventory);
      setLevel(gameState.level);
      setHasSavedGame(false);
      setGameText('Game loaded! Welcome back, hero.');
    }
  };

  // New game
  const newGame = () => {
    setHasSavedGame(false);
    restart();
  };

  // Show damage number animation
  const showDamage = (value: number, type: 'damage' | 'heal' = 'damage') => {
    setDamageNumber({ value, type });
    setTimeout(() => setDamageNumber(null), 1000);
  };

  // Game functions
  const update = (locationIndex: number) => {
    setCurrentLocation(locationIndex);
    setGameText(locations[locationIndex].text);
    setShowMonsterStats(false);
  };

  const goTown = () => update(0);
  const goStore = () => update(1);
  const goCave = () => update(2);
  const goDungeon = () => update(3);
  const goMountains = () => update(9);
  const goCastle = () => update(10);

  const buyHealth = () => {
    if (gold >= 10) {
      setGold(gold - 10);
      const healAmount = 10;
      const newHealth = Math.min(health + healAmount, maxHealth);
      setHealth(newHealth);
      showDamage(healAmount, 'heal');
      setGameText(`You bought 10 health for 10 gold. Current health: ${newHealth}/${maxHealth}`);
    } else {
      setGameText('You do not have enough gold to buy health.');
    }
  };

  const buyWeapon = () => {
    if (currentWeapon < weapons.length - 1) {
      if (gold >= 30) {
        setGold(gold - 30);
        const newWeaponIndex = currentWeapon + 1;
        setCurrentWeapon(newWeaponIndex);
        const newWeapon = weapons[newWeaponIndex].name;
        setInventory([...inventory, newWeapon]);
        setGameText(`You now have a ${newWeapon} (${weapons[newWeaponIndex].power} power)! In your inventory you have: ${[...inventory, newWeapon].join(', ')}`);
      } else {
        setGameText('You do not have enough gold to buy a weapon.');
      }
    } else {
      setGameText('You already have the most powerful weapon!');
    }
  };

  const sellWeapon = () => {
    if (inventory.length > 1) {
      setGold(gold + 15);
      const newInventory = [...inventory];
      const soldWeapon = newInventory.shift();
      setInventory(newInventory);
      setGameText(`You sold a ${soldWeapon}. In your inventory you have: ${newInventory.join(', ')}`);
    } else {
      setGameText("Don't sell your only weapon!");
    }
  };

  const fightSlime = () => { setFighting(0); goFight(0); };
  const fightBeast = () => { setFighting(1); goFight(1); };
  const fightGoblin = () => { setFighting(2); goFight(2); };
  const fightSkeleton = () => { setFighting(3); goFight(3); };
  const fightTroll = () => { setFighting(4); goFight(4); };
  const fightVampire = () => { setFighting(5); goFight(5); };
  const fightKnight = () => { setFighting(6); goFight(6); };
  const fightDragon = () => { setFighting(7); goFight(7); };

  const goFight = (monsterIndex: number) => {
    update(4);
    const mHealth = monsters[monsterIndex].health;
    setMonsterHealth(mHealth);
    setMaxMonsterHealth(mHealth);
    setShowMonsterStats(true);
  };

  const getMonsterAttackValue = (level: number) => {
    const hit = level * 5 - Math.floor(Math.random() * xp);
    return hit > 0 ? hit : 0;
  };

  const isMonsterHit = () => {
    return Math.random() > 0.2 || health < 20;
  };

  const attack = () => {
    if (fighting === null) return;

    let text = `The ${monsters[fighting].name} attacks. `;

    const damage = getMonsterAttackValue(monsters[fighting].level);
    const newHealth = health - damage;
    setHealth(newHealth);
    showDamage(damage, 'damage');
    text += `You take ${damage} damage! `;

    let newMonsterHealth = monsterHealth;
    if (isMonsterHit()) {
      const playerDamage = weapons[currentWeapon].power + Math.floor(Math.random() * (xp / 10)) + 1;
      newMonsterHealth = monsterHealth - playerDamage;
      setMonsterHealth(newMonsterHealth);
      text += `You attack with your ${weapons[currentWeapon].name} and deal ${playerDamage} damage!`;
    } else {
      text += ' You miss.';
    }

    // Weapon breaking
    if (Math.random() <= 0.1 && inventory.length !== 1) {
      const newInventory = [...inventory];
      const brokenWeapon = newInventory.pop();
      setInventory(newInventory);
      setCurrentWeapon(currentWeapon - 1);
      text += ` Your ${brokenWeapon} breaks!`;
    }

    setGameText(text);

    if (newHealth <= 0) {
      lose();
    } else if (newMonsterHealth <= 0) {
      if (fighting === 7) {
        winGame();
      } else {
        defeatMonster();
      }
    }
  };

  const dodge = () => {
    if (fighting !== null) {
      setGameText(`You dodge the attack from the ${monsters[fighting].name}!`);
    }
  };

  const defeatMonster = () => {
    if (fighting === null) return;
    const goldGained = Math.floor(monsters[fighting].level * 6.7);
    const xpGained = monsters[fighting].level * 10;
    setGold(gold + goldGained);
    setXp(xp + xpGained);
    update(5);
    setTimeout(() => {
      setGameText(`The ${monsters[fighting].emoji} ${monsters[fighting].name} is defeated! You gained ${xpGained} XP and ${goldGained} gold!`);
    }, 100);
  };

  const lose = () => {
    update(6);
  };

  const winGame = () => {
    update(7);
  };

  const restart = () => {
    setXp(0);
    setLevel(1);
    setHealth(100);
    setMaxHealth(100);
    setGold(50);
    setCurrentWeapon(0);
    setInventory(['stick']);
    setFighting(null);
    setMonsterHealth(0);
    setMaxMonsterHealth(0);
    localStorage.removeItem('dragonRepellerSave');
    goTown();
  };

  const easterEgg = () => { update(8); };
  const pickTwo = () => pick(2);
  const pickEight = () => pick(8);

  const pick = (guess: number) => {
    const numbers: number[] = [];
    while (numbers.length < 10) {
      numbers.push(Math.floor(Math.random() * 11));
    }

    let text = `You picked ${guess}. Here are the random numbers:\n${numbers.join(', ')}`;

    if (numbers.includes(guess)) {
      text += '\nRight! You win 20 gold!';
      setGold(gold + 20);
    } else {
      text += '\nWrong! You lose 10 health!';
      const newHealth = health - 10;
      setHealth(newHealth);
      if (newHealth <= 0) {
        setTimeout(() => lose(), 100);
      }
    }
    setGameText(text);
  };

  // Function dispatcher
  const executeFunction = (functionName: string) => {
    const functions: { [key: string]: () => void } = {
      goTown, goStore, goCave, goDungeon, goMountains, goCastle,
      buyHealth, buyWeapon, sellWeapon,
      fightSlime, fightBeast, fightGoblin, fightSkeleton, fightTroll, fightVampire, fightKnight, fightDragon,
      attack, dodge, restart, easterEgg, pickTwo, pickEight
    };

    if (functions[functionName]) {
      functions[functionName]();
    }
  };

  // Continue/New Game screen
  if (hasSavedGame) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-700 p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Welcome Back, Hero!</h2>
          <p className="text-gray-300 mb-8">Continue your adventure or start fresh?</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={loadGame}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              📂 Continue Game
            </button>
            <button
              onClick={newGame}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              🆕 New Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto relative">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200">
        {/* Stats with Progress Bars */}
        <div className="bg-gradient-to-r from-primary to-primary-light p-6 text-white relative">
          {/* Damage number animation */}
          {damageNumber && (
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold animate-bounce ${
                damageNumber.type === 'damage' ? 'text-red-500' : 'text-green-500'
              }`}
              style={{ animation: 'fadeUp 1s ease-out forwards' }}
            >
              {damageNumber.type === 'damage' ? '-' : '+'}{damageNumber.value}
            </div>
          )}

          <div className="space-y-3">
            {/* Level */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-sm font-semibold">⭐ Level {level}</span>
            </div>

            {/* Health Bar */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold">❤️ Health</span>
                <span className="text-sm font-bold">{health}/{maxHealth}</span>
              </div>
              <div className="h-6 bg-gray-900/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300 flex items-center justify-end pr-2"
                  style={{ width: `${(health / maxHealth) * 100}%` }}
                >
                  <span className="text-xs font-bold">{Math.round((health / maxHealth) * 100)}%</span>
                </div>
              </div>
            </div>

            {/* XP Bar */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold">✨ XP</span>
                <span className="text-sm font-bold">{xp}/{level * 100}</span>
              </div>
              <div className="h-6 bg-gray-900/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 flex items-center justify-end pr-2"
                  style={{ width: `${(xp / (level * 100)) * 100}%` }}
                >
                  <span className="text-xs font-bold">{Math.round((xp / (level * 100)) * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Gold */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">💰 Gold</span>
              <span className="px-4 py-1 bg-yellow-300 text-gray-900 rounded-full font-bold">{gold}</span>
            </div>

            {/* Current Weapon */}
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold">⚔️ Weapon</span>
              <span className="font-bold">{weapons[currentWeapon].name} ({weapons[currentWeapon].power} power)</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 bg-gray-50 border-b-2 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {locations[currentLocation].buttonText.map((text, index) => (
              <button
                key={index}
                onClick={() => executeFunction(locations[currentLocation].buttonFunctions[index])}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105"
              >
                {text}
              </button>
            ))}
          </div>
        </div>

        {/* Monster Stats with Progress Bar */}
        {showMonsterStats && fighting !== null && (
          <div className="p-4 bg-gradient-to-r from-red-600 to-red-700 text-white border-b-2 border-red-800">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{monsters[fighting].emoji}</span>
                  <span className="font-bold capitalize text-lg">{monsters[fighting].name}</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Lvl {monsters[fighting].level}</span>
                </div>
                <span className="text-sm font-bold">{monsterHealth}/{maxMonsterHealth}</span>
              </div>
              <div className="h-4 bg-gray-900/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-300"
                  style={{ width: `${(monsterHealth / maxMonsterHealth) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Game Text */}
        <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-[200px]">
          <p className="text-lg leading-relaxed whitespace-pre-line">{gameText}</p>
        </div>

        {/* Secret Easter Egg Trigger */}
        <div className="p-4 bg-gray-100 text-center">
          <button
            onClick={easterEgg}
            className="text-xs text-gray-400 hover:text-primary transition-colors"
          >
            🥚
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-50px);
          }
        }
      `}</style>
    </div>
  );
}
