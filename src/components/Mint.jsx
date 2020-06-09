/* eslint jsx-a11y/no-static-element-interactions: 0 */
import PropTypes from 'prop-types';
import React from 'react';

import { BlockchainDatabase } from '@pie-dao/blockchain';
import { view } from '@risingstack/react-easy-state';

import Asset from './Asset';
import Chart from './Chart';
import mint from '../store';

const Mint = ({
  database,
  text: {
    mint: {
      descriptor,
      chartHeader,
      liquidityText,
      verb,
    },
  },
}) => {
  const {
    inputChange,
    mintable,
    slider,
    sliderMax,
    submit,
    tokens,
  } = mint;

  if (!database) {
    throw new TypeError(
      '@pie-dao/mint - <Mint /> - Key \'database\' is missing from props. Please make sure '
      + 'to include an initialized instance of BlockchainDatabase from @pie-dao/blockchain',
    );
  }

  if (!mintable) {
    return '';
  }

  const { symbol } = mintable;

  const max = sliderMax();

  return (
    <div className="mint-container">
      <div className="left">
        <div className="amount">
          <input
            type="number"
            className="w-100pc"
            min={0}
            max={max}
            value={slider}
            onChange={inputChange}
          />
        </div>
        <div className="symbol">{symbol}</div>
        <button
          type="button"
          className="btn"
          onClick={(e) => {
            e.preventDefault();
            console.log('firing submit');
            submit();
          }}
        >
          {verb}
          &nbsp;
          {descriptor}
        </button>
      </div>
      <div className="right">
        <div className="column">
          <h1 className="title" dangerouslySetInnerHTML={{ __html: chartHeader }} />
          <Chart />
          <div className="normal" dangerouslySetInnerHTML={{ __html: liquidityText }} />
        </div>
        <div className="column">
          {Object.keys(tokens).map((key) => (
            <Asset database={database} key={key} token={key} decimalShift={0} />
          ))}
        </div>
      </div>
    </div>
  );
};

Mint.defaultProps = {
  text: {
    mint: {
      descriptor: 'Liquidity',
      chartHeader: 'Allocation',
      liquidityText: '',
      verb: 'Add',
    },
  },
};

Mint.propTypes = {
  database: PropTypes.instanceOf(BlockchainDatabase).isRequired,
  text: PropTypes.shape({
    mint: PropTypes.shape({
      descriptor: PropTypes.string,
      liquidityText: PropTypes.string,
      chartHeader: PropTypes.string,
      verb: PropTypes.string,
    }),
  }),
};

export default view(Mint);
