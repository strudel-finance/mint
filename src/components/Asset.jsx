import BigNumber from 'bignumber.js';
import React from 'react';
import PropTypes from 'prop-types';

import { BlockchainDatabase } from '@pie-dao/blockchain';
import { eth } from '@pie-dao/eth';
import { view } from 'react-easy-state';

import mint from '../store';

const round = (weight) => BigNumber(weight).decimalPlaces(2).toFixed();

const Asset = ({ database, token }) => {
  const address = eth.account;
  const balance = database.balance({ address, token });
  const { amount } = mint;
  const { symbol, weight, color = 'black' } = mint[token];

  const amt = BigNumber(amount(token)).toFixed();
  const available = balance.isGreaterThanOrEqual(amt);

  return (
    <div className="single-asset">
      <div className="asset-left">
        <div className={available ? 'availability bg-green' : 'availability bg-pink'}>
          <img className="icon" alt="available" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4IDBDOC4wNTkgMCAwIDguMDU5IDAgMThDMCAyNy45NDEgOC4wNTkgMzYgMTggMzZDMjcuOTQxIDM2IDM2IDI3Ljk0MSAzNiAxOEMzNiA4LjA1OSAyNy45NDEgMCAxOCAwWk0yOC42NDUgMTIuNDY5TDE3LjY0NSAyNS40NjlDMTcuMSAyNi4xMTEgMTYuMTQxIDI2LjE3OCAxNS41MTIgMjUuNjI5TDcuNTEyIDE4LjYyOUM2Ljg4OCAxOC4wODQgNi44MjUgMTcuMTM2IDcuMzcxIDE2LjUxMkM3LjkxNiAxNS44ODggOC44NjQgMTUuODI1IDkuNDg4IDE2LjM3MUwxNi4zNCAyMi4zNjdMMjYuMzU2IDEwLjUzMkMyNi44OTEgOS45IDI3LjgzNiA5LjgyMSAyOC40NjkgMTAuMzU2QzI5LjEwMiAxMC44OTEgMjkuMTggMTEuODM2IDI4LjY0NSAxMi40NjlaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K" />
          <div className="liquidity-label">
            {available ? 'Avail' : 'Insuf'}
          </div>
        </div>
        <div className="asset-amount">
          {amt}
          &nbsp;
          {symbol}
        </div>
      </div>
      <div className={`asset-weight bg-${color}`}>
        {round(weight)}
        %
      </div>
    </div>
  );
};

Asset.propTypes = {
  database: PropTypes.instanceOf(BlockchainDatabase).isRequired,
  token: PropTypes.string.isRequired,
};

export default view(Asset);
