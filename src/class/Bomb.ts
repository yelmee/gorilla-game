import {Drag, State, Gorilla, Canvas} from "@/class/internal";
import type {Ctx} from "@/type/Ctx";

export class Bomb {
    state: State | undefined
    ctx: Ctx
    bombGrabAreaDOM?: HTMLElement
    previousAnimationTimestamp?: number
    private canvas: Canvas | undefined
    private gorilla: Gorilla
    private drag: Drag
    setIntoCallback:  (deltaX: number, deltaY: number) => void
    announceWinnerCallback: ()=> void

    constructor({state, ctx, gorilla, drag, canvas, setIntoCallback, announceWinnerCallback}
        : {state: State | undefined, ctx: Ctx , gorilla: Gorilla, drag: Drag, canvas: Canvas | undefined, setIntoCallback: (deltaX: number, deltaY: number)=> void, announceWinnerCallback:  ()=> void}){
        this.state = state
        this.ctx = ctx
        this.gorilla = gorilla
        this.drag = drag
        this.canvas = canvas
        this.setIntoCallback = setIntoCallback
        this.announceWinnerCallback = announceWinnerCallback

        this.bombGrabAreaDOM?.addEventListener('mousedown', (e) => {
            if(!this.state?.state) return
            if (this.state.state.phase === 'aiming') {
                this.drag.drag = {
                    isDragging: true,
                    startX: e.clientX,
                    startY: e.clientY
                }
                document.body.style.cursor = 'grabbing'
            }
        })

        //  드래그하는 경우 이벤트 이후 마우스 위치의 델타 계산, mousedown 이 폭탄의 속도를 설정함
        window.addEventListener('mousemove', (e) => {
            if(!this.state?.state) return
            if (this.drag.drag.startX && this.drag.drag.startY && this.drag.drag.isDragging) {
                const deltaX = e.clientX - this.drag.drag.startX
                const deltaY = e.clientY - this.drag.drag.startY

                this.state.state.bombPosFromPrevious.velocity.x = -deltaX
                this.state.state.bombPosFromPrevious.velocity.y = -deltaY
                setIntoCallback(deltaX, deltaY)

                this.canvas?.draw()
            }
        })
    }

    public initializeBombPosition() {
        if(!this.state?.state) return
        const building =
            this.state.state.currentPlayer === 1
                ? this.state.state.buildings[1] // Second Building
                : this.state.state.buildings[-2]// Second last building

        const gorillaX = building.x + building.width / 2
        const gorillaY = building.height

        const gorillaHandOffsetX = this.state.state.currentPlayer === 1 ? -28 : 28
        const gorillaHandOffsetY = 107

        this.state.state.bombPosFromPrevious.x = gorillaX + gorillaHandOffsetX
        this.state.state.bombPosFromPrevious.y = gorillaY + gorillaHandOffsetY
        this.state.state.bombPosFromPrevious.velocity.x = 0
        this.state.state.bombPosFromPrevious.velocity.y = 0

        if(this.state.state.bombPosFromPrevious.x === undefined || this.state.state.bombPosFromPrevious.y === undefined ) return

        // Initialize the position of the grab area in HTML
        // 이 항목 추가 후 보이지 않아 차이 없음, 폭탄 위로 마우스를 가져가면 커서가 잡기로 바뀜
        const grabAreaRadius = 15
        const left = this.state.state.bombPosFromPrevious.x * this.state.state.scale - grabAreaRadius
        const bottom = this.state.state.bombPosFromPrevious.y * this.state.state.scale - grabAreaRadius

        if(!this.bombGrabAreaDOM) return
        this.bombGrabAreaDOM.style.left = `${left}px`
        this.bombGrabAreaDOM.style.bottom = `${bottom}px`
    }

    throwBomb() {
        if(!this.state?.state) return
        this.state.state.phase = 'in flight'
        this.previousAnimationTimestamp = undefined
        requestAnimationFrame(this.animate)
    }

    animate(timestamp: number) {
        if (this.previousAnimationTimestamp === undefined) {
            this.previousAnimationTimestamp = timestamp
            requestAnimationFrame(this.animate)
            return
        }

        const elapsedTime = timestamp - this.previousAnimationTimestamp

        const hitDetectionPrecision = 10
        for (let i = 0; i < hitDetectionPrecision; i++) {
            this.moveBomb(elapsedTime / hitDetectionPrecision); // Hit detection

            // Hit detection
            const miss = this.checkFrameHit() || this.checkBuildingHit() // Bomb git a building or got out of the screen
            const hit = this.checkGorillaHit() // Bomb it the enemy

            // Handle the case when we hit a building or the bomb got off-screen
            if(!this.state?.state) return
            if (miss) {
                this.state.state.currentPlayer = this.state.state.currentPlayer === 1 ? 2 : 1 // Switch players
                this.state.state.phase = 'aiming'
                this.initializeBombPosition()
                this.canvas?.draw();
                return;
            }
            // Handle the case when we hit the enemy
            if (hit) {
                this.state.state.phase = 'celebrating'
                this.announceWinnerCallback();
                this.canvas?.draw()
                return;
            }
        }
        this.canvas?.draw();

        // Continue the animation loop
        this.previousAnimationTimestamp = timestamp
        requestAnimationFrame(this.animate)
    }

    checkFrameHit() {
        if(!this.state?.state) return
        if (this.state.state.bombPosFromPrevious.x === undefined || this.state.state.bombPosFromPrevious.y === undefined)  return
        if (
            this.state.state.bombPosFromPrevious.y < 0 ||
            this.state.state.bombPosFromPrevious.x < 0 ||
            this.state.state.bombPosFromPrevious.x > window.innerWidth / this.state.state.scale
        ) {
            return true // The bomb is off-screen
        }

    }

    checkBuildingHit() {
        if(!this.state?.state) return
        if (this.state.state.bombPosFromPrevious.x === undefined || this.state.state.bombPosFromPrevious.y === undefined)  return
        for (let i = 0; i < this.state.state.buildings.length; i++) {
            const building = this.state.state.buildings[i];

            if (
                this.state.state.bombPosFromPrevious.x + 4 > building.x && // bomb's right is positioning left building's right side
                this.state.state.bombPosFromPrevious.x < building.x + building.width && // bomb's left is positioning right building's left side
                this.state.state.bombPosFromPrevious.y - 4 < 0 + building.height
            ) {
                return true // Building hit
            }
        }

    }

    checkGorillaHit() {
        if(!this.state?.state) return
        if(!this.ctx) return
        const enemyPlayer = this.state.state.currentPlayer === 1 ? 2 : 1
        const enemyBuilding =
            enemyPlayer === 1
                ? this.state.state.buildings[1] // Second building
                : this.state.state.buildings[2] // Second last building

        this.ctx.save()

        this.ctx.translate(
            enemyBuilding.x = enemyBuilding.width / 2,
            enemyBuilding.height
        )

        if (this.state.state.bombPosFromPrevious.x === undefined || this.state.state.bombPosFromPrevious.y === undefined)  return
        this.gorilla.drawGorillaBody();
        let hit = this.ctx.isPointInPath(this.state.state.bombPosFromPrevious.x, this.state.state.bombPosFromPrevious.y);

        this.gorilla.drawGorillaLeftArm(enemyPlayer);
        hit ||= this.ctx.isPointInStroke(this.state.state.bombPosFromPrevious.x, this.state.state.bombPosFromPrevious.y);

        this.gorilla.drawGorillaRightArm(enemyPlayer);
        hit ||= this.ctx.isPointInStroke(this.state.state.bombPosFromPrevious.x, this.state.state.bombPosFromPrevious.y);

        this.ctx.restore()

        return hit
    }


    moveBomb(elapsedTime: number) {
        if(!this.state?.state) return
        if (this.state.state.bombPosFromPrevious.x === undefined || this.state.state.bombPosFromPrevious.y === undefined)  return
        const multiplier = elapsedTime / 200 // Adjust trajectory by gravity

        this.state.state.bombPosFromPrevious.velocity.y -= 20 * multiplier // Calculate new position

        this.state.state.bombPosFromPrevious.x += this.state.state.bombPosFromPrevious.velocity.x * multiplier
        this.state.state.bombPosFromPrevious.y += this.state.state.bombPosFromPrevious.velocity.y * multiplier
    }

    drawBomb() {
        if(!this.state?.state) return
        if (this.state.state.bombPosFromPrevious.x === undefined || this.state.state.bombPosFromPrevious.y === undefined)  return
        if(!this.ctx) return
        // Draw throwing trajectory
        if (this.state.state.phase === 'aiming') {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
            this.ctx.setLineDash([3, 8]);
            this.ctx.lineWidth = 3

            this.ctx.beginPath()
            this.ctx.moveTo(this.state.state.bombPosFromPrevious.x, this.state.state.bombPosFromPrevious.y);

            this.ctx.lineTo(
                this.state.state.bombPosFromPrevious.x + this.state.state.bombPosFromPrevious.velocity.x,
                this.state.state.bombPosFromPrevious.y + this.state.state.bombPosFromPrevious.velocity.y
            );
            this.ctx.stroke()
        }

        // Draw circle
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath()
        this.ctx.arc(this.state.state.bombPosFromPrevious.x, this.state.state.bombPosFromPrevious.y, 6, 0, 2 * Math.PI)
        this.ctx.fill()
    }
}