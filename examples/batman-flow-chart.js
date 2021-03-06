import regent from '../lib/regent.min';

/* eslint no-console: 0 */

const isWearingBatSuit = items => items.every(item => item === true);

const customPredicates = {
  isWearingBatSuit,
};

const {
  and, or, not, explain, find, filter, evaluate,
} = regent.crown(customPredicates);

const data = {
  batmanGear: {
    mask: true,
    belt: true,
    armor: true,
  },

  indicators: {
    batSignal: true,
  },

  location: 'not near the bat cave',
};

const NOT_WEARING_BELT = { left: '@batmanGear.belt', fn: 'equals', right: false };
const NOT_WEARING_MASK = { left: '@batmanGear.mask', fn: 'equals', right: false };
const NOT_WEARING_ARMOR = { left: '@batmanGear.armor', fn: 'equals', right: false };

const NOT_READY_TO_GO = or(NOT_WEARING_ARMOR, NOT_WEARING_BELT, NOT_WEARING_MASK);

const IS_WEARING_FULL_SUIT = { left: ['@batmanGear.mask', '@batmanGear.belt', '@batmanGear.armor'], fn: 'isWearingBatSuit' };
const BAT_SIGNAL_IS_ON = { left: '@indicators.batSignal', fn: 'equals', right: true };
const BAT_SIGNAL_IS_OFF = not(BAT_SIGNAL_IS_ON);
const WEARING_SUIT_AND_SIGNAL_ON = and(IS_WEARING_FULL_SUIT, BAT_SIGNAL_IS_ON);
const NEAR_BAT_CAVE = { left: ['near the bat cave', 'in the bat cave'], fn: 'includes', right: '@location' };
const NOT_NEAR_BAT_CAVE = not(NEAR_BAT_CAVE);

const batmanDecision = [
  { action: 'Time to go!', rule: WEARING_SUIT_AND_SIGNAL_ON },
  { action: 'GET TO THE BAT CAVE!', rule: and(NOT_NEAR_BAT_CAVE, BAT_SIGNAL_IS_ON) },
  { action: 'Put on your utility belt', rule: NOT_WEARING_BELT },
  { action: 'Keep on keeping on, no worries', rule: BAT_SIGNAL_IS_OFF },
];

const { action } = find(batmanDecision, data);
console.log(action); // GET TO THE BAT CAVE!

data.batmanGear.mask = false;

console.log(evaluate(NOT_READY_TO_GO, data));
console.log(explain(NOT_READY_TO_GO, data));

const batmanClothingLogic = [
  { action: 'Put on belt', rule: NOT_WEARING_BELT },
  { action: 'Put on armor', rule: NOT_WEARING_ARMOR },
  { action: 'Put on mask', rule: NOT_WEARING_MASK },
];

data.batmanGear.armor = false;

const clothingLogic = filter(batmanClothingLogic, data);
console.log(clothingLogic);
