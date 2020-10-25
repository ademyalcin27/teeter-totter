import Vue from 'vue'
import Vuex from 'vuex'
import {
    MAX_FALLING_INTERVAL_GAP,
    MIN_FALLING_INTERVAL_GAP,
    MIN_WEIGHT,
    MAX_WEIGHT,
    SCALE_STEP
} from '@/constants';
import { createShape } from '@/utils/helper';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        droppedShapes: [],
        fallingShapes: [],
        randomlyPlacedShapes: [],
        isGamePaused: true,
        isModalShown: false,
        fallingIntervalGap: null
    },
    mutations: {
        addDroppedShape(state, shape = {}) {
            state.droppedShapes.push(shape);
        },

        clearAllShapeArrs(state) {
            state.droppedShapes = [];
            state.fallingShapes = [];
            state.randomlyPlacedShapes = [];
        },

        toggleSimulation(state) {
            state.isGamePaused = !state.isGamePaused;
        },

        generateShape({ randomlyPlacedShapes, fallingShapes }, randomlyPlaced = false) {
            const shape = createShape(MIN_WEIGHT, MAX_WEIGHT, SCALE_STEP)
            if (randomlyPlaced) {
                randomlyPlacedShapes.push(shape);
            } else {
                fallingShapes.push(shape);
            }
        },


        toggleModal(state, isShown = false) {
            state.isModalShown = isShown;
        },

        updateFallingIntervalGap(state, reset = false) {
            if (reset) {
                state.fallingIntervalGap = MAX_FALLING_INTERVAL_GAP;
            } else if (state.fallingIntervalGap > MIN_FALLING_INTERVAL_GAP) {
                state.fallingIntervalGap--;
            }
        }
    },
    actions: {
        initGame({ commit, state }) {
            if (!state.isGamePaused) commit('toggleSimulation');
            if (state.isModalShown) commit('toggleModal');
            commit('updateFallingIntervalGap', true);
            commit('clearAllShapeArrs');

            commit('generateShape');
            commit('generateShape');

            commit('generateShape', true);
        }
    },
})