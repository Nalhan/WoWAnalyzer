import RESOURCE_TYPES from 'game/RESOURCE_TYPES';
import SPELLS from 'common/SPELLS';
import ResourceTracker from 'parser/core/modules/resourcetracker/ResourceTracker';

// Primal Fury may be slightly delayed.
const PRIMAL_FURY_WINDOW = 50; //ms

class ComboPointTracker extends ResourceTracker {
  /**
   * A critical hit from a generator triggers Primal Fury which gives an extra combo point.
   * A Feral druid should always build up 5 combo points and crits are unpredictable.
   * Generators used at 4 combo points that crit will waste the Primal Fury generation but
   * this is unavoidable, or at least shouldn't be avoided.
   */
  unavoidableWaste = 0;

  castToMaxCpTimestamp = null;

  constructor(...args) {
    super(...args);
    this.resource = RESOURCE_TYPES.COMBO_POINTS;
    this.maxResource = 5;
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;

    // T21 4pc set bonus can proc "free Ferocious Bite that counts as if it spent the full 5 CPs"
    // the energy cost is properly missing from the cast, but the CP cost shows very strangely. (amount: x, max: 5, cost: 5) where x is the amount of CPs you had on cast.
    // Returning before this CP cost can be processed to avoid messing up the results
    if ((spellId === SPELLS.FEROCIOUS_BITE.id) && event.classResources && !event.classResources.find(resource => resource.type === RESOURCE_TYPES.ENERGY.id)) {
      return;
    }
    super.on_byPlayer_cast(event);
  }

  _applyBuilder(spellId, resource, gain, waste) {
    const isMaxBefore = (this.current === this.maxResource);
    super._applyBuilder(spellId, resource, gain, waste);
    const isMaxAfter = (this.current === this.maxResource);

    if (!isMaxBefore && isMaxAfter) {
      this.castToMaxCpTimestamp = this.owner.currentTimestamp;
      return;
    }

    // primal fury procs that happen right after a cast that brought us to max CP shouldn't count as waste because it was out of the player's control
    if ((spellId === SPELLS.PRIMAL_FURY.id) &&
        ((this.owner.currentTimestamp - this.castToMaxCpTimestamp) < PRIMAL_FURY_WINDOW)) {
      this.unavoidableWaste += 1;
    }
  }
}

export default ComboPointTracker;
