import type { Event } from './Event'
import type { State } from './State'
import type { Transition } from './Transition'

type FiniteStateMachineProps<TEvent extends Event> = {
  name: string
  parent: FiniteStateMachine<TEvent> | null
  initialState: State<TEvent>
  transitions?: Transition<TEvent>[]
  children?: FiniteStateMachine<TEvent>[]
  currentChild?: FiniteStateMachine<TEvent> | null
}

export abstract class FiniteStateMachine<TEvent extends Event> {
  private name!: string
  private parent!: FiniteStateMachine<TEvent> | null
  private currentState!: State<TEvent>
  private transitions: Transition<TEvent>[] = []
  private children: FiniteStateMachine<TEvent>[] = []
  private currentChild: FiniteStateMachine<TEvent> | null = null

  constructor({
    name,
    parent = null,
    initialState,
    transitions = [],
    children = [],
    currentChild = null,
  }: FiniteStateMachineProps<TEvent>) {
    this.setName(name)
    this.setParent(parent)
    this.setCurrentState(initialState)
    this.setTransitions(transitions)
    this.setChildren(children)
    this.setCurrentChild(currentChild)
  }

  getName(): string {
    return this.name
  }

  private setName(name: string): void {
    this.name = name
  }

  getParent(): FiniteStateMachine<TEvent> | null {
    return this.parent
  }

  private setParent(parent: FiniteStateMachine<TEvent> | null): void {
    this.parent = parent
  }

  getCurrentState(): State<TEvent> {
    return this.currentState
  }

  private setCurrentState(state: State<TEvent>): void {
    this.currentState = state
  }

  getTransitions(): Transition<TEvent>[] {
    return [...this.transitions]
  }

  private setTransitions(transitions: Transition<TEvent>[]): void {
    this.transitions = [...transitions]
  }

  addTransition(transition: Transition<TEvent>): void {
    this.transitions.push(transition)
  }

  getChildren(): FiniteStateMachine<TEvent>[] {
    return [...this.children]
  }

  private setChildren(children: FiniteStateMachine<TEvent>[]): void {
    this.children = [...children]

    for (const child of this.children) {
      child.setParent(this)
    }
  }

  addChild(child: FiniteStateMachine<TEvent>): void {
    this.children.push(child)
    child.setParent(this)
  }

  getCurrentChild(): FiniteStateMachine<TEvent> | null {
    return this.currentChild
  }

  setCurrentChild(child: FiniteStateMachine<TEvent> | null): void {
    this.currentChild = child
  }

  trigger(event: TEvent): boolean {
    if (this.currentChild?.trigger(event)) {
      return true
    }

    for (const transition of this.transitions) {
      if (
        transition.matches({
          currentState: this.currentState,
          event,
        })
      ) {
        if (!transition.execute(event, this)) {
          continue
        }

        this.setCurrentState(transition.getTo())

        return true
      }
    }

    if (this.currentState.handleEvent(event, this)) {
      return true
    }

    return false
  }

  changeState(event: TEvent, toState: State<TEvent>): void {
    this.getCurrentState()?.exit(event, this)
    this.setCurrentState(toState)
    this.getCurrentState()?.enter(event, this)
  }

  getChildByName(name: string): FiniteStateMachine<TEvent> | null {
    return this.children.find((child) => child.getName() === name) ?? null
  }
}
