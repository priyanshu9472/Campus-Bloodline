/**
 * Converts units to milliliters, assuming 1 unit = 450 ml.
 *
 * @param {number} units - The number of units to be converted.
 * @returns {number} - The equivalent volume in milliliters.
 */
export function unitsToMl(units) {
    const UNIT_VOLUME = 450; // 1 unit = 450 ml
    return units * UNIT_VOLUME;
  }
