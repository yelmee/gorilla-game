import type {State} from "@/class/internal";
import type {Ctx} from "@/type/Ctx";

export class Gorilla {
    ctx: Ctx
    state: State | undefined

    constructor({ctx, state}: {ctx: Ctx , state: State | undefined}) {
        this.ctx = ctx
        this.state = state
    }

     drawGorillaBody () {
        if(!this.ctx.ctx) return
        this.ctx.ctx.fillStyle = 'black'

        this.ctx.ctx.beginPath()

        this.ctx.ctx.moveTo(0, 15)

        // 왼쪽 다리
        this.ctx.ctx.lineTo(-7, 0)
        this.ctx.ctx.lineTo(-20, 0)

        // 몸통
        this.ctx.ctx.lineTo(-13, 77)
        this.ctx.ctx.lineTo(0, 84)
        this.ctx.ctx.lineTo(13, 77)

        // 오른쪽 다리
        this.ctx.ctx.lineTo(20, 0)
        this.ctx.ctx.lineTo(7, 0)

        this.ctx.ctx.fill()
    }

     drawGorillaLeftArm (player: number) {
         if(!this.state?.state) return
         if(!this.ctx.ctx) return
        this.ctx.ctx.strokeStyle = "black"
        this.ctx.ctx.lineWidth = 18

        this.ctx.ctx.beginPath()
        this.ctx.ctx.moveTo(-13, 50)

        if(
            (this.state.state.phase ===  'aiming' && this.state.state.currentPlayer === 1) ||
            (this.state.state.phase ===  'celebrating' && this.state.state.currentPlayer === player)
        ){
            this.ctx.ctx.quadraticCurveTo(-44, 63, -28, 107)
        }else {
            this.ctx.ctx.quadraticCurveTo(-44, 45, -28, 12)
        }
        this.ctx.ctx.stroke()
    }

     drawGorillaRightArm (player: number)  {
         if(!this.state?.state) return
         if(!this.ctx.ctx) return
        this.ctx.ctx.strokeStyle = "black"
        this.ctx.ctx.lineWidth = 18

        this.ctx.ctx.beginPath()
        this.ctx.ctx.moveTo(+13, 50)

        if(
            (this.state.state.phase === 'aiming' && this.state.state.currentPlayer === 2 && player === 2) ||
            (this.state.state.phase === 'celebrating' && this.state.state.currentPlayer === player)
        ){
            this.ctx.ctx.quadraticCurveTo(+44, 63, +28, 107)
        }else{
            this.ctx.ctx.quadraticCurveTo(+44, 45, + 28, 12)
        }
        this.ctx.ctx.stroke()
    }

     drawGorillaFace ()  {
         if(!this.ctx.ctx) return
        this.ctx.ctx.strokeStyle = 'lightgray'
        this.ctx.ctx.lineWidth = 3

        this.ctx.ctx.beginPath()

        // 왼쪽 눈
        this.ctx.ctx.moveTo(-5, 70)
        this.ctx.ctx.lineTo(-2, 70)

        // 오른쪽 눈
        this.ctx.ctx.moveTo(-5, 60)
        this.ctx.ctx.moveTo(5, 62)

        this.ctx.ctx.stroke()
    }

     drawGorilla(player: number)  {
         if(!this.state?.state) return
         if(!this.ctx.ctx) return
        this.ctx.ctx.save()
         const building =
             player === 1
                 ? this.state.state.buildings[1] // Second building
                 : this.state.state.buildings[-2];

        this.ctx.ctx.translate(building.x + building.width / 2, building.height)

         this.drawGorillaBody()
         this.drawGorillaLeftArm(player)
         this.drawGorillaRightArm(player)
         this.drawGorillaFace()

         this.ctx.ctx.restore()
    }
}