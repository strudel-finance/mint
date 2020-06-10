import BigNumber from 'bignumber.js';

import { eth } from '@pie-dao/eth';
import {
  isPOJO,
  validateIsAddress,
  validateIsBigNumber,
  validateIsFunction,
  validateIsString,
} from '@pie-dao/utils';
import { store } from '@risingstack/react-easy-state';

const exampleTokenConfig = {
  address: '0x...',
  amountPerUnit: 'BigNumber(0.0002345)',
  color: '#000000',
  symbol: 'DOUGH',
  weight: 'BigNumber(10)',
};

const internal = {
  database: undefined,
};

const logPrefix = (functionName) => `@pie-dao/mint - mint#${functionName}`;

const validateTokenConfig = (name, obj, skipWeight = false) => {
  const prefix = '@pie-dao/mint - validateTokenConfig';

  if (!isPOJO(obj)) {
    const message = `${prefix}: Missing or invalid token config object for ${name}`;
    console.error(message, 'Example', exampleTokenConfig);
    throw new TypeError(message);
  }

  validateIsAddress(obj.address, { prefix, message: `Invalid address for token ${name}` });
  validateIsString(obj.symbol, {
    prefix,
    message: `Invalid symbol for token ${name}. Must be a string.`,
  });
  validateIsBigNumber(obj.amountPerUnit, {
    prefix,
    message: `Invalid amount per unit for token ${name}. Must be a BigNumber.`,
  });

  if (!skipWeight) {
    const weightMessage = `Invalid weight for token ${name}. `
      + 'Must be a positive BigNumber with a value of 100 or below.';
    validateIsBigNumber(obj.weight, { prefix, message: weightMessage });
    if (obj.weight.isGreaterThan(100) || obj.weight.isLessThanOrEqualTo(0)) {
      throw new TypeError(`${prefix}: ${weightMessage}`);
    }
  }
};

const validateTotalWeight = (tokens) => {
  const prefix = '@pie-dao/mint - validateTotalWeight';
  const keys = Object.keys(tokens);
  const totalWeight = keys.reduce((acc, key) => acc.plus(tokens[key].weight), BigNumber(0));

  if (totalWeight.isGreaterThan(100)) {
    throw new TypeError(
      `${prefix}: Token weights cannot exceed 100. Got: ${totalWeight.toString()}`,
    );
  }
};

const mint = store({
  initialized: false,
  mintable: undefined,
  slider: 0,
  submit: () => {
    throw new Error(
      `${logPrefix('submit')} is not implemented. Please pass it to ${logPrefix('init')}`,
    );
  },
  tokens: {},

  amount: (token) => {
    const { slider, tokens } = mint;

    if (BigNumber(slider).isNaN()) {
      return BigNumber(0);
    }

    return BigNumber(slider)
      .multipliedBy(tokens[token].amountPerUnit);
  },
  init: ({
    database,
    mintable,
    submit,
    tokens,
  }) => {
    const prefix = logPrefix('init');
    const { account } = eth;

    if (!account) {
      throw new Error(`${prefix} should not be called without an account`);
    }

    if (mint.initialized) {
      throw new Error(`${prefix} is already initialized`);
    }
    internal.database = database;

    validateIsFunction(submit, { prefix, message: '\'submit\' is not a function.' });
    mint.submit = submit;

    validateTokenConfig('mintable', mintable, true);
    mint.mintable = mintable;

    const keys = Object.keys(tokens);
    keys.forEach((key) => {
      validateTokenConfig(key, tokens[key]);
    });

    validateTotalWeight(tokens);

    mint.tokens = { ...tokens };

    eth.on('accountChanged', (message, data) => {
      mint.initializeTokens(data.account);
    });

    mint.initializeTokens(account);

    mint.initialized = true;
  },
  initializeTokens: (account) => {
    const keys = Object.keys(mint.tokens);
    const { database } = internal;

    keys.forEach((key) => {
      if (mint.tokens[key].balanceSubscription) {
        database.unsubscribe(mint.tokens[key].balanceSubscription);
      }

      mint.tokens[key].balance = BigNumber(0);

      const { address } = mint.tokens[key];
      const uuid = `${account}.${address}.balance`;

      mint.tokens[key].balanceSubscription = database.subscribe(uuid, (message, { balance }) => {
        if (message.split('.')[0] === eth.account.toLowerCase()) {
          mint.tokens[key].balance = balance;
        }
      });

      setTimeout(() => {
        database.balance({ address: account, token: address });
      }, 1000);
    });
  },
  inputChange: (evt) => {
    const { value } = evt.target;
    console.log('VALUE', value);
    mint.slider = value;
  },
  sliderChange: (value) => {
    mint.slider = value;
  },
  sliderMax: (decimalShift = 0) => {
    const { tokens } = mint;

    return Object.keys(tokens).reduce((acc, key) => {
      const { amountPerUnit, balance } = tokens[key];
      const localMax = balance.dividedBy(amountPerUnit);
      return localMax.isLessThan(acc) ? localMax : acc;
    }, BigNumber(10000))
      .multipliedBy(10 ** decimalShift)
      .decimalPlaces(0)
      .toNumber();
  },
  updateTokens: (tokens) => {
    const keys = Object.keys(mint.tokens);
    const properties = ['amountPerUnit', 'color', 'weight'];
    const updatedTokens = { ...mint.tokens };

    keys.forEach((key) => {
      const update = { ...updatedTokens[key] };

      properties.forEach((property) => {
        if (tokens[key] && tokens[key][property]) {
          update[property] = tokens[key][property];
        }
      });

      validateTokenConfig(key, update);

      updatedTokens[key] = update;
    });

    validateTotalWeight(updatedTokens);

    mint.tokens = updatedTokens;
  },
});

export default mint;
