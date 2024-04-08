import type {StateType} from "@/type/State";

export class State{
    state: StateType | undefined

    constructor(state?: StateType) {
    this.state = state
    }

     setState (state?: StateType){
        this.state = state
    }
}