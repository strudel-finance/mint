import BigNumber from 'bignumber.js';
import React from 'react';
import PropTypes from 'prop-types';

import { amountFormatter } from '@pie-dao/utils';
import { view } from '@risingstack/react-easy-state';

import mint from '../store';

const Asset = ({ decimalShift, token }) => {
  const {
    balance,
    color,
    symbol,
    weight,
  } = mint.tokens[token];

  const { amount } = mint;
  const amt = BigNumber(amount(token, decimalShift));
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
          {amountFormatter({ amount: amt, displayDecimals: decimalShift })}
          &nbsp;of&nbsp;
          {amountFormatter({ amount: balance, displayDecimals: decimalShift })}
          &nbsp;
          {symbol}
        </div>
      </div>
      <div className="asset-weight" style={{ backgroundColor: color }}>
        {weight.toFixed(2)}
        %
      </div>
    </div>
  );
};

Asset.propTypes = {
  // database: PropTypes.instanceOf(BlockchainDatabase).isRequired,
  decimalShift: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired,
};

export default view(Asset);
