<template>
  <section class="play-ground">
    <Shapes :board-bending-angle="boardBendingAngle" :is-boarding-angle-in-limit="isBoardingAngleInLimit"/>
    <TeetterTotter :board-bending-angle="boardBendingAngle" :is-boarding-angle-in-limit="isBoardingAngleInLimit" />
  </section>
</template>

<script>
import TeetterTotter from '@/components/TeetterTotter.vue';
import { mapActions } from 'vuex';
import { MAX_BENDING_ANGLE, MIN_BENDING_ANGLE } from '@/constants';
import Shapes from '@/components/Shapes.vue';
import { shapeQuantity } from '@/utils/helper';

export default {
  components: {
    TeetterTotter,
    Shapes,
  },
  computed: {
    boardBendingAngle() {
      let angle = 0;
      if (!this.droppedShapesSum) {
          angle = MAX_BENDING_ANGLE;
      } else {
          const subtraction = Math.abs(this.droppedShapesSum - this.randomlyPlacedShapesSum);
          angle = this.droppedShapesSum > this.randomlyPlacedShapesSum ?
              subtraction / this.droppedShapesSum * -50 :
              subtraction / this.randomlyPlacedShapesSum * 50;
      }
      return angle;
    },
    droppedShapesSum() {
      return shapeQuantity(this.$store.state.droppedShapes, true);
    },
    randomlyPlacedShapesSum() {
      return shapeQuantity(this.$store.state.randomlyPlacedShapes);
    },
    isBoardingAngleInLimit() {
      return this.boardBendingAngle > MIN_BENDING_ANGLE && 
            this.boardBendingAngle < MAX_BENDING_ANGLE 
    },
  },
  created() {
    this.initGame();
  },
  methods: {
    ...mapActions([ 'initGame' ]),
  }
}
</script>

<style lang="scss" scoped>
  .play-ground {
    display: flex;
    flex-direction: column;
    flex: 1 1 100%;
    width: 80%;
    margin: 0 auto;
    min-width: 600px;
    padding-bottom: 10rem;
  }
</style>
