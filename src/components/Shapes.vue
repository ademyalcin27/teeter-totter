<template>
  <div class="shapes">
    <Shape v-for="shape in fallingShapes" :key="shape.id" :shape="shape" :id="`shapes-${ shape.id }`" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { LEFT_ARROW_KEY, RIGHT_ARROW_KEY, BOARD_HEIGHT, BOARD_WIDTH } from '@/constants';

import Shape from '@/components/Shape.vue';
export default {
  props: {
    boardBendingAngle: [String, Number],
    isBoardingAngleInLimit: Boolean,
  },
  components: {
    Shape,
  },
  data() {
    return {
      interValid: null,
      shapeBottomLimit: null,
    }
  },
  computed: {
    ...mapState([ 'fallingIntervalGap', 'fallingShapes', 'isGamePaused' ]),
    fallingShapeEl() {
      const { id } = this.fallingShapes[0];
      return document.getElementById(`shapes-${ id }`);
    }
  },
  mounted() {
    console.log('shapes')
    const boardEl = document.querySelector('.teeter-totter__board');

    boardEl.addEventListener('transitionend', this.handleBoardTransitionEnd);
    window.addEventListener('keydown', this.moveFallingShape);
    this.$once('hook:beforeDestroy', () => {
      boardEl.removeEventListener('transitionend', this.handleBoardTransitionEnd);
      window.removeEventListener('keydown', this.moveFallingShape);
    });
  },
  watch: {
    isGamePaused: {
      handler(current) {
        if (current) {
          clearInterval(this.intervalId);
        }
        else {
          this.getShapeBottomLimit();
          this.animateShape();
        }
      }
    }
  },
  methods: {
    ...mapMutations([ 
      'addDroppedShape',
      'generateShape', 
      'toggleSimulation',
      'toggleModal',
      'updateFallingIntervalGap'
    ]),

    animateShape() {
      this.intervalId = setInterval(() => {
        if (this.fallingShapes[0].top >= this.shapeBottomLimit) {
          const droppedShape = this.fallingShapes.shift();

          clearInterval(this.intervalId);
          
          this.addDroppedShape(droppedShape);
          this.updateFallingIntervalGap();
          this.generateShape();
          this.animateShape(); 
        }
        else {
          this.fallingShapes[0].top += 1;
          this.fallingShapeEl.style.top = `${ this.fallingShapes[0].top }px`;
        }
      }, this.fallingIntervalGap);
    },

    getShapeBottomLimit() {
      const boardBounds = document.querySelector('.teeter-totter__board').getBoundingClientRect();
      const panelBounds = document.querySelector('.status').getBoundingClientRect();
      const shapeBounds = this.fallingShapeEl.getBoundingClientRect();

      const totterCathet  = boardBounds.bottom - boardBounds.top - BOARD_HEIGHT;
      const similarCathet = (this.fallingShapes[0].left * totterCathet) / BOARD_WIDTH;

      this.shapeBottomLimit = this.boardBendingAngle >= 0
          ? boardBounds.top + similarCathet - shapeBounds.height - panelBounds.height
          : boardBounds.bottom - similarCathet - shapeBounds.height - panelBounds.height;
    },

    handleBoardTransitionEnd() {
      if (this.isGamePaused) return;

      if (this.isBoardingAngleInLimit) {
          this.getShapeBottomLimit();
      }
      else {
          this.toggleSimulation();
          this.toggleModal(true);
      }
    },

    moveFallingShape({ keyCode }) {
      const isArrowKeyPressed = [LEFT_ARROW_KEY, RIGHT_ARROW_KEY].includes(keyCode);

      if (this.isGamePaused || !isArrowKeyPressed) return;

      const shapeWidth = this.fallingShapeEl.getBoundingClientRect().width;
      const areaWidth  = document.querySelector('.shapes').getBoundingClientRect().width;

      this.move(keyCode,shapeWidth, areaWidth);

      this.$nextTick(this.getShapeBottomLimit);
    },
    move(keyCode, shahepWidth, areaWidth) {
      const shape = this.$store.state.fallingShapes[0];
      const width = (shahepWidth/ areaWidth) * 100;
      const canMoveLeft = shape.left - 1 >= 0;
      const canMoveRight = shape.left + width + 1 <= 45;

      if (keyCode === LEFT_ARROW_KEY) {
        canMoveLeft && shape.left--;
      } else {
        canMoveRight && shape.left++
      }
    }
  }
  
}
</script>

<style lang="scss" scoped>
  .shapes {
    position: relative;
    flex: 1 1 50%;
  }
</style>
