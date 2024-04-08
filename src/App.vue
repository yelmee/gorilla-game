<template>
  <head>
    <meta charset="utf-8"/>
    <title>Gorillas</title>
    <link rel="stylesheet" href="./css/index.css">
  </head>
  <body>
  canvas<canvas id="game"></canvas>

  <div id="info-left">
    <h3>Player 1</h3>
    <p>Angle: <span class="angle">0</span></p>
    <p>Velocity: <span class="velocity">0</span></p>
  </div>

  <div id="info-right">
    <h3>Player 2</h3>
    <p>Angle: <span class="angle">0</span></p>
    <p>Velocity: <span class="velocity">0</span></p>
  </div>

  <div id="congratulations">
    <h1><span id="winner">?</span> won!</h1>
    <button id="new-game">New Game</button>
  </div>
  </body>

  <div id="bomb-grab-area"></div>
</template>
<script lang="ts" setup>
import {State, Bomb, Gorilla, Canvas, Drag, Building, Main} from "@/class/internal";
import {computed, type ComputedRef, onMounted} from "vue";
import type {Ctx} from "@/type/Ctx";

const angle1DOM:  HTMLElement | null  = document.querySelector('#info-left .angle')
const velocity1DOM:  HTMLElement | null  = document.querySelector('#info-left .velocity')

// Right info panel
const angle2DOM:  HTMLElement | null  = document.querySelector('#info-right .angle')
const velocity2DOM:  HTMLElement | null  = document.querySelector('#info-right .velocity')

// The Bomb's grab area
// const bombGrabAreaDOM:  HTMLElement | null  = document.getElementById('bomb-grab-area')

const congratulationDOM:  HTMLElement | null = document.getElementById('congratulations')
const winnerDOM:  HTMLElement | null  = document.getElementById('winner')
const newGameButtonDOM:  HTMLElement | null  = document.getElementById('new-game')

const announceWinnerI = () => {
  if (winnerDOM) {
    winnerDOM.innerText = `Player ${state.state?.currentPlayer}`
  }
  if (congratulationDOM) {
    congratulationDOM.style.visibility = 'visible';
  }
}

const setIntoI =  (deltaX: number, deltaY: number) => {
  const hypotenuse = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  const angleInRadians = Math.asin(deltaY / hypotenuse);
  const angleInDegrees = (angleInRadians / Math.PI) * 180;

  if (state.state?.currentPlayer === 1) {
    if (angle1DOM) {
      angle1DOM.innerText = String(Math.round(angleInDegrees));
    }
    if (velocity1DOM) {
      velocity1DOM.innerText = String(Math.round(hypotenuse));
    }
  } else {
    if (angle2DOM) {
      angle2DOM.innerText = String(Math.round(angleInDegrees));
    }

    if (velocity2DOM) {
      velocity2DOM.innerText = String(Math.round(hypotenuse));
    }
  }
}

const isEmptyObject = (obj: any): boolean => {
  return Object.entries(obj).length === 0
}

const cc:  HTMLElement | null =  document.getElementById("game")
const ctx: Ctx =  cc?.querySelector('canvas')?.getContext('2d') || undefined

const state = new State(undefined)
const drag = new Drag({
      isDragging: false,
      startX: undefined,
      startY: undefined
    }
)

const gorilla = new Gorilla({ctx, state})
const building = new Building({ctx, state})
type CanvasType = Canvas | null
const canvas: ComputedRef<CanvasType> = computed(()=>{
  if ( bomb?.value !== undefined && !isEmptyObject(bomb?.value)) {
    return new Canvas({ctx, state, bomb: bomb.value, building, gorilla})
  }
  return null
const bomb = computed(()=>{
  if (canvas?.value !== undefined && !isEmptyObject(canvas.value)) {
    return new Bomb({
      announceWinnerCallback(): void {
        announceWinnerI()
      }, setIntoCallback(deltaX: number, deltaY: number): void {
        setIntoI(deltaX, deltaY)
      }, state, ctx, gorilla, drag, canvas: canvas.value})
  }
  return undefined
})
const main = new Main({state, bomb, building, canvas})

onMounted(()=>{
  main.newGame()

  // Reset HTML elements
  if (congratulationDOM) {
    congratulationDOM.style.visibility = 'hidden';
  }

  if (angle1DOM) {
    angle1DOM.innerText = String(0);
  }

  if (velocity1DOM) {
    velocity1DOM.innerText = String(0)
  }

  if (angle2DOM) {
    angle2DOM.innerText = String(0);
  }

  if (velocity2DOM) {
    velocity2DOM.innerText =String(0);
  }

  initListener();

})

const initListener = () =>{
  newGameButtonDOM?.addEventListener('click', main.newGame)

  window.addEventListener('mouseup', ()=>{
    if (drag.drag.isDragging) {
      drag.drag.isDragging = false

      document.body.style.cursor = 'default'

      bomb.value?.throwBomb()
    }
  })
}
</script>
<style scoped>

</style>
