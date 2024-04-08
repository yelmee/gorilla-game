import type {BuildingType} from "@/type/buildingType";
import type {State} from "@/class/State";
import type {Ctx} from "@/type/Ctx";

export class Building {
    ctx: Ctx
    state: State

    constructor({ctx, state}: { ctx: Ctx , state: State }) {
        this.ctx = ctx
        this.state = state
    }

    generateBuilding() {
        const buildings: BuildingType[] = []
        for (let index = 0; index < 8; index++) {
            const previousBuilding = buildings[index - 1]
            const x = previousBuilding
                ? previousBuilding.x + previousBuilding.width + 4
                : 0
            const minWidth = 80
            const maxWidth = 130
            const width = minWidth + Math.random() * (maxWidth - minWidth)

            const platformWidthGorilla = index === 1 || index === 6

            const minHeight = 40
            const maxHeight = 300
            const minHeightGorilla = 30
            const maxHeightGorilla = 150

            const height = platformWidthGorilla
                ? minHeightGorilla + Math.random() * (maxHeightGorilla - minHeightGorilla)
                : minHeight + Math.random() * (maxHeight - minHeight)

            buildings.push({x, width, height})
        }
        return buildings
    }

    public drawBuildings() {
        if(!this.state.state) return
        // 2. 메타데이터를 기반으로 건물을 그림
        this.state.state.buildings.forEach((buildings) => {
            if(!this.ctx) return
            this.ctx.fillStyle = '#152A47'
            this.ctx.fillRect(buildings.x, 0, buildings.width, buildings.height)
        })
    }
}