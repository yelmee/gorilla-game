// this 사용 가능 확인
import {State, Bomb, Gorilla, Building} from "@/class/internal";
import type {Ctx} from "@/type/Ctx";

export class Canvas{
    ctx: Ctx
    state: State | undefined
    bomb: Bomb
    building: Building
    gorilla: Gorilla
    constructor({ctx, state, bomb, building, gorilla}
        :{ctx: Ctx, state: State | undefined, bomb: Bomb, building: Building, gorilla: Gorilla}) {
        this.ctx = ctx
        this.state = state
        this.bomb = bomb
        this.building = building
        this.gorilla = gorilla

        window.addEventListener('resize', () => {
            if(!this.ctx) return
            this.ctx.canvas.width = window.innerWidth
            this.ctx.canvas.height = window.innerHeight
            this.calculateScale()
            this.bomb?.initializeBombPosition()
            this.draw()
        })
    }
    calculateScale(){
        if(!this.state?.state) return
        const index = 1

        if(index <= this.state.state.buildings.length || -this.state.state.buildings.length < index ) return
        const lastBuilding = this.state.state.buildings[-index]
        const totalWidthOfCity = lastBuilding.x + lastBuilding.width

        this.state.state.scale = window.innerWidth / totalWidthOfCity
    }

     draw (){
         if(!this.ctx) return
         if(!this.state?.state) return
         this.ctx.save()

        // 위 아래 뒤집기
        this.ctx.translate(0, window.innerHeight)
        this.ctx.scale(1, -1)
        this.ctx.scale(this.state.state.scale, this.state.state.scale)

        // 화면 그리기
        this.drawBackground()
         this.building.drawBuildings()
        this.gorilla.drawGorilla(1)
         this.gorilla.drawGorilla(2)
        this.bomb?.drawBomb()

        // 회전 복구
        this.ctx.restore()

        // 획 그리기
        // ctx.fillStyle = "#58A8D8" // 대신 strokeStyle 사용 가능, lineWidth를 사용하면 선너비 설정
        // ctx.beginPath()
        // ctx.moveTo(200, 200)
        // ctx.lineTo(500, 350)
        // ctx.lineTo(200, 500)
        // ctx.stroke()
        //
        // // 곡선
        // ctx.lineWidth = 30
        // ctx.beginPath()
        // ctx.moveTo(200, 300)
        // ctx.quadraticCurveTo(500, 400, 800, 300)
        // ctx.stroke()
        //
        // // 직사각형
        // ctx.fillRect(200, 200, 440, 320)
        // ctx.beginPath()
        // ctx.moveTo(200, 200)
        // ctx.lineTo(500, 350)
        // ctx.lineTo(200, 500)
        // ctx.fill()
    }

     drawBackground (){
         if(!this.ctx) return
         if(!this.state?.state) return
         if(!this.ctx) return
        // 직사각형 그림 (달, 별 연습)
         this.ctx.fillStyle = '#58A8D8'
         this.ctx.fillRect(0, 0, window.innerWidth / this.state.state.scale, window.innerHeight / this.state.state.scale)
    }
}