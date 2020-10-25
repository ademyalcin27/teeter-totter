<template>
  <section class="status">
    <div class="status__score">
      <p><strong>Total Weight: </strong>{{ totalDroppedShapesWeight }} KG</p>
      <p><strong>Total Moment: </strong>{{ fallingShapes[0] && fallingShapes[0].weight }} KG</p>
    </div>
    <div class="status__buttons">
      <button class="btn btn--play" @click="toggleSimulation">{{ isGamePaused ? 'play' : 'pause' }}</button>
      <button class="btn btn--replay" @click="initGame">Re play</button>
    </div>
    <div class="status__score">
      <p><strong>Total Weight: </strong>{{ totalRandomShapesWeight }} KG</p>
      <p><strong>Total Moment: </strong>X KG</p>
    </div>
  </section>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { SPACE_KEY } from '@/constants';
export default {
  computed: {
    ...mapState([ 
        'droppedShapes',
        'fallingShapes',
        'isGamePaused', 
        'isModalShown',
        'randomlyPlacedShapes'
    ]),

    totalDroppedShapesWeight() {
        return this.getTotalWeight(this.droppedShapes);
    },

    totalRandomShapesWeight() {
        return this.getTotalWeight(this.randomlyPlacedShapes);
    }
  },
  created() {
    window.addEventListener('keydown', this.handleSpaceClick);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleSpaceClick);
  },
  methods: {
    ...mapActions([ 'initGame' ]),
    ...mapMutations([ 'toggleSimulation' ]),

    getTotalWeight(shapes = []) {
        return shapes.reduce((total, current) => total += current.weight, 0);
    },

    handleSpaceClick(event) {
        event.preventDefault();
        if (event.keyCode === SPACE_KEY && !this.isModalShown) {
            this.toggleSimulation();
        }
    }
  }
}
</script>

<style lang="scss" scoped>
  .status {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .btn {
    padding: 15px 10px;
    font-size: 16px;
    background-color: transparent;
    color: #000;
    border: none;
    cursor: pointer;
    & + & {
      margin-left: 10px;
    }
    &--play {
      background-color: #00BCD4;
      &:hover {
        background-color: darken(#00BCD4, 10%);
      }
    }
    &--replay {
      background-color: #FF5722;
      &:hover {
        background-color: darken(#FF5722, 10%);
      }
     
    }
  }
</style>
