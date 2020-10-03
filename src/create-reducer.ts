import {
  createHandlerMap,
  othersHandlerKey,
  CreateHandlerMap,
  HandlerMap,
  InferActionFromHandlerMap,
  InferNextStateFromHandlerMap,
} from './create-handler-map'
import { merge } from './utils'
import { AnyAction } from './create-action'

/**
 * Reducer factory
 * @description combines multiple handler map into single reducer
 * @example
 * const counter = createReducer(0, handleAction => [
 *   handleAction(increment, state => state + 1),
 *   handleAction(decrement, state => state - 1),
 * ])
 */
export function createReducer<
  TPrevState,
  THandlerMap extends HandlerMap<TPrevState, any, any>
>(
  defaultState: TPrevState,
  handlerMapsCreator: (handle: CreateHandlerMap<TPrevState>) => THandlerMap[]
) {
  const handlerMap = merge(...handlerMapsCreator(createHandlerMap))

  return (
    state = defaultState,
    action: InferActionFromHandlerMap<THandlerMap> | AnyAction
  ): InferNextStateFromHandlerMap<THandlerMap> => {
    const handler = handlerMap[(<any>action).type]
    const othersHandler = handlerMap[othersHandlerKey]

    return handler ? handler(<any>state, action) :
      othersHandler ? othersHandler(<any>state, action) :
        state
  }
}
