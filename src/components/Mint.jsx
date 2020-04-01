/* eslint jsx-a11y/no-static-element-interactions: 0 */
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
  console.log('MAX', max);

  return (
    <div className="mint-container">
      <div className="left">
        <div className="amount">
          {slider}
        </div>
        <div className="symbol">{symbol}</div>
        <div className="slider-wrapper">
          <Slider
            min={0}
            max={max}
            step={step}
            onChange={sliderChange}
            value={slider}
            vertical={false}
          />
        </div>
        <button type="button" className="btn">
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
          {Object.keys(tokens).map((key) => <Asset database={database} key={key} token={key} />)}
        </div>
      </div>
    </div>
  );
};

Mint.defaultProps = {
  config: {
    mint: {
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
