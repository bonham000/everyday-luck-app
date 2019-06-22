import { Dimensions } from "react-native";

/** ========================================================================
 * Dimension adjustments for smaller screens
 * =========================================================================
 */

const HEIGHT = Dimensions.get("window").height;

const SMALL_DEVICE = HEIGHT < 725;

/** ========================================================================
 * Export
 * =========================================================================
 */

export { SMALL_DEVICE };
