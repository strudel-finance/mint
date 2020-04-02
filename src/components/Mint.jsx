/* eslint jsx-a11y/no-static-element-interactions: 0 */
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import React from 'react';
import Slider from 'rc-slider';

import { BlockchainDatabase } from '@pie-dao/blockchain';
import { view } from '@risingstack/react-easy-state';

import Asset from './Asset';
import Chart from './Chart';
import mint from '../store';

const Mint = ({
  config: {
    mint: {
      decimalPlaces,
      step,
    },
  },
  database,
  text: {
    mint: {
      descriptor,
      liquidityText,
      verb,
    },
  },
}) => {
  const {
    mintable,
    slider,
    sliderChange,
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

  const displayAmount = BigNumber(slider).dividedBy(10 ** decimalPlaces).toString();
  const sliderStep = BigNumber(step).multipliedBy(10 ** decimalPlaces).toNumber();
  const { symbol } = mintable;

  const max = sliderMax(decimalPlaces);

  return (
    <div className="mint-container">
      <div className="left">
        <div className="amount">
          {displayAmount}
        </div>
        <div className="symbol">{symbol}</div>
        <div className="slider-wrapper">
          <Slider
            min={0}
            max={max}
            step={sliderStep}
            onChange={sliderChange}
            value={slider}
            vertical={false}
          />
        </div>
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
          <h1 className="title">
            {descriptor}
            &nbsp;
            Breakdown
          </h1>
          <Chart />
          <div className="normal">
            {liquidityText}
          </div>
        </div>
        <div className="column">
          {Object.keys(tokens).map((key) => (
            <Asset database={database} key={key} token={key} decimalShift={decimalPlaces} />
          ))}
        </div>
      </div>
    </div>
  );
};

Mint.defaultProps = {
  config: {
    mint: {
      decimalPlaces: 0,
      step: 0.1,
    },
  },
  text: {
    mint: {
      descriptor: 'Liquidity',
      liquidityText: '',
      verb: 'Add',
    },
  },
};

Mint.propTypes = {
  config: PropTypes.shape({
    mint: PropTypes.shape({
      decimalPlaces: PropTypes.number,
      step: PropTypes.number,
    }),
  }),
  database: PropTypes.instanceOf(BlockchainDatabase).isRequired,
  text: PropTypes.shape({
    mint: PropTypes.shape({
      descriptor: PropTypes.string,
      liquidityText: PropTypes.string,
      verb: PropTypes.string,
    }),
  }),
};

export default view(Mint);
