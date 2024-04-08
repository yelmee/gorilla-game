import type {State} from "@/class/State";
import type {Bomb} from "@/class/Bomb";
import type {Building} from "@/class/Building";
import type {Canvas} from "@/class/Canvas";

export class Main {
    state: State
    bomb: Bomb | undefined
    building: Building
    canvas: Canvas | undefined
    constructor({state, bomb, building, canvas}:
                    {state: State, bomb: Bomb | undefined, building: Building, canvas: Canvas | undefined}) {
        this.state = state
        this.bomb = bomb
        this.building = building
        this.canvas = canvas

    }
    public newGame (){
        this.state.setState({
            scale: 1,
            phase: 'aiming',
            currentPlayer: 1,
            bombPosFromPrevious: {
                x: undefined,
                y: undefined,
                velocity: {x: 0, y: 0}
            },
            buildings: this.building.generateBuilding()
        })
        // 도시의 전체 너비를 계산하고, 브라우저 창의 내부 너비를 이 값으로 나눔 (비율을 알려줌)
        this.canvas?.calculateScale()

        // 게임 초기화
        this.bomb?.initializeBombPosition()
    }
}