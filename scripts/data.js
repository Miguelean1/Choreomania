// data.js - Define los sprites disponibles

export const availableSprites = [
  { 
    id: 1, 
    color: '#FF6B6B',
    name: 'Red',
    fullbody: './sprites/red-full.png', 
    icon: './sprites/red-icon.png' 
  },
  { 
    id: 2, 
    color: '#4ECDC4',
    name: 'Cyan',
    fullbody: './sprites/cyan-full.png', 
    icon: './sprites/cyan-icon.png' 
  },
  { 
    id: 3, 
    color: '#45B7D1',
    name: 'Blue',
    fullbody: './sprites/blue-full.png', 
    icon: './sprites/blue-icon.png' 
  },
  { 
    id: 4, 
    color: '#FFA07A',
    name: 'Salmon',
    fullbody: './sprites/salmon-full.png', 
    icon: './sprites/salmon-icon.png' 
  },
  { 
    id: 5, 
    color: '#98D8C8',
    name: 'Mint',
    fullbody: './sprites/mint-full.png', 
    icon: './sprites/mint-icon.png' 
  },
  { 
    id: 6, 
    color: '#F7DC6F',
    name: 'Yellow',
    fullbody: './sprites/yellow-full.png', 
    icon: './sprites/yellow-icon.png' 
  },
  { 
    id: 7, 
    color: '#BB8FCE',
    name: 'Purple',
    fullbody: './sprites/purple-full.png', 
    icon: './sprites/purple-icon.png' 
  },
  { 
    id: 8, 
    color: '#85C1E2',
    name: 'Sky',
    fullbody: './sprites/sky-full.png', 
    icon: './sprites/sky-icon.png' 
  },
  { 
    id: 9, 
    color: '#F8B739',
    name: 'Orange',
    fullbody: './sprites/orange-full.png', 
    icon: './sprites/orange-icon.png' 
  },
  { 
    id: 10, 
    color: '#52B788',
    name: 'Green',
    fullbody: './sprites/green-full.png', 
    icon: './sprites/green-icon.png' 
  },
  { 
    id: 11, 
    color: '#E63946',
    name: 'Crimson',
    fullbody: './sprites/crimson-full.png', 
    icon: './sprites/crimson-icon.png' 
  },
  { 
    id: 12, 
    color: '#457B9D',
    name: 'Navy',
    fullbody: './sprites/navy-full.png', 
    icon: './sprites/navy-icon.png' 
  },
  { 
    id: 13, 
    color: '#F4A261',
    name: 'Peach',
    fullbody: './sprites/peach-full.png', 
    icon: './sprites/peach-icon.png' 
  },
  { 
    id: 14, 
    color: '#2A9D8F',
    name: 'Teal',
    fullbody: './sprites/teal-full.png', 
    icon: './sprites/teal-icon.png' 
  },
  { 
    id: 15, 
    color: '#E76F51',
    name: 'Coral',
    fullbody: './sprites/coral-full.png', 
    icon: './sprites/coral-icon.png' 
  },
  { 
    id: 16, 
    color: '#264653',
    name: 'Dark',
    fullbody: './sprites/dark-full.png', 
    icon: './sprites/dark-icon.png' 
  }
];

// Clase Contestant
export class Contestant {
  constructor(spriteData, name) {
    this.id = spriteData.id;
    this.color = spriteData.color;
    this.colorName = spriteData.name;
    this.fullbody = spriteData.fullbody;
    this.icon = spriteData.icon;
    this.name = name;
    this.status = 'active'; // 'active', 'saved', 'eliminated'
  }
}
