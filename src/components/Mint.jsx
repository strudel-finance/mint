/* eslint jsx-a11y/no-static-element-interactions: 0 */
import React from 'react';
import { view } from 'react-easy-state';
import Slider from 'rc-slider';
import PropTypes from 'prop-types';

import Asset from './Asset';
import Chart from './Chart';
import mint from '../store';

const Mint = ({
  config: {
    step,
  },
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
  const { symbol } = mintable;

  const max = sliderMax();

  return (
    <section className="content">
      <div className="liquidity-container lg:flex-row lg:w-94pc">
        <div className="liquidity-left lg:w-auto lg:m-0 lg:min-w-300px">
          <div className="liquidity-amount lg:text-liquidity-amount">
            {slider}
          </div>
          <div className="awp-label lg:text-big lg:leading-none lg:m-0">{symbol}</div>
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
          <button
            type="button"
            className="btn"
          >
            {verb}
            {descriptor}
          </button>
        </div>
        <div className="liquidity-right lg:w-auto lg:ml-2pc lg:tex-left lg:flex-row lg:flex-grow">
          <div className="liquidity-column lg:items-start lg:text-left lg:pl-3pc lg:pr-1pc lg:max-w-300px">
            <h1 className="title lg:text-left lg:text-big py-2pc">
              {descriptor}
              Breakdown
            </h1>
            <Chart />
            <div className="normal-text lg:m-0 lg:text-left py-2pc">
              {liquidityText}
            </div>
          </div>
          <div className="liquidity-column lg:flex-grow lg:pl-2pc lg:pr-3pc">
            {Object.keys(tokens).map((key) => <Asset token={key} />)}
          </div>
        </div>
      </div>
    </section>
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
  config: {
    mint: {
      step: PropTypes.number,
    },
  },
  text: PropTypes.shape({
    mint: PropTypes.shape({
      descriptor: PropTypes.string,
      liquidityText: PropTypes.string,
      verb: PropTypes.string,
    }),
  }),
};

export default view(Mint);
