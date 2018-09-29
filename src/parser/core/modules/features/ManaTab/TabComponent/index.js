import React from 'react';
import PropTypes from 'prop-types';

import Tab from 'interface/others/Tab';

import ManaLevelGraph from './ManaLevelGraph';
import ManaUsageGraph from './ManaUsageGraph';

const Mana = ({ parser }) => (
  <Tab style={{ padding: '15px 22px' }}>
    <h1>Mana pool</h1>
    <ManaLevelGraph
      reportCode={parser.report.code}
      actorId={parser.playerId}
      start={parser.fight.start_time}
      end={parser.fight.end_time}
      manaUpdates={parser._modules.manaValues.manaUpdates}
      currentTimestamp={parser.currentTimestamp}
    /> {/* the currentTimestamp makes sure the Mana tab re-renders after parsing events */}

    <h1>Mana usage</h1>
    <ManaUsageGraph
      start={parser.fight.start_time}
      end={parser.fight.end_time}
      healingBySecond={parser._modules.healingDone.bySecond}
      manaUpdates={parser._modules.manaValues.manaUpdates}
      timestamp={parser.currentTimestamp}
    /> {/* the currentTimestamp makes sure the Mana tab re-renders after parsing events */}
  </Tab>
);
Mana.propTypes = {
  parser: PropTypes.object.isRequired,
};

export default Mana;