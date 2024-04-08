import type {BuildingType} from "@/type/buildingType";

export interface StateType{
    scale: number,
    phase:  Phase[keyof Phase],
    currentPlayer: number,
    bombPosFromPrevious: {
        x?: number,
        y?: number,
        velocity: {x: number, y: number}
    },
    buildings: BuildingType[]
}

/*
 게임 3단계
 1. aiming - 폭탄이 고릴라 손에 있고, 이벤트 핸들러가 활성화됨
 2. inflight - 폭탄을 던졌을 때, 이벤트 핸들러 비활성화됨
    애니메이션 -> 폭탄이 하늘을 가로질러 이동, 적중 감지 추가(애니메이션 중지 시점 감지)
 3. celebrating - 1,2번 반복하다가 적을 공격했을 떄 승리한 고릴라 축하, 게임을 다시 시작하는 버튼 보여줌
 */


type Phase = {
    Aiming: 'aiming'
    InFlight :'in flight'
    Celebrating: 'celebrating'
}
