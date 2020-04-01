import BigNumber from 'bignumber.js';
import React from 'react';
import PropTypes from 'prop-types';

// import { BlockchainDatabase } from '@pie-dao/blockchain';
// import { eth } from '@pie-dao/eth';
import { view } from '@risingstack/react-easy-state';

import mint from '../store';

const round = (weight) => BigNumber(weight).decimalPlaces(2).toFixed();
/*
const stores = {};

const fetchStore = ({ database, token }) => {
  const tokenStore = stores[token];

  if (tokenStore) {
    return tokenStore;
  }

  const { tokens } = mint;
  const {
    address,
    symbol,
    weight,
    color = 'black',
  } = tokens[token];

  const newStore = store({
    address,
    color,
    symbol,
    weight,

    balance: BigNumber(0),
  });

  stores[token] = newStore;

  const { account } = eth;

  database.subscribe(`${account}.${address}.balance`, (key, { balance }) => {
    console.log('GOT BALANCE FOR', key, token, balance, balance.toString());
    mint.tokens[token].balance = balance;
    newStore.balance = balance;
  });

  database.balance({ address: account, token: address });

  return newStore;
};
*/

const Asset = ({ token }) => {
  // const tokenStore = fetchStore({ database, token });

  const {
    balance,
    color,
    symbol,
    weight,
  } = mint.tokens[token];

  console.log('FROM STORE', token, balance.toString());

  const { amount } = mint;
  const amt = BigNumber(amount(token)).toFixed();
  const available = !balance.isZero() && balance.isGreaterThanOrEqualTo(amt);

  return (
    <div className="asset-container">
      <div className="asset-left">
        <div className={available ? 'asset-available bg-green' : 'asset-available bg-pink'}>
          <img className="icon" alt="available" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4IDBDOC4wNTkgMCAwIDguMDU5IDAgMThDMCAyNy45NDEgOC4wNTkgMzYgMTggMzZDMjcuOTQxIDM2IDM2IDI3Ljk0MSAzNiAxOEMzNiA4LjA1OSAyNy45NDEgMCAxOCAwWk0yOC42NDUgMTIuNDY5TDE3LjY0NSAyNS40NjlDMTcuMSAyNi4xMTEgMTYuMTQxIDI2LjE3OCAxNS41MTIgMjUuNjI5TDcuNTEyIDE4LjYyOUM2Ljg4OCAxOC4wODQgNi44MjUgMTcuMTM2IDcuMzcxIDE2LjUxMkM3LjkxNiAxNS44ODggOC44NjQgMTUuODI1IDkuNDg4IDE2LjM3MUwxNi4zNCAyMi4zNjdMMjYuMzU2IDEwLjUzMkMyNi44OTEgOS45IDI3LjgzNiA5LjgyMSAyOC40NjkgMTAuMzU2QzI5LjEwMiAxMC44OTEgMjkuMTggMTEuODM2IDI4LjY0NSAxMi40NjlaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K" />
          <div className="asset-label">
            {available ? 'Avail' : 'Insuf'}
          </div>
        </div>
        <div className="asset-amount">
          {amt}
          &nbsp;of&nbsp;
          {balance.toFixed(6)}
          &nbsp;
          {symbol}
        </div>
      </div>
      <div className="asset-weight" style={{ backgroundColor: color }}>
        {round(weight)}
        %
      </div>
    </div>
  );
};

Asset.propTypes = {
  // database: PropTypes.instanceOf(BlockchainDatabase).isRequired,
  token: PropTypes.string.isRequired,
};

export default view(Asset);
