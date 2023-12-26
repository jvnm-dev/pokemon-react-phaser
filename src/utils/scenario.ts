import { Types } from "phaser";
import { getTiledObjectProperty } from "./object";
import { useUserDataStore } from "../stores/userData";

export const getFirstPossibleScenario = (object: Types.Tilemaps.TiledObject) => {
    const scenarioIds = getTiledObjectProperty("scenario_ids", object).split(",");
    const loopLastScenario = !!getTiledObjectProperty("loop_last_scenario", object);

    const firstPossibleScenario =  Number(
        scenarioIds.find((scenarioId) => {
        return !useUserDataStore
            .getState()
            .hasCompletedScenario(Number(scenarioId));
        }),
    );

    if (!Number.isNaN(firstPossibleScenario)) {
        return firstPossibleScenario;
    }

    if (loopLastScenario) {
        return Number(scenarioIds[scenarioIds.length - 1]);
    }

    return;
}