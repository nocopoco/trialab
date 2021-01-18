const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  website: {
    type: String,
  },
  company: {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  experiences: [
    {
      title: {
        type: String,
      },
      company: {
        type: String,
      },
      location: {
        type: String,
      },
      description: {
        type: String,
      },
      from: {
        type: Date,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
      },
    },
  ],
  skillsets: {
    type: [String],
  },
  social: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  friends: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    },
  ],
  networth: {
    type: Number,
    required: true,
    default: 1000,
  },
  land: {
    type: Number,
    required: true,
    default: 1000,
  },
  landUsed: {
    type: Number,
    required: true,
    default: 0,
  },
  money: {
    type: Number,
    required: true,
    default: 10000,
  },
  population: {
    type: Number,
    required: true,
    default: 500,
  },
  food: {
    type: Number,
    required: true,
    default: 1500,
  },
  nextIncrements: {
    money: {
      type: Number,
      default: 0,
    },
    population: {
      type: Number,
      default: 0,
    },
    food: {
      type: Number,
      default: 0,
    },
    land: {
      type: Number,
      default: 0,
    },
  },
  buildings: {
    intelligenceCamp: {
      quantity: {
        type: Number,
        default: 0,
      },
      totalSpace: {
        type: Number,
        default: 0,
      },
      availableSpace: {
        type: Number,
        default: 0,
      },
      usedSpace: {
        type: Number,
        default: 0,
      },
    },
    infantryCamp: {
      quantity: {
        type: Number,
        default: 0,
      },
      totalSpace: {
        type: Number,
        default: 0,
      },
      availableSpace: {
        type: Number,
        default: 0,
      },
      usedSpace: {
        type: Number,
        default: 0,
      },
    },
    tankGarage: {
      quantity: {
        type: Number,
        default: 0,
      },
      totalSpace: {
        type: Number,
        default: 0,
      },
      availableSpace: {
        type: Number,
        default: 0,
      },
      usedSpace: {
        type: Number,
        default: 0,
      },
    },
    airField: {
      quantity: {
        type: Number,
        default: 0,
      },
      totalSpace: {
        type: Number,
        default: 0,
      },
      availableSpace: {
        type: Number,
        default: 0,
      },
      usedSpace: {
        type: Number,
        default: 0,
      },
    },
    navalBase: {
      quantity: {
        type: Number,
        default: 0,
      },
      totalSpace: {
        type: Number,
        default: 0,
      },
      availableSpace: {
        type: Number,
        default: 0,
      },
      usedSpace: {
        type: Number,
        default: 0,
      },
    },
  },
  battleStats: {
    wins: {
      type: Number,
      default: 0,
    },
    losses: {
      type: Number,
      default: 0,
    },
    battles: [
      {
        result: {
          type: String,
        },
        description: {
          type: String,
        },
        from: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  intelligenceDivision: {
    recons: {
      type: Number,
      default: 0,
    },
    commandos: {
      type: Number,
      default: 0,
    },
    sabotages: [
      {
        result: {
          type: String,
        },
        description: {
          type: String,
        },
        target: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    intels: [
      {
        result: {
          type: String,
        },
        losses: {
          type: String,
        },
        intelligenceDivision: {
          recons: {
            type: Number,
          },
          commandos: {
            type: Number,
          },
        },
        infantryDivision: {
          attackPts: {
            type: Number,
          },
          defencePts: {
            type: Number,
          },
        },
        armouredDivision: {
          attackPts: {
            type: Number,
          },
          defencePts: {
            type: Number,
          },
        },
        airDivision: {
          attackPts: {
            type: Number,
          },
          defencePts: {
            type: Number,
          },
        },
        navalDivision: {
          attackPts: {
            type: Number,
          },
          defencePts: {
            type: Number,
          },
        },
        target: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
        },
        date: {
          type: String,
        },
      },
    ],
  },
  AnDLogs: [
    {
      type: {
        type: String, //Attack | Defend | Recon | BackStab | Exploration | Buildings || Military Creation
      },
      result: {
        type: String,
      },
      /*
      For My News TAB
      If type is 'Attack' => 
        if won:'Target: username(clickable). 5000 land gained. Destroyed 500 units. Lost 50 units.'
        if lost:'Target: username(clickable). 0 land gained. Destroyed 100 units. Lost 5000 units'
      If type is 'Defend' =>
        if won:'From: username(clickable). Destroyed 500 units. Lost 100 units'  
        if lost:'From: username(clickable). Destroyed 50 units. Lost 100 units'  
      If type is 'Recon' =>
        if won: 'From: username(clickable). Prevented scan. Destroyed 500 recons. Lost 10 recons'
        if lost: 'From: username(clickable). Got scanned. Destroyed 10 recons. Lost 200 recons'
      If type is 'Backstab' =>
        if won: 'From: username(clickable). Prevented backstab. Destroyed 500 commandos. Lost 10 commandos'
        if lost: 'From: username(clickable). Got backstabbed. Destroyed 10 commandos. Lost 1000 units'
        */
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
      description: {
        type: String,
      },
      read: {
        type: Boolean,
        default: false,
      },
      date: {
        type: String,
      },
    },
  ],
  infantryDivision: {
    infantry1: {
      researched: {
        type: Boolean,
        default: true,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
    infantry2: {
      researched: {
        type: Boolean,
        default: false,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
    infantry3: {
      researched: {
        type: Boolean,
        default: false,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
    infantry4: {
      researched: {
        type: Boolean,
        default: false,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
    attackPts: {
      type: Number,
      default: 0,
    },
    defencePts: {
      type: Number,
      default: 0,
    },
  },
  armouredDivision: {
    tank1: {
      researched: {
        type: Boolean,
        default: true,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
    tank2: {
      researched: {
        type: Boolean,
        default: false,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
    tank3: {
      researched: {
        type: Boolean,
        default: false,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
    tank4: {
      researched: {
        type: Boolean,
        default: false,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
    attackPts: {
      type: Number,
      default: 0,
    },
    defencePts: {
      type: Number,
      default: 0,
    },
  },
  airDivision: {
    air1: {
      researched: {
        type: Boolean,
        default: true,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
    air2: {
      researched: {
        type: Boolean,
        default: false,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
    air3: {
      researched: {
        type: Boolean,
        default: false,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
    air4: {
      researched: {
        type: Boolean,
        default: false,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
    attackPts: {
      type: Number,
      default: 0,
    },
    defencePts: {
      type: Number,
      default: 0,
    },
  },
  seaDivision: {
    sea1: {
      researched: {
        type: Boolean,
        default: true,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
    sea2: {
      researched: {
        type: Boolean,
        default: false,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
    sea3: {
      researched: {
        type: Boolean,
        default: false,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
    sea4: {
      researched: {
        type: Boolean,
        default: false,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
    attackPts: {
      type: Number,
      default: 0,
    },
    defencePts: {
      type: Number,
      default: 0,
    },
  },
  messages: [
    {
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      content: {
        type: String,
        required: true,
      },
      read: {
        type: Boolean,
        default: false,
      },
      date: {
        type: String,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('user', UserSchema);
module.exports = User;
